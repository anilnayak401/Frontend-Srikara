import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Search, X, ChevronDown, Stethoscope, AlertCircle, HeartPulse } from 'lucide-react'
import { getByLetter, searchDiseases, getDiseaseDetail, ALL_DISEASES } from '@/data/diseases'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// ─── Skeleton ─────────────────────────────────────────────────
function Skeleton({ isDark }) {
  return (
    <div className="flex flex-wrap gap-2.5 mt-2">
      {[120, 90, 150, 110, 80, 140, 100, 130].map((w, i) => (
        <div key={i} className={`h-8 rounded-full animate-pulse ${isDark ? 'bg-white/10' : 'bg-[#8B1A4A]/10'}`} style={{ width: w }} />
      ))}
    </div>
  )
}

// ─── Disease detail panel ─────────────────────────────────────
function DiseaseDetail({ name, isDark, onClose }) {
  const detail = getDiseaseDetail(name)

  const cardBg   = isDark ? 'bg-white/[0.06] border-white/10' : 'bg-[#FBF5F8] border-[#E8B4C8]'
  const headText = 'text-[#8B1A4A]'
  const bodyText = isDark ? 'text-white/70' : 'text-[#3A3A3A]'
  const tagBg    = isDark ? 'bg-[#8B1A4A]/20 text-[#E8B4C8]' : 'bg-[#F5D6E3] text-[#8B1A4A]'
  const listDot  = isDark ? 'bg-[#8B1A4A]/60' : 'bg-[#8B1A4A]'

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`mt-3 rounded-2xl border p-5 md:p-6 ${cardBg}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 className={`font-headline text-base md:text-lg font-extrabold leading-tight ${headText}`}>
            {name}
          </h4>
          <span className={`inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${tagBg}`}>
            <Stethoscope size={11} />
            {detail.specialist}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close detail"
          className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-[#E8B4C8]/50 text-[#9A7A88] hover:text-[#8B1A4A]'}`}
        >
          <X size={15} />
        </button>
      </div>

      {/* Description */}
      <p className={`text-sm leading-relaxed mb-5 ${bodyText}`}>{detail.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Symptoms */}
        <div>
          <div className={`flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-widest ${headText}`}>
            <AlertCircle size={13} />
            Symptoms
          </div>
          <ul className="space-y-1.5">
            {detail.symptoms.map((s, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${bodyText}`}>
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${listDot}`} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Treatment */}
        <div>
          <div className={`flex items-center gap-2 mb-2.5 text-xs font-bold uppercase tracking-widest ${headText}`}>
            <HeartPulse size={13} />
            Treatment
          </div>
          <ul className="space-y-1.5">
            {detail.treatment.map((t, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${bodyText}`}>
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${listDot}`} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Book CTA */}
      <div className={`mt-5 pt-4 border-t flex items-center justify-between gap-3 ${isDark ? 'border-white/10' : 'border-[#E8B4C8]'}`}>
        <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#9A7A88]'}`}>
          Treated at Srikara Hospitals by our {detail.specialist}
        </p>
        <a
          href="#book"
          className="flex-shrink-0 text-[11px] font-bold uppercase tracking-widest bg-[#8B1A4A] text-white px-4 py-2 rounded-full hover:bg-[#2D3A4A] transition-colors duration-200"
        >
          Book Consultation
        </a>
      </div>
    </motion.div>
  )
}

