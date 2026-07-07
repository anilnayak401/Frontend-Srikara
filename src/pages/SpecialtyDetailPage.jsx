import { useState, useRef, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  X, Phone, Mail, Share2, MessageSquare, ChevronLeft, ChevronRight, Activity, ArrowLeft, User, Calendar 
} from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { assetUrl } from '@/lib/assetUrl'
import { ALL_DOCTORS } from '@/data/doctors'
import { useDoctors } from '@/hooks/useDoctors'

// Premium Glassmorphic Doctor Card Component (Screenshot 2 Style - DETTO MATCH)
function PremiumDoctorCard({ doc, accentColor }) {
  const navigate = useNavigate()
  const phoneNum = doc.phone || '04068324803'
  
  const clickTimeout = useRef(null)

  const handleCardClick = (e) => {
    // If they clicked an action button, let the button handle it
    if (e.target.closest('button')) return
    
    // Block clicks if a drag swipe just happened
    if (window.blockCardClicks) return

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
      clickTimeout.current = null
      // Double click: Go to Bookings Page
      navigate(`/book/${doc.slug}`)
    } else {
      // Wait to see if it is a double click
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null
        // Single click: Go to Profile Page
        navigate(`/doctors/${doc.slug}`)
      }, 250) // 250ms standard delay
    }
  }

  const handlePhone = (e) => {
    e.stopPropagation()
    window.location.href = `tel:${phoneNum}`
  }

  const handleProfileLink = (e) => {
    e.stopPropagation()
    navigate(`/doctors/${doc.slug}`)
  }

  const handleBookLink = (e) => {
    e.stopPropagation()
    navigate(`/book/${doc.slug}`)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: doc.name,
        text: `${doc.name} - ${doc.label}. Book an appointment at Srikara Hospitals!`,
        url: window.location.href,
      }).catch(err => console.log(err))
    } else {
      navigator.clipboard.writeText(`${doc.name} - ${doc.label}. Branch: ${doc.branch}. Phone: ${phoneNum}`)
      alert("Doctor details copied to clipboard!")
    }
  }

  return (
    <div 
      onClick={handleCardClick}
      className="relative w-[260px] sm:w-[300px] shrink-0 bg-white rounded-[40px] flex flex-col justify-start items-center shadow-[0_16px_50px_rgba(0,0,0,0.03)] border border-slate-100/70 hover:shadow-[0_24px_65px_rgba(139,26,74,0.12)] transition-all duration-500 overflow-hidden group select-none cursor-pointer"
    >
      {/* 1. Portrait Photo Container with full edge-to-edge layout & light shaded burgundy background */}
      <div 
        className="relative w-full h-[265px] sm:h-[320px] overflow-hidden flex justify-center items-end transition-all duration-500"
        style={{ backgroundColor: '#FAF0F4' }}
      >
        <img 
          src={doc.image} 
          alt={doc.name} 
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-102"
          onError={(e) => { e.target.src = doc.fallback || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" }}
        />
        
        {/* Glassmorphic Overlay Box at the bottom of the photo */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-white/45 backdrop-blur-md border border-white/30 rounded-[24px] sm:rounded-[28px] p-3 sm:p-4 text-center shadow-lg">
          <h4 className="text-[14px] sm:text-[16px] font-black text-[#8B1A4A] tracking-tight leading-tight mb-1">
            {doc.name}
          </h4>
          <p className="text-[9px] sm:text-[10px] font-extrabold uppercase text-[#8B1A4A] tracking-[0.15em] mb-0.5">
            {doc.specialty.toUpperCase()} • {doc.exp.toUpperCase()}
          </p>
          <p className="text-[8px] sm:text-[10px] text-slate-500 italic font-medium font-sans block mt-0.5">
            {doc.sub}
          </p>
        </div>
      </div>
      
      {/* 2. Text Description & Action Buttons (in the bottom white body) */}
      <div className="w-full p-4 sm:p-6 pt-4 sm:pt-5 flex flex-col items-center justify-between">
        <p className="text-[10px] sm:text-[12px] font-bold text-[#2D3A4A] leading-snug mb-1 text-center px-1">
          {doc.tagline || doc.label || 'Expert Clinical Care.'}
        </p>
        
        {/* Subtle click guide */}
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4 text-center">
          🖱️ Click for Profile • Double-click to Book
        </p>
        
        {/* 3. Action Buttons (Profile is themed burgundy filled, others are outlines) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 w-full border-t border-slate-100 pt-4 sm:pt-5">
          {/* Profile link Button (Burgundy Filled Highlighted CTA) */}
          <button 
            onClick={handleProfileLink}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#8B1A4A] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(139,26,74,0.3)] active:scale-90 hover:scale-105 hover:bg-[#72113A] transition-all duration-300"
            title="View Profile"
          >
            <User size={14} className="text-white" />
          </button>

          {/* Phone Button (Outline) */}
          <button 
            onClick={handlePhone}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-sm active:scale-90 hover:scale-105 hover:border-slate-300 hover:text-slate-700 transition-all duration-300"
            title={`Call ${doc.name}`}
          >
            <Phone size={14} />
          </button>

          {/* Book link Button (Outline) */}
          <button 
            onClick={handleBookLink}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-sm active:scale-90 hover:scale-105 hover:border-slate-300 hover:text-slate-700 transition-all duration-300"
            title="Book Appointment"
          >
            <Calendar size={14} />
          </button>

          {/* Share Button (Outline) */}
          <button 
            onClick={handleShare}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-sm active:scale-90 hover:scale-105 hover:border-slate-300 hover:text-slate-700 transition-all duration-300"
            title="Share Profile"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function SpecialtyDetailPage() {
  const { specialtyId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  const { doctors } = useDoctors()
  const currentBranchName = searchParams.get('branch') || ''

  // Departments definitions matching the collage mapping
  const departmentsData = {
    cardio: {
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
      icon: "❤️"
    },
    ortho: {
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
      icon: "🦴"
    },
    neuro: {
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
      icon: "🧠"
    },
    nephro: {
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
      icon: "🧪"
    },
    pulmo: {
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
      icon: "🌬️"
    },
    physician: {
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
      icon: "💚"
    },
    onco: {
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
      icon: "🎗️"
    },
    gyn: {
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
      icon: "🤰"
    }
  }

  const dept = departmentsData[specialtyId] || departmentsData.cardio // Fallback to cardio if not found

  const [isInteracting, setIsInteracting] = useState(false)
  const autoScrollTimer = useRef(null)

  // Drag-to-scroll refs
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  // Drag-to-scroll handlers
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return
    isDraggingRef.current = true
    setIsInteracting(true)
    // Temporarily set scrollBehavior to auto for instant feedback during drag
    scrollRef.current.style.scrollBehavior = 'auto'
    startXRef.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeftRef.current = scrollRef.current.scrollLeft
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5 // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = 'smooth'
    }
    // Delay resuming auto-scroll for a richer interactive feel
    setTimeout(() => {
      setIsInteracting(false)
    }, 3000)
  }

  // Auto-scroll handler
  const startAutoScroll = () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current)
    autoScrollTimer.current = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current
        const cardWidth = 324 // Card width 300px + gap 24px
        
        // Wrap around at the end
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' })
        }
      }
    }, 3500) // Scroll every 3.5 seconds
  }

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current)
      autoScrollTimer.current = null
    }
  }

  // Scroll doctors carousel
  const scrollDoctorsList = (direction) => {
    setIsInteracting(true)
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
    setTimeout(() => {
      setIsInteracting(false)
    }, 4000)
  }

  // Filter and sort doctors matching specialty, showing current branch's doctors first
  const sortedDoctors = useMemo(() => {
    const normalize = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const matchingDocs = doctors.filter(doc => doc.specialtyId === specialtyId)
    return [...matchingDocs].sort((a, b) => {
      const normA = normalize(a.branch);
      const normB = normalize(b.branch);
      const normCurr = normalize(currentBranchName);
      if (normA === normCurr && normB !== normCurr) return -1;
      if (normA !== normCurr && normB === normCurr) return 1;
      return 0;
    })
  }, [doctors, specialtyId, currentBranchName])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [specialtyId])

  // Setup auto scroll interval
  useEffect(() => {
    if (!isInteracting && sortedDoctors.length > 1) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }
    return () => stopAutoScroll()
  }, [isInteracting, specialtyId, sortedDoctors])

  return (
    <>
      <Helmet>
        <title>{dept.name} Specialists | Srikara Hospitals</title>
      </Helmet>

      <div className="min-h-screen bg-[#FFF9FA] font-['Inter'] text-[#1A202C] antialiased">
        <StickyNavbar />

        {/* Premium ambient decorative elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div 
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.06]" 
            style={{ background: `radial-gradient(circle, ${dept.accentColor} 0%, transparent 70%)` }}
          />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-900/[0.02] rounded-full blur-[100px]" />
        </div>

        <main className="relative z-10 max-w-[1400px] mx-auto px-8 pt-32 pb-48">
          
          {/* Back button row */}
          <div className="mb-8 flex items-center">
            <button 
              onClick={() => {
                if (currentBranchName) {
                  navigate(`/branches/${currentBranchName.toLowerCase().replace('.', '').replace(' ', '-')}`)
                } else {
                  navigate(-1)
                }
              }}
              className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#8B1A4A] hover:text-[#72113A] transition-colors"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to {currentBranchName ? `${currentBranchName} Branch` : 'Home'}</span>
            </button>
          </div>

          {/* Core Responsive Showcase Dual Pane */}
          <div className="w-full bg-white border border-slate-100 rounded-[40px] shadow-[0_20px_80px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
            
            {/* LEFT PRESENTATION COLUMN */}
            <div 
              className="w-full lg:w-[40%] p-5 sm:p-10 flex flex-col justify-between items-center lg:items-start border-b lg:border-b-0 lg:border-r border-slate-100 relative overflow-hidden"
              style={{ 
                background: `radial-gradient(circle at 0% 0%, ${dept.accentColor}12 0%, transparent 80%)`,
                backgroundColor: '#FAFCFF'
              }}
            >
              {/* Levitating 3D Organ Illustration */}
              <div className="w-full flex-grow flex items-center justify-center py-4 sm:py-10">
                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                    rotate: [-3, 3, -3]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: 'easeInOut'
                  }}
                  className="relative w-[180px] h-[180px] sm:w-[360px] sm:h-[360px] flex items-center justify-center"
                >
                  <div 
                    className="absolute w-[140px] h-[140px] sm:w-[280px] sm:h-[280px] rounded-full blur-3xl opacity-60 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${dept.accentColor}25 0%, transparent 70%)` }}
                  />
                  <img 
                    src={assetUrl(dept.organImage)} 
                    alt={dept.name} 
                    className="w-[150px] h-[150px] sm:w-[330px] sm:h-[330px] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.10)]"
                  />
                </motion.div>
              </div>

              {/* Detail Content */}
              <div className="w-full text-center lg:text-left mt-4 relative z-10">
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/95 border border-slate-100 shadow-sm mb-4"
                  style={{ color: dept.accentColor }}
                >
                  {dept.icon} {dept.highlightText}
                </span>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase mb-3 sm:mb-4">
                  {dept.name}
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed mb-6 sm:mb-8 max-w-md">
                  {dept.tagline}
                </p>

                {/* Accuracy / Sat Stats */}
                <div className="flex gap-6 sm:gap-8 items-center border-t border-slate-100 pt-5 sm:pt-6 justify-center lg:justify-start w-full">
                  <div className="text-left">
                    <span className="block text-2xl sm:text-3xl font-display font-black text-slate-800 leading-none">{dept.stat}</span>
                    <span className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 sm:mt-1.5">{dept.statLabel}</span>
                  </div>
                  <div className="w-[1px] h-8 sm:h-10 bg-slate-200" />
                  <div className="text-left">
                    <span className="block text-xs sm:text-sm font-black text-slate-700 leading-none">★ {dept.rating}</span>
                    <span className="block text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 sm:mt-1.5">Satisfaction</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT DOCTORS CAROUSEL COLUMN */}
            <div className="w-full lg:w-[60%] p-5 sm:p-10 flex flex-col justify-between overflow-hidden bg-white">
              
              {/* Header row */}
              <div className="flex justify-between items-center w-full mb-8">
                <div className="text-left">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Meet the Specialists
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    {sortedDoctors.length} {sortedDoctors.length === 1 ? 'Expert Board-Certified Doctor' : 'Expert Board-Certified Doctors'} Available
                  </p>
                </div>
                
                {/* Horizontal slider chevron buttons */}
                {sortedDoctors.length > 1 && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => scrollDoctorsList('left')}
                      className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm transition-all active:scale-95"
                      title="Scroll Left"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={() => scrollDoctorsList('right')}
                      className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm transition-all active:scale-95"
                      title="Scroll Right"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Slider content */}
              <div className="w-full flex-grow flex items-center overflow-hidden relative min-h-[420px]">
                {sortedDoctors.length > 0 ? (
                  <div 
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                    className="flex gap-6 overflow-x-auto pb-8 pt-2 w-full scroll-smooth scrollbar-thin snap-x snap-mandatory px-2 cursor-grab active:cursor-grabbing select-none"
                  >
                    {sortedDoctors.map((doc, idx) => (
                      <div key={doc.id} className="snap-start">
                        <PremiumDoctorCard doc={doc} accentColor={dept.accentColor} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full text-slate-400 py-16">
                    <Activity size={36} className="opacity-40 animate-pulse mb-3" />
                    <p className="text-xs font-bold uppercase tracking-wider">No Doctors listed for this specialty</p>
                  </div>
                )}
              </div>

              {/* Priority branch cta indicator */}
              <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  📍 Sorted to prioritize local {currentBranchName ? `${currentBranchName} branch` : 'landing page'} doctors
                </span>
                <button 
                  onClick={() => navigate('/book')}
                  className="text-[10px] font-black text-white bg-[#8B1A4A] hover:bg-[#72113A] uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors shadow-md"
                >
                  Book Instant Consultation
                </button>
              </div>

            </div>

          </div>

        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
