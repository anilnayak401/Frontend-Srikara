import { useState, useMemo, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { 
  Heart, Brain, Bone, Baby, Zap, Activity, ShieldCheck, 
  Search, ChevronRight, Microscope, Syringe, Scissors, 
  Stethoscope, Thermometer, User, ArrowRight, Filter,
  Star, Award, Pill, Radiation, Wind, Droplets, FlaskConical,
  Cross, Info, Sparkles
} from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'

import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { AlphabetDiseaseSearch } from '@/components/sections/AlphabetDiseaseSearch'
import { PremiumDoctorFinder } from '@/components/sections/PremiumDoctorFinder'
import { assetUrl } from '@/lib/assetUrl'

// Brand palette for this dark-bg page
const P = '#8B1A4A'   // primary rose
const S = '#2D3A4A'   // secondary teal
const STYLES = `
  .glass-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 26, 74,0.08);
    transition: all 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }
  .glass-card:hover {
    border-color: rgba(139, 26, 74,0.25);
    box-shadow: 0 20px 40px rgba(139, 26, 74,0.05), 0 0 0 1px rgba(139, 26, 74,0.05);
    transform: translateY(-6px);
  }
`;

const CATEGORIES = [
  { id: 'ALL', label: 'All Specialities', icon: '✦' },
  { id: 'MEDICAL', label: 'Medical', icon: '🔷' },
  { id: 'SURGICAL', label: 'Surgical', icon: '⚔️' },
  { id: 'WOMEN_CHILD', label: 'Women & Child', icon: '🌸' },
  { id: 'DIAGNOSTICS', label: 'Diagnostics', icon: '🔬' },
  { id: 'EMERGENCY', label: 'Emergency', icon: '🚨' },
]

const DEPARTMENTS = [
  // --- MEDICAL ---
  { 
    name: 'Cardiology', 
    category: 'MEDICAL', 
    icon: Heart, 
    desc: 'Advanced interventional cardiology and structural heart protocols.', 
    docs: 18,
    specialtyId: 'cardio',
    accentColor: '#dc2626',
    glowColor: 'rgba(239, 68, 68, 0.12)',
    organImage: 'images/heart-3d.png',
    rating: '5.0'
  },
  { 
    name: 'Neurology', 
    category: 'MEDICAL', 
    icon: Brain, 
    desc: 'Comprehensive brain, spine, and neurological disorder management.', 
    docs: 14,
    specialtyId: 'neuro',
    accentColor: '#7c3aed',
    glowColor: 'rgba(139, 92, 246, 0.12)',
    organImage: 'images/brain-3d.png',
    rating: '4.9'
  },
  { 
    name: 'Pulmonology', 
    category: 'MEDICAL', 
    icon: Wind, 
    desc: 'Advanced respiratory care and interstitial lung disease clinic.', 
    docs: 9,
    specialtyId: 'pulmo',
    accentColor: '#0d9488',
    glowColor: 'rgba(20, 184, 166, 0.12)',
    organImage: 'images/lungs-3d.png',
    rating: '4.8'
  },
  { 
    name: 'Nephrology', 
    category: 'MEDICAL', 
    icon: Droplets, 
    desc: 'Renal replacement therapy and dialysis excellence center.', 
    docs: 11,
    specialtyId: 'nephro',
    accentColor: '#0891b2',
    glowColor: 'rgba(6, 182, 212, 0.12)',
    organImage: 'images/kidney-3d.png',
    rating: '5.0'
  },
  { 
    name: 'Gastroenterology', 
    category: 'MEDICAL', 
    icon: Activity, 
    desc: 'Digestive health, therapeutic endoscopy, and hepatology.', 
    docs: 15,
    specialtyId: 'physician',
    accentColor: '#2563eb',
    glowColor: 'rgba(37, 99, 235, 0.08)',
    organImage: 'images/liver-3d.png',
    rating: '4.9'
  },
  { 
    name: 'Oncology', 
    category: 'MEDICAL', 
    icon: Radiation, 
    desc: 'Comprehensive medical oncology and targeted therapy.', 
    docs: 22, 
    featured: true,
    specialtyId: 'onco',
    accentColor: '#9333ea',
    glowColor: 'rgba(147, 51, 234, 0.08)',
    organImage: 'images/dna-3d.png',
    rating: '4.9'
  },
  
  // --- SURGICAL ---
  { 
    name: 'Cardiac Surgery', 
    category: 'SURGICAL', 
    icon: Heart, 
    desc: 'Minimally invasive bypass and valve replacement surgery.', 
    docs: 8,
    specialtyId: 'cardio',
    accentColor: '#dc2626',
    glowColor: 'rgba(239, 68, 68, 0.12)',
    organImage: 'images/heart-3d.png',
    rating: '4.9'
  },
  { 
    name: 'Neurosurgery', 
    category: 'SURGICAL', 
    icon: Brain, 
    desc: 'Micro-neurosurgery and precision spinal reconstruction.', 
    docs: 7,
    specialtyId: 'neurosurg',
    accentColor: '#7c3aed',
    glowColor: 'rgba(139, 92, 246, 0.12)',
    organImage: 'images/brain-3d.png',
    rating: '4.9'
  },
  { 
    name: 'Orthopaedics', 
    category: 'SURGICAL', 
    icon: Bone, 
    desc: 'Robotic joint replacement and complex limb salvage.', 
    docs: 25, 
    featured: true,
    specialtyId: 'ortho',
    accentColor: '#1a56db',
    glowColor: 'rgba(59, 130, 246, 0.12)',
    organImage: 'images/joint-3d.png',
    rating: '4.9'
  },
  { 
    name: 'Urology', 
    category: 'SURGICAL', 
    icon: Activity, 
    desc: 'Advanced laparo-urology and renal transplant surgery.', 
    docs: 12,
    specialtyId: 'urology',
    accentColor: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.12)',
    organImage: 'images/kidney-3d.png',
    rating: '4.8'
  },
  { 
    name: 'Vascular Surgery', 
    category: 'SURGICAL', 
    icon: Activity, 
    desc: 'Endovascular repairs and diabetic foot management.', 
    docs: 6,
    specialtyId: 'cardio',
    accentColor: '#dc2626',
    glowColor: 'rgba(239, 68, 68, 0.12)',
    organImage: 'images/heart-3d.png',
    rating: '4.8'
  },
  
  // --- WOMEN & CHILD ---
  { 
    name: 'Obstetrics & Gynaec', 
    category: 'WOMEN_CHILD', 
    icon: Baby, 
    desc: 'High-risk pregnancy care and advanced laparoscopic gynaecology.', 
    docs: 16,
    specialtyId: 'gyn',
    accentColor: '#db2777',
    glowColor: 'rgba(219, 39, 119, 0.08)',
    organImage: 'images/shield-3d.png',
    rating: '4.9'
  },
  { 
    name: 'Fertility & IVF', 
    category: 'WOMEN_CHILD', 
    icon: Sparkles, 
    desc: 'Precision reproductive medicine and genetic screening.', 
    docs: 5,
    specialtyId: 'gyn',
    accentColor: '#db2777',
    glowColor: 'rgba(219, 39, 119, 0.08)',
    organImage: 'images/shield-3d.png',
    rating: '4.9'
  },
  { 
    name: 'Neonatology', 
    category: 'WOMEN_CHILD', 
    icon: Baby, 
    desc: 'Level III NICU for advanced neonatal intensive care.', 
    docs: 10,
    specialtyId: 'gyn',
    accentColor: '#db2777',
    glowColor: 'rgba(219, 39, 119, 0.08)',
    organImage: 'images/shield-3d.png',
    rating: '4.9'
  },
  { 
    name: 'Paediatrics', 
    category: 'WOMEN_CHILD', 
    icon: Baby, 
    desc: 'Comprehensive child healthcare and immunisations.', 
    docs: 12,
    specialtyId: 'peds',
    accentColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.08)',
    organImage: 'images/shield-3d.png',
    rating: '4.8'
  },
  
  // --- DIAGNOSTICS ---
  { 
    name: 'Radiology', 
    category: 'DIAGNOSTICS', 
    icon: Microscope, 
    desc: 'Interventional radiology and high-resolution imaging.', 
    docs: 20,
    specialtyId: 'radio',
    accentColor: '#475569',
    glowColor: 'rgba(71, 85, 105, 0.12)',
    organImage: 'images/brain-3d.png',
    rating: '4.8'
  },
  { 
    name: 'Pathology', 
    category: 'DIAGNOSTICS', 
    icon: FlaskConical, 
    desc: 'Automated molecular pathology and histopathology.', 
    docs: 14,
    specialtyId: 'path',
    accentColor: '#64748b',
    glowColor: 'rgba(100, 116, 139, 0.12)',
    organImage: 'images/dna-3d.png',
    rating: '4.7'
  },
  { 
    name: 'Physiotherapy', 
    category: 'DIAGNOSTICS', 
    icon: Activity, 
    desc: 'Neuro-rehabilitation and sports injury recovery.', 
    docs: 18,
    specialtyId: 'physio',
    accentColor: '#16a34a',
    glowColor: 'rgba(22, 163, 74, 0.12)',
    organImage: 'images/joint-3d.png',
    rating: '4.9'
  },
  
  // --- EMERGENCY ---
  { 
    name: 'Emergency Medicine', 
    category: 'EMERGENCY', 
    icon: Zap, 
    desc: 'Golden-hour trauma care and immediate life support.', 
    docs: 30, 
    featured: true, 
    availableNow: true,
    specialtyId: 'critical',
    accentColor: '#dc2626',
    glowColor: 'rgba(220, 38, 38, 0.12)',
    organImage: 'images/shield-3d.png',
    rating: '5.0'
  },
  { 
    name: 'Intensive Care Unit', 
    category: 'EMERGENCY', 
    icon: ShieldCheck, 
    desc: 'Advanced multi-specialty life monitoring and 1:1 care.', 
    docs: 24, 
    availableNow: true,
    specialtyId: 'critical',
    accentColor: '#dc2626',
    glowColor: 'rgba(220, 38, 38, 0.12)',
    organImage: 'images/shield-3d.png',
    rating: '4.9'
  },
]

