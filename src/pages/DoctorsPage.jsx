import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Star, ChevronLeft, ChevronRight, Sparkles, Award, Clock, 
  Calendar, MapPin, ArrowUpRight, Info 
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { BranchSideNav } from '@/components/layout/BranchSideNav'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { ALL_DOCTORS, getSpecialties, ACCENT_MAP } from '@/data/doctors'

// Custom Tilt Hover Effect Hook for a premium feel
function useTiltEffect(ref, active = true) {
  useEffect(() => {
    if (!active || !ref.current) return
    const el = ref.current

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const xc = rect.width / 2
      const yc = rect.height / 2
      const angleX = (yc - y) / 15
      const angleY = (x - xc) / 15
      el.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, active])
}

// ─────────────────────────────────────────────────────────────
// EDITORIAL DOCTOR CARD (Uses strictly logo themed colors)
// ─────────────────────────────────────────────────────────────
function DoctorCard({ doctor, onView, onBook }) {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  
  // Resolve specialty specific accent colors dynamically
  const accent = ACCENT_MAP[doctor.specialtyId]?.accent || '#8B1A4A'
  
  useTiltEffect(cardRef, true)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white rounded-3xl border border-slate-100 p-4 transition-all duration-500 ease-out flex flex-col justify-between cursor-pointer hover:border-slate-200"
      style={{
        transform: hovered ? 'translateY(-10px)' : 'translateY(0px)',
        boxShadow: hovered 
          ? `0 20px 40px -15px ${accent}25, 0 0 25px 2px ${accent}08` 
          : `0 10px 30px -10px ${accent}08`,
      }}
    >
      <div 
        ref={cardRef}
        className="relative transition-all duration-300 ease-out flex flex-col"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Large Editorial Portrait */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-50 mb-5 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow duration-300">
          <img 
            src={doctor.image} 
            alt={doctor.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            onError={e => { if (doctor.fallback) e.target.src = doctor.fallback }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-slate-100 rounded-full px-2.5 py-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-black text-slate-800">{doctor.rating}</span>
          </div>

          {/* Specialty tag (specialty accent color themed) */}
          <div 
            className="absolute bottom-3 left-3 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md"
            style={{ backgroundColor: `${accent}E6`, color: '#FFFFFF' }}
          >
            {doctor.specialty}
          </div>
        </div>

        {/* Doctor Details */}
        <div className="px-1 flex-1 flex flex-col">
          <h3 
            className="font-display font-extrabold text-slate-900 text-lg leading-snug transition-colors duration-300 mb-1 group-hover:text-[var(--hover-color)]"
            style={{ '--hover-color': accent }}
          >
            {doctor.name}
          </h3>
          <p className="text-xs font-semibold text-slate-500 mb-3 line-clamp-1">
            {doctor.label}
          </p>
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4 border-t border-slate-50 pt-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock size={12} className="text-slate-400 shrink-0" />
              <span className="text-[11px] font-medium text-slate-600 truncate">{doctor.exp}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin size={12} className="shrink-0" style={{ color: accent }} />
              <span className="text-[11px] font-medium text-slate-600 truncate">{doctor.branch}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Actions */}
      <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onView(doctor); }}
          className="py-2.5 bg-[#2D3A4A] text-white hover:bg-[#1B2530] text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1 shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-95"
        >
          <Info size={13} /> Profile
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onBook(doctor); }}
          className="py-2.5 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1 hover:scale-[1.03] active:scale-95 hover:brightness-105"
          style={{ 
            backgroundColor: '#8B1A4A',
            boxShadow: hovered ? '0 8px 20px rgba(139, 26, 74, 0.4)' : '0 4px 14px rgba(139, 26, 74, 0.25)'
          }}
        >
          <Calendar size={13} /> Book
        </button>
      </div>
    </motion.div>
  )
}


