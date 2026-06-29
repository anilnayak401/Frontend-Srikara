import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export function ScrollSequence() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [images, setImages] = useState([])
  const [loaded, setLoaded] = useState(false)

  // Configuration for frames
  const frameCount = 18
  const currentFrameIndex = useRef(0)

  // Preload images
  useEffect(() => {
    const loadedImages = []
    let loadedCount = 0

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image()
      // format as ezgif-frame-001.jpg
      const frameNum = i.toString().padStart(3, '0')
      img.src = `${import.meta.env.BASE_URL}hero-frames/ezgif-frame-${frameNum}.jpg`
      
      img.onload = () => {
        loadedCount++
        if (loadedCount === frameCount) {
          setImages(loadedImages)
          setLoaded(true)
          // Draw first frame
          drawFrame(loadedImages[0])
        }
      }
      
      // Handle missing images gracefully for dev
      img.onerror = () => {
        loadedCount++
        if (loadedCount === frameCount) {
          setImages(loadedImages)
          setLoaded(true)
        }
      }

      loadedImages.push(img)
    }
  }, [])

  const drawFrame = (img) => {
    if (!canvasRef.current || !img || !img.complete || img.naturalWidth === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Maintain aspect ratio while filling canvas
    const hRatio = canvas.width / img.width
    const vRatio = canvas.height / img.height
    const ratio = Math.max(hRatio, vRatio)
    
    const centerShift_x = (canvas.width - img.width * ratio) / 2
    const centerShift_y = (canvas.height - img.height * ratio) / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio)
  }

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && images.length > 0) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        drawFrame(images[currentFrameIndex.current])
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize() // Initial sizing
    return () => window.removeEventListener('resize', handleResize)
  }, [images])

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Map 0-1 scroll to 0-17 frame index
  const frameIndexTransform = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1])

  useMotionValueEvent(frameIndexTransform, "change", (latest) => {
    if (!loaded) return
    const frameIndex = Math.round(latest)
    if (images[frameIndex] && frameIndex !== currentFrameIndex.current) {
      currentFrameIndex.current = frameIndex
      requestAnimationFrame(() => drawFrame(images[frameIndex]))
    }
  })

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[#1A202C]" style={{ position: 'relative' }}>
      {/* Sticky container for the canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#1A202C]">
            <div className="text-[#8B1A4A] flex flex-col items-center">
               <div className="w-10 h-10 border-4 border-[#8B1A4A]/20 border-t-[#8B1A4A] rounded-full animate-spin mb-4" />
               <p className="font-label tracking-widest text-xs font-bold uppercase text-white/50">Loading Experience...</p>
            </div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-70"
        />

        {/* Overlay Content synced with scroll if desired */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
           <motion.div 
             style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0, 0]) }}
             className="text-center px-4"
           >
              <h1 className="font-garamond text-6xl md:text-8xl font-bold mb-6 text-white tracking-tight drop-shadow-2xl">
                Discover <span className="text-[#8B1A4A] italic">Srikara</span>
              </h1>
              <p className="max-w-2xl text-white/80 text-xl font-medium leading-relaxed drop-shadow-lg mx-auto">
                 Scroll down to explore a legacy of clinical mastery and innovation.
              </p>
           </motion.div>
        </div>

        {/* Fade to page transition at the end */}
        <motion.div 
          className="absolute inset-0 bg-[#FFF9FA] z-30 pointer-events-none"
          style={{ opacity: useTransform(scrollYProgress, [0.85, 1], [0, 1]) }}
        />
      </div>
    </div>
  )
}
