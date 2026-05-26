import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * VideoHero
 * ─────────────────────────────────────────────────────────────
 * Desktop (≥ 768px):
 *   • Plays hero.mp4 as a muted, looping, autoplaying background video
 *   • Shows hero-poster.jpg while the video loads
 *   • Falls back to poster image if autoplay is blocked
 *
 * Mobile (< 768px):
 *   • Video element is not rendered at all (saves bandwidth)
 *   • Shows branch.heroImage or the poster as a static background
 *
 * Asset paths use import.meta.env.BASE_URL so they resolve correctly
 * on both localhost (/hero.mp4) and GitHub Pages (/sri/hero.mp4).
 */

// BASE_URL = '/'  locally,  '/sri/'  on GitHub Pages
const BASE      = import.meta.env.BASE_URL
const VIDEO_SRC    = `${BASE}hero.mp4`
const POSTER_IMAGE = `${BASE}hero-poster.jpg`

export function VideoHero({ branch, children }) {
  const navigate   = useNavigate()
  const videoRef   = useRef(null)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  const [videoFailed, setVideoFailed] = useState(false)

  // Track viewport changes (e.g. orientation flip)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Attempt programmatic play in case autoplay policy blocked it
  useEffect(() => {
    const video = videoRef.current
    if (!video || isMobile) return
    video.play().catch(() => setVideoFailed(true))
  }, [isMobile])

  // Fallback image: prefer branch-specific hero, then poster
  const fallbackSrc = branch?.heroImage || POSTER_IMAGE

  return (
    <section className="hero-section relative min-h-[520px] md:min-h-[600px] lg:min-h-[780px] flex items-center overflow-hidden bg-[#0a1628]">

      {/* ── Background layer ── */}
      <div className="absolute inset-0 z-0">

        {/* Overlays — identical on both mobile and desktop */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a1628]/70 via-[#0a1628]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a1628]/50 via-transparent to-transparent pointer-events-none" />

        {/* ── MOBILE: static image only ── */}
        {isMobile && (
          <img
            src={fallbackSrc}
            alt={branch?.title || 'Srikara Hospitals'}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
            loading="eager"
            decoding="async"
          />
        )}

        {/* ── DESKTOP: <video> + poster fallback ── */}
        {!isMobile && (
          <>
            {/* Poster shown while video loads or if it fails */}
            {videoFailed && (
              <img
                src={POSTER_IMAGE}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
              />
            )}

            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={POSTER_IMAGE}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => setVideoFailed(true)}
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${videoFailed ? 'opacity-0' : 'opacity-90'}`}
            />
          </>
        )}
      </div>

      {/* ── Content ── */}
      <div className="hero-content max-w-7xl mx-auto px-4 md:px-8 relative z-20 w-full py-10 md:py-16">
        {children ?? (
          <div className="max-w-2xl">
            <h1 className="font-headline font-extrabold tracking-tighter mb-5 md:mb-6">
              <span className="hero-line-1 block text-[28px] md:text-5xl lg:text-7xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                {branch?.heroHeadline || 'Precision in Every Procedure.'}
              </span>
              <span className="hero-line-2 block text-[26px] md:text-5xl lg:text-7xl hero-gradient-text">
                {branch?.heroHighlight || 'Excellence in Every Recovery.'}
              </span>
            </h1>
            <p className="hero-desc text-sm md:text-lg text-white/70 max-w-xl mb-6 md:mb-8 leading-relaxed">
              {branch?.description}
            </p>
            <div className="hero-btn-wrap flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
              <button
                onClick={() => navigate('/book')}
                className="w-full sm:w-auto min-h-[48px] bg-gradient-to-br from-[#8B1A4A] to-[#5E0F30] text-white px-8 py-3 md:py-4 rounded-full font-label font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform text-sm md:text-base"
              >
                Book an Appointment
              </button>
              <button
                onClick={() => navigate('/specialties')}
                className="w-full sm:w-auto min-h-[48px] bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 md:py-4 rounded-full font-label font-bold uppercase tracking-widest hover:bg-white/20 transition-all text-sm md:text-base"
              >
                Explore Specialties
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Stats overlay — desktop only ── */}
      {branch?.heroStats && (
        <div className="absolute bottom-10 right-8 hidden xl:grid grid-cols-2 gap-4 w-[340px] z-20">
          {branch.heroStats.map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-[20px] p-6 rounded-xl border border-white/20">
              <p className={`text-3xl font-black ${i === 0 ? 'text-white' : 'text-[#E8B4C8]'}`}>{stat.value}</p>
              <p className="text-xs font-bold text-white/60 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
