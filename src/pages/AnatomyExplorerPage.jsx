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

const CLINICAL_STORYLINE = [
  {
    specialtyId: 'neuro',
    name: 'Neurology',
    title: 'NEURO-ENDOVASCULAR PRECISION',
    accentColor: '#7c3aed', // Purple
    desc: 'Unlocking the complexities of the human brain. Srikara’s Stroke and Neuro-Endovascular clinic delivers ultra-rapid micro-surgical interventions for brain tumors, spinal corrections, and critical neurological anomalies, restoring vital functions with microscopic accuracy.',
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
    specialtyId: 'cardio',
    name: 'Cardiology',
    title: 'CARDIOVASCULAR LIFELINES',
    accentColor: '#dc2626', // Red
    desc: 'Engineering the rhythm of life. Srikara’s Cardiovascular Excellence Center pioneers beating-heart CABG, robotic valve replacements, structural heart repairs, and round-the-clock primary angioplasties. We ensure cardiac survival through cutting-edge diagnostics.',
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
    specialtyId: 'pulmo',
    name: 'Pulmonology',
    title: 'ADVANCED RESPIRATORY CARE',
    accentColor: '#0d9488', // Teal
    desc: 'Breathing vitality back into compromised lungs. From interstitial lung diseases to complex respiratory failure, Srikara’s Pulmonology team deploys advanced endobronchial ultrasound (EBUS), rigid bronchoscopy, and customized lung rehabilitation protocols.',
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
    specialtyId: 'physician',
    name: 'Gastroenterology',
    title: 'GASTROINTESTINAL EXCELLENCE',
    accentColor: '#2563eb', // Blue
    desc: 'Nurturing the core of digestive vitality. Our Advanced GI Sciences team provides cutting-edge diagnostic and therapeutic endoscopy, ERCP, and comprehensive hepatobiliary interventions, ensuring early detection and transplant management.',
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
  
  const targetTimeRef = useRef(0)
  const currentTimeRef = useRef(0)

  // Track page scroll to drive the background video
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      
      const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Fire once initially
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Map the scroll progress [0, 0.90] (scrollytelling range) to active section indices
  const activeIndex = useMemo(() => {
    // 0.90 marks the end of scrollytelling. After 0.90, the CTA/Footer scroll in naturally.
    const scrollyProgress = Math.min(scrollProgress / 0.90, 1)
    const index = Math.min(Math.floor(scrollyProgress * CLINICAL_STORYLINE.length), CLINICAL_STORYLINE.length - 1)
    return index
  }, [scrollProgress])

  const activeData = useMemo(() => {
    return CLINICAL_STORYLINE[activeIndex]
  }, [activeIndex])

  // Calculate video target time based on active segment
  const targetTime = useMemo(() => {
    const scrollyProgress = Math.min(scrollProgress / 0.90, 1)
    // 48.0s is the full compiled video duration (1440 frames / 30fps)
    return scrollyProgress * 47.9
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
        // If difference is small, snap to target time to avoid micro-jitters
        if (Math.abs(diff) > 0.01) {
          video.currentTime += diff * 0.12 // Easing factor: 0.12 provides smooth cinematic gliding
        } else {
          video.currentTime = targetTimeRef.current
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
                className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B1A4A]/60"
              >
                Loading 1,440 Anatomy Frames...
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
              src={assetUrl('anatomy.mp4')}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleVideoLoaded}
              onCanPlayThrough={handleVideoLoaded}
              className="absolute top-[64px] bottom-0 left-0 right-0 w-full h-[calc(100vh-64px)] object-contain mix-blend-multiply transition-opacity duration-1000 z-0 opacity-100 pointer-events-none"
              style={{ filter: 'contrast(1.04) brightness(1.03)' }}
            />


            {/* HUD Dashboard Overlays (HUD elements: back button, scroll progress) */}
            <div className="absolute inset-x-8 top-28 z-30 flex justify-between items-start pointer-events-auto max-w-[1400px] mx-auto">
              {/* Sleek Floating Back Button */}
              <button
                onClick={() => navigate('/specialties')}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-slate-900 border border-slate-200/80 hover:border-slate-900 text-slate-700 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm"
              >
                <ArrowLeft size={12} /> Back to Specialties
              </button>

              {/* HUD Frame / Scrub Indicator */}
              <div className="text-right flex flex-col items-end gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8B1A4A]">Srikara Clinical Engine</span>
                <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200/50">
                  FRAME: {String(Math.min(Math.floor(scrollProgress * 1440), 1440)).padStart(4, '0')} / SEC: {String(Math.min(Math.floor(targetTime), 48)).padStart(2, '0')}.0
                </span>
              </div>
            </div>

            {/* Cinematic Scrollytelling Narrative Text Layers (Fixed Left/Center overlay) */}
            <div className="absolute inset-y-0 left-10 md:left-24 lg:left-32 z-30 flex flex-col justify-center pointer-events-none max-w-[1400px] mx-auto w-full pt-20">
              <div className="w-full max-w-xl text-left pointer-events-auto pr-8">
                
                {/* Visual Specialty Vertical Indicator (HUD style) */}
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: activeData.accentColor }}
                  />
                  <span 
                    className="text-[10px] font-black uppercase tracking-[0.25em]"
                    style={{ color: activeData.accentColor }}
                  >
                    Medical Specialty {activeIndex + 1} of {CLINICAL_STORYLINE.length}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 30, filter: 'blur(8px)', letterSpacing: '0.01em' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.04em' }}
                    exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-5"
                  >
                    {/* Cinematic Accent-colored Headline */}
                    <h1 className="font-headline font-black text-[32px] md:text-[40px] leading-tight text-slate-900 uppercase tracking-tight">
                      {activeData.title}
                    </h1>

                    {/* Clean pure-text narrative - absolutely no background cards */}
                    <p className="text-[13px] md:text-[14px] text-slate-500 font-medium leading-[1.8] max-w-lg mb-4">
                      {activeData.desc}
                    </p>

                    {/* Stats details, clean direct labels */}
                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100 max-w-md">
                      {activeData.stats.map((stat, i) => (
                        <div key={i} className="flex flex-col">
                          <span 
                            className="font-headline font-black text-2xl leading-none transition-colors duration-300"
                            style={{ color: activeData.accentColor }}
                          >
                            {stat.value}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2 leading-tight">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive CTAs linked to corresponding specialists */}
                    <div className="flex flex-wrap items-center gap-4 mt-8">
                      <button
                        onClick={() => navigate(`/doctors?specialty=${activeData.specialtyId}`)}
                        className="h-[48px] px-8 text-white rounded-full font-bold uppercase tracking-[0.1em] text-[11px] transition-all duration-300 shadow-md hover:scale-[1.02]"
                        style={{ 
                          backgroundColor: activeData.accentColor,
                          boxShadow: `0 10px 20px -5px ${activeData.accentColor}50`
                        }}
                      >
                        Consult Specialists
                      </button>
                      
                      <button
                        onClick={() => navigate('/book')}
                        className="h-[48px] px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold uppercase tracking-[0.1em] text-[11px] transition-all duration-300 hover:scale-[1.02] shadow-md"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Vertical HUD Dot Progress Indicator (Right Side margin) */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6 items-center pointer-events-auto">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 rotate-90 origin-center mb-8">
                Scroll Progress
              </span>
              
              <div className="flex flex-col gap-3 relative">
                {/* Progress bar line */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-100" />
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#8B1A4A] transition-all duration-500" 
                  style={{ height: `${Math.min(scrollProgress / 0.90, 1) * 100}%` }}
                />

                {CLINICAL_STORYLINE.map((item, idx) => {
                  const isActive = idx === activeIndex
                  const isPassed = idx < activeIndex
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const targetScroll = (idx / CLINICAL_STORYLINE.length) * 0.90
                        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
                        window.scrollTo({
                          top: targetScroll * totalHeight,
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

            {/* Clean bottom HUD Chevron scroll indicator */}
            {scrollProgress <= 0.05 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-slate-400 pointer-events-none"
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
                  onClick={() => navigate('/specialties')}
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
