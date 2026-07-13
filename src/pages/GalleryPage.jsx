import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { PageShell } from '@/components/shared/PageShell'

const BASE = import.meta.env.BASE_URL

const CATEGORIES = ['All', 'Infrastructure', 'Technology & OT', 'Patient Care']

// 18 frames captured from the Discover Srikara film, grouped into placeholder categories
const PHOTOS = Array.from({ length: 18 }, (_, i) => {
  const n = String(i + 1).padStart(3, '0')
  return {
    src: `${BASE}gallery/ezgif-frame-${n}.jpg`,
    category: i < 6 ? 'Infrastructure' : i < 12 ? 'Technology & OT' : 'Patient Care',
    caption: i < 6 ? 'World-class facilities at Srikara Hospitals'
      : i < 12 ? 'Advanced robotic & surgical technology'
      : 'Compassionate care, every step of the way',
  }
})

/* Repeating collage rhythm: big feature tiles, tall portraits, wide banners and small squares.
   `grid-flow-dense` lets the browser back-fill any holes so the collage stays packed. */
const SPAN_PATTERN = [
  { size: 'col-span-2 row-span-2', radius: 'rounded-[28px]', featured: true },   // big feature
  { size: 'col-span-1 row-span-1', radius: 'rounded-2xl' },                      // small
  { size: 'col-span-1 row-span-2', radius: 'rounded-[24px]' },                   // tall
  { size: 'col-span-1 row-span-1', radius: 'rounded-xl' },                       // small
  { size: 'col-span-2 row-span-1', radius: 'rounded-[24px]' },                   // wide
  { size: 'col-span-1 row-span-2', radius: 'rounded-2xl' },                      // tall
  { size: 'col-span-1 row-span-1', radius: 'rounded-[24px]' },                   // small
  { size: 'col-span-2 row-span-2', radius: 'rounded-[28px]', featured: true },   // big feature
  { size: 'col-span-1 row-span-1', radius: 'rounded-xl' },                       // small
  { size: 'col-span-1 row-span-2', radius: 'rounded-2xl' },                      // tall
  { size: 'col-span-2 row-span-1', radius: 'rounded-[24px]' },                   // wide
  { size: 'col-span-1 row-span-1', radius: 'rounded-2xl' },                      // small
]

/* Alternating hover tilt (degrees) for a hand-placed, scrapbook feel */
const TILT_PATTERN = [-1.2, 1, -0.8, 1.4, -1, 0.8]

export function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const photos = useMemo(
    () => (activeCategory === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === activeCategory)),
    [activeCategory]
  )

  const showPrev = e => { e?.stopPropagation(); setLightboxIndex(i => (i - 1 + photos.length) % photos.length) }
  const showNext = e => { e?.stopPropagation(); setLightboxIndex(i => (i + 1) % photos.length) }

  return (
    <PageShell
      seoTitle="Gallery | Srikara Hospitals"
      seoDescription="A visual journey through Srikara Hospitals — our infrastructure, advanced surgical technology and moments of patient care."
      badge="Life at Srikara"
      title="Our Gallery"
      subtitle="Step inside Srikara Hospitals — explore our world-class infrastructure, cutting-edge operating theatres and the moments that define our care."
    >
      {/* Category filter chips */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setLightboxIndex(null) }}
            className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border shadow-sm ${
              activeCategory === cat
                ? 'bg-[#8B1A4A] text-white border-[#8B1A4A] shadow-[#8B1A4A]/25 shadow-md'
                : 'bg-white/70 text-[#4A4A4A] border-slate-200 hover:border-[#8B1A4A]/40 hover:text-[#8B1A4A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Uneven collage grid — mixed tile sizes packed densely for an editorial, scrapbook feel */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-4 auto-rows-[110px] sm:auto-rows-[140px] md:auto-rows-[165px] gap-3 md:gap-4 grid-flow-dense mb-20"
      >
        <AnimatePresence mode="popLayout">
          {photos.map((photo, idx) => {
            const span = SPAN_PATTERN[idx % SPAN_PATTERN.length]
            const tilt = TILT_PATTERN[idx % TILT_PATTERN.length]
            return (
              <motion.button
                layout
                key={photo.src}
                initial={{ opacity: 0, scale: 0.9, rotate: tilt * 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ rotate: tilt, scale: 1.02, zIndex: 20 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => setLightboxIndex(idx)}
                className={`group relative overflow-hidden bg-white outline-none border-[5px] border-white shadow-[0_10px_30px_rgba(139,26,74,0.12)] hover:shadow-[0_24px_50px_rgba(139,26,74,0.25)] transition-shadow duration-500 ${span.size} ${span.radius}`}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Feature tiles get an always-on label; the rest reveal on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#2D0A1C]/85 via-transparent to-transparent transition-opacity duration-500 flex flex-col justify-end p-4 text-left ${
                  span.featured ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                    <Camera className="w-3 h-3" /> {photo.category}
                  </span>
                  <p className="text-white text-xs font-bold mt-1 leading-snug">{photo.caption}</p>
                </div>
                {span.featured && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#8B1A4A] text-[8px] font-black uppercase tracking-widest shadow-sm">
                    Featured
                  </span>
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[300] bg-[#1A0510]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all"
              aria-label="Close gallery preview"
            >
              <X size={20} />
            </button>

            <button onClick={showPrev} aria-label="Previous photo"
              className="absolute left-3 md:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all">
              <ChevronLeft size={22} />
            </button>

            <motion.figure
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
              className="max-w-5xl w-full"
            >
              <img
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].caption}
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
              <figcaption className="text-center mt-4">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{photos[lightboxIndex].category}</p>
                <p className="text-white text-sm font-semibold mt-1">{photos[lightboxIndex].caption}</p>
                <p className="text-white/40 text-[11px] mt-1">{lightboxIndex + 1} / {photos.length}</p>
              </figcaption>
            </motion.figure>

            <button onClick={showNext} aria-label="Next photo"
              className="absolute right-3 md:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all">
              <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}
