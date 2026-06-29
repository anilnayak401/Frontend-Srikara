import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Star, Award, Calendar, Phone, MessageCircle, 
  MapPin, Clock, GraduationCap, Globe, Shield, Heart, 
  Activity, Sparkles, Mail, ChevronRight, Play, BookOpen, Tv, X, ChevronLeft, Volume2, VolumeX, Pause, ArrowRight
} from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { ALL_DOCTORS, ACCENT_MAP } from '@/data/doctors'
import { assetUrl } from '@/lib/assetUrl'

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
                    borderColor: isActive ? brandAccent : 'rgba(0, 0, 0, 0)',
                    color: isActive ? brandAccent : 'rgba(0, 0, 0, 0)' 
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
// 7. DOCTOR-SPECIFIC BLOGS & VIDEOS DATASET
// ─────────────────────────────────────────────────────────────
const DOCTOR_MEDIA = {
  'dr-akhil-dadi': {
    blogs: [
      {
        id: 'b-dadi-1',
        title: "NAVIO Robotic Knee Joint Balancing: The Precision Factor",
        category: "Orthopaedics",
        date: "March 12, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800",
        excerpt: "An in-depth analysis of sub-millimetre implant balancing and how it maximizes knee joint longevity.",
        content: `<h3>Surgical Precision with Robotic Assistance</h3>
        <p>The success of a knee replacement relies heavily on how well the knee joint is balanced throughout its range of motion. Traditional surgical techniques rely on mechanical alignment guides and the surgeon's tactile feedback. However, even a deviation of 2 to 3 degrees can result in uneven load distribution, leading to premature wear of the implant.</p>
        <h3>The NAVIO Solution</h3>
        <p>With NAVIO robotic assistance, we map the patient's unique joint anatomy in real-time. This eliminates the need for preoperative CT scans. The robot provides a digital model of the joint and helps plan the precise bone cuts and implant size. During the operation, the robotic-assisted handpiece automatically shuts off if it moves outside the predefined safety boundary, ensuring perfect execution of the plan.</p>
        <blockquote>"Precision is not an option; it's the foundation of a successful recovery." — Dr. Akhil Dadi</blockquote>`
      },
      {
        id: 'b-dadi-2',
        title: "Accelerating Post-Op Day 1 Mobilization in Knee Replacement Patients",
        category: "Orthopaedics",
        date: "January 18, 2025",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800",
        excerpt: "How minimally invasive robotic bone cuts decrease trauma and allow patients to walk within 24 hours.",
        content: `<h3>Redefining Recovery Timelines</h3>
        <p>Historically, patients undergoing knee replacement were bedridden for several days, followed by weeks of painful physical therapy. Modern protocols, specifically when combined with robotic-assisted surgery, have completely transformed this timeline.</p>
        <h3>Minimal Tissue Trauma</h3>
        <p>Because the NAVIO system restricts bone cuts to the absolute millimetre required, the surrounding ligaments and soft tissues are preserved. This reduction in physical trauma, coupled with advanced local nerve blocks, allows patients to experience significantly less pain immediately after surgery.</p>
        <p>Consequently, we are able to stand our patients up and guide them to walk on Post-Operative Day 1, which dramatically reduces the risk of deep vein thrombosis and boosts patient confidence.</p>`
      },
      {
        id: 'b-dadi-3',
        title: "Sub-Millimetre Accuracy in Complex Revision Knee Arthroplasty",
        category: "Orthopaedics",
        date: "November 05, 2024",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
        excerpt: "A technical study on revising failed conventional implants using robotic visual mapping.",
        content: `<h3>The Challenge of Revision Surgery</h3>
        <p>Revision knee replacement is significantly more complex than primary surgery due to bone loss, scar tissue, and altered landmarks. Achieving perfect alignment is critical to ensure the second implant does not fail.</p>
        <h3>Robotic Revision Workflows</h3>
        <p>By using the NAVIO platform, we can perform detailed anatomical mapping of the joint surface and calculate the exact bone deficits. The system allows us to simulate the revision implant placement digitally before making any cuts, resulting in clean, predictable outcomes for complex joint failure cases.</p>`
      },
      {
        id: 'b-dadi-4',
        title: "Robotic vs Manual Knee Replacements: A 1000-Patient Study",
        category: "Orthopaedics",
        date: "September 14, 2024",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800",
        excerpt: "Comparing patient satisfaction, recovery times, and alignment metrics over 5 years of follow-up.",
        content: `<h3>Comparative Trial Details</h3>
        <p>We tracked 500 patients who underwent manual knee replacement and 500 patients who received robotic-assisted replacements at Srikara Hospitals over a five-year period.</p>
        <h3>Key Findings</h3>
        <p>The robotic-assisted cohort demonstrated significantly better alignment scores (97% within target vs 78% for manual) and reported shorter hospital stays (average 2.1 days vs 4.4 days). Most importantly, patient-reported satisfaction scores were 18% higher in the robotic group due to a more natural-feeling joint.</p>`
      }
    ],
    videos: [
      {
        id: 'v-dadi-1',
        title: "NAVIO Robotic Interface & Digital Planning Demo",
        duration: "4:20",
        thumbnail: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        id: 'v-dadi-2',
        title: "Patient Spotlight: Bilateral Robotic Knee Replacement Journey",
        duration: "3:15",
        thumbnail: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  },
  'dr-nikhil-veludandi': {
    blogs: [
      {
        id: 'b-nikhil-1',
        title: "Minimally Invasive Endoscopic Discectomy: Techniques & Recovery",
        category: "Neurosurgery",
        date: "April 05, 2025",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
        excerpt: "An inside look at how keyhole spinal procedures preserve muscle tissue and accelerate returning to work.",
        content: `<h3>The Shift to Endoscopic Spine Care</h3>
        <p>Herniated discs in the lower back are a common source of debilitating leg and back pain. While open discectomy has been the standard treatment, minimally invasive endoscopic spine surgery offers a highly effective alternative through an incision of less than 8mm.</p>
        <h3>Preserving Spinal Infrastructure</h3>
        <p>Using high-definition endoscopes and micro-instruments, we access the spinal canal directly by dilating the muscles rather than cutting them. The herniated disc material compressing the nerve is removed under direct visualization. Patients are typically discharged on the same day and can return to light desk jobs within a week.</p>`
      },
      {
        id: 'b-nikhil-2',
        title: "Microscopic Keyhole Resection for Complex Spine Tumors",
        category: "Neurosurgery",
        date: "February 20, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800",
        excerpt: "Utilizing advanced neuro-navigation and keyhole corridors to safely remove intradural spinal lesions.",
        content: `<h3>Precision in Tumor Resection</h3>
        <p>Spinal cord tumors present extreme challenges because of the risk of neurological damage. Advanced intraoperative neuro-monitoring (IONM) allows us to track nerve function in real-time while performing keyhole resections under microscopic magnification, achieving safe removal with minimal disruption.</p>`
      },
      {
        id: 'b-nikhil-3',
        title: "Cervical Disc Replacement: Preserving Neck Mobility",
        category: "Neurosurgery",
        date: "November 12, 2024",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=800",
        excerpt: "Why artificial disc replacements are superior to fusion for younger, active patients with pinched nerves.",
        content: `<h3>Fusion vs Motion Preservation</h3>
        <p>For patients with severe cervical radiculopathy, surgical decompression is highly effective. Rather than fusing the vertebrae (which limits neck mobility and increases wear on adjacent joints), we replace the damaged disc with a flexible artificial implant, preserving natural motion.</p>`
      }
    ],
    videos: [
      {
        id: 'v-nikhil-1',
        title: "Keyhole Spinal Endoscopy: Procedure Overview",
        duration: "5:10",
        thumbnail: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  },
  'dr-rameshwari-vishwakarma': {
    blogs: [
      {
        id: 'b-rameshwari-1',
        title: "Primary Angioplasty Benchmarks: Door-to-Balloon Under 45 Minutes",
        category: "Cardiology",
        date: "February 12, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800",
        excerpt: "How rapid clinical workflows and advanced catheterization labs save myocardium during acute heart attacks.",
        content: `<h3>Time is Muscle</h3>
        <p>During an acute myocardial infarction (heart attack), every minute of artery blockage leads to irreversible heart muscle death. The international gold standard for re-opening the blocked artery (Door-to-Balloon time) is 90 minutes. At Srikara, our dedicated heart team routinely achieves this in under 45 minutes.</p>
        <h3>Seamless Cardiac Workflows</h3>
        <p>From the moment a patient enters the emergency department with chest pain, an automatic protocol is activated. The cath lab is primed immediately, allowing us to guide the wire, inflate the balloon, and place a drug-eluting stent to restore coronary blood flow with rapid speed, minimizing long-term heart failure risks.</p>`
      },
      {
        id: 'b-rameshwari-2',
        title: "Stenting vs Bypass (CABG) in Complex Multi-Vessel Disease",
        category: "Cardiology",
        date: "December 08, 2024",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800",
        excerpt: "Analyzing clinical outcomes, vessel anatomy, and long-term survival metrics to decide optimal therapies.",
        content: `<h3>The Multidisciplinary Heart Team Decision</h3>
        <p>When patients present with blockages in multiple coronary arteries, choosing the best therapy requires weighing stenting (PCI) against open-heart bypass surgery (CABG). We discuss how coronary complexity (SYNTAX scores) and patient comorbidities guide our clinical choices.</p>`
      },
      {
        id: 'b-rameshwari-3',
        title: "Preventing Heart Failure: Early Warning Signs & Lifestyle Steps",
        category: "Cardiology",
        date: "October 15, 2024",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
        excerpt: "A practical clinical guide to managing blood pressure, cholesterol, and diabetes to protect cardiac muscle.",
        content: `<h3>The Path to Prevention</h3>
        <p>Heart failure is often the final stage of long-standing hypertension or coronary artery disease. We outline diagnostic markers, such as B-type natriuretic peptide (BNP) and ejection fraction, and discuss medical and lifestyle strategies to manage risks early.</p>`
      }
    ],
    videos: [
      {
        id: 'v-ramesh-1',
        title: "Interventional Cardiology & Cath Lab Technologies",
        duration: "6:05",
        thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  },
  'dr-vaishnavi-pochineni': {
    blogs: [
      {
        id: 'b-vaish-1',
        title: "Mayo Clinic Protocols in Kidney Transplant Immunosuppression",
        category: "Nephrology",
        date: "March 20, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=800",
        excerpt: "Implementing advanced post-transplant regimens to avoid organ rejection while minimizing drug toxicity.",
        content: `<h3>Tailored Immunosuppression</h3>
        <p>Successful kidney transplantation relies heavily on balancing the body's immune system. Too little immunosuppression leads to organ rejection; too much makes the patient vulnerable to infections. Drawing from fellowship protocols at the Mayo Clinic, we design customized drug regimens that monitor donor-specific antibodies in real-time.</p>
        <p>This precision monitoring allows us to taper drug doses safely, maintaining long-term graft survival while preserving the patient's overall health and vitality.</p>`
      },
      {
        id: 'b-vaish-2',
        title: "Dialysis vs Preemptive Transplantation: Finding the Best Path",
        category: "Nephrology",
        date: "January 11, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800",
        excerpt: "Why receiving a kidney transplant before starting dialysis leads to superior long-term survival rates.",
        content: `<h3>Preemptive Kidney Transplant Advantage</h3>
        <p>Preemptive transplantation refers to receiving a kidney transplant before a patient's kidney function deteriorates to the point of needing dialysis. We analyze clinical survival data and graft outcomes to demonstrate why preemptive transplant is the gold standard.</p>`
      },
      {
        id: 'b-vaish-3',
        title: "Understanding Glomerulonephritis: Diagnosis and Interventions",
        category: "Nephrology",
        date: "November 08, 2024",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
        excerpt: "A guide to recognizing kidney inflammation signs and utilizing biopsies for early therapy.",
        content: `<h3>Deciphering Glomerular Inflammation</h3>
        <p>Glomerulonephritis is a group of diseases that injure the part of the kidney that filters blood. Left untreated, it can lead to acute kidney injury or chronic renal failure. We outline key symptoms like hematuria and proteinuria, and explain the role of renal biopsies in creating treatment plans.</p>`
      }
    ],
    videos: [
      {
        id: 'v-vaish-1',
        title: "Advances in Renal Transplant Medicine",
        duration: "4:50",
        thumbnail: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  },
  'garapati-raja-bhagat': {
    blogs: [
      {
        id: 'b-raja-1',
        title: "Robotic Surgical Oncology: Achieving Clean Resection Margins",
        category: "Oncology",
        date: "April 01, 2025",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
        excerpt: "How robotic arm dexterity enables precise tumor isolation in complex pelvic and abdominal cancers.",
        content: `<h3>Robotic Precision in Cancer Excision</h3>
        <p>In surgical oncology, removing the entire tumor with a surrounding border of healthy tissue (achieving negative or 'clean' margins) is critical to prevent cancer recurrence. In deep anatomical spaces like the pelvis, standard laparoscopic instruments have limited movement.</p>
        <h3>The Multi-Jointed Robotic Edge</h3>
        <p>Using the robotic platform, we gain 3D high-definition visualization magnified up to 10x, and instruments that rotate with greater flexibility than the human wrist. This enables precise dissection of tumors away from major blood vessels and nerves, resulting in safer margins and quicker recovery.</p>`
      },
      {
        id: 'b-raja-2',
        title: "Enhanced Recovery Protocols (ERAS) in Gastrointestinal Cancers",
        category: "Oncology",
        date: "February 15, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800",
        excerpt: "How standard post-op pathways cut hospital stays by 40% in major abdominal cancer surgeries.",
        content: `<h3>Optimizing Post-Operative Recovery</h3>
        <p>Enhanced Recovery After Surgery (ERAS) represents a paradigm shift in perioperative care. We discuss preoperative counseling, optimal nutrition, early mobilization, and tailored pain protocols to improve gastrointestinal cancer surgery recovery.</p>`
      },
      {
        id: 'b-raja-3',
        title: "Discipline and Precision: Translating Military Values to the OR",
        category: "Oncology",
        date: "December 10, 2024",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=800",
        excerpt: "Dr. (Maj) Garapati Raja discusses how structured routines and army values optimize surgical outcomes.",
        content: `<h3>The Surgical Mission</h3>
        <p>As a former military surgeon, Dr. Garapati Raja brings structured checklists, rigorous team communication, and unwavering focus to the operating room. He outlines how these habits reduce surgical errors and create a safer environment for patients.</p>`
      }
    ],
    videos: [
      {
        id: 'v-raja-1',
        title: "Robotic Tools in Complex Abdominal Oncosurgery",
        duration: "7:12",
        thumbnail: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  },
  'dr-sushmitha-akula': {
    blogs: [
      {
        id: 'b-sush-1',
        title: "Hyperacute Stroke Interventions: Thrombolysis Windows & Protocols",
        category: "Neurology",
        date: "March 02, 2025",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800",
        excerpt: "Why the first 4.5 hours are critical for administering tissue plasminogen activator (tPA) to stroke patients.",
        content: `<h3>The Golden Hours of Stroke Care</h3>
        <p>An ischemic stroke occurs when a clot blocks blood flow to the brain, starving brain cells of oxygen. For every minute that passes, nearly 1.9 million neurons die. Reversing this process relies heavily on initiating thrombolytic (clot-busting) therapy as soon as possible.</p>
        <h3>tPA Administration Windows</h3>
        <p>The FDA-approved window for administering intravenous tPA is within 4.5 hours of symptom onset. Our rapid stroke protocol ensures that brain imaging is completed and medication is started shortly after the patient arrives, helping to prevent permanent disability.</p>`
      },
      {
        id: 'b-sush-2',
        title: "Epilepsy Management: Beyond Anticonvulsant Medications",
        category: "Neurology",
        date: "January 15, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
        excerpt: "Exploring vagus nerve stimulation (VNS) and dietary plans for drug-resistant epilepsy cases.",
        content: `<h3>Dealing with Drug-Resistant Epilepsy</h3>
        <p>Around 30% of epilepsy patients continue to experience seizures despite taking anticonvulsant medications. We discuss neuromodulation therapies, such as Vagus Nerve Stimulation (VNS), and explore lifestyle options that help improve seizure control.</p>`
      },
      {
        id: 'b-sush-3',
        title: "Diagnostic Evaluation of Peripheral Neuropathies",
        category: "Neurology",
        date: "November 18, 2024",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800",
        excerpt: "How electromyography (EMG) and nerve conduction studies localize nerve disorders.",
        content: `<h3>Localizing Peripheral Nerve Damage</h3>
        <p>Peripheral neuropathy causes numbness, pain, and weakness, often in the hands and feet. We outline our systematic diagnostic approach, including Electromyography (EMG) and nerve conduction velocity (NCV) testing, to isolate specific nerve roots and guide therapies.</p>`
      }
    ],
    videos: [
      {
        id: 'v-sush-1',
        title: "Recognizing Stroke Symptoms & Rapid Response Protocols",
        duration: "5:02",
        thumbnail: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  },
  'default': {
    blogs: [
      {
        id: 'b-def-1',
        title: "Evidence-Based Diagnostic Protocols at Srikara",
        category: "Clinical Care",
        date: "April 02, 2025",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=800",
        excerpt: "Integrating clinical expertise with modern diagnostic imaging for optimal patient recovery pathways.",
        content: `<h3>The Srikara Standard of Care</h3>
        <p>Modern medicine demands that treatment decisions be backed by clinical evidence and accurate diagnostics. At Srikara, we combine the experience of our specialists with state-of-the-art laboratory and imaging technologies to ensure every patient receives a precise diagnosis.</p>
        <p>By mapping out care plans based on proven protocols, we reduce unnecessary interventions, minimize recovery times, and help our patients return to their active daily routines safely.</p>`
      },
      {
        id: 'b-def-2',
        title: "Patient Recovery and Rehabilitation Best Practices",
        category: "Clinical Care",
        date: "February 22, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800",
        excerpt: "A comprehensive review of physical therapy timelines after major orthopedic and spinal procedures.",
        content: `<h3>Rehabilitation for Long-Term Mobility</h3>
        <p>Surgery is only the first step towards recovery. A structured, early physical rehabilitation program is key to restoring muscle strength and joint movement. We outline recovery exercises and discuss patient compliance guidelines that optimize long-term mobility.</p>`
      },
      {
        id: 'b-def-3',
        title: "Preventative Screenings: The First Line of Health Defense",
        category: "Clinical Care",
        date: "December 18, 2024",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
        excerpt: "Why early screenings for blood pressure, glucose, and tumors prevent major chronic diseases.",
        content: `<h3>Catching Health Risks Early</h3>
        <p>Many serious conditions like hypertension, Type 2 diabetes, and early-stage cancers show no symptoms. Regular health checkups allow our medical team to detect risks and intervene before complications develop. We review recommended tests and screening schedules for adults.</p>`
      }
    ],
    videos: [
      {
        id: 'v-def-1',
        title: "Clinical Technology & Diagnostics Advancements",
        duration: "3:45",
        thumbnail: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  }
};

// ─────────────────────────────────────────────────────────────
// BLOG READ MODAL
// ─────────────────────────────────────────────────────────────
function BlogModal({ blog, onClose }) {
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[820px] max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="relative h-64 md:h-72 flex-shrink-0">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center hover:bg-white shadow transition-all hover:scale-105">
            <X size={16} />
          </button>
          <span className="absolute top-4 left-4 bg-[#8B1A4A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-10">
            {blog.tag || 'Case Study'}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-8 md:px-10 pb-10 pt-6">
          <div className="flex items-center gap-4 text-xs text-[#94A3B8] mb-4">
            <span className="flex items-center gap-1"><Calendar size={12} />{blog.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{blog.readTime}</span>
            <span className="text-[#8B1A4A] font-semibold">{blog.category}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-6 leading-tight">{blog.title}</h2>
          <div
            className="text-[#475569] text-sm md:text-base leading-relaxed space-y-4 [&_h3]:text-[#1A202C] [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#8B1A4A] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#8B1A4A] [&_strong]:text-[#1A202C]"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </motion.div>
    </div>
  );
  return createPortal(modalContent, document.body);
}

// ─────────────────────────────────────────────────────────────
// 8. INTERACTIVE BLOGS & VIDEOS (Awwwards-Level Challenge Layout)
// ─────────────────────────────────────────────────────────────
function InteractiveBlogsAndVideos({ slug, name, brandAccent }) {
  const rawMediaData = DOCTOR_MEDIA[slug] || DOCTOR_MEDIA['default'];
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [hoveredBlogId, setHoveredBlogId] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktopSticky, setIsDesktopSticky] = useState(false);

  const parentRef = useRef(null);
  const sliderRef = useRef(null);
  const blogs = rawMediaData.blogs;

  useEffect(() => {
    const checkSticky = () => {
      setIsDesktopSticky(window.innerWidth >= 1024 && window.innerHeight >= 750);
    };
    checkSticky();
    window.addEventListener('resize', checkSticky);
    return () => window.removeEventListener('resize', checkSticky);
  }, []);

  const handleScroll = () => {
    if (!sliderRef.current || isDesktopSticky) return;
    const container = sliderRef.current;
    const totalScroll = container.scrollWidth - container.clientWidth;
    if (totalScroll > 0) {
      setScrollProgress((container.scrollLeft / totalScroll) * 100);
    }
  };

  useEffect(() => {
    const container = sliderRef.current;
    if (container && !isDesktopSticky) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [blogs.length, isDesktopSticky]);

  useEffect(() => {
    if (!isDesktopSticky) return;

    const handleStickyScroll = () => {
      if (!parentRef.current || !sliderRef.current) return;
      const parent = parentRef.current;
      const slider = sliderRef.current;
      
      const rect = parent.getBoundingClientRect();
      const parentHeight = rect.height;
      const viewHeight = window.innerHeight;
      const stickyTop = 110; 
      
      const stickyHeight = viewHeight - stickyTop;
      const pinningDistance = parentHeight - stickyHeight;
      
      if (pinningDistance <= 0) return;
      
      let progress = (stickyTop - rect.top) / pinningDistance;
      progress = Math.max(0, Math.min(1, progress));
      
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      slider.scrollLeft = progress * maxScroll;
      
      setScrollProgress(progress * 100);
    };

    window.addEventListener('scroll', handleStickyScroll, { passive: true });
    handleStickyScroll();
    
    return () => {
      window.removeEventListener('scroll', handleStickyScroll);
    };
  }, [isDesktopSticky, blogs.length]);

  const handleWheel = (e) => {
    if (!sliderRef.current || isDesktopSticky) return;
    const container = sliderRef.current;
    const isAtStart = container.scrollLeft === 0;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;

    if (e.deltaY !== 0) {
      if ((e.deltaY > 0 && !isAtEnd) || (e.deltaY < 0 && !isAtStart)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }
  };

  if (!blogs.length) return null;

  const renderContent = () => (
    <div className="relative z-10 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-8 border-b border-slate-100 relative">
        <div className="space-y-3 max-w-2xl">
          <span className="text-[#8B1A4A] text-[11px] font-black uppercase tracking-[0.5em] mb-2 block">Clinical Insights</span>
          <h2 className="editorial-title text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] mb-4">
            <span className="block text-slate-900">Blogs &amp;</span>
            <span className="block text-[#8B1A4A] mt-2">Case Studies</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#8B1A4A]/25 mb-6" />
        </div>
        
        <div className="flex flex-col gap-1 items-end shrink-0 ml-auto lg:ml-0">
          <div className="flex gap-1">
            <div className="w-[42px] h-[42px] bg-black border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full text-white p-2" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
                <line x1="10" y1="90" x2="90" y2="10" />
                <line x1="40" y1="90" x2="90" y2="40" strokeWidth="4" opacity="0.6" />
              </svg>
            </div>
            <div className="w-[42px] h-[42px] bg-black border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full text-white p-2" viewBox="0 0 100 100" fill="currentColor">
                <polygon points="10,90 90,90 90,10" />
              </svg>
            </div>
          </div>
          <div className="flex gap-1">
            <div className="w-[42px] h-[42px] bg-black border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full text-white p-2" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
                <line x1="10" y1="90" x2="90" y2="10" />
              </svg>
            </div>
            <div className="w-[42px] h-[42px] bg-black border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full text-white p-2.5" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
                <line x1="20" y1="10" x2="20" y2="90" />
                <line x1="50" y1="10" x2="50" y2="90" />
                <line x1="80" y1="10" x2="80" y2="90" />
              </svg>
            </div>
            <div className="w-[42px] h-[42px] bg-black border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full text-white p-2" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
                <polygon points="50,15 15,85 85,85" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={sliderRef}
        onWheel={handleWheel}
        className={`w-full py-4 flex gap-6 snap-x snap-mandatory scroll-smooth scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none ${isDesktopSticky ? 'overflow-x-hidden' : 'overflow-x-auto'}`}
      >
        {blogs.map((blog, idx) => {
          const isHovered = hoveredBlogId === blog.id;

          return (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.05 }}
              onMouseEnter={() => setHoveredBlogId(blog.id)}
              onMouseLeave={() => setHoveredBlogId(null)}
              onClick={() => setSelectedBlog(blog)}
              className="snap-start relative w-[380px] h-[480px] rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white cursor-pointer shrink-0 transition-all duration-300 group flex flex-col hover:border-[#8B1A4A]/30 hover:shadow-[0_16px_48px_rgba(139,26,74,0.1)]"
            >
              <div className="relative h-52 w-full overflow-hidden bg-[#F1F5F9] shrink-0 border-b border-[#E2E8F0]">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out" 
                  style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' }}
                />
                
                <span 
                  className="absolute top-4 left-4 bg-[#8B1A4A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-20"
                >
                  {blog.tag || 'Case Study'}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8] mb-3">
                    <span className="text-[#8B1A4A] font-semibold">{blog.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />{blog.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{blog.readTime}</span>
                  </div>

                  <h4 className="font-bold text-[#1A202C] text-lg leading-snug mb-3 group-hover:text-[#8B1A4A] transition-colors line-clamp-2">
                    {blog.title}
                  </h4>

                  <p className="text-[#64748B] text-sm leading-relaxed line-clamp-3 mb-5">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[#8B1A4A] text-xs font-bold uppercase tracking-wider">
                  Read More <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-4 flex flex-col items-center">
        <div className="w-48 h-[2px] bg-slate-100 rounded-none relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#8B1A4A] transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {selectedBlog && (
        <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}

      {isDesktopSticky ? (
        <div ref={parentRef} className="relative w-full h-[220vh]">
          <div className="sticky top-[110px] h-[calc(100vh-110px)] min-h-[620px] w-full flex flex-col justify-center overflow-hidden bg-white">
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUpVariants}
              className="relative overflow-hidden w-full text-slate-900 space-y-6"
            >
              {renderContent()}
            </motion.section>
          </div>
        </div>
      ) : (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUpVariants}
          className="relative overflow-hidden py-12 text-slate-900 space-y-8 bg-white"
        >
          {renderContent()}
        </motion.section>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// INNER CONTENT COMPONENT
// ─────────────────────────────────────────────────────────────
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

  const organImage = (() => {
    switch (doctor.specialtyId) {
      case 'cardio': return 'images/heart-3d.png'
      case 'neuro':
      case 'neurosurg':
      case 'spine': return 'images/brain-3d.png'
      case 'ortho': return 'images/joint-3d.png'
      case 'nephro':
      case 'urology': return 'images/kidney-3d.png'
      case 'pulmo': return 'images/lungs-3d.png'
      default: return 'images/liver-3d.png'
    }
  })()

  const organLabel = (() => {
    switch (doctor.specialtyId) {
      case 'cardio': return 'Healed Hearts'
      case 'neuro':
      case 'neurosurg':
      case 'spine': return 'Healed Brains'
      case 'ortho': return 'Healed Joints'
      case 'nephro':
      case 'urology': return 'Healed Kidneys'
      case 'pulmo': return 'Healed Lungs'
      default: return 'Healed Patients'
    }
  })()

  return (
    <div className="min-h-screen bg-white font-body text-slate-800 antialiased selection:bg-[#8B1A4A] selection:text-white">
      <StickyNavbar currentBranch={{ branchLogo: 'https://i.ibb.co/CK9bqmXK/sri-logo.jpg' }} />

      <div className="pt-[76px] lg:pt-[88px] bg-white">
        
        <main className="w-full pb-20">

          {/* Nuvica Premium Glassmorphic Hero Container - Stretched Full Width */}
          <div className="w-full border-y border-slate-200/80 bg-gradient-to-r from-slate-50 via-sky-50/40 to-blue-50/50 shadow-[0_16px_48px_rgba(31,41,55,0.03)] py-8 relative overflow-hidden mb-16 select-none flex justify-center">
            
            {/* Wide layout inner content alignment */}
            <div className="w-full max-w-[1680px] mx-auto px-6 md:px-16 lg:px-24 relative">
            
            {/* Background glowing mesh circles */}
            <div className="absolute -top-16 -right-16 w-[450px] md:w-[600px] h-[450px] md:h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.02) 70%, transparent 100%)' }} />
            <div className="absolute -bottom-16 -left-16 w-[300px] md:w-[450px] h-[300px] md:h-[450px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, rgba(251,191,36,0.02) 70%, transparent 100%)' }} />

            {/* Floating Top Left Pill tag - Completely glassmorphic */}
            <div className="absolute top-6 left-8 inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white/70 px-4 py-2 rounded-full shadow-sm text-slate-700">
              <Activity size={14} className="text-[#3b82f6]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fast Treatment</span>
            </div>

            {/* Floating Top Right Badge - Completely glassmorphic */}
            <div className="absolute top-6 right-8 bg-white/55 backdrop-blur-md border border-white/70 px-5 py-2.5 rounded-full flex items-center gap-3.5 shadow-sm hover:scale-[1.02] transition-all cursor-pointer">
              <img src={assetUrl('favicon-logo.jpg')} alt="Srikara Logo" className="w-8 h-8 rounded-full border border-white/60 object-cover shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-[11px] font-black text-slate-800">@srikara_health</p>
                <p className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Verified Medical Center</p>
              </div>
            </div>

            {/* 3-Column Grid Layout: Details on Left, Portrait in Center, Organ on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 pt-16">
              
              {/* Left Column (lg:col-span-4): Nuvica Details & Actions (Light High-Contrast Theme) */}
              <div className="lg:col-span-4 flex flex-col text-left">
                {isChairman && (
                  <div className="font-black uppercase text-[10px] tracking-[0.3em] mb-2.5 flex items-center gap-1.5 animate-pulse" style={{ color: brandAccent }}>
                    <Award size={14} className="fill-current opacity-20" />
                    Visionary Founder &amp; Chairman
                  </div>
                )}

                {/* Display Title in Slate-800 */}
                <h1 className="text-slate-800 text-3xl md:text-4xl lg:text-[42px] font-display font-black tracking-tighter leading-[1.0] uppercase mb-5">
                  <SplitText text={doctor.name} />
                </h1>

                <p className="text-sm font-black uppercase tracking-[0.2em] mb-4" style={{ color: brandAccent }}>
                  {doctor.label}
                </p>

                <p className="text-base text-slate-850 font-bold leading-tight mb-3">
                  {doctor.tagline || `Committed to providing world-class diagnostic and surgical precision.`}
                </p>

                <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed mb-8 max-w-sm">
                  {doctor.about || `${doctor.name} is a renowned ${doctor.specialty} specialist at Srikara Hospitals, leading innovative patient care and advanced therapeutic solutions.`}
                </p>

                {/* Staggered Capsule Buttons */}
                <div className="flex flex-wrap gap-2.5">
                  <MagneticButton 
                    onClick={() => navigate(`/book/${doctor.slug}`)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-wider shadow-md transition-all duration-300 flex items-center gap-2"
                  >
                    <Calendar size={14} className="stroke-white fill-none" /> BOOK APPOINTMENT
                  </MagneticButton>
                  
                  <MagneticButton
                    onClick={() => window.location.href = `tel:${doctor.phone}`}
                    className="bg-slate-100/80 hover:bg-slate-200/90 text-slate-800 px-6 py-3.5 rounded-xl font-black text-[11px] transition-all duration-300 flex items-center gap-2 border border-slate-200/60 shadow-sm"
                  >
                    <Phone size={14} className="text-slate-700 stroke-[2.5px] fill-none" /> Call Now
                  </MagneticButton>

                  <MagneticButton
                    onClick={() => window.open(`https://wa.me/${doctor.whatsapp}?text=Hello%20${encodeURIComponent(doctor.name)}%2C%20I%20would%20like%20to%20book%20an%20appointment.`, '_blank')}
                    className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-3.5 rounded-xl font-black text-[11px] transition-all duration-300 flex items-center gap-2 shadow-sm"
                  >
                    <MessageCircle size={14} className="stroke-white fill-none" /> WhatsApp
                  </MagneticButton>
                </div>
              </div>

              {/* Center Column (lg:col-span-4): Curved Doctor Portrait (Completely background-free) */}
              <div className="lg:col-span-4 flex justify-center relative pt-8 lg:pt-0">
                <div className="relative w-full max-w-[420px] aspect-[4/5] overflow-hidden select-none group transition-transform duration-500 hover:scale-[1.03]">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover object-top filter contrast-[102%] hover:scale-105 transition-all duration-700 pointer-events-none"
                    onError={e => { if (doctor.fallback) e.target.src = doctor.fallback }} 
                  />
                </div>

                {/* Overlapping bubble: Experience - Completely glassmorphic */}
                <div className="absolute bottom-[-16px] left-[6%] bg-white/60 backdrop-blur-md border border-white/80 px-5 py-3.5 rounded-2xl flex items-center gap-3.5 shadow-lg select-none pointer-events-none max-w-[280px] z-20">
                  <div className="w-9 h-9 rounded-xl bg-blue-50/50 backdrop-blur-sm flex items-center justify-center text-blue-600 shrink-0 font-bold">
                    💼
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-800 leading-none">{doctor.exp}</p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1 leading-none">Medical Excellence</p>
                  </div>
                </div>

                {/* Floating Rating Badge at Top Right - Completely glassmorphic */}
                <div className="absolute top-4 right-[6%] bg-white/60 backdrop-blur-md border border-white/80 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md z-20">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-slate-800">{doctor.rating}</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-none">Choice</span>
                </div>
              </div>

              {/* Right Column (lg:col-span-4): Floating 3D Specialty Organ (Completely background-free & interactive) */}
              <div className="lg:col-span-4 flex flex-col justify-center relative select-none pt-8 lg:pt-0">
                <div className="w-full min-h-[350px] md:min-h-[420px] flex items-center justify-center relative">
                  {/* Subtle Light Burgundy Background Shading Glow */}
                  <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-80" style={{ background: 'radial-gradient(circle, rgba(139,26,74,0.18) 0%, rgba(139,26,74,0.02) 65%, transparent 100%)' }} />

                  {/* Direct beautiful transparent organ PNG with very slight and slow automatic vertical levitation */}
                  <motion.div
                    animate={{
                      y: [-5, 5, -5]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 8,
                      ease: "easeInOut"
                    }}
                    className="relative z-10"
                  >
                    <img 
                      src={assetUrl(organImage)} 
                      alt={organLabel} 
                      className="w-64 md:w-76 lg:w-[360px] h-auto object-contain filter drop-shadow-[0_16px_32px_rgba(31,41,55,0.08)] hover:scale-105 hover:rotate-2 hover:drop-shadow-[0_24px_48px_rgba(31,41,55,0.12)] transition-all duration-500 ease-out cursor-pointer"
                    />
                  </motion.div>

                  {/* Floating Awards Tag above Organ - Completely glassmorphic */}
                  <div className="absolute top-4 left-4 bg-white/60 backdrop-blur-md border border-white/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-md hover:scale-[1.02] transition-transform animate-bounce-subtle z-20">
                    <div className="w-8 h-8 rounded-xl bg-amber-50/50 backdrop-blur-sm flex items-center justify-center text-[#cca830] shrink-0 font-bold">
                      🏆
                    </div>
                    <div className="text-left leading-none">
                      <p className="text-[11px] font-black text-slate-800">490</p>
                      <p className="text-[8px] text-slate-455 font-bold uppercase tracking-wider mt-0.5">Awards</p>
                    </div>
                  </div>

                  {/* Floating Healed Patient Tag next to Organ - Completely glassmorphic */}
                  <div className="absolute bottom-8 right-4 bg-white/60 backdrop-blur-md border border-white/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-md hover:scale-[1.02] transition-transform animate-float-subtle z-20">
                    <div className="w-8 h-8 rounded-xl bg-blue-50/50 backdrop-blur-sm flex items-center justify-center text-blue-600 shrink-0 font-bold">
                      🩺
                    </div>
                    <div className="text-left leading-none">
                      <p className="text-[11px] font-black text-slate-800">
                        {doctor.specialtyId === 'ortho' ? '15,000+' : 
                         doctor.specialtyId === 'cardio' ? '6,700+' :
                         doctor.specialtyId === 'nephro' ? '2,500+' :
                         doctor.specialtyId === 'neuro' || doctor.specialtyId === 'neurosurg' ? '1,800+' :
                         '10,000+'}
                      </p>
                      <p className="text-[8px] text-slate-455 font-bold uppercase tracking-wider mt-0.5">
                        {organLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Education Details banner at the bottom of the card (Frosted Glass Light Theme) */}
            <div className="w-full h-[1px] bg-slate-200/80 mt-12 mb-8 relative z-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left relative z-10">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 text-slate-500">
                  Academic Credentials &amp; Fellowships
                </h4>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {doctor.education?.length > 0 ? (
                    doctor.education.map((edu, idx) => (
                      <li key={idx} className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5">
                        <GraduationCap size={13} className="text-slate-400" />
                        <span>{edu}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5">
                      <GraduationCap size={13} className="text-slate-400" />
                      <span>{doctor.sub}</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="flex flex-col md:items-end justify-center text-slate-700">
                <div className="flex items-center gap-2.5 text-[12px] font-bold">
                  <Clock size={13} className="text-slate-400" />
                  <span>Available for Consultations: {doctor.availability}</span>
                </div>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                  <MapPin size={11} className="text-slate-400" /> Primary Practice: Srikara {doctor.branch}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── SCROLL-BASED ADDITIONAL DETAILS (INTERACTIVE ACCORDION & KINETIC SCROLL REVEAL) ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-28 space-y-28 border-t border-slate-100 pt-20">
            
            {/* Section 3: Interactive Blogs & Video Lectures Showcase */}
            <InteractiveBlogsAndVideos slug={doctor.slug} name={doctor.name} brandAccent={brandAccent} />

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



            {/* Back to Doctors Button at the bottom */}
            <div className="mt-16 flex justify-center">
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onClick={() => navigate('/doctors')} 
                className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.03] shadow-sm cursor-pointer"
              >
                <ArrowLeft size={12} /> Back to Doctors
              </motion.button>
            </div>

          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-20 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
