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

      {/* Photo grid */}
      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-20">
        <AnimatePresence mode="popLayout">
          {photos.map((photo, idx) => (
            <motion.button
              layout
              key={photo.src}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35 }}
              onClick={() => setLightboxIndex(idx)}
              className={`group relative overflow-hidden rounded-2xl border border-white/80 shadow-[0_6px_20px_rgba(139,26,74,0.08)] bg-white outline-none ${
                idx % 7 === 0 ? 'row-span-2' : ''
              }`}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="w-full h-full min-h-[160px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D0A1C]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                  <Camera className="w-3 h-3" /> {photo.category}
                </span>
                <p className="text-white text-xs font-bold mt-1 leading-snug">{photo.caption}</p>
              </div>
            </motion.button>
          ))}
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
