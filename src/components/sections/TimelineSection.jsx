import React from 'react';
import { motion } from 'framer-motion';
import { Timeline } from '@/components/ui/timeline-section';

export function TimelineSection() {
  return (
    <section className="py-32 bg-[#0D0A0C] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-24 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
           <span className="text-[#8B1A4A] text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">
             The Srikara Experience
           </span>
           <h2 className="font-garamond text-5xl md:text-7xl text-white font-bold mb-8 leading-tight">
             How we deliver <br />
             <span className="hero-gradient-text italic">Absolute Care</span>
           </h2>
           <p className="text-white/50 text-xl font-medium leading-relaxed max-w-lg mb-10">
             Our clinical journey is designed to be as seamless as our surgical procedures. From first contact to final recovery, every step is verified.
           </p>
           
           <div className="p-1 rounded-3xl bg-gradient-to-br from-[#8B1A4A]/20 to-transparent">
             <div className="bg-[#1A1619] rounded-[calc(1.5rem-2px)] p-10 border border-white/5">
                <p className="text-white/60 text-sm leading-relaxed italic">
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
          <div className="absolute inset-0 bg-[#8B1A4A]/10 blur-[120px] rounded-full scale-125" />
          
          <div className="relative z-10 glass-surface p-12 rounded-[3.5rem] border-[#8B1A4A]/30 shadow-2xl">
            <Timeline />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