// ─────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────
export function DoctorsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeBranch, setActiveBranch] = useState('all')
  const tabsRef = useRef(null)

  const branches = ['all', ...new Set(ALL_DOCTORS.map(d => d.branch))]
  const specialties = getSpecialties(activeBranch === 'all' ? null : activeBranch)

  const filtered = ALL_DOCTORS.filter(doc => {
    const matchSearch = search === '' ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.label.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'all' || doc.specialtyId === activeFilter
    const matchBranch = activeBranch === 'all' || doc.branch === activeBranch
    return matchSearch && matchFilter && matchBranch
  })

  // Remove duplicates for the 'All' view to avoid showing the same doctor multiple times
  const displayDoctors = activeBranch === 'all'
    ? filtered.filter((doc, index, self) => index === self.findIndex(t => t.slug === doc.slug))
    : filtered

  // Find the Chairman's profile (Dr. Akhil Dadi)
  const chairman = ALL_DOCTORS.find(d => d.id === 203) || ALL_DOCTORS.find(d => d.name.includes("Akhil Dadi"))

  const scrollTabs = (dir) => {
    if (tabsRef.current) tabsRef.current.scrollLeft += dir * 180
  }

  return (
    <>
      <Helmet><title>Meet Our World-Class Medical Team | Srikara Hospitals</title></Helmet>
      
      <div className="min-h-screen bg-[#FAFCFF] font-body text-slate-800 antialiased selection:bg-[#8B1A4A] selection:text-white">
        <StickyNavbar currentBranch={{ branchLogo: 'https://i.ibb.co/CK9bqmXK/sri-logo.jpg' }} />
        <BranchSideNav currentSlug={null} />

        <div className="xl:pl-16">
          
          {/* ── 1. CINEMATIC HERO SECTION ── */}
          <section className="relative pt-32 pb-24 px-8 overflow-hidden bg-[#0A1628] text-white">
            {/* Ambient luxury light effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#8B1A4A]/25 via-transparent to-transparent rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2D3A4A]/20 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-2 bg-[#8B1A4A]/10 border border-[#8B1A4A]/30 text-[#E8B4C8] text-[10px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-full mb-8"
              >
                <Sparkles size={12} className="animate-pulse" />
                Srikara Centers of Excellence
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-tight max-w-4xl mb-6 text-white"
              >
                Where Healing Meets <span className="hero-gradient-text">Precision</span> and Robotic Innovation
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light"
              >
                Consult with our board-certified specialists and medical leaders pushing the boundaries of technology to restore your active lifestyle.
              </motion.p>
            </div>
          </section>

          {/* ── 2. CHAIRMAN SPOTLIGHT (Awwwards-Level Editorial Layout) ── */}
          {chairman && (
            <section className="relative pt-24 lg:pt-32 pb-0 px-8 lg:px-12 overflow-hidden bg-[#050811] text-white border-b border-white/5 min-h-[600px] lg:min-h-[720px] flex items-center">
              {/* Marquee Background text */}
              <div className="absolute top-10 left-0 right-0 overflow-hidden whitespace-nowrap opacity-[0.01] pointer-events-none select-none">
                <span className="text-[120px] font-display font-black tracking-[0.2em] text-slate-400 uppercase inline-block">
                  VISIONARY • PIONEER • LEADER • SURGEON
                </span>
              </div>

              <div className="max-w-7xl mx-auto relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                  
                  {/* Left Column Spacer (5 cols) to make room for absolutely positioned left image */}
                  <div className="hidden lg:block lg:col-span-5 h-[1px]" />

                  {/* Right Column (7 cols): Massive Typography Slogan (Now Right Aligned & Themed) */}
                  <div className="col-span-1 lg:col-span-7 flex flex-col items-start text-left py-12 lg:py-20 lg:pl-8">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="bg-[#8B1A4A]/20 border border-[#8B1A4A]/40 text-[#E8B4C8] text-[9px] font-black uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                        <Sparkles size={10} className="fill-[#E8B4C8]" />
                        FOUNDING CHAIRMAN
                      </span>
                      <span className="bg-[#2D3A4A]/40 border border-[#2D3A4A]/50 text-[#A0B3CD] text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full">
                        CHIEF ROBOTIC SURGEON
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl lg:text-[80px] font-display font-black text-white tracking-tighter leading-[1.02] mb-6 select-none">
                      Pioneering the<br />
                      <span className="bg-gradient-to-r from-[#8B1A4A] via-[#b5179e] to-[#cc00cc] bg-clip-text text-transparent">future of robotic</span><br />
                      joint replacement.
                    </h2>
                    
                    <p className="text-slate-300 text-base md:text-lg max-w-2xl mb-8 leading-relaxed font-light">
                      Dr. Akhil Dadi has performed over 30,000 surgeries, introducing South India's first NAVIO robotic knee replacement system to establish Srikara as a global leader in orthopedic precision.
                    </p>

                    {/* Interactive CTAs styled like reference */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => navigate(`/book/${chairman.slug}`)}
                        className="px-8 py-4 bg-white text-[#2D3A4A] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-100 hover:scale-[1.05] active:scale-[0.95] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Book consult
                      </button>
                      <button 
                        onClick={() => navigate(`/doctors/${chairman.slug}`)}
                        className="group w-12 h-12 rounded-full bg-[#8B1A4A] text-white flex items-center justify-center hover:bg-[#72113A] hover:scale-[1.1] active:scale-[0.92] transition-all duration-300 shadow-md hover:shadow-lg"
                        title="View Full Biography"
                      >
                        <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Absolute Image Column on Desktop, stacked on Mobile */}
              <div className="relative lg:absolute lg:left-0 lg:bottom-0 lg:w-[46%] lg:h-[105%] flex items-end justify-center lg:justify-start z-10 pointer-events-none w-full">
                {/* Subtle halo glow behind the doctor */}
                <div className="absolute top-1/4 left-1/2 lg:left-1/4 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-[#8B1A4A]/25 to-[#2D3A4A]/10 blur-[100px] pointer-events-none" />
                
                {/* Bottom fade shadow gradient to blend cutout into black background */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050811] via-[#050811]/90 to-transparent z-20 pointer-events-none" />

                <img 
                  src={chairman.image}
                  alt={chairman.name}
                  className="relative z-10 w-full h-auto max-h-[500px] lg:max-h-none lg:h-full object-contain object-bottom lg:object-left-bottom filter drop-shadow-[0_20px_50px_rgba(139,26,74,0.15)] transition-transform duration-700 ease-out lg:scale-105 hover:lg:scale-110 lg:origin-bottom-left"
                />
              </div>
            </section>
          )}



          {/* ── 2.5 SEARCH & FILTER SECTION (BELOW CHAIRMAN SPOTLIGHT) ── */}
          <section className="relative py-12 px-8 bg-white border-b border-slate-100 overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
              {/* Cinematic Search */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full max-w-xl relative shadow-md rounded-2xl overflow-hidden border border-slate-200 mb-8 bg-white"
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search specialists by name, specialty, or condition..."
                  className="w-full pl-12 pr-6 py-4 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8B1A4A]/10 focus:border-[#8B1A4A] transition-all duration-300 text-sm"
                />
              </motion.div>

              {/* ── VERTICALLY STACKED FILTER SYSTEM (BELOW THE SEARCH BAR) ── */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full flex flex-col gap-6 items-start z-20"
              >
                {/* 1. Branches Row (Uses logo themed Slate #2D3A4A) */}
                <div className="flex flex-col gap-2.5 w-full items-start">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#2D3A4A] shrink-0">Filter Branch</span>
                  <div className="flex flex-wrap gap-2 w-full">
                    {branches.map(b => (
                      <button 
                        key={b} 
                        onClick={() => { setActiveBranch(b); setActiveFilter('all') }}
                        className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border hover:-translate-y-0.5 active:scale-95 ${
                          activeBranch === b 
                            ? 'text-white border-[#2D3A4A] bg-[#2D3A4A] shadow-sm hover:shadow-md' 
                            : 'text-slate-700 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        {b === 'all' ? 'All Locations' : b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Specialties Row (Uses logo themed Burgundy #8B1A4A) */}
                <div className="flex flex-col gap-2.5 w-full items-start">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8B1A4A] shrink-0">Filter Specialty</span>
                  <div className="flex items-center gap-2 w-full">
                    <button 
                      onClick={() => scrollTabs(-1)} 
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    
                    <div 
                      ref={tabsRef} 
                      className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-1"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      <button 
                        onClick={() => setActiveFilter('all')}
                        className={`relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border hover:-translate-y-0.5 active:scale-95 ${
                          activeFilter === 'all' 
                            ? 'text-white border-[#8B1A4A] bg-[#8B1A4A] shadow-sm hover:shadow-md' 
                            : 'text-slate-700 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        All Specialties
                      </button>

                      {specialties.map(s => (
                        <button 
                          key={s.id} 
                          onClick={() => setActiveFilter(s.id)}
                          className={`relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border hover:-translate-y-0.5 active:scale-95 ${
                            activeFilter === s.id 
                              ? 'text-white border-[#8B1A4A] bg-[#8B1A4A] shadow-sm hover:shadow-md' 
                              : 'text-slate-700 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => scrollTabs(1)} 
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* ── 3. DOCTORS GRID (Filter strip is now placed below Chairman) ── */}
          <section className="py-20 px-8 bg-[#F8FAFC]">

            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-display font-extrabold text-slate-900">
                    Clinical Experts
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Showing {displayDoctors.length} specialist{displayDoctors.length !== 1 ? 's' : ''} matched
                  </p>
                </div>
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="text-xs font-bold text-[#8B1A4A] hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {displayDoctors.length > 0 ? (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.04 }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {displayDoctors.map(doc => (
                    <DoctorCard 
                      key={doc.id} 
                      doctor={doc} 
                      onView={d => navigate(`/doctors/${d.slug}`)} 
                      onBook={d => navigate(`/book/${d.slug}`)} 
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto"
                >
                  <Search size={40} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="text-slate-800 font-bold text-lg mb-2">No doctors match your query</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    We couldn't find any medical team members fitting your current combination of keyword, location, and specialty filters.
                  </p>
                </motion.div>
              )}
            </div>
          </section>

        </div>

        <Footer />
        <MobileBottomNav />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}