function GlassmorphicSpecialtyCard({ dept, index }) {
  const navigate = useNavigate()
  const cardRef = useRef(null)
  
  // Motion values for tilt physics
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const stiffness = 150
  const damping = 20
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness, damping })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness, damping })
  
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

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/doctors?specialty=${dept.specialtyId}`)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.03 }}
      className="group relative rounded-[28px] border border-white/80 bg-white/50 backdrop-blur-xl p-[28px] flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(31,41,55,0.02)] hover:shadow-[0_20px_40px_rgba(139,26,74,0.08)] transition-all duration-300 cursor-pointer select-none min-h-[320px]"
      id={`dept-card-${dept.specialtyId}`}
    >
      {/* Dynamic Interactive Background Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle 240px at ${glowPos.x}% ${glowPos.y}%, ${dept.glowColor || 'rgba(139, 26, 74, 0.05)'} 0%, transparent 100%)`
        }}
      />

      {/* Decorative grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />

      {/* Top Tag & Featured/Live Badges */}
      <div className="relative z-10 flex justify-between items-start w-full mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/70 border border-white/90 shadow-sm"
            style={{ color: dept.accentColor }}
          >
            <span className="text-[11px]"><dept.icon size={12} /></span> {dept.category.replace('_', ' & ')}
          </span>
          {dept.featured && (
            <span className="text-[9px] font-black uppercase tracking-widest text-[#8B1A4A] px-2.5 py-1 bg-white/70 rounded-full border border-[#8B1A4A]/10 shadow-sm">
              ✦ Featured
            </span>
          )}
          {dept.availableNow && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-full border border-green-500/20 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold text-green-600 uppercase">Live</span>
            </div>
          )}
        </div>
        
        {/* Floating Arrow */}
        <div 
          className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 group-hover:translate-x-1"
          style={{ backgroundColor: hovered ? dept.accentColor : 'white' }}
        >
          <ArrowRight size={14} />
        </div>
      </div>

      {/* Card Content (Details + Absolute Overlapping Levitating Image) */}
      <div className="relative z-10 flex-grow w-full flex flex-col justify-end mt-4">
        
        {/* Details Column - Restricted max-width to allow room for the overlapping image */}
        <div className="text-left flex flex-col justify-end h-full max-w-[65%] pointer-events-none">
          <h3 className="font-headline font-black text-slate-900 text-[19px] leading-[1.1] uppercase tracking-tight mb-2 group-hover:text-[#8B1A4A] transition-colors">
            {dept.name}
          </h3>
          
          <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-4 max-w-[200px]">
            {dept.desc}
          </p>

          <div className="flex gap-4 items-center">
            <div className="text-left">
              <span className="block text-xl font-headline font-black text-slate-800 leading-none">{dept.docs}+</span>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Specialists</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-200" />
            <div className="text-left">
              <span className="block text-xs font-black text-slate-700 leading-none">★ {dept.rating || '4.9'}</span>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Floating 3D Organ Image */}
        {dept.organImage && (
          <div 
            className="absolute bottom-[-10px] -right-4 w-[110px] md:w-[125px] flex justify-center items-end select-none pointer-events-none z-0"
          >
            {/* Automatic Vertical Levitation Animation */}
            <motion.div
              animate={{
                y: [-4, 4, -4],
                rotate: [-1.5, 1.5, -1.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 5 + index,
                ease: 'easeInOut'
              }}
              className="relative w-full flex justify-center"
            >
              {/* Backglow for the organ */}
              <div 
                className="absolute w-16 h-16 rounded-full blur-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${dept.accentColor}20 0%, transparent 70%)` }}
              />
              
              <img 
                src={assetUrl(dept.organImage)} 
                alt={dept.name} 
                className="w-full h-auto object-contain filter drop-shadow-[0_6px_15px_rgba(0,0,0,0.05)] group-hover:scale-105 group-hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-transform duration-500 pointer-events-none"
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Reserve button overlay footer inside the card for booking directly */}
      <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-end relative z-20">
        <button
          onClick={(e) => {
            e.stopPropagation() // Don't trigger the card's specialty page redirect
            navigate('/book')
          }}
          className="text-[10px] font-black uppercase tracking-widest text-[#8B1A4A] flex items-center gap-1.5 group/btn bg-white/80 hover:bg-[#8B1A4A] hover:text-white border border-[#8B1A4A]/20 px-3.5 py-1.5 rounded-full transition-all duration-300 shadow-sm"
        >
          Reserve <ChevronRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  )
}

