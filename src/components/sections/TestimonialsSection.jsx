import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, Video, FileText, Play } from 'lucide-react'
import { useTestimonials } from '@/hooks/useTestimonials'

export function TestimonialsSection({ category = 'General / Home' }) {
  const { testimonials, loading } = useTestimonials()
  const [activeIndex, setActiveIndex] = useState(0)

  // Filter testimonials matching the category, fallback to General if none exist
  const filtered = useMemo(() => {
    const matched = testimonials.filter(t => t.page?.toLowerCase() === category.toLowerCase())
    return matched.length > 0 ? matched : testimonials.filter(t => t.page?.toLowerCase() === 'general / home')
  }, [testimonials, category])

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0)
  }, [category])

  const current = filtered[activeIndex]

  // ── Play the video only while the visitor can see it ──
  // The iframe loads paused (no autoplay); an IntersectionObserver sends
  // play/pause commands to the YouTube player as it enters/leaves the viewport.
  const videoWrapRef = useRef(null)
  const iframeRef = useRef(null)
  const videoVisibleRef = useRef(false)
  const [videoVisible, setVideoVisible] = useState(false)

  const sendPlayerCommand = (func) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [], id: 1, channel: 'widget' }),
      '*'
    )
  }

  useEffect(() => {
    const el = videoWrapRef.current
    if (!el || !current?.videoUrl) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        videoVisibleRef.current = entry.isIntersecting
        setVideoVisible(entry.isIntersecting)
      },
      { threshold: 0.45 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [current?.videoUrl])

  useEffect(() => {
    sendPlayerCommand(videoVisible ? 'playVideo' : 'pauseVideo')
  }, [videoVisible])

  if (loading || filtered.length === 0) {
    return null
  }

  const getYoutubeId = (url) => {
    if (!url) return null
    let cleanUrl = url.trim()
    if (cleanUrl.includes('youtube.com/embed')) {
      const parts = cleanUrl.split('/')
      return parts[parts.length - 1].split(/[?#&]/)[0]
    }
    if (cleanUrl.includes('/shorts/')) {
      const parts = cleanUrl.split('/shorts/')
      return parts[parts.length - 1].split(/[?#&]/)[0]
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = cleanUrl.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const getYoutubeThumb = (url) => {
    const id = getYoutubeId(url)
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : ''
  }

  // Helper to extract YouTube video ID (supporting standard, watch, shorts, and embed formats).
  // Loads with the JS API enabled and NO autoplay — playback is driven by scroll visibility.
  // mute=1 lets the scroll-triggered play succeed under browser autoplay policies;
  // visitors can unmute via the player controls.
  const EMBED_PARAMS = `enablejsapi=1&mute=1&playsinline=1&rel=0&origin=${encodeURIComponent(window.location.origin)}`
  const getEmbedUrl = (url) => {
    if (!url) return ''
    let cleanUrl = url.trim()

    // Check if it's already an embed URL
    if (cleanUrl.includes('youtube.com/embed')) {
      return cleanUrl.includes('?') ? `${cleanUrl}&${EMBED_PARAMS}` : `${cleanUrl}?${EMBED_PARAMS}`
    }

    // Check if it is a YouTube Short
    if (cleanUrl.includes('/shorts/')) {
      const parts = cleanUrl.split('/shorts/')
      const videoId = parts[parts.length - 1].split(/[?#&]/)[0]
      return `https://www.youtube.com/embed/${videoId}?${EMBED_PARAMS}`
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = cleanUrl.match(regExp)
    const videoId = (match && match[2].length === 11) ? match[2] : null
    return videoId ? `https://www.youtube.com/embed/${videoId}?${EMBED_PARAMS}` : cleanUrl
  }

  return (
    <section className="relative py-24 bg-gradient-to-tr from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] text-slate-800 overflow-hidden font-sans border-t border-slate-100">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#8B1A4A]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B1A4A02_1px,transparent_1px),linear-gradient(to_bottom,#8B1A4A02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 z-10 relative">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#8B1A4A]" />
            <span className="text-[#8B1A4A] text-xs font-black uppercase tracking-[0.4em]">Patient Stories</span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#8B1A4A]" />
          </motion.div>
          
          <h2 className="font-garamond text-4xl sm:text-5xl font-bold text-slate-900 tracking-wide">
            Testimonials of Hope & Healing
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-sans">
            Hear directly from the patients who recovered their mobility and health through the surgical precision at Srikara Hospitals.
          </p>
        </div>

        {/* Main Card (Horizontal Rectangular Card) */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200/85 shadow-[0_24px_60px_rgba(0,0,0,0.05)] rounded-[32px] overflow-hidden flex flex-col md:flex-row min-h-[380px] mb-8 relative">
          <Quote className="absolute top-6 left-6 text-slate-100 w-24 h-24 pointer-events-none z-0" />

          {/* Left Column (Review Info & Text) */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-between z-10 relative min-w-0">
            <div className="space-y-6">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: current.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-2"
                >
                  <p className="text-xl md:text-2xl font-garamond italic leading-relaxed text-slate-800 pr-2">
                    "{current.review ? current.review.replace(/^["'\s]+|["'\s]+$/g, '') : ''}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Patient Name */}
            <div className="mt-8">
              <h4 className="font-bold text-slate-950 text-lg leading-none">{current.patientName}</h4>
              <span className="text-[10px] text-[#8B1A4A] mt-2 inline-block font-black uppercase tracking-wider bg-[#8B1A4A]/5 px-2 py-0.5 rounded-full">
                Verified Story ({current.page || 'General'})
              </span>
            </div>
          </div>

          {/* Right Column (Inline Iframe Player if Video exists, else blank/decorative quote column) */}
          {current.videoUrl ? (
            <div ref={videoWrapRef} className="w-full md:w-[460px] shrink-0 border-t md:border-t-0 md:border-l border-slate-100 bg-slate-950 flex items-center justify-center relative aspect-video md:aspect-auto">
              <iframe
                ref={iframeRef}
                src={getEmbedUrl(current.videoUrl)}
                width="100%"
                height="100%"
                title={`Testimonial from ${current.patientName}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onLoad={() => {
                  // Handshake so the YouTube player accepts our API commands, then
                  // re-send the current visibility state once the iframe has loaded.
                  iframeRef.current?.contentWindow?.postMessage(
                    JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*'
                  )
                  setTimeout(() => {
                    sendPlayerCommand(videoVisibleRef.current ? 'playVideo' : 'pauseVideo')
                  }, 600)
                }}
              />
            </div>
          ) : (
            <div className="hidden md:flex w-72 shrink-0 bg-gradient-to-br from-[#8B1A4A]/5 to-transparent border-l border-slate-100 items-center justify-center p-8 text-center flex-col gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-[#8B1A4A] shadow-inner">
                <Quote className="w-6 h-6 transform rotate-180" />
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                "Precision, patient care, and permanent relief from chronic pain."
              </p>
            </div>
          )}
        </div>

        {/* Small Square Cards Below (Scrollable Row) */}
        {filtered.length > 1 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3 ml-2">
              Browse More Patient Stories
            </p>
            
            <div className="flex gap-4 overflow-x-auto pb-4 px-1.5 scrollbar-thin scrollbar-thumb-slate-200 select-none custom-scrollbar">
              {filtered.map((item, index) => {
                const isActive = index === activeIndex
                const isVideo = !!item.videoUrl
                const thumbUrl = isVideo ? getYoutubeThumb(item.videoUrl) : ''

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={
                      isVideo && thumbUrl
                        ? { backgroundImage: `url(${thumbUrl})` }
                        : { backgroundImage: `linear-gradient(135deg, #8B1A4A 0%, #2D3A4A 100%)` }
                    }
                    className={`w-48 h-44 flex-shrink-0 cursor-pointer rounded-2xl border-2 transition-all p-4 flex flex-col justify-between text-left shadow-md relative bg-cover bg-center overflow-hidden ${
                      isActive 
                        ? 'border-[#8B1A4A] ring-2 ring-[#8B1A4A]/30' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Dark gradient overlay on thumbnail to make text readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-0" />

                    {/* Top Icon / Badges (above overlay) */}
                    <div className="flex justify-between items-start z-10 w-full">
                      <div className={`p-2 rounded-xl text-white ${isActive ? 'bg-[#8B1A4A]' : 'bg-black/40 backdrop-blur-sm'}`}>
                        {isVideo ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      
                      {isVideo && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF4A8B] animate-ping" />
                      )}
                    </div>

                    {/* Play Button Overlay (z-10) */}
                    {isVideo && !isActive && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/30">
                          <Play className="w-4.5 h-4.5 fill-current translate-x-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Bottom Info (z-10) */}
                    <div className="min-w-0 z-10 w-full">
                      <p className="text-xs font-bold text-white truncate drop-shadow-sm">
                        {item.patientName}
                      </p>
                      <p className="text-[9px] text-white/70 font-semibold leading-none mt-0.5 uppercase tracking-wider">
                        {isVideo ? 'Video Story' : 'Text Review'}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
