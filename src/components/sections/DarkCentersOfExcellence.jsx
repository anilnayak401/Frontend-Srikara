import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Heart, Brain, Bone, Zap, Droplets, ShieldCheck, Flame, Microscope, Monitor, Baby, ClipboardList, Pipette, Plus } from 'lucide-react';
import { ParallaxCard } from '@/components/ui/parallax-card';

const specialties = [
  {
    id: 1, tag: 'DEPARTMENT OF CARDIOLOGY', title: 'Cardiovascular Care', icon: Heart, color: '#ef4444',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Advanced interventional cardiology, non-invasive imaging, and cardiac rehabilitation with globally-verified protocols.',
  },
  {
    id: 2, tag: 'BRAIN & SPINE CENTER', title: 'Neurological Excellence', icon: Brain, color: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Leading neuro-interventional procedures and complex neurosurgeries with 3D navigation for stroke, epilepsy, and spine care.',
  },
  {
    id: 3, tag: 'ADVANCED ROBOTICS UNIT', title: 'Precision Surgery', icon: Monitor, color: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Next-generation robotic surgical systems enabling sub-millimeter precision for orthopaedic, urological, and oncological procedures.',
  },
  {
    id: 4, tag: 'JOINT REPLACEMENT CENTER', title: 'Orthopaedic Mastery', icon: Bone, color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'NAVIO robotic-assisted knee and hip replacements with the pioneered i-SUITE technology for lasting mobility.',
  },
  {
    id: 5, tag: 'ONCOLOGY INSTITUTE', title: 'Cancer Care', icon: ShieldCheck, color: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Holistic cancer treatments combining radiation, chemotherapy, and surgical oncology with multidisciplinary tumor board support.',
  },
  {
    id: 6, tag: 'EMERGENCY MEDICINE', title: 'Trauma Response', icon: Flame, color: '#ef4444',
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Level-1 trauma response 24/7 with high-tech ambulances and immediate intervention capabilities.',
  },
  {
    id: 7, tag: 'RENAL SCIENCES', title: 'Nephrology', icon: Droplets, color: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Comprehensive renal care including 24/7 dialysis, kidney transplantation, and chronic kidney disease management.',
  },
  {
    id: 8, tag: 'DIGESTIVE HEALTH', title: 'Gastroenterology', icon: Pipette, color: '#10b981',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Advanced therapeutic endoscopy for liver diseases, GI cancers, and pancreatic conditions.',
  },
  {
    id: 9, tag: 'MATERNAL & CHILD HEALTH', title: 'Obstetrics & Gynecology', icon: Baby, color: '#ec4899',
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'High-risk pregnancy management, painless labor, and neonatal excellence with advanced NICU.',
  },
  {
    id: 10, tag: 'UROLOGY CENTER', title: 'Urological Care', icon: Zap, color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Laser surgeries for kidney stones and precision prostate management using robotic aids.',
  },
  {
    id: 11, tag: 'TRANSPLANT UNIT', title: 'Organ Transplantation', icon: Microscope, color: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Multi-organ transplant facility with dedicated clean-rooms and specialized post-transplant ICU.',
  },
  {
    id: 12, tag: 'AUTOIMMUNE CLINIC', title: 'Rheumatology', icon: ClipboardList, color: '#10b981',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=90&w=800',
    fullDesc: 'Specialized management for arthritis, lupus, and complex systemic autoimmune conditions.',
  },
];

function SpecialtyModal({ item, onClose }) {
  const Icon = item.icon;
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      />
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          onClick={e => e.stopPropagation()}
          style={{ pointerEvents: 'auto' }}
          className="w-full max-w-[760px] max-h-[85vh] flex flex-col rounded-3xl bg-white overflow-hidden shadow-2xl border border-[#E2E8F0]"
        >
          <div className="relative h-64 flex-shrink-0">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/10 border border-black/10 flex items-center justify-center text-[#1A202C] hover:bg-black/20 transition-all">
              <X size={18} />
            </button>
            <div className="absolute bottom-5 left-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4A4A4A]/50 block mb-1">{item.tag}</span>
              <h3 className="text-3xl font-bold text-[#1A202C]">{item.title}</h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <p className="text-[#4A4A4A] text-base leading-relaxed mb-8">{item.fullDesc}</p>
            <div className="flex gap-4 border-t border-[#EDF2F7] pt-8">
              <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0]">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#4A4A4A]/40 mb-2">Lead Specialists</p>
                <p className="text-[#1A202C] font-bold text-sm">Global Board Members</p>
              </div>
              <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0]">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#4A4A4A]/40 mb-2">Success Rate</p>
                <p className="text-[#1A202C] font-bold text-sm">99.8% Verified</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

function SpecialtyCard({ item }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <>
      {open && <SpecialtyModal item={item} onClose={() => setOpen(false)} />}

      <ParallaxCard intensity={8} className="cursor-pointer rounded-2xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => setOpen(true)}
          className="group relative aspect-[4/3] bg-[#e8f0f8] rounded-2xl overflow-hidden"
        >
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'; }}
          />

          {/* Dark label bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#2D3A4A]/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
            <h3 className="text-white text-sm font-semibold leading-tight">{item.title}</h3>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ml-2"
              style={{ background: item.color + '30', border: `1px solid ${item.color}60` }}
            >
              <Icon size={14} style={{ color: item.color }} />
            </div>
          </div>
        </motion.div>
      </ParallaxCard>
    </>
  );
}

export function DarkCentersOfExcellence() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? specialties : specialties.slice(0, 5);

  return (
    <section className="py-20 bg-transparent font-sans">
      <div className="max-w-[1400px] mx-auto px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[#8B1A4A]" />
              <span className="text-[#8B1A4A] text-[10px] font-black uppercase tracking-[0.5em]">Clinical Artistry</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-[#1A202C] tracking-tight leading-none font-serif">
              Centers of <span className="text-[#8B1A4A] italic">Excellence</span>
            </h2>
            <p className="text-[#4A4A4A]/60 text-lg mt-5 font-light max-w-xl">
              Every beat, every breath, every breakthrough — built around the human experience.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 border border-[#E2E8F0] rounded-full">
            <span className="text-4xl font-serif italic text-[#8B1A4A]">16</span>
            <span className="text-[#4A4A4A]/40 text-[9px] font-bold uppercase tracking-widest mt-1">Specialties</span>
          </div>
        </div>

        {/* Grid — 3 columns landscape cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(item => (
            <SpecialtyCard key={item.id} item={item} />
          ))}

          {/* Show more tile */}
          {!expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onClick={() => setExpanded(true)}
              className="group cursor-pointer rounded-2xl aspect-[4/3] border-2 border-dashed border-[#8B1A4A]/20 bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 hover:border-[#8B1A4A]/60 hover:bg-[#8B1A4A]/5 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-full border-2 border-[#8B1A4A]/30 flex items-center justify-center text-[#8B1A4A] group-hover:bg-[#8B1A4A] group-hover:text-white group-hover:border-[#8B1A4A] transition-all duration-500">
                <Plus size={22} />
              </div>
              <div className="text-center px-4">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#8B1A4A]">Show More</p>
                <p className="text-[#4A4A4A]/40 text-[10px] mt-1.5 font-medium">+{specialties.length - 5} Departments</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Show less */}
        {expanded && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setExpanded(false)}
              className="text-[#4A4A4A]/40 text-[10px] font-black uppercase tracking-[0.5em] hover:text-[#1A202C] transition-colors border border-[#E2E8F0] px-8 py-3 rounded-full hover:border-[#1A202C]/30"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
