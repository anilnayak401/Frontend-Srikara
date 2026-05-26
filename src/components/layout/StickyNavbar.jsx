import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, MapPin, Phone, Menu, X, Calendar, Search } from 'lucide-react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { branches } from '@/data/branches'

const ACCENT = '#8B1A4A'
const LOGO_SRC = `${import.meta.env.BASE_URL}Srikara Hospitals, LB Nagar.png`

export function StickyNavbar({ currentBranch }) {
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
    const unsub = scrollY.onChange(y => {
      setHideBar(y > lastScrollY.current && y > 160)
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
          <NavLink to="/branches/ecil" active={location.pathname === '/' || location.pathname.startsWith('/branches/ecil')} isWhite={isWhite}>
            Home
          </NavLink>

          {/* Specialties dropdown */}
          <div ref={specRef} className="relative h-full flex items-center">
            <DropButton
              label="Specialties"
              isOpen={specOpen}
              active={isActive('/specialties')}
              isWhite={isWhite}
              onClick={() => setSpecOpen(p => !p)}
            />
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
                    { to: '/specialties', label: 'All Specialties' },
                    { to: '/specialties?f=SURGICAL', label: 'Orthopaedics & Robotic' },
                    { to: '/specialties?f=MEDICAL', label: 'Cardiology & Neurology' },
                    { to: '/specialties?f=WOMEN_CHILD', label: 'Women & Child Care' },
                    { to: '/specialties?f=EMERGENCY', label: 'Emergency & ICU' },
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
          <div ref={hospitalsRef} className="relative h-full flex items-center">
            <DropButton
              label="Find Hospitals"
              isOpen={hospitalsOpen}
              active={isActive('/branches')}
              isWhite={isWhite}
              onClick={() => setHospitalsOpen(p => !p)}
            />
            <AnimatePresence>
              {hospitalsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-[460px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden z-50"
                >
                  <div className="px-5 py-4 flex items-center justify-between"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}, #5E0F30)` }}>
                    <div>
                      <p className="text-white font-bold text-sm uppercase tracking-widest">Our Hospitals</p>
                      <p className="text-white/55 text-[10px] mt-0.5">{branches.length} Locations · AP & Telangana</p>
                    </div>
                    <Link to="/branches" onClick={() => setHospitalsOpen(false)}
                      className="text-[10px] font-bold text-white/80 hover:text-white uppercase tracking-wider border border-white/30 px-3 py-1.5 rounded-full hover:border-white transition-colors">
                      View All →
                    </Link>
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-1 max-h-[320px] overflow-y-auto">
                    {branches.map(b => (
                      <Link key={b.slug} to={`/branches/${b.slug}`} onClick={() => setHospitalsOpen(false)}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-[#8B1A4A]/5 transition-all">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-[#8B1A4A]/10 flex items-center justify-center mt-0.5 group-hover:bg-[#8B1A4A]/20 transition-colors">
                          <MapPin className="w-4 h-4 text-[#8B1A4A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#8B1A4A] truncate">{b.title}</p>
                          <p className="text-[11px] text-gray-500 truncate">{b.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-black/5 flex items-center justify-between">
                    <p className="text-[11px] text-gray-500">🚨 <span className="font-bold text-[#8B1A4A]">040-68324800</span></p>
                    <button onClick={() => { navigate('/book'); setHospitalsOpen(false) }}
                      className="text-[10px] font-bold text-white bg-[#8B1A4A] px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity">
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
          <Link to="/">
            <img src={logoSrc} alt="Srikara Hospitals"
              style={{ height: '40px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} />
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
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-[190] pt-[64px] pb-8 px-5 bg-white shadow-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-1 mt-3">
              {[
                { label: 'Home', to: '/branches/ecil' },
                { label: 'Find Hospitals', to: '/branches' },
                { label: 'Doctors', to: '/doctors' },
                { label: 'Specialties', to: '/specialties' },
                { label: 'Discover Srikara', to: '/about' },
                { label: 'Blogs', to: '/blogs' },
              ].map(lnk => (
                <Link key={lnk.label} to={lnk.to} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-4 px-5 rounded-2xl font-bold text-base uppercase tracking-wide transition-all"
                  style={{
                    color: isActive(lnk.to) ? 'white' : '#222',
                    backgroundColor: isActive(lnk.to) ? ACCENT : 'transparent',
                  }}>
                  {lnk.label}
                  <ChevronDown size={17} className="-rotate-90 opacity-40" />
                </Link>
              ))}
            </nav>
            <div className="mt-5 flex gap-3">
              <a href={`tel:${phone.replace(/\D/g, '')}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-[14px]"
                style={{ backgroundColor: ACCENT }}>
                <Phone size={16} fill="white" /> {phone}
              </a>
              <button onClick={() => { navigate('/book'); setMobileOpen(false) }}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-[14px]"
                style={{ backgroundColor: '#2D3A4A' }}>
                <Calendar size={16} /> Book Now
              </button>
            </div>
          </motion.div>
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
function DropButton({ label, isOpen, active, isWhite, onClick }) {
  const textCol = isWhite ? '#222' : '#fff'
  return (
    <button onClick={onClick}
      className="group relative h-full flex items-center gap-1 px-4 text-[13.5px] font-semibold uppercase tracking-wide outline-none transition-colors duration-200"
      style={{ color: isOpen || active ? ACCENT : textCol }}
    >
      {label}
      <ChevronDown size={13}
        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        style={{ color: isWhite ? '#888' : 'rgba(255,255,255,0.6)' }} />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-300"
        style={{ backgroundColor: ACCENT, width: (isOpen || active) ? '65%' : '0%' }} />
    </button>
  )
}
