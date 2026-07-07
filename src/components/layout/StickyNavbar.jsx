import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, MapPin, Phone, Menu, X, Calendar, Search } from 'lucide-react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useBranches } from '@/hooks/useBranches'

const ACCENT = '#8B1A4A'
const LOGO_SRC = `${import.meta.env.BASE_URL}Srikara Hospitals, LB Nagar.png`

export function StickyNavbar({ currentBranch }) {
  const { branches } = useBranches()
  const [scrolled, setScrolled] = useState(false)
  const [hideBar, setHideBar] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hospitalsOpen, setHospitalsOpen] = useState(false)
  const [specOpen, setSpecOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const hospitalsRef = useRef(null)
  const specRef = useRef(null)
  const lastScrollY = useRef(0)
  const { scrollY } = useScroll()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const unsub = scrollY.on("change", y => {
      setHideBar(false)
      setScrolled(y > 50)
      lastScrollY.current = y
    })
    return () => unsub()
  }, [scrollY])

  useEffect(() => {
    const fn = e => {
      if (hospitalsRef.current && !hospitalsRef.current.contains(e.target)) setHospitalsOpen(false)
      if (specRef.current && !specRef.current.contains(e.target)) setSpecOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  useEffect(() => {
    setHospitalsOpen(false)
    setSpecOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  // Force white navbar on non-branch pages (no dark hero background)
  const hasHero = location.pathname.startsWith('/branches/')
  const isWhite = scrolled || mobileOpen || !hasHero
  const isActive = path => location.pathname.startsWith(path)
  const phone = currentBranch?.phone || '040-6832-4800'
  // Always use the local Srikara Hospitals logo
  const logoSrc = LOGO_SRC

  // Current branch caption shown under the brand name (only on branch pages)
  const branchSlug = location.pathname.startsWith('/branches/') ? location.pathname.split('/')[2] : null
  const activeBranch = branchSlug
    ? ((currentBranch?.title && currentBranch) || branches.find(b => b.slug === branchSlug))
    : null
  const branchCity = (() => {
    const a = activeBranch?.address || ''
    let city = ''
    if (a.includes('Hyderabad')) city = 'Hyderabad'
    else {
      const parts = a.split(',').map(s => s.trim()).filter(Boolean)
      city = parts.length >= 2 ? parts[parts.length - 2].replace(/\s*\d+$/, '') : ''
    }
    // Avoid "Vijayawada Branch, Vijayawada"
    if (city && activeBranch?.title?.toLowerCase().includes(city.toLowerCase())) city = ''
    return city
  })()
  const branchLabel = activeBranch ? `${activeBranch.title} Branch${branchCity ? `, ${branchCity}` : ''}` : null

  return (
    <>
      {/* ══════════════ NAV BAR ══════════════ */}
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
        animate={hideBar ? 'hidden' : 'visible'}
        transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-[200]"
        style={{
          backgroundColor: isWhite
            ? 'rgba(255,255,255,0.97)'
            : 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: isWhite
            ? '0 2px 30px rgba(0,0,0,0.10)'
            : '0 1px 0 rgba(255,255,255,0.12)',
          borderBottom: isWhite
            ? '1px solid rgba(0,0,0,0.07)'
            : '1px solid rgba(255,255,255,0.18)',
          transition: 'background 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        {/* ── Single centered row (desktop) ── */}
        <div
          className="hidden lg:flex items-center justify-center gap-0"
          style={{ height: scrolled ? '64px' : '76px', transition: 'height 0.35s ease' }}
        >


          {/* Home */}
          <NavLink to="/" active={location.pathname === '/'} isWhite={isWhite}>
            Home
          </NavLink>

          {/* Specialties dropdown split (Text goes directly to 3D page, Chevron toggles dropdown menu) */}
          <div ref={specRef} className="relative h-full flex items-center group/spec">
            <Link
              to="/specialties"
              className="h-full flex items-center pl-4 pr-1 text-[13.5px] font-semibold uppercase tracking-wide transition-colors duration-200"
              style={{ color: specOpen || isActive('/specialties') ? ACCENT : (isWhite ? '#222' : '#fff') }}
            >
              Specialties
            </Link>
            <button
              onClick={() => setSpecOpen(p => !p)}
              className="h-full flex items-center pl-1 pr-4 outline-none transition-colors duration-200"
              aria-label="Toggle Specialties Dropdown"
            >
              <ChevronDown size={13}
                className={`transition-transform duration-300 ${specOpen ? 'rotate-180' : ''}`}
                style={{ color: specOpen || isActive('/specialties') ? ACCENT : (isWhite ? '#888' : 'rgba(255,255,255,0.6)') }} />
            </button>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-300"
              style={{ backgroundColor: ACCENT, width: (specOpen || isActive('/specialties')) ? '65%' : '0%' }} />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full w-0 group-hover/spec:w-[65%] transition-all duration-300"
              style={{ backgroundColor: ACCENT, opacity: 0.55 }} />
            <AnimatePresence>
              {specOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-[220px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.14)] border border-black/5 overflow-hidden z-50 py-2"
                >
                  {[
                    { to: '/specialties', label: '3D Anatomy Explorer' },
                    { to: '/specialties-list', label: 'All Specialties List' },
                    { to: '/specialties-list?f=SURGICAL', label: 'Orthopaedics & Robotic' },
                    { to: '/specialties-list?f=MEDICAL', label: 'Cardiology & Neurology' },
                    { to: '/specialties-list?f=WOMEN_CHILD', label: 'Women & Child Care' },
                    { to: '/specialties-list?f=EMERGENCY', label: 'Emergency & ICU' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setSpecOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-gray-700 hover:text-[#8B1A4A] hover:bg-[#8B1A4A]/5 transition-all">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A4A]/50 flex-shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Find Hospitals dropdown */}
          <div ref={hospitalsRef} className="h-full flex items-center">
            <DropButton
              label="Find Hospitals"
              caption={branchLabel}
              isOpen={hospitalsOpen}
              active={isActive('/branches')}
              isWhite={isWhite}
              onClick={() => setHospitalsOpen(p => !p)}
            />
            <AnimatePresence>
              {hospitalsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95, rotateX: -5 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95, rotateX: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{ transformOrigin: 'top center' }}
                  className="absolute top-[calc(100%+8px)] left-0 right-0 mx-auto w-[1160px] bg-slate-100 border border-slate-200 rounded-[28px] shadow-[0_30px_70px_rgba(0,0,0,0.18)] overflow-hidden z-50 p-4 flex flex-col"
                >
                  {/* Rounded Header */}
                  <div 
                    className="px-5 py-4 flex items-center justify-between rounded-2xl shadow-md mb-3"
                    style={{ background: `linear-gradient(135deg, rgba(139, 26, 74, 0.95), rgba(94, 15, 48, 0.95))` }}
                  >
                    <div>
                      <p className="text-white font-headline font-black text-sm uppercase tracking-widest">Our Hospitals</p>
                      <p className="text-white/60 text-[10px] font-bold mt-0.5">{branches.length} Locations · AP & Telangana</p>
                    </div>
                    <Link to="/branches" onClick={() => setHospitalsOpen(false)}
                      className="text-[10px] font-bold text-white uppercase tracking-wider border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-[#8B1A4A] transition-all duration-300 shadow-sm">
                      View All →
                    </Link>
                  </div>

                  {/* Staggered Grid of Horizontally Elongated Rounded Glassmorphic Cards (3 columns) */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.04,
                          delayChildren: 0.05
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="p-1 grid grid-cols-3 gap-3 max-h-[380px] overflow-y-auto custom-scrollbar"
                  >
                    {branches.map(b => (
                      <motion.div
                        key={b.slug}
                        variants={{
                          hidden: { opacity: 0, y: 15, scale: 0.95 },
                          show: { 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: { type: "spring", stiffness: 260, damping: 20 } 
                          }
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link to={`/branches/${b.slug}`} onClick={() => setHospitalsOpen(false)}
                          className="group flex flex-row items-center gap-4 p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:bg-[#8B1A4A]/5 hover:border-[#8B1A4A]/25 transition-all duration-300 min-h-[96px] text-left w-full"
                        >
                          {/* MapPin Icon Container on Left */}
                          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#8B1A4A]/10 flex items-center justify-center mt-0.5 group-hover:bg-[#8B1A4A] group-hover:text-white transition-all duration-300 shadow-sm">
                            <MapPin className="w-5 h-5 text-[#8B1A4A] group-hover:text-white transition-colors duration-300 group-hover:animate-bounce" />
                          </div>

                          {/* Details on Right */}
                          <div className="min-w-0 flex-1">
                            <p className="font-headline font-black text-[15px] text-[#8B1A4A] group-hover:text-[#5E0F30] transition-colors truncate">{b.title}</p>
                            <p className="text-[11px] text-[#2D3A4A] font-bold mt-0.5 truncate leading-relaxed">{b.subtitle}</p>
                            <p className="text-[10px] text-gray-500 font-medium mt-1.5 line-clamp-1 leading-normal group-hover:text-gray-700 transition-colors">
                              📍 {b.address}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Rounded Footer */}
                  <div className="px-5 py-4 bg-slate-100 border-t border-slate-200 rounded-2xl flex items-center justify-between mt-3">
                    <p className="text-[11px] text-gray-600 font-bold flex items-center gap-1.5">
                      🚨 Hotline: <span className="font-black text-[#8B1A4A] text-xs">040-68324800</span>
                    </p>
                    <button onClick={() => { navigate('/book'); setHospitalsOpen(false) }}
                      className="text-[10px] font-black text-white bg-[#8B1A4A] px-5 py-2.5 rounded-full hover:bg-[#5E0F30] transition-colors shadow-md shadow-[#8B1A4A]/20 hover:shadow-lg uppercase tracking-wider">
                      Book Now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── CENTER LOGO ── */}
          <Link to="/" className="mx-6 flex-shrink-0">
            <img
              src={logoSrc}
              alt="Srikara Hospitals"
              style={{
                height: scrolled ? '44px' : '56px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.35s ease',
                // Logo has white bg — always show as-is since navbar itself is frosted/white
                filter: 'none',
                borderRadius: '6px',
              }}
            />
          </Link>

          {/* 6. Doctors */}
          <NavLink to="/doctors" active={isActive('/doctors')} isWhite={isWhite}>
            Doctors
          </NavLink>

          {/* 7. Discover Srikara */}
          <NavLink to="/about" active={isActive('/about')} isWhite={isWhite}>
            Discover Srikara
          </NavLink>

          {/* 8. Blogs */}
          <NavLink to="/blogs" active={isActive('/blogs')} isWhite={isWhite}>
            Blogs
          </NavLink>

          {/* 9. Careers */}
          <NavLink to="/careers" active={isActive('/careers')} isWhite={isWhite}>
            Careers
          </NavLink>

          {/* 7. Search Toggle - removed */}

          {/* Book Appointment button */}
          <button
            onClick={() => navigate('/book')}
            className="flex items-center gap-2 rounded-full px-5 py-2 font-bold text-[13px] ml-2 transition-all hover:opacity-90"
            style={{ backgroundColor: '#2D3A4A', color: 'white', flexShrink: 0 }}
          >
            <Calendar size={13} />
            Book Appointment
          </button>

        </div>

        {/* ── Search Overlay ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 z-[210] flex items-center px-10 gap-10"
              style={{
                backgroundColor: isWhite ? 'white' : 'rgba(10, 22, 40, 0.98)',
                backdropFilter: 'blur(12px)'
              }}
            >
              <div className="flex-1 max-w-4xl mx-auto flex flex-col gap-3">
                <p
                  className="font-bold text-lg"
                  style={{ color: isWhite ? '#1A202C' : 'white' }}
                >
                  What are you looking for?
                </p>
                <div className="relative flex items-center h-14 bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Enter a keyword"
                    className="flex-1 h-full px-6 text-[#1A202C] outline-none text-lg font-medium placeholder:text-gray-400"
                    onKeyDown={(e) => e.key === 'Enter' && setSearchOpen(false)}
                  />
                  <button
                    className="h-full px-8 flex items-center justify-center transition-all bg-[#0a3560] text-white hover:bg-[#002B5C]"
                    onClick={() => setSearchOpen(false)}
                  >
                    <Search size={22} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-black/10 transition-all"
                style={{ color: isWhite ? '#1A202C' : 'white' }}
              >
                <X size={28} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile row ── */}
        <div
          className="lg:hidden flex items-center justify-between px-5"
          style={{ height: '64px' }}
        >
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <img src={logoSrc} alt="Srikara Hospitals"
              style={{ height: '40px', width: 'auto', objectFit: 'contain', borderRadius: '4px', flexShrink: 0 }} />
            {branchLabel && (
              <p className="text-[10px] font-bold truncate max-w-[180px]" style={{ color: isWhite ? '#64748b' : 'rgba(255,255,255,0.8)' }}>
                {branchLabel}
              </p>
            )}
          </Link>
          <button
            className="p-2.5 rounded-xl transition-all"
            style={{ backgroundColor: 'rgba(139,26,74,0.1)' }}
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X size={21} style={{ color: ACCENT }} /> : <Menu size={21} style={{ color: ACCENT }} />}
          </button>
        </div>
      </motion.header>

      {/* ══════════════ MOBILE DRAWER ══════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[180] lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="fixed top-20 left-4 right-4 z-[190] p-5 bg-white/95 backdrop-blur-md rounded-[24px] shadow-[0_20px_50px_rgba(139,26,74,0.18)] border border-slate-100 lg:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-0.5">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Find Hospitals', to: '/branches' },
                  { label: 'Doctors', to: '/doctors' },
                  { label: 'Specialties (3D)', to: '/specialties' },
                  { label: 'Specialties List', to: '/specialties-list' },
                  { label: 'Discover Srikara', to: '/about' },
                  { label: 'Blogs', to: '/blogs' },
                  { label: 'Careers', to: '/careers' },
                ].map(lnk => (
                  <Link key={lnk.label} to={lnk.to} onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300"
                    style={{
                      color: isActive(lnk.to) ? 'white' : '#475569',
                      backgroundColor: isActive(lnk.to) ? ACCENT : 'transparent',
                    }}>
                    {lnk.label}
                    <ChevronDown size={14} className="-rotate-90 opacity-50" />
                  </Link>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <a href={`tel:${phone.replace(/\D/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-white text-[12px] uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md shadow-[#8B1A4A]/25"
                  style={{ backgroundColor: ACCENT }}>
                  <Phone size={14} fill="white" /> Call Now
                </a>
                <button onClick={() => { navigate('/book'); setMobileOpen(false) }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-white text-[12px] uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md"
                  style={{ backgroundColor: '#2D3A4A' }}>
                  <Calendar size={14} /> Book Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* ── Regular nav link ──────────────────────────── */
function NavLink({ to, active, isWhite, children }) {
  const textCol = isWhite ? '#222' : '#fff'
  return (
    <Link to={to}
      className="group relative h-full flex items-center px-4 text-[13.5px] font-semibold uppercase tracking-wide transition-colors duration-200"
      style={{ color: active ? ACCENT : textCol }}
    >
      {children}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-300"
        style={{ backgroundColor: ACCENT, width: active ? '65%' : '0%' }} />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full w-0 group-hover:w-[65%] transition-all duration-300"
        style={{ backgroundColor: ACCENT, opacity: 0.55 }} />
    </Link>
  )
}

/* ── Dropdown trigger button ───────────────────── */
function DropButton({ label, caption, isOpen, active, isWhite, onClick }) {
  const textCol = isWhite ? '#222' : '#fff'
  return (
    <button onClick={onClick}
      className="group relative h-full flex flex-col items-center justify-center px-4 outline-none transition-colors duration-200"
      style={{ color: isOpen || active ? ACCENT : textCol }}
    >
      <span className="flex items-center gap-1 text-[13.5px] font-semibold uppercase tracking-wide">
        {label}
        <ChevronDown size={13}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: isWhite ? '#888' : 'rgba(255,255,255,0.6)' }} />
      </span>
      {caption && (
        <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap"
          style={{ color: isWhite ? ACCENT : 'rgba(255,255,255,0.8)' }}>
          {caption}
        </span>
      )}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-300"
        style={{ backgroundColor: ACCENT, width: (isOpen || active) ? '65%' : '0%' }} />
    </button>
  )
}