export function SpecialtiesPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    return DEPARTMENTS.filter(d => {
      const matchCat = activeFilter === 'ALL' || d.category === activeFilter
      const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.desc.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeFilter, searchQuery])

  // Split into grouped sections for the UI
  const groupedData = useMemo(() => {
    if (activeFilter !== 'ALL') return { [activeFilter]: filteredData }
    
    return {
      'MEDICAL': filteredData.filter(d => d.category === 'MEDICAL'),
      'SURGICAL': filteredData.filter(d => d.category === 'SURGICAL'),
      'WOMEN_CHILD': filteredData.filter(d => d.category === 'WOMEN_CHILD'),
      'DIAGNOSTICS': filteredData.filter(d => d.category === 'DIAGNOSTICS'),
      'EMERGENCY': filteredData.filter(d => d.category === 'EMERGENCY'),
    }
  }, [filteredData, activeFilter])

  return (
    <>
      <Helmet>
        <title>Centres of Excellence | Srikara Hospitals</title>
        <style>{STYLES}</style>
      </Helmet>

      <div className="min-h-screen bg-[#FFF9FA] font-['Inter'] text-[#1A202C] antialiased">
        <StickyNavbar />

        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139, 26, 74,0.05)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45, 58, 74,0.03)_0%,transparent_60%)]" />
        </div>

        <main className="relative z-10 max-w-[1400px] mx-auto px-8 pt-32 pb-48">

          {/* Search + Filter */}
          <div className="mb-20 flex flex-col items-center gap-12">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8B1A4A]/50 group-hover:text-[#8B1A4A] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search for your department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[58px] bg-white border border-[#8B1A4A]/10 rounded-[18px] pl-16 pr-6 outline-none focus:border-[#8B1A4A]/50 text-sm font-medium transition-all placeholder:text-[#1A202C]/30 text-center text-[#1A202C] shadow-sm"
              />
            </div>

            <div className="flex flex-nowrap justify-center gap-2.5 overflow-x-auto pb-4 custom-scrollbar w-full">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-7 py-3.5 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 border whitespace-nowrap flex items-center gap-2.5 ${
                    activeFilter === cat.id
                      ? 'bg-[#8B1A4A] border-[#8B1A4A] text-white shadow-[0_4px_20px_rgba(139, 26, 74,0.2)]'
                      : 'bg-white border-[#8B1A4A]/10 text-[#4A4A4A] hover:border-[#8B1A4A]/40 hover:text-[#8B1A4A]'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Interactive 3D Anatomy Entry Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-20 relative overflow-hidden rounded-[32px] border border-[#8B1A4A]/10 bg-gradient-to-br from-[#FFF9FA] via-white to-[#EBF3F5] p-8 md:p-12 shadow-[0_15px_40px_rgba(139,26,74,0.03)] flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            {/* Glowing ambient lights */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[80px] bg-[#8B1A4A]/5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full blur-[70px] bg-sky-500/5 pointer-events-none" />

            <div className="relative z-10 max-w-3xl text-left flex flex-col items-start gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#8B1A4A]/10 text-[#8B1A4A] border border-[#8B1A4A]/15 shadow-sm">
                <Sparkles size={11} className="animate-pulse" /> New Interactive Simulator
              </span>
              <h2 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-800 leading-tight">
                Interactive 3D Anatomy
                <br />
                <span className="text-[#8B1A4A]">& Specialty Explorer</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
                Embark on an immersive, scroll-controlled visual journey through the human body. Rotate high-definition 3D organs, pinpoint clinical landmarks, and see how Srikara’s medical experts deliver world-class surgical and therapeutic precision.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/anatomy-explorer')}
              className="relative z-10 shrink-0 h-[58px] px-8 bg-[#8B1A4A] hover:bg-[#2D3A4A] text-white rounded-full font-bold uppercase tracking-[0.1em] text-[11px] flex items-center gap-3 transition-all duration-300 shadow-[0_10px_25px_rgba(139,26,74,0.2)] hover:shadow-[0_15px_30px_rgba(45,58,74,0.25)] group hover:scale-[1.02]"
            >
              Launch 3D Explorer
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Department grid */}
          <div className="space-y-24">
            <AnimatePresence mode="wait">
              {Object.entries(groupedData).map(([group, list]) =>
                list.length > 0 && (
                  <motion.section
                    key={group}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-col gap-5 mb-12">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-md bg-[#8B1A4A]/10 border border-[#8B1A4A]/20 flex items-center justify-center text-[#8B1A4A] text-[10px]">⬡</div>
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B1A4A]">
                          {group.replace('_', ' & ')} SPECIALITIES
                        </h2>
                      </div>
                      <div className="h-px bg-[#8B1A4A]/5 w-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {list.map((dept, i) => (
                        <GlassmorphicSpecialtyCard key={dept.name} dept={dept} index={i} />
                      ))}
                    </div>
                  </motion.section>
                )
              )}
            </AnimatePresence>
          </div>

          {/* Alphabet Disease Search */}
          <div className="mt-24">
            <AlphabetDiseaseSearch theme="light" />
          </div>

          {/* Bottom CTA */}
          <div className="mt-48 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6">
                <span className="text-[#1A202C]">Find the Right</span>
                <br />
                <span className="text-[#8B1A4A]">Specialist for Your Needs</span>
              </h2>
              <p className="text-[#4A4A4A] max-w-2xl mx-auto text-lg mb-12 font-light">
                Our team of 500+ specialists is ready to provide world-class care, tailored to you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <button
                  onClick={() => navigate('/book')}
                  className="h-[58px] px-12 bg-[#8B1A4A] text-white rounded-full font-bold uppercase tracking-[0.1em] text-[13px] shadow-[0_20px_40px_rgba(139, 26, 74,0.3)] hover:bg-[#2D3A4A] hover:shadow-[0_20px_40px_rgba(45, 58, 74,0.3)] transition-all duration-300"
                >
                  Book an Appointment
                </button>
                <button
                  onClick={() => navigate('/doctors')}
                  className="h-[58px] px-12 glass-card rounded-full font-bold uppercase tracking-[0.1em] text-[13px] text-[#4A4A4A] hover:text-[#1A202C] hover:border-[#8B1A4A]/30 transition-all border-[#8B1A4A]/20"
                >
                  Explore Our Doctors
                </button>
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-[#8B1A4A]/40">
                <span>✦ 500+ Specialists</span>
                <span>✦ 40+ Departments</span>
                <span>✦ NABH Accredited</span>
              </div>
            </motion.div>
          </div>

        </main>

        <PremiumDoctorFinder isGlobal={true} />
        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