// ─── Clickable disease pill ───────────────────────────────────
function DiseasePill({ name, isDark, index, isSelected, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.015, duration: 0.18 }}
      onClick={onClick}
      aria-pressed={isSelected}
      className={`
        disease-pill
        inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium
        border transition-all duration-200 select-none cursor-pointer
        ${isSelected
          ? 'bg-[#8B1A4A] border-[#8B1A4A] text-white shadow-[0_2px_12px_rgba(139,26,74,0.35)]'
          : isDark
            ? 'bg-white/5 border-white/10 text-white/80 hover:bg-[#8B1A4A]/20 hover:border-[#8B1A4A]/50 hover:text-[#E8B4C8]'
            : 'bg-[#F5D6E3] border-[#E8B4C8] text-[#1A1A1A] hover:bg-[#8B1A4A] hover:border-[#8B1A4A] hover:text-white'
        }
      `}
    >
      {name}
      <ChevronDown
        size={12}
        className={`transition-transform duration-200 flex-shrink-0 ${isSelected ? 'rotate-180' : ''}`}
      />
    </motion.button>
  )
}

// ─── Main component ───────────────────────────────────────────
export function AlphabetDiseaseSearch({ theme = 'light' }) {
  const isDark = theme === 'dark'

  const [activeLetter,   setActiveLetter]   = useState(null)
  const [searchQuery,    setSearchQuery]     = useState('')
  const [diseases,       setDiseases]        = useState([])
  const [loading,        setLoading]         = useState(false)
  const [error,          setError]           = useState(null)
  const [mode,           setMode]            = useState(null)
  const [selectedDisease, setSelectedDisease] = useState(null) // pill click

  const letterCacheRef = useRef(new Map())
  const searchCacheRef = useRef(new Map())
  const letterDebounce = useRef(null)
  const searchDebounce = useRef(null)
  const pendingRef     = useRef(null)
  const inputRef       = useRef(null)
  const detailRef      = useRef(null)

  useEffect(() => () => {
    clearTimeout(letterDebounce.current)
    clearTimeout(searchDebounce.current)
  }, [])

  // Scroll detail into view when it opens
  useEffect(() => {
    if (selectedDisease && detailRef.current) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
    }
  }, [selectedDisease])

  const applyResults = useCallback((data) => {
    setDiseases(data)
    setLoading(false)
    setError(null)
    setSelectedDisease(null) // clear detail when new results load
  }, [])

  const handleLetterClick = useCallback((letter) => {
    clearTimeout(letterDebounce.current)
    clearTimeout(searchDebounce.current)
    letterDebounce.current = setTimeout(async () => {
      if (pendingRef.current === `alpha:${letter}`) return
      setActiveLetter(letter)
      setSearchQuery('')
      setMode('alpha')
      setError(null)
      if (letterCacheRef.current.has(letter)) { applyResults(letterCacheRef.current.get(letter)); return }
      pendingRef.current = `alpha:${letter}`
      setLoading(true)
      setDiseases([])
      try {
        const data = await getByLetter(letter)
        letterCacheRef.current.set(letter, data)
        if (pendingRef.current === `alpha:${letter}`) applyResults(data)
      } catch {
        if (pendingRef.current === `alpha:${letter}`) { setError('Failed to load.'); setLoading(false) }
      }
    }, 100)
  }, [applyResults])

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value
    setSearchQuery(val)
    clearTimeout(searchDebounce.current)
    clearTimeout(letterDebounce.current)
    if (!val.trim()) { setActiveLetter(null); setDiseases([]); setMode(null); setLoading(false); pendingRef.current = null; return }
    setActiveLetter(null)
    setMode('search')
    setError(null)
    searchDebounce.current = setTimeout(async () => {
      const key = val.trim().toLowerCase()
      if (pendingRef.current === `search:${key}`) return
      if (searchCacheRef.current.has(key)) { applyResults(searchCacheRef.current.get(key)); return }
      pendingRef.current = `search:${key}`
      setLoading(true)
      setDiseases([])
      try {
        const data = await searchDiseases(val)
        searchCacheRef.current.set(key, data)
        if (pendingRef.current === `search:${key}`) applyResults(data)
      } catch {
        if (pendingRef.current === `search:${key}`) { setError('Search failed.'); setLoading(false) }
      }
    }, 300)
  }, [applyResults])

  const handleClear = useCallback(() => {
    clearTimeout(letterDebounce.current)
    clearTimeout(searchDebounce.current)
    setActiveLetter(null); setSearchQuery(''); setDiseases([]); setMode(null)
    setLoading(false); setError(null); setSelectedDisease(null)
    pendingRef.current = null
    inputRef.current?.focus()
  }, [])

  const handlePillClick = useCallback((name) => {
    setSelectedDisease(prev => prev === name ? null : name)
  }, [])

  const hasResults  = diseases.length > 0
  const showResults = mode !== null
  const resultLabel = mode === 'alpha'
    ? `${diseases.length} condition${diseases.length !== 1 ? 's' : ''} under "${activeLetter}"`
    : `${diseases.length} result${diseases.length !== 1 ? 's' : ''} for "${searchQuery}"`

  const T = {
    section:   isDark ? 'bg-white/[0.03] border border-white/8' : 'bg-white border border-[#E8B4C8]',
    divider:   isDark ? 'border-white/10' : 'border-[#E8B4C8]',
    colBorder: isDark ? 'border-t lg:border-t-0 lg:border-r border-white/8' : 'border-t lg:border-t-0 lg:border-r border-[#E8B4C8]',
    title:     'text-[#8B1A4A]',
    subtitle:  isDark ? 'text-white/45' : 'text-[#4A4A4A]',
    inputWrap: isDark ? 'bg-white/5 border border-white/12 focus-within:border-[#8B1A4A]/60' : 'bg-[#FBF5F8] border border-[#E8B4C8] focus-within:border-[#8B1A4A]',
    input:     isDark ? 'bg-transparent text-white placeholder:text-white/30' : 'bg-transparent text-[#1A1A1A] placeholder:text-[#9A7A88]',
    resultBar: isDark ? 'text-white/40' : 'text-[#9A7A88]',
    emptyText: isDark ? 'text-white/35' : 'text-[#9A7A88]',
  }

  return (
    <div className="w-full">
      <div className={`disease-search-panel rounded-2xl ${T.section}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT — Alphabet */}
          <div className={`p-6 md:p-8 lg:order-1 order-2 ${T.colBorder}`}>
            <div className="mb-5">
              <h3 className={`font-headline text-lg font-extrabold tracking-tight ${T.title}`}>Find by Alphabet</h3>
              <p className={`text-xs mt-1 ${T.subtitle}`}>Click a letter to browse conditions</p>
            </div>
            <div className="alpha-grid grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-9 gap-1.5">
              {ALPHABET.map(letter => {
                const isActive = activeLetter === letter
                return (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    aria-pressed={isActive}
                    aria-label={`Diseases starting with ${letter}`}
                    className={`alpha-btn w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full text-[11px] sm:text-[12px] lg:text-[13px] font-semibold transition-all duration-150 flex items-center justify-center mx-auto focus:outline-none focus:ring-2 focus:ring-[#8B1A4A]/40 focus:ring-offset-1 ${
                      isActive
                        ? 'bg-[#8B1A4A] text-white shadow-[0_2px_10px_rgba(139,26,74,0.40)] scale-105'
                        : isDark
                          ? 'bg-white/5 text-white/50 border border-white/10 hover:bg-[#8B1A4A] hover:text-white hover:border-[#8B1A4A] hover:scale-105'
                          : 'bg-white text-[#8B1A4A] border border-[#E8B4C8] hover:bg-[#8B1A4A] hover:text-white hover:border-[#8B1A4A] hover:scale-105'
                    }`}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
            <p className={`text-[11px] mt-4 ${T.subtitle}`}>{ALL_DISEASES.length}+ conditions across all specialties</p>
          </div>

          {/* RIGHT — Search + results + detail */}
          <div className="p-6 md:p-8 lg:order-2 order-1">
            <div className="mb-5">
              <h3 className={`font-headline text-lg font-extrabold tracking-tight ${T.title}`}>Search Diseases &amp; Conditions</h3>
              <p className={`text-xs mt-1 ${T.subtitle}`}>Click any condition to see details</p>
            </div>

            {/* Search input */}
            <div className={`search-input-wrap relative flex items-center rounded-xl transition-all duration-200 ${T.inputWrap}`}>
              <Search size={17} className={`absolute left-4 flex-shrink-0 pointer-events-none ${isDark ? 'text-white/30' : 'text-[#8B1A4A]/50'}`} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search diseases..."
                aria-label="Search diseases and conditions"
                className={`w-full h-12 pl-11 pr-20 text-sm font-medium rounded-xl outline-none ${T.input}`}
              />
              {searchQuery && (
                <button onClick={handleClear} aria-label="Clear search" className={`absolute right-14 p-1 rounded-full transition-colors ${isDark ? 'text-white/30 hover:text-white/70' : 'text-[#9A7A88] hover:text-[#8B1A4A]'}`}>
                  <X size={14} />
                </button>
              )}
              <button aria-label="Submit search" className="absolute right-2 h-8 w-10 rounded-lg bg-[#8B1A4A] flex items-center justify-center text-white hover:bg-[#2D3A4A] transition-colors duration-200 shadow-sm">
                {loading && mode === 'search' ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              </button>
            </div>
            <p className={`text-[11px] mt-2 mb-4 ${T.subtitle}`}>Results update as you type — click any pill for details</p>

            {/* Results */}
            <div>
              <AnimatePresence mode="wait">

                {loading && (
                  <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <div className={`flex items-center gap-2 mb-3 ${T.resultBar}`}>
                      <Loader2 size={13} className="animate-spin text-[#8B1A4A]" />
                      <span className="text-xs">Loading conditions…</span>
                    </div>
                    <Skeleton isDark={isDark} />
                  </motion.div>
                )}

                {!loading && error && (
                  <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-red-400">{error}</motion.p>
                )}

                {!loading && !error && showResults && hasResults && (
                  <motion.div key={`results-${activeLetter || searchQuery}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                    {/* Count bar */}
                    <div className={`flex items-center justify-between mb-3 pb-2.5 border-b ${T.divider}`}>
                      <span className={`text-xs font-semibold ${T.resultBar}`}>{resultLabel}</span>
                      <button onClick={handleClear} className={`text-[11px] font-bold hover:text-[#8B1A4A] transition-colors ${T.resultBar}`}>Clear</button>
                    </div>

                    {/* Pills — no overflow clipping so detail panel is visible */}
                    <div className="flex flex-wrap gap-2 pr-1 custom-scrollbar">
                      {diseases.map((name, i) => (
                        <DiseasePill
                          key={name}
                          name={name}
                          isDark={isDark}
                          index={i}
                          isSelected={selectedDisease === name}
                          onClick={() => handlePillClick(name)}
                        />
                      ))}
                    </div>

                    {/* Detail panel — outside overflow container, animates independently */}
                    <div ref={detailRef}>
                      <AnimatePresence mode="wait">
                        {selectedDisease && (
                          <DiseaseDetail
                            key={selectedDisease}
                            name={selectedDisease}
                            isDark={isDark}
                            onClose={() => setSelectedDisease(null)}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {!loading && !error && showResults && !hasResults && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-8 gap-2">
                    <span className="text-2xl">🔍</span>
                    <p className={`text-sm font-medium ${T.emptyText}`}>No conditions found{mode === 'alpha' ? ` under "${activeLetter}"` : ` for "${searchQuery}"`}</p>
                  </motion.div>
                )}

                {!loading && !error && !showResults && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${isDark ? 'bg-white/5' : 'bg-[#F5D6E3]'}`}>
                      <Search size={18} className="text-[#8B1A4A]" />
                    </div>
                    <p className={`text-sm font-medium ${T.emptyText}`}>Select a letter or type to search</p>
                    <p className={`text-xs ${T.subtitle}`}>Browse {ALL_DISEASES.length}+ conditions — click any for details</p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
