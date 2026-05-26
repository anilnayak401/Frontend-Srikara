import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Brain,
  Bone,
  Activity,
  Stethoscope,
  Zap,
  Pipette,
  Globe,
  Monitor,
  Flame,
  Droplets,
  Microscope,
  Baby,
  Smile,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
  Plus
} from 'lucide-react';
import { ExpandableCard } from '@/components/ui/expandable-card';

const specialties = [
  { 
    id: 1, 
    title: 'Cardiology', 
    icon: Heart, 
    desc: 'Precision cardiac care.',
    fullDesc: 'The Heart & Vascular Institute at Srikara ECIL offers globally-verified protocols for interventional cardiology, non-invasive imaging, and cardiac rehabilitation. We specialize in complex angioplasties, valve replacements, and rhythm management.',
    image: 'https://images.unsplash.com/photo-1628348068869-42551408abb1?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 2, 
    title: 'Cardiothoracic', 
    icon: Activity, 
    desc: 'Advanced heart & chest surgery.',
    fullDesc: 'Our world-class surgeons perform life-saving thoracic procedures including bypass surgeries (CABG), lung resections, and esophageal surgeries using minimally invasive techniques for faster recovery.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 3, 
    title: 'Neuro Sciences', 
    icon: Brain, 
    desc: 'Elite brain & spine care.',
    fullDesc: 'Leading neuro-interventional procedures and complex neuro-surgeries with 3D navigation. We cover stroke management, epilepsy, Parkinson’s care, and comprehensive spine reconstructive surgery.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 4, 
    title: 'Gastroenterology', 
    icon: Pipette, 
    desc: 'Expert digestive health.',
    fullDesc: 'Combining endoscopic precision with medical expertise. Our department manages liver diseases, gastrointestinal cancers, and pancreatic conditions with the most advanced therapeutic endoscopy.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 5, 
    title: 'Nephrology', 
    icon: Droplets, 
    desc: 'Advanced kidney specialists.',
    fullDesc: 'Comprehensive renal care including 24/7 dialysis support, kidney transplantation protocols, and management of chronic kidney disease (CKD) with personalized nutrient planning.',
    image: 'https://images.unsplash.com/photo-1579165466541-746824233bd9?auto=format&fit=crop&q=80&w=800'
  },
  { id: 6, title: 'Oncology', icon: ShieldCheck, desc: 'Comprehensive cancer care.', image: 'https://images.unsplash.com/photo-1579154235821-6968fd3f309a?auto=format&fit=crop&q=80&w=800', fullDesc: 'Holistic cancer treatments combining radiation, chemotherapy, and surgical oncology.' },
  { id: 7, title: 'Emergency Care', icon: Flame, desc: '24/7 Critical response.', image: 'https://images.unsplash.com/photo-1583333223166-9e8f20e5c9df?auto=format&fit=crop&q=80&w=800', fullDesc: 'Level-1 trauma response for all emergencies, equipped with high-tech ambulances and immediate intervention.' },
  { id: 8, title: 'Urology', icon: Zap, desc: 'Urological innovation.', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800', fullDesc: 'Laser surgeries for kidney stones and precision prostate management using robotic aids.' },
  { id: 9, title: 'Transplantation', icon: Microscope, desc: 'Elite organ replacement.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', fullDesc: 'Multi-organ transplant facility with dedicated clean-rooms and specialized post-transplant ICU.' },
  { id: 10, title: 'Orthopedics', icon: Bone, desc: 'Global joints replacement.', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800', fullDesc: 'The flagship of Srikara. Robotics-assisted knee and hip replacements with the pioneered i-SUITE technology.' },
  { id: 11, title: 'Robotic Surgery', icon: Monitor, desc: 'The future of surgery.', image: 'https://images.unsplash.com/photo-1576091160550-2173dad99963?auto=format&fit=crop&q=80&w=800', fullDesc: 'Next-gen robotic precision for urological, gynecological, and gynecological procedures.' },
  { id: 12, title: 'Obstetrics & Gyn', icon: Baby, desc: 'Premier maternal care.', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800', fullDesc: 'High-risk pregnancy management, painless labor, and neonatal excellence.' },
  { id: 13, title: 'Plastic Surgery', icon: Smile, desc: 'Aesthetic excellence.', image: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?auto=format&fit=crop&q=80&w=800', fullDesc: 'Cosmetic and reconstructive procedures performed by elite aesthetic surgeons.' },
  { id: 14, title: 'Rheumatology', icon: ClipboardList, desc: 'Joint & autoimmune care.', image: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&q=80&w=800', fullDesc: 'Specialized management for arthritis, lupus, and complex systemic autoimmune conditions.' },
  { id: 15, title: 'Neurology', icon: Stethoscope, desc: 'Clinical neuro excellence.', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800', fullDesc: 'Comprehensive neuro-diagnostics and management of neurological disorders.' },
  { id: 16, title: 'General Surgery', icon: ShieldCheck, desc: 'Standard of precision.', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800', fullDesc: 'Laparoscopic and open surgeries for varied clinical needs.' }
];

export const LuxuryCentersOfExcellence = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedSpecialties = isExpanded ? specialties : specialties.slice(0, 5);

  return (
    <section className="pt-20 pb-0 bg-transparent overflow-hidden relative font-sans antialiased select-none">
      {/* ── HUMAN TOUCH: ARTISTIC PULSE LINE ── */}
      <div className="absolute top-1/2 left-0 w-full h-[300px] -translate-y-1/2 pointer-events-none opacity-[0.03]">
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
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-none w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-16 h-[2px] bg-gradient-to-r from-[#8B1A4A] to-transparent" />
              <span className="text-[#8B1A4A] text-[10px] font-black uppercase tracking-[0.5em] leading-none">Clinical Artistry</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-[#1A202C] tracking-tight leading-none mb-10 flex items-baseline gap-x-3 whitespace-nowrap overflow-visible">
              <span>Centers of</span>
              <span className="text-[#8B1A4A]">Excellence</span>
            </h2>

            <p className="text-[#4A4A4A] text-lg leading-relaxed font-light max-w-xl opacity-90">
              Every beat, every breath, every breakthrough. Our centers are built around the human experience, merging clinical mastery with profound empathy.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="hidden lg:flex flex-col items-center justify-center w-36 h-36 border border-[#8B1A4A]/10 rounded-full relative"
          >
            <div className="text-4xl font-serif italic text-[#8B1A4A] leading-none">16</div>
            <div className="text-[#4A4A4A] text-[9px] font-bold uppercase tracking-[0.1em] mt-2">Specialties</div>
            <div className="absolute inset-0 border-[0.5px] border-[#8B1A4A]/10 rounded-full animate-[spin_20s_linear_infinite]" />
          </motion.div>
        </div>

        {/* ── STAGGERED CREATIVE GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 px-4">
          <AnimatePresence mode='popLayout'>
            {displayedSpecialties.map((item, index) => (
              <ExpandableCard
                key={item.id}
                title={item.title}
                description={item.desc}
                src={item.image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070"}
                itemNumber={String(index + 1).padStart(2, '0')}
                icon={<item.icon size={40} strokeWidth={1} />}
              >
                <div className="py-6">
                  <h4 className="text-2xl font-bold text-[#1A202C] mb-4">The Clinical Goal</h4>
                  <p className="text-[#4A4A4A] leading-relaxed mb-8">{item.fullDesc || "Detailed journey information and clinical protocols available upon consultation."}</p>
                  <div className="flex flex-col sm:flex-row gap-6 mt-8 border-t border-black/5 pt-8">
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-[#8B1A4A] tracking-widest mb-2">Lead Specialists</p>
                      <p className="text-sm font-bold text-[#1A202C]">Global Board Members</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-[#2563EB] tracking-widest mb-2">Verified Accuracy</p>
                      <p className="text-sm font-bold text-[#1A202C]">99.8% Success Rate</p>
                    </div>
                  </div>
                </div>
              </ExpandableCard>
            ))}

            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setIsExpanded(true)}
                className="group cursor-pointer h-full min-h-[220px] rounded-[2.5rem] border border-dashed border-[#8B1A4A]/20 bg-transparent backdrop-blur-xl flex flex-col items-start justify-center gap-4 pl-12 hover:bg-[#8B1A4A]/5 hover:border-[#8B1A4A]/40 transition-all duration-700"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#8B1A4A]/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                  <div className="w-12 h-12 rounded-full bg-white border border-[#8B1A4A]/10 flex items-center justify-center text-[#8B1A4A] group-hover:bg-[#8B1A4A] group-hover:text-white transition-all duration-700 relative z-10">
                    <Plus size={20} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-700" />
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B1A4A] opacity-60 group-hover:opacity-100 transition-all">Show More</span>
                  <p className="text-[#1A202C]/40 text-[9px] mt-1 font-bold tracking-widest uppercase">Explore 11+ Departments</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SHOW LESS ACTION ── */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 flex justify-center"
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="group relative flex flex-col items-center gap-6"
            >
              <div className="w-[1px] h-10 bg-gradient-to-b from-[#8B1A4A] to-transparent mb-2 h-0 group-hover:h-10 transition-all duration-700" />
              <div className="flex items-center gap-4 text-[#8B1A4A]">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 group-hover:opacity-100 transition-opacity">Show Less</span>
                <div className="w-12 h-12 rounded-full border border-[#8B1A4A]/10 flex items-center justify-center group-hover:bg-[#8B1A4A] group-hover:text-white group-hover:border-[#8B1A4A] transition-all duration-500">
                  <div className="w-4 h-[1px] bg-red-800 bg-current transition-transform duration-700 group-hover:rotate-180" />
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </div>

      {/* ── FOOTER ACCENT ── */}
      <div className="absolute bottom-20 left-10 pointer-events-none hidden md:block">
        <div className="text-[9px] font-bold text-[#8B1A4A]/40 tracking-[1em] uppercase [writing-mode:vertical-lr]">
          Srikara Precision
        </div>
      </div>
    </section>
  );
};
