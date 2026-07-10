import React from 'react';
import { motion } from 'framer-motion';
import { Timeline } from '@/components/ui/timeline-section';

export function TimelineSection() {
  return (
    <section className="py-32 bg-[#FFF9FA] border-t border-[#8B1A4A]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-24 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
           <span className="text-[#8B1A4A] text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">
             The Srikara Experience
           </span>
           <h2 className="font-garamond text-5xl md:text-7xl text-[#1A202C] font-bold mb-8 leading-tight">
             How we deliver <br />
             <span className="hero-gradient-text italic">Absolute Care</span>
           </h2>
           <p className="text-[#4A4A4A] text-xl font-medium leading-relaxed max-w-lg mb-10">
             Our clinical journey is designed to be as seamless as our surgical procedures. From first contact to final recovery, every step is verified.
           </p>

           <div className="p-1 rounded-3xl bg-gradient-to-br from-[#8B1A4A]/15 to-transparent">
             <div className="bg-white rounded-[calc(1.5rem-2px)] p-10 border border-[#8B1A4A]/10 shadow-[0_15px_40px_rgba(139,26,74,0.06)]">
                <p className="text-[#4A4A4A] text-sm leading-relaxed italic">
                  "The integration of digital clinical protocols at Srikara ensures that we maintain 100% precision throughout the patient lifecycle."
                </p>
                <p className="text-[#8B1A4A] text-[10px] font-bold uppercase tracking-widest mt-6">
                  - Clinical Excellence Board
                </p>
             </div>
           </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="relative"
        >
          {/* Background Highlight */}
          <div className="absolute inset-0 bg-[#8B1A4A]/5 blur-[120px] rounded-full scale-125" />

          <div className="relative z-10 bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] border border-[#8B1A4A]/15 shadow-[0_25px_60px_rgba(139,26,74,0.10)]">
            <Timeline />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
