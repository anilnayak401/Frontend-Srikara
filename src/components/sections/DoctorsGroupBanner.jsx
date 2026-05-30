import React from 'react';
import { motion } from 'framer-motion';
import { assetUrl } from '@/lib/assetUrl';

export function DoctorsGroupBanner() {
  return (
    <section className="pt-20 pb-12 bg-transparent overflow-hidden relative font-sans antialiased select-none">
      {/* HUMAN TOUCH: ARTISTIC PULSE LINE */}
      <div className="absolute top-1/2 left-0 w-full h-[300px] -translate-y-1/2 pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 100" className="w-full h-full text-[#8B1A4A]" preserveAspectRatio="none">
          <path
            d="M0,50 L200,50 L220,10 L240,90 L260,30 L280,70 L300,50 L1000,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        
        {/* ── HEADER SECTION ── */}
        <div className="mb-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-16 h-[2px] bg-gradient-to-r from-[#8B1A4A] to-transparent" />
            <span className="text-[#8B1A4A] text-[10px] font-black uppercase tracking-[0.5em] leading-none">Clinical Artistry</span>
          </motion.div>

          <h2 className="editorial-title text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6">
            <span className="text-[#2D3A4A]">Meet Our </span>
            <span className="text-[#8B1A4A]">Medical Team</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#8B1A4A]/25 mb-8" />

          <p className="text-[#4A4A4A] text-lg leading-relaxed font-light opacity-90">
            A collaborative team of senior consultants, robotic surgeons, and dedicated healthcare professionals working in synergy to provide top-tier clinical outcomes.
          </p>
        </div>

        {/* ── FULL WIDTH IMAGE BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-200/60 bg-slate-50"
        >
          <div className="w-full aspect-[21/9] sm:aspect-[21/8] lg:aspect-[21/7] overflow-hidden relative">
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500 z-10" />

            <img
              src={assetUrl('images/doctors-banner.jpg')}
              alt="Srikara Hospitals Specialized Medical Team"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
