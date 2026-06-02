import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Activity, Sparkles, ArrowRight } from 'lucide-react'
import { assetUrl } from '@/lib/assetUrl'

// Individual Premium Glassmorphic Card with Tilt Effect
function GlassmorphicTiltCard({ dept, index, onClick }) {
  const cardRef = useRef(null)
  
  // Motion values for tilt physics
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const stiffness = 150
  const damping = 20
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness, damping })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness, damping })
  
  const [hovered, setHovered] = useState(false)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    // Relative coordinate from center (-0.5 to 0.5)
    const relX = (e.clientX - rect.left) / width - 0.5
    const relY = (e.clientY - rect.top) / height - 0.5
    
    x.set(relX)
    y.set(relY)

    // Glow position (0 to 100%)
    const glowX = ((e.clientX - rect.left) / width) * 100
    const glowY = ((e.clientY - rect.top) / height) * 100
    setGlowPos({ x: glowX, y: glowY })
  }

  const handleMouseLeave = () => {
    setHovered(false)
    x.set(0)
    y.set(0)
  }

  // Dynamically position the organ image based on card width
  const rightPosition = (() => {
    if (dept.span.includes('col-span-7')) {
      // Pushed more to the left (inward) to overlap and balance the wide card
      return 'right-4 md:right-[15%] lg:right-[8%] xl:right-[15%]'
    }
    if (dept.span.includes('col-span-6')) {
      // Slightly pushed inward
      return 'right-0 md:right-[8%] lg:right-[4%] xl:right-[8%]'
    }
    // Narrow col-span-5 cards: keep at the right edge
    return '-right-8'
  })()

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.08 }}
      className={`group relative rounded-[32px] border border-white/70 bg-white/45 backdrop-blur-xl p-8 flex flex-col justify-between overflow-hidden shadow-[0_12px_40px_rgba(31,41,55,0.03)] hover:shadow-[0_24px_50px_rgba(139,26,74,0.12)] transition-all duration-300 cursor-pointer ${dept.span} select-none`}
      id={`dept-card-${dept.specialtyId}`}
    >
      {/* 1. Dynamic Interactive Background Glow (Matching Department Theme) */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle 320px at ${glowPos.x}% ${glowPos.y}%, ${dept.glowColor} 0%, transparent 100%)`
        }}
      />

      {/* Decorative background grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      {/* 2. Top Banner / Pill Tag */}
      <div className="relative z-10 flex justify-between items-start w-full mb-4">
        <span 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/60 border border-white/80 shadow-sm"
          style={{ color: dept.accentColor }}
        >
          {dept.icon} {dept.highlightText}
        </span>
        
        {/* Floating Arrow */}
        <div 
          className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 group-hover:translate-x-1"
          style={{ backgroundColor: hovered ? dept.accentColor : 'white' }}
        >
          <ArrowRight size={14} />
        </div>
      </div>

      {/* 3. Collage Content (Details + Absolute Overlapping Image) */}
      <div className="relative z-10 flex-grow w-full flex flex-col justify-end">
        
        {/* Details Column - Restricted max-width to leave room on the right, allowing a small overlap */}
        <div className="text-left flex flex-col justify-end h-full max-w-[65%] md:max-w-[70%] relative z-10 pointer-events-none">
          <h3 className="font-display font-black text-slate-900 text-xl md:text-2xl leading-[1.05] uppercase tracking-tight mb-2.5">
            {dept.name}
          </h3>
          
          <p className="text-[12px] text-slate-550 font-bold leading-snug mb-4 max-w-[280px]">
            {dept.tagline}
          </p>

          <div className="flex gap-4 items-center">
            <div className="text-left">
              <span className="block text-2xl font-display font-black text-slate-800 leading-none">{dept.stat}</span>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{dept.statLabel}</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-200" />
            <div className="text-left">
              <span className="block text-xs font-black text-slate-700 leading-none">★ {dept.rating}</span>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Floating 3D Organ Column - Absolute positioned with responsive alignment to match layout bounds */}
        {dept.imgOnRight && (
          <div 
            className={`absolute bottom-[-16px] w-[180px] md:w-[220px] lg:w-[170px] xl:w-[210px] flex justify-center items-end select-none pointer-events-none z-0 ${rightPosition}`}
          >
            {/* Automatic Vertical Levitation Animation */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
                rotate: [-2, 2, -2]
              }}
              transition={{
                repeat: Infinity,
                duration: 6 + index,
                ease: 'easeInOut'
              }}
              className="relative w-full flex justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Backglow for the organ */}
              <div 
                className="absolute w-24 h-24 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${dept.accentColor}25 0%, transparent 70%)` }}
              />
              
              <img 
                src={assetUrl(dept.organImage)} 
                alt={dept.name} 
                className="w-full h-auto object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.06)] group-hover:scale-105 group-hover:drop-shadow-[0_16px_32px_rgba(0,0,0,0.10)] transition-transform duration-500 pointer-events-none"
              />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function UnevenDepartmentCollage({ branchName }) {
  const navigate = useNavigate()

  // Detect current branch from the URL hash/path
  const currentBranchName = branchName || (() => {
    const href = window.location.href.toLowerCase()
    if (href.includes('ecil')) return 'ECIL'
    if (href.includes('miyapur')) return 'Miyapur'
    if (href.includes('peerzadiguda')) return 'Peerzadiguda'
    if (href.includes('lb-nagar')) return 'L.B. Nagar'
    if (href.includes('kompally')) return 'Kompally'
    if (href.includes('lakdikapul')) return 'Lakdikapul'
    if (href.includes('vijayawada')) return 'Vijayawada'
    if (href.includes('rajahmundry')) return 'Rajahmundry'
    if (href.includes('rtc-x-roads')) return 'RTC X Roads'
    return ''
  })()

  const departments = [
    {
      name: "Cardiovascular Sciences",
      specialtyId: "cardio",
      tagline: "Ultra-rapid STEMI stenting & interventional labs resolving complex coronaries.",
      organImage: "images/heart-3d.png",
      highlightText: "Primary STEMI",
      stat: "6,700+",
      statLabel: "Healed Hearts",
      rating: "5.0/5.0",
      accentColor: "#dc2626",
      glowColor: "rgba(239, 68, 68, 0.12)",
      span: "col-span-1 md:col-span-5 md:row-span-2 min-h-[320px]",
      icon: "❤️",
      imgOnRight: true
    },
    {
      name: "Joints & Orthopedics",
      specialtyId: "ortho",
      tagline: "South India's pioneer in NAVIO robotic balancing & sub-millimetre accuracy.",
      organImage: "images/joint-3d.png",
      highlightText: "NAVIO Robotic",
      stat: "15,000+",
      statLabel: "Healed Joints",
      rating: "4.9/5.0",
      accentColor: "#1a56db",
      glowColor: "rgba(59, 130, 246, 0.12)",
      span: "col-span-1 md:col-span-7 md:row-span-2 min-h-[320px]",
      icon: "🦴",
      imgOnRight: true
    },
    {
      name: "Neurosciences & Brain Care",
      specialtyId: "neuro",
      tagline: "Minimally invasive keyhole procedures and microsurgeries protecting active motor control.",
      organImage: "images/brain-3d.png",
      highlightText: "Micro-Keyhole",
      stat: "1,800+",
      statLabel: "Healed Brains",
      rating: "4.9/5.0",
      accentColor: "#7c3aed",
      glowColor: "rgba(139, 92, 246, 0.12)",
      span: "col-span-1 md:col-span-7 md:row-span-2 min-h-[320px]",
      icon: "🧠",
      imgOnRight: true
    },
    {
      name: "Kidneys & Nephrology",
      specialtyId: "nephro",
      tagline: "Fellowship protocols from Mayo Clinic managing transplant care & advanced dialysis.",
      organImage: "images/kidney-3d.png",
      highlightText: "Mayo Fellowship",
      stat: "2,500+",
      statLabel: "Healed Kidneys",
      rating: "5.0/5.0",
      accentColor: "#0891b2",
      glowColor: "rgba(6, 182, 212, 0.12)",
      span: "col-span-1 md:col-span-5 md:row-span-2 min-h-[320px]",
      icon: "🧪",
      imgOnRight: true
    },
    {
      name: "Lungs & Pulmonology",
      specialtyId: "pulmo",
      tagline: "Advanced bronchoscopy & comprehensive pulmonary recovery plans.",
      organImage: "images/lungs-3d.png",
      highlightText: "Bronchoscopy",
      stat: "4,200+",
      statLabel: "Healed Lungs",
      rating: "4.8/5.0",
      accentColor: "#0d9488",
      glowColor: "rgba(20, 184, 166, 0.12)",
      span: "col-span-1 md:col-span-6 md:row-span-2 min-h-[320px]",
      icon: "🌬️",
      imgOnRight: true
    },
    {
      name: "Gastro & General Medicine",
      specialtyId: "physician",
      tagline: "Complete healthcare management, liver transplant backing, and preventative diagnostics.",
      organImage: "images/liver-3d.png",
      highlightText: "Preventative",
      stat: "30,000+",
      statLabel: "Total Patients",
      rating: "4.9/5.0",
      accentColor: "#d97706",
      glowColor: "rgba(245, 158, 11, 0.08)",
      span: "col-span-1 md:col-span-6 md:row-span-2 min-h-[320px]",
      icon: "💚",
      imgOnRight: true
    },
    {
      name: "Oncology & Cancer Care",
      specialtyId: "onco",
      tagline: "Advanced surgical resection margins, robotic oncology, and personalized molecular therapies.",
      organImage: "images/dna-3d.png",
      highlightText: "Robotic Tumor Care",
      stat: "5,800+",
      statLabel: "Treated Cases",
      rating: "4.9/5.0",
      accentColor: "#9333ea",
      glowColor: "rgba(147, 51, 234, 0.08)",
      span: "col-span-1 md:col-span-5 md:row-span-2 min-h-[320px]",
      icon: "🎗️",
      imgOnRight: true
    },
    {
      name: "Gynecology & Family Care",
      specialtyId: "gyn",
      tagline: "Empathetic prenatal programs, high-risk obstetrics backing, and advanced neonatal care systems.",
      organImage: "images/shield-3d.png",
      highlightText: "Obstetrics Care",
      stat: "8,900+",
      statLabel: "Happy Families",
      rating: "4.9/5.0",
      accentColor: "#db2777",
      glowColor: "rgba(219, 39, 119, 0.08)",
      span: "col-span-1 md:col-span-7 md:row-span-2 min-h-[320px]",
      icon: "🤰",
      imgOnRight: true
    }
  ]

  return (
    <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#FAFCFF] border-b border-slate-100 relative overflow-hidden select-none flex justify-center">
      
      {/* Background soft mesh gradients */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-50/40 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-rose-50/30 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-[1680px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-slate-100 pb-8">
          <div className="flex flex-col items-start max-w-2xl text-left">
            <span className="text-[#8B1A4A] text-[10px] font-black uppercase tracking-[0.4em] mb-3 flex items-center gap-1.5">
              <Sparkles size={12} className="animate-pulse text-[#cca830]" />
              Srikara Core Pillars
            </span>
            <h2 className="editorial-title text-3xl md:text-[44px] font-black tracking-tight leading-tight mb-4">
              <span className="block text-[#2D3A4A]">Centers of Specialty Care</span>
              <span className="block text-[#8B1A4A] mt-2">{currentBranchName ? `at Srikara ${currentBranchName}` : 'at Srikara'}</span>
            </h2>
            <div className="w-16 h-[2px] bg-[#8B1A4A]/25 mb-6" />
          </div>
          <div className="max-w-md text-slate-500 text-sm md:text-right font-medium leading-relaxed">
            Hover over the glassy department cards to interact with the medical illustrations, and click on them to immediately view our specialized medical team.
          </div>
        </div>

        {/* Uneven Asymmetric Grid Collage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[auto]">
          {departments.map((dept, index) => (
            <GlassmorphicTiltCard 
              key={dept.specialtyId} 
              dept={dept} 
              index={index} 
              onClick={() => navigate(`/specialties/${dept.specialtyId}?branch=${currentBranchName}`)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
