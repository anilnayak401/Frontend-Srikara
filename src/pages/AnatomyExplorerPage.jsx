import { useState, useEffect, useRef, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Brain, Bone, Activity, Wind, Droplets, 
  ArrowLeft, ArrowRight, Sparkles, AlertCircle, ChevronDown, Check
} from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { assetUrl } from '@/lib/assetUrl'
import { UnevenDepartmentCollage } from '@/components/sections/UnevenDepartmentCollage'

const CLINICAL_STORYLINE = [
  {
    specialtyId: 'neuro',
    name: 'Neurology',
    title: 'NEURO-ENDOVASCULAR PRECISION',
    accentColor: '#7c3aed', // Purple
    desc: 'Unlocking the complexities of the human brain. Srikara’s Stroke and Neuro-Endovascular clinic delivers ultra-rapid micro-surgical interventions for brain tumors, spinal corrections, and critical neurological anomalies, restoring vital functions with microscopic accuracy.',
    shortDesc: 'Srikara’s Stroke and Neuro-Endovascular clinic delivers ultra-rapid micro-surgical interventions for brain tumors, spinal corrections, and neurological anomalies with microscopic accuracy.',
    stats: [
      { label: 'Critical Recoveries', value: '98.6%' },
      { label: 'Specialists', value: '14+' },
      { label: 'Response Time', value: '<30 Mins' }
    ],
    hotspots: [
      { top: '38%', left: '51%', label: 'Cerebral Cortex (Cognitive Control)' },
      { top: '46%', left: '46%', label: 'Brainstem (Autonomic Functions)' }
    ]
  },
  {
    specialtyId: 'pulmo',
    name: 'Pulmonology',
    title: 'ADVANCED RESPIRATORY CARE',
    accentColor: '#0d9488', // Teal
    desc: 'Breathing vitality back into compromised lungs. From interstitial lung diseases to complex respiratory failure, Srikara’s Pulmonology team deploys advanced endobronchial ultrasound (EBUS), rigid bronchoscopy, and customized lung rehabilitation protocols.',
    shortDesc: 'From interstitial lung diseases to complex respiratory failure, our team deploys advanced endobronchial ultrasound and customized lung rehabilitation.',
    stats: [
      { label: 'Lungs Treated', value: '12,000+' },
      { label: 'Surgical Success', value: '97.8%' },
      { label: 'ICU Beds Enabled', value: '100+' }
    ],
    hotspots: [
      { top: '44%', left: '42%', label: 'Left Lung (Gas Exchange Center)' },
      { top: '46%', left: '58%', label: 'Right Lung (Primary Bronchus)' }
    ]
  },
  {
    specialtyId: 'cardio',
    name: 'Cardiology',
    title: 'CARDIOVASCULAR LIFELINES',
    accentColor: '#dc2626', // Red
    desc: 'Engineering the rhythm of life. Srikara’s Cardiovascular Excellence Center pioneers beating-heart CABG, robotic valve replacements, structural heart repairs, and round-the-clock primary angioplasties. We ensure cardiac survival through cutting-edge diagnostics.',
    shortDesc: 'Our Cardiovascular Excellence Center pioneers beating-heart CABG, robotic valve replacements, structural heart repairs, and round-the-clock primary angioplasties.',
    stats: [
      { label: 'Successful Procedures', value: '15,000+' },
      { label: 'Cardiac Surgeons', value: '18+' },
      { label: 'Angioplasty Success', value: '99.4%' }
    ],
    hotspots: [
      { top: '48%', left: '52%', label: 'Left Ventricle (Pumping Chamber)' },
      { top: '41%', left: '48%', label: 'Aorta (Main Blood Highway)' }
    ]
  },
  {
    specialtyId: 'physician',
    name: 'Gastroenterology',
    title: 'GASTROINTESTINAL EXCELLENCE',
    accentColor: '#2563eb', // Blue
    desc: 'Nurturing the core of digestive vitality. Our Advanced GI Sciences team provides cutting-edge diagnostic and therapeutic endoscopy, ERCP, and comprehensive hepatobiliary interventions, ensuring early detection and transplant management.',
    shortDesc: 'Our Advanced GI Sciences team provides cutting-edge diagnostic and therapeutic endoscopy, ERCP, and comprehensive hepatobiliary interventions.',
    stats: [
      { label: 'Endoscopies Run', value: '22,000+' },
      { label: 'GI Specialists', value: '15+' },
      { label: 'Minimally Invasive', value: '92%' }
    ],
    hotspots: [
      { top: '56%', left: '49%', label: 'Stomach (Digestive Resolute)' },
      { top: '54%', left: '43%', label: 'Hepatic Lobes (Liver Filtration)' }
    ]
  },
  {
    specialtyId: 'nephro',
    name: 'Nephrology',
    title: 'RENAL CARE & DIALYSIS',
    accentColor: '#0891b2', // Cyan
    desc: 'Pioneering kidney resilience and longevity. Srikara’s Renal Sciences Center provides advanced hemodialysis, peritoneal dialysis, and clinical nephrology programs, coupled with an active, highly successful kidney transplant program.',
    shortDesc: 'Srikara’s Renal Sciences Center provides advanced dialysis programs, clinical nephrology, and an active, highly successful kidney transplant program.',
    stats: [
      { label: 'Transplants Completed', value: '350+' },
      { label: 'Dialysis Machines', value: '45+' },
      { label: 'Patient Satisfaction', value: '4.95/5' }
    ],
    hotspots: [
      { top: '61%', left: '45%', label: 'Left Kidney (Blood Purification)' },
      { top: '63%', left: '54%', label: 'Renal Arteries & Vessels' }
    ]
  },
  {
    specialtyId: 'ortho',
    name: 'Orthopaedics',
    title: 'ROBOTIC JOINT REPLACEMENT',
    accentColor: '#1a56db', // Indigo/Blue
    desc: 'Reconstructing mobility, restoring freedom. As a national leader in Orthopaedics, Srikara utilizes high-precision robotic joint replacements (TKR/THR), advanced sports injury reconstruction, and rapid recovery clinical pathways.',
    shortDesc: 'As a national leader in Orthopaedics, Srikara utilizes high-precision robotic joint replacements and rapid recovery clinical pathways.',
    stats: [
      { label: 'Robotic Replacements', value: '25,000+' },
      { label: 'Joint Surgeons', value: '25+' },
      { label: 'Rapid Recovery Rate', value: '96.2%' }
    ],
    hotspots: [
      { top: '70%', left: '44%', label: 'Hip Joint (Femoral Alignment)' },
      { top: '80%', left: '50%', label: 'Knee Patella (Robotic Reconstruction)' }
    ]
  }
]

