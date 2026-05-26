import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Target, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  CardCurtainReveal,
  CardCurtainRevealBody,
  CardCurtainRevealDescription,
  CardCurtainRevealFooter,
  CardCurtainRevealTitle,
  CardCurtain 
} from '@/components/ui/card-curtain-reveal';

const cases = [
  {
    id: 1,
    category: 'Neurovascular Breakthrough',
    title: 'Precision Flow Diverter Procedure',
    patient: '45-year-old Male | Vertebral Artery Dissection',
    outcome: 'Successful arterial restoration via breakthrough stenting, preventing major stroke event.',
    stat: '98% Recovery Rate',
    icon: Zap,
    color: 'from-blue-500/20 to-indigo-500/20',
    frontImage: 'https://picsum.photos/seed/neuro/800/600',
    revealImage: 'https://picsum.photos/seed/scan/800/600'
  },
  {
    id: 2,
    category: 'Surgical Milestone',
    title: '30,000+ Robotic Joint Replacements',
    patient: 'Global Decade Milestone',
    outcome: 'Pioneered robotic-assisted precision for knee and hip replacements across the Srikara network.',
    stat: '12 Years of Excellence',
    icon: Activity,
    color: 'from-purple-500/20 to-rose-500/20',
    frontImage: 'https://picsum.photos/seed/surgery/800/600',
    revealImage: 'https://picsum.photos/seed/robot/800/600'
  },
  {
    id: 3,
    category: 'Clinical Mastery',
    title: 'Complex Spine Deformity Correction',
    patient: 'Pediatric & Adult Spinal Trauma',
    outcome: 'Successful correction of high-angle deformities using neuro-navigation and clinical precision.',
    stat: 'Precision-Led Outcomes',
    icon: Target,
    color: 'from-emerald-500/20 to-teal-500/20',
    frontImage: 'https://picsum.photos/seed/spine/800/600',
    revealImage: 'https://picsum.photos/seed/anatomy/800/600'
  }
];

export const PremiumCaseStudies = () => {
  return (
    <section className="pt-10 pb-0 bg-transparent relative overflow-hidden font-sans">
      {/* ── BACKGROUND ARTISTRY ── */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-full h-full text-[#8B1A4A]">
          <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        {/* ── HEADER ── */}
        <div className="mb-24 flex flex-col items-start max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-[1px] bg-[#8B1A4A]" />
            <span className="text-[#8B1A4A] text-[10px] font-black uppercase tracking-[0.5em]">Institutional Impact</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#1A202C] tracking-tight leading-[1.1] mb-8">
            Precision Protocols & <br />
            <span className="text-[#8B1A4A]">Success Narratives.</span>
          </h2>
          <p className="text-[#4A4A4A] text-lg max-w-2xl font-light leading-relaxed opacity-80">
            Beyond standard care. We document our breakthrough clinical outcomes, setting global standards in robotic precision and neuro-recovery.
          </p>
        </div>

        {/* ── CASE GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {cases.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
            >
              <CardCurtainReveal className="h-full bg-[#1A202C] border border-white/10 rounded-[2.5rem] flex flex-col transition-all duration-700 hover:shadow-[0_40px_100px_rgba(139,26,74,0.15)] overflow-hidden min-h-[520px] relative">
                
                {/* ── FOOTER LAYER (The revealed asset) ── */}
                <CardCurtainRevealFooter className="mt-auto pointer-events-none">
                  <div className="absolute inset-0 bg-[#8B1A4A]/20 mix-blend-multiply z-[1] opacity-60" />
                  <img
                    src={item.revealImage}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale brightness-50"
                  />
                </CardCurtainRevealFooter>

                {/* ── BODY LAYER (The clinical info) ── */}
                <CardCurtainRevealBody className="relative z-10 flex flex-col p-10 h-full bg-white transition-colors duration-700 group-hover:bg-white/10 group-hover:backdrop-blur-sm group-hover:text-white">
                  <div className="flex items-center justify-between mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#F7FAFC] flex items-center justify-center text-[#8B1A4A] group-hover:bg-white group-hover:text-[#8B1A4A] transition-all duration-500">
                      <item.icon size={28} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#8B1A4A] group-hover:text-white/80 mb-1">{item.category}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-[#8B1A4A]/20 group-hover:bg-white/20" />)}
                      </div>
                    </div>
                  </div>

                  {/* Foreground Image Container */}
                  <div className="relative h-44 rounded-3xl overflow-hidden mb-8 border border-[#EDF2F7]">
                    <img 
                      src={item.frontImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent group-hover:from-transparent transition-all duration-700 z-20" />
                  </div>

                  <CardCurtainRevealTitle className="text-2xl font-bold text-[#1A202C] group-hover:text-white mb-4 transition-colors leading-tight">
                    {item.title}
                  </CardCurtainRevealTitle>
                  
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B1A4A]/40 group-hover:bg-white/40" />
                    <span className="text-[11px] font-bold text-[#4A4A4A]/60 group-hover:text-white/60 italic tracking-wide">{item.patient}</span>
                  </div>

                  <CardCurtainRevealDescription className="text-[#4A4A4A]/80 group-hover:text-white/90 text-sm leading-relaxed mb-6 transition-opacity">
                    {item.outcome}
                  </CardCurtainRevealDescription>

                  <div className="mt-auto pt-8 border-t border-[#EDF2F7] group-hover:border-white/10 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#4A4A4A]/40 group-hover:text-white/40 uppercase tracking-widest mb-1">Impact Detail</span>
                      <span className="text-sm font-black text-[#1A202C] group-hover:text-white flex items-center gap-2">
                        {item.stat}
                        <TrendingUp size={14} className="text-[#8B1A4A] group-hover:text-white" />
                      </span>
                    </div>
                    <button className="w-10 h-10 rounded-full border border-[#E2E8F0] group-hover:border-white/20 flex items-center justify-center text-[#1A202C] group-hover:text-white hover:bg-[#8B1A4A] group-hover:hover:bg-white group-hover:hover:text-[#8B1A4A] transition-all">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                  
                  <CardCurtain className="bg-[#8B1A4A]/5 mix-blend-overlay" />
                </CardCurtainRevealBody>

              </CardCurtainReveal>
            </motion.div>
          ))}
        </div>

        {/* ── INSTITUTIONAL BADGE ── */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 py-10 border-y border-[#EDF2F7] flex flex-wrap items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <Award className="text-[#8B1A4A]" size={32} strokeWidth={1} />
            <p className="text-[#1A202C] font-bold text-sm tracking-tight">
              Recognized for <span className="text-[#8B1A4A]">Clinical Breakthroughs</span> in South India
            </p>
          </div>
          <div className="flex items-center gap-12 text-[#4A4A4A]/40">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">NABH Accredited</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">ISO Certified</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">NABL Labs</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
