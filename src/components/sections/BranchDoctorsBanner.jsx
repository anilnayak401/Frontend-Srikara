import React from 'react';
import { motion } from 'framer-motion';
import { assetUrl } from '@/lib/assetUrl';

export function BranchDoctorsBanner({ branch }) {
  const imageUrl = branch?.doctorsGroupImage;

  if (!imageUrl) return null;

  return (
    <section className="py-12 bg-transparent overflow-hidden font-sans antialiased select-none">
      <div className="max-w-[1400px] mx-auto px-8">
        
        {/* Subtle decorative separator line */}
        <div className="w-full h-[1px] bg-slate-200/50 mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text block */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#8B1A4A] to-transparent" />
              <span className="text-[#8B1A4A] text-xs font-black uppercase tracking-[0.3em] leading-none">
                Clinical Experts
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="editorial-title text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#2D3A4A] mb-6"
            >
              Meet Our {branch.title} Medical Team
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#4A4A4A] text-base md:text-lg font-light leading-relaxed mb-8"
            >
              A collaborative team of senior consultants, robotic surgeons, and dedicated healthcare professionals working in synergy to provide top-tier clinical outcomes.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-x-6 gap-y-4 pt-2 border-t border-slate-100"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#8B1A4A]/10 text-[#8B1A4A] flex items-center justify-center text-xs">🤝</span>
                <span className="text-sm font-semibold text-[#2D3A4A]">Collaborative Care</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#8B1A4A]/10 text-[#8B1A4A] flex items-center justify-center text-xs">🤖</span>
                <span className="text-sm font-semibold text-[#2D3A4A]">Robotic Precision</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#8B1A4A]/10 text-[#8B1A4A] flex items-center justify-center text-xs">❤️</span>
                <span className="text-sm font-semibold text-[#2D3A4A]">Patient First</span>
              </div>
            </motion.div>
          </div>

          {/* Image Banner block */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-200/60 bg-slate-50"
            >
              <div className="aspect-[16/7] sm:aspect-[2.1/1] w-full overflow-hidden relative">
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500 z-10" />

                <img
                  src={assetUrl(imageUrl)}
                  alt={`Medical Specialists at Srikara ${branch.title}`}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>

              {/* Glassmorphic floating card on the image */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-[340px] z-20 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white/45 shadow-xl">
                <span className="text-[#8B1A4A] font-extrabold text-[10px] tracking-wider uppercase block mb-1">
                  Srikara {branch.title}
                </span>
                <h4 className="text-[#2D3A4A] font-headline text-base font-bold mb-1">
                  Clinical Artistry in Action
                </h4>
                <p className="text-[#4A4A4A] text-xs leading-relaxed">
                  Our expert team specializes in advanced surgeries, robotic accuracy, and personalized treatment pathways.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
