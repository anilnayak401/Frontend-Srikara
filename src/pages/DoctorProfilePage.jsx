import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Star, Award, Calendar, Phone, MessageCircle, 
  MapPin, Clock, GraduationCap, Globe, Shield, Heart, 
  Activity, Sparkles, Mail, ChevronRight
} from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { ALL_DOCTORS, ACCENT_MAP } from '@/data/doctors'

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      stiffness: 50, 
      damping: 15,
      duration: 0.8 
    } 
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
}

// ─────────────────────────────────────────────────────────────
// 1. ERROR BOUNDARY FOR ROBUST DIAGNOSTICS
// ─────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Crash in DoctorProfilePage:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-rose-50 text-rose-900 min-h-screen font-mono whitespace-pre-wrap">
          <h1 className="text-xl font-bold mb-4">Something went wrong (React Exception)</h1>
          <p className="mb-4 font-bold text-sm bg-rose-100 p-3 rounded">{this.state.error?.toString()}</p>
          <pre className="text-xs p-4 bg-rose-100/50 rounded border border-rose-200 overflow-auto max-w-full">
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2.5 bg-rose-900 text-white font-bold rounded-lg hover:bg-rose-800 transition-colors"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ─────────────────────────────────────────────────────────────
// 2. KINETIC TEXT REVEAL
// ─────────────────────────────────────────────────────────────
function SplitText({ text }) {
  if (!text) return null
  const words = text.split(' ')
  return (
    <span className="inline-block flex-wrap">
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-3 md:mr-4 pb-1 overflow-hidden">
          {word.split('').map((char, cIdx) => (
            <motion.span
              key={cIdx}
              className="inline-block origin-bottom font-black"
              variants={{
                hidden: { y: '100%', opacity: 0, rotate: 4 },
                visible: { 
                  y: 0, 
                  opacity: 1,
                  rotate: 0,
                  transition: { type: 'spring', stiffness: 100, damping: 14 }
                }
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// 3. CINEMATIC SCROLL REVEAL WORD QUOTE (Awwwards Style)
// ─────────────────────────────────────────────────────────────
function ScrollRevealQuote({ text, isDark = false }) {
  if (!text) return null
  const words = text.split(' ')
  
  return (
    <div className="flex flex-col relative z-10">
      <div className="flex flex-wrap leading-tight text-3xl md:text-4xl lg:text-[42px] font-display font-light mb-2 tracking-tight">
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            variants={{
              hidden: { opacity: 0.15, y: 15, scale: 0.98 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: 'spring', stiffness: 80, damping: 15 }
              }
            }}
            className={`inline-block mr-2 md:mr-2.5 mb-1 ${isDark ? 'text-white font-extrabold' : 'text-slate-900 font-extrabold'}`}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 4. MAGNETIC BUTTON (tactile physics)
// ─────────────────────────────────────────────────────────────
function MagneticButton({ children, className, onClick, style }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    const distanceX = clientX - centerX
    const distanceY = clientY - centerY

    const pull = 0.32
    setPosition({ x: distanceX * pull, y: distanceY * pull })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 120, damping: 12, mass: 0.1 }}
      className={className}
      onClick={onClick}
      style={{ ...style, cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// 5. INTERACTIVE 3D PORTRAIT
// ─────────────────────────────────────────────────────────────
function InteractivePortrait({ src, alt, fallback }) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('')
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xc = rect.width / 2
    const yc = rect.height / 2

    const maxTilt = 8
    const rotateX = ((yc - y) / yc) * maxTilt
    const rotateY = ((x - xc) / xc) * -maxTilt

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100
    setGlare({ x: glareX, y: glareY, opacity: 0.35 })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlare(prev => ({ ...prev, opacity: 0 }))
  }

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[420px] aspect-[4/5] bg-slate-50 overflow-hidden select-none transition-transform duration-300 ease-out cursor-pointer"
      style={{ 
        transform,
        transformStyle: 'preserve-3d'
      }}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover object-top filter grayscale-[5%] contrast-[102%] hover:grayscale-0 transition-all duration-700 pointer-events-none"
        onError={e => { if (fallback) e.target.src = fallback }} 
      />
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255,255,255,0) 60%)`
        }}
      />
      
      <div className="hidden md:block absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-white pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  )
}

// Helper to resolve milestone topic to appropriate Lucide Icon Component
function getMilestoneIcon(title) {
  const t = title.toLowerCase()
  if (t.includes('joint') || t.includes('ortho') || t.includes('bone') || t.includes('replacement')) {
    return Activity // represents joint flexion/extension movement
  }
  if (t.includes('fracture') || t.includes('trauma') || t.includes('injury') || t.includes('spine') || t.includes('disc')) {
    return Shield // represents protection/structural spinal support
  }
  if (
    t.includes('cardio') || t.includes('heart') || t.includes('coronary') || 
    t.includes('stemi') || t.includes('angioplasty') || t.includes('catheterization') || 
    t.includes('failure') || t.includes('valve')
  ) {
    return Heart // represents the heart / cardiac pulse
  }
  if (t.includes('brain') || t.includes('neuro') || t.includes('nerve')) {
    return Sparkles // represents synapses / brainwave activity
  }
  if (t.includes('consult') || t.includes('clinic') || t.includes('appointment') || t.includes('hours') || t.includes('time')) {
    return Clock // represents scheduling and clinical hours
  }
  if (t.includes('diagnost') || t.includes('imaging') || t.includes('pathology') || t.includes('test') || t.includes('scan')) {
    return Globe // represents comprehensive, systematic diagnosis
  }
  return Activity // fallback
}

// ─────────────────────────────────────────────────────────────
// 6. CLINICAL MILESTONES: HOVER ACCORDION SHOWCASE
// ─────────────────────────────────────────────────────────────
function InteractiveMilestones({ milestones, brandAccent }) {
  const [hoveredIdx, setHoveredIdx] = useState(0)
  
  // Resolve the active icon dynamically based on the active hovered index milestone
  const ActiveIcon = getMilestoneIcon(milestones[hoveredIdx])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left: Dynamic Visual Indicator Dial (Larger Icon & Dynamically Swapped Symbols) */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center select-none">
        <div className="relative w-80 h-80 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50/40">
          
          {/* Animated Radial Pulse Rings */}
          <div className="absolute inset-4 rounded-full border border-slate-200/50 animate-pulse" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="absolute inset-8 rounded-full border border-dashed"
            style={{ borderColor: `${brandAccent}40` }}
          />

          {/* Dynamic Core Glow */}
          <motion.div 
            key={hoveredIdx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.16 }}
            className="absolute inset-16 rounded-full blur-xl"
            style={{ backgroundColor: brandAccent }}
          />

          {/* Center Showcase - Larger layout & Dynamic Symbols alignment */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <motion.div
              key={hoveredIdx}
              initial={{ rotate: -35, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 140, damping: 14 }}
              className="w-24 h-24 rounded-[28px] bg-white border border-slate-100 flex items-center justify-center shadow-lg mb-4"
              style={{ color: brandAccent }}
            >
              <ActiveIcon size={38} className="transition-transform duration-300" />
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Milestone</span>
            <span className="text-2xl font-display font-black text-slate-900 mt-0.5">
              {String(hoveredIdx + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Hover List */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        {milestones.map((item, idx) => {
          const isActive = hoveredIdx === idx
          return (
            <div 
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              className="group cursor-pointer border-b border-slate-100 pb-5 pt-2 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {/* Big Number */}
                  <span 
                    className="text-xl md:text-2xl font-display font-black transition-colors duration-300"
                    style={{ color: isActive ? brandAccent : '#CBD5E1' }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Title */}
                  <h4 
                    className="text-lg md:text-xl font-display font-extrabold transition-all duration-300 group-hover:translate-x-2"
                    style={{ color: isActive ? '#1A202C' : '#64748B' }}
                  >
                    {item}
                  </h4>
                </div>

                <motion.div 
                  animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }}
                  className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
                  style={{ 
                    borderColor: isActive ? brandAccent : 'transparent',
                    color: isActive ? brandAccent : 'transparent' 
                  }}
                >
                  <ChevronRight size={14} />
                </motion.div>
              </div>

              {/* Detail Text */}
              <motion.div 
                initial={false}
                animate={{ 
                  height: isActive ? 'auto' : 0, 
                  opacity: isActive ? 1 : 0,
                  marginTop: isActive ? 12 : 0 
                }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="overflow-hidden pl-12 pr-6"
              >
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-light">
                  Advanced diagnostics and therapeutic methodologies performed with clinical accuracy and recovery guidance. Incorporating modern evidence-based practices at Srikara to optimize patient recovery and wellness.
                </p>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// INNER CONTENT COMPONENT
// ─────────────────────────────────────────────────────────────
function DoctorProfilePageContent() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const doctor = ALL_DOCTORS.find(d => d.slug === slug)
  const pledgeContainerRef = useRef(null)

  useEffect(() => { 
    window.scrollTo(0, 0) 
  }, [slug])

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-800">
        <div className="text-center">
          <p className="text-slate-400 text-xl mb-4">Doctor not found</p>
          <button onClick={() => navigate('/doctors')} className="text-[#8B1A4A] font-bold hover:underline">← Back to Doctors</button>
        </div>
      </div>
    )
  }

  const isChairman = doctor.slug === 'akhil-dadi' || doctor.slug === 'dr-akhil-dadi'
  const brandAccent = isChairman ? '#cca830' : (ACCENT_MAP[doctor.specialtyId]?.accent || '#8B1A4A')
  
  const [pledgeGlow, setPledgeGlow] = useState({ x: 0, y: 0, opacity: 0 })
  const handlePledgeMouseMove = (e) => {
    if (!pledgeContainerRef.current) return
    const rect = pledgeContainerRef.current.getBoundingClientRect()
    setPledgeGlow({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 0.18
    })
  }

  const milestones = doctor.expertise?.length > 0 ? doctor.expertise : [
    "Outpatient Consultation & Diagnosis",
    "Advanced Clinical Interventions",
    "Evidence-based Recovery Programs",
    "Multidisciplinary Diagnostics"
  ]

  return (
    <div className="min-h-screen bg-white font-body text-slate-800 antialiased selection:bg-[#8B1A4A] selection:text-white">
      <StickyNavbar currentBranch={{ branchLogo: 'https://i.ibb.co/CK9bqmXK/sri-logo.jpg' }} />

      <div className="pt-[110px] lg:pt-[130px] bg-white">
        
        <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-20">
          
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate('/doctors')} 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[11px] font-bold uppercase tracking-[0.2em] mb-10 transition-colors"
          >
            <ArrowLeft size={12} /> Back to Doctors
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="lg:col-span-5 flex flex-col items-center lg:items-start"
            >
              <InteractivePortrait 
                src={doctor.image} 
                alt={doctor.name} 
                fallback={doctor.fallback} 
              />

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex items-center justify-between w-full max-w-[420px] px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-100/60"
              >
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-slate-800">{doctor.rating}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patient Choice</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <Shield size={12} style={{ color: brandAccent }} />
                  <span>Verified Expert</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 flex flex-col pt-1"
            >
              
              {isChairman && (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex items-center gap-2 mb-3 text-[#cca830] font-black uppercase text-[10px] tracking-[0.3em]"
                >
                  <Award size={14} className="fill-[#cca830]/20" />
                  Visionary Founder & Chairman
                </motion.div>
              )}

              <h1 className="text-5xl md:text-6xl lg:text-[72px] font-display font-black text-slate-900 tracking-tighter leading-[0.95] mb-4 flex flex-wrap">
                <SplitText text={doctor.name} />
              </h1>

              <motion.p 
                variants={fadeInUpVariants}
                className="text-sm font-black uppercase tracking-[0.2em] mb-6"
                style={{ color: brandAccent }}
              >
                {doctor.label}
              </motion.p>

              <motion.p 
                variants={fadeInUpVariants}
                className="text-lg md:text-xl text-slate-700 font-light leading-relaxed mb-4 max-w-2xl"
              >
                {doctor.tagline || `Committed to providing world-class diagnostic and surgical precision.`}
              </motion.p>

              <motion.p 
                variants={fadeInUpVariants}
                className="text-xs md:text-sm text-slate-400 font-light leading-relaxed mb-8 max-w-xl"
              >
                {doctor.about || `${doctor.name} is a renowned ${doctor.specialty} specialist at Srikara Hospitals, leading innovative patient care and advanced therapeutic solutions in the region.`}
              </motion.p>

              <motion.div 
                variants={fadeInUpVariants}
                className="w-full h-[1px] bg-slate-200/80 my-2" 
              />

              <motion.div 
                variants={fadeInUpVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8"
              >
                <div className="flex flex-col">
                  <h4 
                    className="text-[10px] font-black uppercase tracking-[0.25em] mb-4"
                    style={{ color: brandAccent }}
                  >
                    Education & Fellowships
                  </h4>
                  <ul className="space-y-3 mb-6 flex-1">
                    {doctor.education?.length > 0 ? (
                      doctor.education.map((edu, idx) => (
                        <li key={idx} className="text-[13px] font-bold text-slate-800 leading-snug flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                          <span>{edu}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[13px] font-bold text-slate-800 leading-snug flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                        <span>{doctor.sub}</span>
                      </li>
                    )}
                  </ul>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <a 
                      href={`tel:${doctor.phone}`}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[var(--hover-color)] hover:border-[var(--hover-color)] transition-all"
                      style={{ '--hover-color': brandAccent }}
                      title="Call Doctor"
                    >
                      <Phone size={14} />
                    </a>
                    <a 
                      href={`https://wa.me/${doctor.whatsapp}?text=Hello%20${encodeURIComponent(doctor.name)}%2C%20I%20would%20like%20to%20book%20an%20appointment.`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all"
                      title="WhatsApp Chat"
                    >
                      <MessageCircle size={14} />
                    </a>
                    <a 
                      href="mailto:info@srikarahospitals.com"
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[var(--hover-color)] hover:border-[var(--hover-color)] transition-all"
                      style={{ '--hover-color': brandAccent }}
                      title="Email Inquiry"
                    >
                      <Mail size={14} />
                    </a>
                  </div>

                </div>

                <div className="flex flex-col">
                  <h4 
                    className="text-[10px] font-black uppercase tracking-[0.25em] mb-4"
                    style={{ color: brandAccent }}
                  >
                    Experience & Location
                  </h4>
                  <div className="space-y-3 mb-6 text-[13px] font-bold text-slate-800 flex-1">
                    <div className="flex items-start gap-2">
                      <Award size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-slate-800 leading-none">{doctor.exp}</p>
                        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">Clinical Excellence</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-slate-800 leading-none">Srikara {doctor.branch}</p>
                        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">Primary Practice location</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-slate-800 leading-none">{doctor.availability}</p>
                        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">Consultation Schedule</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-600 bg-amber-50"
                      title={`Top Rated Doctor: ${doctor.rating}/5`}
                    >
                      <Star size={15} className="fill-amber-500/20" />
                    </div>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-600 bg-rose-50"
                      title="Cardiac/Surgical Specialist Care"
                    >
                      <Heart size={15} />
                    </div>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 bg-blue-50"
                      title="Multilingual Consultation Available"
                    >
                      <Globe size={15} />
                    </div>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 bg-emerald-50"
                      title="Certified Patient Safety Protocols"
                    >
                      <Shield size={15} />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeInUpVariants}
                className="flex flex-wrap gap-4 mt-4"
              >
                <MagneticButton 
                  onClick={() => navigate(`/book/${doctor.slug}`)}
                  className="bg-[#2D3A4A] hover:bg-[#1A2330] text-white px-8 py-3.5 rounded-full font-bold text-[11px] uppercase tracking-widest shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  <Calendar size={13} /> Book Appointment
                </MagneticButton>
                
                <MagneticButton
                  onClick={() => window.location.href = `tel:${doctor.phone}`}
                  className="border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-900 px-8 py-3.5 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 bg-white"
                >
                  <Phone size={13} /> Call Reception
                </MagneticButton>
              </motion.div>

            </motion.div>

          </div>

          {/* ── SCROLL-BASED ADDITIONAL DETAILS (INTERACTIVE ACCORDION & KINETIC SCROLL REVEAL) ── */}
          <div className="mt-28 space-y-28 border-t border-slate-100 pt-20">
            
            {/* Section 1: Clinical Specialties & Milestones (Awwwards Hover Accordion Layout) */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="bg-white"
            >
              <div className="mb-14">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2">
                  Evidence-based Practice
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight">
                  Clinical Milestones & Focus
                </h3>
              </div>

              <InteractiveMilestones milestones={milestones} brandAccent={brandAccent} />
            </motion.section>

            {/* Section 2: Pledge of Care / Chairman's Vision (Insanely High-End Editorial Split Layout) */}
            <motion.section 
              ref={pledgeContainerRef}
              onMouseMove={handlePledgeMouseMove}
              onMouseLeave={() => setPledgeGlow(prev => ({ ...prev, opacity: 0 }))}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="relative overflow-hidden rounded-[40px] p-8 md:p-16 transition-all duration-500 bg-slate-50 border border-slate-100 shadow-sm"
            >
              {/* Dynamic Interactive Glow Spot (Mouse guided) */}
              <div 
                className="absolute pointer-events-none transition-opacity duration-500 ease-out"
                style={{
                  left: `${pledgeGlow.x - 250}px`,
                  top: `${pledgeGlow.y - 250}px`,
                  width: '500px',
                  height: '500px',
                  opacity: pledgeGlow.opacity,
                  background: `radial-gradient(circle, ${brandAccent}20 0%, transparent 70%)`
                }}
              />

              {/* Decorative Giant Background Quotation Marks for Luxury Feel */}
              <span className="absolute -top-6 -left-6 text-[220px] font-serif text-slate-200/40 select-none pointer-events-none font-extrabold leading-none">“</span>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative z-10">
                {/* Left Column (7 cols): Massive Editorial Quote */}
                <div className="lg:col-span-7 flex flex-col pt-2">
                  {isChairman ? (
                    <ScrollRevealQuote 
                      text="Healthcare is not just about healing body parts; it's about restoring a person's life and dignity."
                      isDark={false}
                    />
                  ) : (
                    <ScrollRevealQuote 
                      text="Every diagnosis is a commitment to restore active, pain-free living."
                      isDark={false}
                    />
                  )}
                </div>

                {/* Right Column (5 cols): Author Citation & Detailed Bio Context */}
                <div className="lg:col-span-5 flex flex-col pt-2 border-t lg:border-t-0 lg:border-l border-slate-200/70 lg:pl-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: brandAccent }}
                    />
                    <h5 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                      {isChairman ? "Founding Chairman's Charter" : "Pledge of Clinical Care"}
                    </h5>
                  </div>
                  
                  <p className="text-[13px] font-bold text-slate-900 leading-snug mb-4">
                    {isChairman ? "Dr. Akhil Dadi" : "Srikara Excellence Charter"}
                  </p>
                  
                  <p className="text-slate-500 text-xs font-light leading-relaxed">
                    {isChairman 
                      ? "Under Dr. Akhil Dadi's leadership, Srikara Hospitals has set benchmarks in joint surgery by introducing South India's first NAVIO robotic orthopedic system, reducing recovery times and achieving record success rates for over 30,000 satisfied patients."
                      : "At Srikara, our specialists emphasize empathy-driven consultation combined with cutting-edge medical science, ensuring that each patient receives optimal, personalized attention."
                    }
                  </p>
                </div>
              </div>
            </motion.section>

          </div>

          <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div>
              © 2026 Srikara Hospitals | Healing Hands, Caring Hearts
            </div>
            <div className="flex items-center gap-4">
              <span>Designed for Excellence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span>AP & Telangana</span>
            </div>
          </div>

        </main>

      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// EXPORTED COMPONENT WRAPPED IN ERROR BOUNDARY
// ─────────────────────────────────────────────────────────────
export function DoctorProfilePage() {
  return (
    <ErrorBoundary>
      <DoctorProfilePageContent />
    </ErrorBoundary>
  )
}