export function AnatomyExplorerPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [videoSrc, setVideoSrc] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  
  const targetTimeRef = useRef(0)
  const currentTimeRef = useRef(0)

  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const hudRef = useRef(null)
  const progressBarRef = useRef(null)
  const isLoadingRef = useRef(isLoading)

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  // Pre-fetch the 3D video as a blob to enable 100% butter-smooth local scroll scrubbing
  useEffect(() => {
    let active = true
    const videoUrl = assetUrl('anatomy.mp4')
    let objectUrl = null

    const prefetchVideo = async () => {
      try {
        const response = await fetch(videoUrl)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const contentLength = response.headers.get('content-length')
        const totalBytes = contentLength ? parseInt(contentLength, 10) : 0
        
        if (totalBytes === 0) {
          const blob = await response.blob()
          if (active) {
            objectUrl = URL.createObjectURL(blob)
            setVideoSrc(objectUrl)
          }
          return
        }

        const reader = response.body.getReader()
        let loadedBytes = 0
        const chunks = []

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          if (value) {
            chunks.push(value)
            loadedBytes += value.length
            if (active) {
              setDownloadProgress(Math.min(Math.round((loadedBytes / totalBytes) * 100), 100))
            }
          }
        }

        const blob = new Blob(chunks, { type: 'video/mp4' })
        if (active) {
          objectUrl = URL.createObjectURL(blob)
          setVideoSrc(objectUrl)
        }
      } catch (err) {
        console.error('Failed to pre-fetch video blob, falling back to direct streaming:', err)
        if (active) {
          setVideoSrc(videoUrl)
        }
      }
    }

    prefetchVideo()

    return () => {
      active = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [])

  // Track page scroll to drive the background video
  useEffect(() => {
    const handleScroll = () => {
      const maxScrollytellingScroll = 9 * window.innerHeight
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      
      let scrollY = window.scrollY

      // Prevent user from scrolling past the scrollytelling section until video catches up
      const video = videoRef.current
      if (video && !isLoadingRef.current && video.readyState >= 2 && scrollY > maxScrollytellingScroll) {
        const videoProgress = video.currentTime / 47.9
        if (videoProgress < 0.98) {
          window.scrollTo(0, maxScrollytellingScroll)
          scrollY = maxScrollytellingScroll
        }
      }
      
      const progress = Math.min(Math.max(scrollY / maxScrollytellingScroll, 0), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    // Fire once initially
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activeData = useMemo(() => {
    return CLINICAL_STORYLINE[activeIndex]
  }, [activeIndex])

  // Calculate video target time based on active segment
  const targetTime = useMemo(() => {
    // scrollProgress goes from 0 to 1 for the scrollytelling range
    // 48.0s is the full compiled video duration (1440 frames / 30fps)
    return scrollProgress * 47.9
  }, [scrollProgress])

  // Feed targetTime into the lerp loop
  useEffect(() => {
    targetTimeRef.current = targetTime
  }, [targetTime])

  // requestAnimationFrame linear-interpolation (lerp) video scrubbing loop
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let animationFrameId

    const smoothScrub = () => {
      if (video.readyState >= 2) {
        const diff = targetTimeRef.current - video.currentTime
        const step = diff * 0.15 // Glides smoothly to target
        const maxStep = 0.20 // Limits step per frame to ensure intermediate frames render and prevent skips
        const clampedStep = Math.sign(step) * Math.min(Math.abs(step), maxStep)

        if (Math.abs(diff) > 0.01) {
          video.currentTime += clampedStep
        } else {
          video.currentTime = targetTimeRef.current
        }

        // Direct DOM update of HUD Frame/Seconds counters
        if (hudRef.current) {
          const currentFrame = Math.min(Math.floor((video.currentTime / 47.9) * 1440), 1440)
          const currentSec = Math.min(Math.floor(video.currentTime), 48)
          hudRef.current.textContent = `FRAME: ${String(currentFrame).padStart(4, '0')} / SEC: ${String(currentSec).padStart(2, '0')}.0`
        }

        // Direct DOM update of vertical HUD progress bar height
        if (progressBarRef.current) {
          const videoProgress = video.currentTime / 47.9
          progressBarRef.current.style.height = `${Math.min(videoProgress, 1) * 100}%`
        }

        // Calculate and transition active specialty section based on actual video frame
        const videoProgress = video.currentTime / 47.9
        const scrollyProgress = Math.min(videoProgress, 1)
        const computedIndex = Math.min(
          Math.floor(scrollyProgress * CLINICAL_STORYLINE.length), 
          CLINICAL_STORYLINE.length - 1
        )

        if (computedIndex !== activeIndexRef.current) {
          activeIndexRef.current = computedIndex
          setActiveIndex(computedIndex)
        }
      }
      animationFrameId = requestAnimationFrame(smoothScrub)
    }

    animationFrameId = requestAnimationFrame(smoothScrub)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  // Video loaded handler
  const handleVideoLoaded = () => {
    setIsLoading(false)
  }

  // Double check if video loaded through fallback checking
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current
      if (video && video.readyState >= 2 && isLoading) {
        setIsLoading(false)
        clearInterval(interval)
      }
    }, 250)
    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <>
      <Helmet>
        <title>Interactive 3D Anatomy Explorer | Srikara Hospitals</title>
        <meta name="description" content="Explore the human anatomy interactively. Discover how Srikara's leading clinical specialties deliver precision medicine and state-of-the-art robotic surgeries." />
      </Helmet>

      <div className="min-h-screen bg-white font-['Inter'] text-slate-800 antialiased relative">
        <StickyNavbar />

        {/* Global Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 z-50 bg-[#FFFFFF] flex flex-col items-center justify-center text-center p-8"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#8B1A4A] animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-slate-50 border-b-[#2D3A4A] animate-spin [animation-direction:reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={28} className="text-[#8B1A4A] animate-pulse" />
                </div>
              </div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-headline font-black uppercase tracking-widest text-slate-800 mb-2"
              >
                SRIKARA 3D SIMULATOR
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B1A4A]"
              >
                {downloadProgress > 0 && downloadProgress < 100 
                  ? `PRE-LOADING ANATOMY ENGINES: ${downloadProgress}%`
                  : 'Booting 3D Anatomy Simulator...'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer scrollytelling container */}
        <div className="relative w-full" style={{ height: '1000vh' }}>
          
          {/* Sticky Visual Background viewport */}
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-white flex items-center justify-center pointer-events-none">
            
            {/* White Ambient Overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,#FFFFFF_90%)] z-10 pointer-events-none" />

            {/* Backglow element corresponding to active organ specialty color */}
            <div 
              className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-1000 ease-out z-0 pointer-events-none"
              style={{ backgroundColor: activeData.accentColor }}
            />

            {/* Pinned background video frame player, aligned below header with contrast filters to eliminate compression borders */}
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleVideoLoaded}
              onCanPlayThrough={handleVideoLoaded}
              className="absolute top-[60px] lg:top-[64px] bottom-auto lg:bottom-0 left-0 right-0 w-full h-[75vh] lg:h-[calc(100vh-64px)] object-contain object-[center_15%] lg:object-contain scale-[1.35] origin-top lg:scale-100 lg:origin-center mix-blend-multiply transition-opacity duration-1000 z-0 opacity-100 pointer-events-none"
              style={{ filter: 'contrast(1.04) brightness(1.03)' }}
            />


            {/* HUD Dashboard Overlays (HUD elements: back button, scroll progress) */}
            <div className="absolute inset-x-4 lg:inset-x-8 top-20 lg:top-28 z-30 flex justify-between items-start pointer-events-auto max-w-[1400px] mx-auto">
              {/* Sleek Floating Back Button */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 hover:bg-slate-900 border border-slate-200/80 hover:border-slate-900 text-slate-700 hover:text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm"
              >
                <ArrowLeft size={11} /> 
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </button>

              {/* HUD Frame / Scrub Indicator */}
              <div className="hidden lg:flex text-right flex-col items-end gap-0.5 sm:gap-1">
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#8B1A4A]">Srikara Clinical Engine</span>
                <span 
                  ref={hudRef}
                  className="font-mono text-[9px] sm:text-[11px] font-bold text-slate-400 bg-slate-100/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-slate-200/50"
                >
                  FRAME: 0000 / SEC: 00.0
                </span>
              </div>
            </div>

            {/* Cinematic Scrollytelling Narrative Text Layers (Fixed Left/Center overlay on desktop, glassmorphic bottom sheet on mobile) */}
            <div className="absolute inset-x-0 bottom-24 lg:inset-x-auto lg:bottom-auto lg:inset-y-0 lg:left-32 lg:w-auto lg:justify-start lg:px-0 lg:pt-[190px] z-30 flex flex-col justify-end pointer-events-none max-w-[1400px] mx-auto w-full px-4 sm:px-6">
              <div className="w-full max-w-xl text-left pointer-events-auto lg:pr-8 bg-transparent backdrop-blur-none border-none shadow-none p-3.5 sm:p-6 rounded-2xl sm:rounded-[32px] lg:p-0 transition-all duration-500">
                
                {/* Visual Specialty Vertical Indicator (HUD style) */}
                <div className="flex items-center gap-2 mb-2 sm:mb-4 lg:mb-6">
                  <div 
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: activeData.accentColor }}
                  />
                  <span 
                    className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.20em] sm:tracking-[0.25em]"
                    style={{ color: activeData.accentColor }}
                  >
                    Medical Specialty {activeIndex + 1} of {CLINICAL_STORYLINE.length}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 15, filter: 'blur(4px)', letterSpacing: '0.01em' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.04em' }}
                    exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-2 sm:gap-4 lg:gap-5"
                  >
                    {/* Cinematic Accent-colored Headline */}
                    <h1 className="font-headline font-black text-base sm:text-2xl md:text-3xl lg:text-[40px] leading-tight text-slate-900 uppercase tracking-tight">
                      {activeData.title}
                    </h1>

                    {/* Clean pure-text narrative - absolutely no background cards on desktop, responsive spacing */}
                    <p className="hidden lg:block text-[10px] sm:text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-lg mb-1 sm:mb-3 lg:mb-4">
                      <span className="lg:hidden">{activeData.shortDesc}</span>
                      <span className="hidden lg:inline">{activeData.desc}</span>
                    </p>

                    {/* Stats details, clean direct labels */}
                    <div className="grid grid-cols-3 gap-1 sm:gap-4 lg:gap-6 pt-1.5 sm:pt-3 lg:pt-4 border-t border-slate-100 max-w-md">
                      {activeData.stats.map((stat, i) => (
                        <div key={i} className="flex flex-col">
                          <span 
                            className="font-headline font-black text-xs sm:text-lg md:text-2xl leading-none transition-colors duration-300"
                            style={{ color: activeData.accentColor }}
                          >
                            {stat.value}
                          </span>
                          <span className="text-[6.5px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest text-slate-400 mt-0.5 sm:mt-2 leading-tight">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive CTAs linked to corresponding specialists */}
                    <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-6 lg:mt-8 w-full sm:w-auto">
                      <button
                        onClick={() => navigate(`/doctors?specialty=${activeData.specialtyId}`)}
                        className="flex-1 sm:flex-initial h-[34px] sm:h-[44px] lg:h-[48px] px-2 sm:px-8 text-white rounded-full font-bold uppercase tracking-[0.05em] sm:tracking-[0.1em] text-[8.5px] sm:text-[11px] transition-all duration-300 shadow-md hover:scale-[1.02] flex items-center justify-center"
                        style={{ 
                          backgroundColor: activeData.accentColor,
                          boxShadow: `0 8px 16px -4px ${activeData.accentColor}40`
                        }}
                      >
                        Consult Specialists
                      </button>
                      
                      <button
                        onClick={() => navigate('/book')}
                        className="flex-1 sm:flex-initial h-[34px] sm:h-[44px] lg:h-[48px] px-2 sm:px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold uppercase tracking-[0.05em] sm:tracking-[0.1em] text-[8.5px] sm:text-[11px] transition-all duration-300 hover:scale-[1.02] shadow-md flex items-center justify-center"
                      >
                        Book Appointment
                      </button>
                    </div>

                    {/* Quick Access Link to Manual Specialties Grid */}
                    <div className="mt-2.5 flex items-center justify-center sm:justify-start">
                      <button
                        onClick={() => navigate('/specialties-list')}
                        className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#8B1A4A]/80 hover:text-[#8B1A4A] underline decoration-[#8B1A4A]/30 transition-all pointer-events-auto flex items-center gap-1"
                      >
                        <span>View Text-Only Specialties Grid →</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Vertical HUD Dot Progress Indicator (Right Side margin - Hidden on mobile) */}
            <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6 items-center pointer-events-auto">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 rotate-90 origin-center mb-8">
                Scroll Progress
              </span>
              
              <div className="flex flex-col gap-3 relative">
                {/* Progress bar line */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-100" />
                <div 
                  ref={progressBarRef}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#8B1A4A]" 
                  style={{ height: '0%' }}
                />

                {CLINICAL_STORYLINE.map((item, idx) => {
                  const isActive = idx === activeIndex
                  const isPassed = idx < activeIndex
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const maxScrollytellingScroll = 9 * window.innerHeight
                        const targetScroll = (idx / CLINICAL_STORYLINE.length) * maxScrollytellingScroll
                        window.scrollTo({
                          top: targetScroll,
                          behavior: 'smooth'
                        })
                      }}
                      className="group relative z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm transition-all duration-300"
                      style={{ 
                        borderColor: isActive ? item.accentColor : isPassed ? '#8B1A4A' : '#e2e8f0',
                        color: isActive ? item.accentColor : isPassed ? '#8B1A4A' : '#94a3b8'
                      }}
                    >
                      {isPassed ? (
                        <Check size={10} className="stroke-[3]" />
                      ) : (
                        <span className="text-[9px] font-bold">{idx + 1}</span>
                      )}

                      {/* Tooltip on hover dot */}
                      <span className="absolute right-10 whitespace-nowrap bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md">
                        {item.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Clean bottom HUD Chevron scroll indicator (Adjusted position on mobile to prevent overlapping - Hidden on mobile) */}
            {scrollProgress <= 0.05 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                className="hidden lg:flex absolute bottom-[220px] lg:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-slate-400 pointer-events-none"
              >
                <span className="text-[9px] font-black uppercase tracking-widest">Scroll to Rotate Anatomy</span>
                <ChevronDown size={14} className="text-[#8B1A4A] stroke-[3]" />
              </motion.div>
            )}

          </div>

          {/* Trigger heights that extend the scrolling height - expanded to 150vh per segment for a slower, smooth scroll scrub */}
          <div className="absolute inset-0 pointer-events-none flex flex-col">
            <div className="h-[150vh]" /> {/* 1. Neurology */}
            <div className="h-[150vh]" /> {/* 2. Cardiology */}
            <div className="h-[150vh]" /> {/* 3. Pulmonology */}
            <div className="h-[150vh]" /> {/* 4. Gastroenterology */}
            <div className="h-[150vh]" /> {/* 5. Nephrology */}
            <div className="h-[150vh]" /> {/* 6. Orthopaedics */}
            <div className="h-screen" />    {/* 7. Final bottom triggers (starts at progress ~0.90) */}
          </div>
        </div>

        {/* Final CTA & Footer wrapper that overlays and scrolls up natively at progress > 0.85 */}
        <div className="relative z-40 bg-white border-t border-slate-100">
          
          {/* Centers of Specialty Care Section */}
          <UnevenDepartmentCollage />
          
          {/* Immersive Dark/Light Contrast CTA Panel */}
          <section className="py-32 px-8 max-w-[1400px] mx-auto text-center relative overflow-hidden bg-[#FFF9FA]">
            {/* Elegant Background radial glows */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,26,74,0.03)_0%,transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,58,74,0.02)_0%,transparent_60%)]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-pink-500/10 text-[#8B1A4A] border border-[#8B1A4A]/10">
                <Sparkles size={11} /> High Precision Medicine
              </span>
              
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black leading-none text-slate-900 uppercase tracking-tight">
                COMPREHENSIVE SURGICAL
                <br />
                <span className="text-[#8B1A4A]">EXCELLENCE AT SRIKARA</span>
              </h2>
              
              <p className="text-slate-500 max-w-2xl text-sm md:text-base font-medium leading-relaxed font-light">
                From robotic joint reconstructions to microscopic neuro-endovascular procedures, Srikara Hospitals houses India’s leading surgical specialists, equipped with cutting-edge medical technologies.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-4 w-full">
                <button
                  onClick={() => navigate('/book')}
                  className="h-[58px] px-12 bg-[#8B1A4A] text-white rounded-full font-bold uppercase tracking-[0.1em] text-[12px] shadow-lg hover:shadow-[0_15px_30px_rgba(139,26,74,0.25)] hover:scale-[1.02] transition-all duration-300"
                >
                  Schedule Consultation
                </button>
                <button
                  onClick={() => navigate('/specialties-list')}
                  className="h-[58px] px-12 bg-white border border-[#8B1A4A]/20 hover:border-[#8B1A4A]/40 text-[#4A4A4A] hover:text-[#1A202C] rounded-full font-bold uppercase tracking-[0.1em] text-[12px] hover:scale-[1.02] transition-all duration-300"
                >
                  Explore Specialties Grid
                </button>
              </div>
            </div>
          </section>

          {/* Standard Page Footer */}
          <Footer />
          <MobileBottomNav />
        </div>
      </div>
    </>
  )
}
