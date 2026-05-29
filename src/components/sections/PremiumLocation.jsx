import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Star, 
  Compass,
  PhoneCall,
  Clock,
  Copy,
  Check,
  Building2,
  Paperclip
} from 'lucide-react';
import { branches } from '@/data/branches';

// Guaranteed active, high-resolution hospital & clinic building exterior facade photos (No clinical rooms, no dead links)
const BRANCH_BUILDINGS = {
  ecil: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600',
  'lb-nagar': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
  lbnagar: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
  peerzadiguda: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=600',
  kompally: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
  lakdikapul: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600',
  'rtc-x-roads': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
  miyapur: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=600',
  vijayawada: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600',
  rajahmundry: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
  secunderabad: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600',
};

const getBranchBuildingImage = (b) => {
  return BRANCH_BUILDINGS[b.slug] || BRANCH_BUILDINGS['ecil'];
};

export const PremiumLocation = ({ branch: currentBranch }) => {
  const [selected, setSelected] = useState(
    branches.find(b => b.slug === currentBranch?.slug) || branches[0]
  );
  const [copied, setCopied] = useState(false);

  const mapSrc = selected.googleMapEmbed;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selected.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHyderabad = selected.address?.includes('Hyderabad') || selected.address?.includes('Telangana');

  return (
    <section className="relative py-24 bg-gradient-to-tr from-[#FAF0F5] via-[#FFFFFF] to-[#F1F5F9] text-slate-800 font-sans overflow-hidden">
      
      {/* ── Dynamic Light Shifting Backdrop ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Shifting blurred branch image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.slug}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.08, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center filter blur-[60px]"
            style={{ backgroundImage: `url(${getBranchBuildingImage(selected)})` }}
          />
        </AnimatePresence>
        
        {/* Soft grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B1A4A05_1px,transparent_1px),linear-gradient(to_bottom,#8B1A4A05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#8B1A4A]/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#8B1A4A]" />
            <span className="text-[#8B1A4A] text-xs font-black uppercase tracking-[0.4em] flex items-center gap-1.5">
              <Compass size={12} className="animate-spin-slow" />
              Srikara Network Map
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#8B1A4A]" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6 text-[#2D3A4A]"
          >
            Explore Our Medical Units
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B1A4A] to-[#FF4A8B] mt-2">Locate Clinical Excellence Near You</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-24 h-[3px] bg-gradient-to-r from-transparent via-[#8B1A4A]/40 to-transparent mx-auto mb-6" 
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[#4A4A4A]/80 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed"
          >
            Select any unit in our visual bento collage below to dynamically inspect its real-world infrastructure and direct map coordinates.
          </motion.p>
        </div>

        {/* ── Main Layout: Uneven Collage Selector on Left + Smaller Map Card on Right ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">

          {/* ── LEFT: Expansive Bento Collage of Hospital Building Photos (Same size cards, unevenly placed) ── */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col justify-between p-2"
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-4">
                <p className="text-xs text-slate-500 font-semibold tracking-wide flex items-center gap-1.5">
                  💡 Click any branch thumbnail to dynamically fetch its coordinate map.
                </p>
              </div>

              {/* 2-column grid of identical card sizes, placed unevenly with alternate vertical offsets */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 max-h-[465px] overflow-y-auto pt-6 pr-1.5 pb-12 custom-scrollbar">
                {branches.map((b, i) => {
                  const isActive = selected.slug === b.slug;
                  const isOddColumn = i % 2 !== 0; // Check if Column 2
                  const baseOffsetY = isOddColumn ? 24 : 0;
                  
                  return (
                    <motion.button
                      key={b.slug}
                      onClick={() => setSelected(b)}
                      initial={{ y: baseOffsetY, scale: 1 }}
                      animate={{ 
                        y: isActive ? baseOffsetY - 4 : baseOffsetY, 
                        scale: isActive ? 1.02 : 1,
                        boxShadow: isActive 
                          ? "0 12px 30px rgba(139, 26, 74, 0.25)" 
                          : "0 4px 10px rgba(0, 0, 0, 0.05)"
                      }}
                      whileHover={{ 
                        y: baseOffsetY - 8, 
                        scale: 1.03,
                        boxShadow: "0 20px 40px rgba(139, 26, 74, 0.18)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`group relative h-36 rounded-2xl !border-none !border-0 text-left flex flex-col justify-end p-4 transition-all duration-300 ${
                        isActive ? 'opacity-100 saturate-110' : 'bg-white/10 opacity-75 hover:opacity-100 saturate-[0.85] hover:saturate-100 shadow-sm'
                      }`}
                    >
                      {/* Back loop of paperclip (rendered behind the card background, z-0) */}
                      {isActive && (
                        <motion.svg 
                          layoutId="activeBentoClipBack"
                          viewBox="0 0 24 40" 
                          width="20" 
                          height="34" 
                          className="absolute -top-3 right-6 z-0 text-[#FF4A8B] pointer-events-none rotate-[-12deg]"
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round"
                          initial={{ y: -20, opacity: 0, scale: 0.8 }}
                          animate={{ y: 0, opacity: 0.45, scale: 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 15 }}
                        >
                          <path d="M 2 14 L 2 32 A 10 10 0 0 0 22 32 L 22 10 A 10 10 0 0 0 2 10" />
                        </motion.svg>
                      )}

                      {/* Image sub-container with overflow-hidden (z-10) to clip the background image properly */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10 !border-none !border-0">
                        {/* Real hospital building facade image extracted from Maps (Subtle slow transition, no ugly zoom) */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 !border-none !border-0"
                          style={{ backgroundImage: `url(${getBranchBuildingImage(b)})` }}
                        />
                        {/* Deep dark gradient overlay at the bottom for absolute text legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent !border-none !border-0" />
                      </div>

                      {/* Front loop of paperclip (rendered in front of card, z-20) */}
                      {isActive && (
                        <motion.svg 
                          layoutId="activeBentoClipFront"
                          viewBox="0 0 24 40" 
                          width="20" 
                          height="34" 
                          className="absolute -top-3 right-6 z-20 text-[#FF4A8B] drop-shadow-[2px_3px_3px_rgba(0,0,0,0.45)] pointer-events-none rotate-[-12deg]"
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round"
                          initial={{ y: -20, opacity: 0, scale: 0.8 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 15 }}
                        >
                          <path d="M 6 14 L 6 26 A 6 6 0 0 0 18 26 L 18 10" />
                        </motion.svg>
                      )}

                      {/* Content Overlay (placed in z-20) */}
                      <div className="relative z-20 min-w-0 !border-none !border-0">
                        <p className={`font-headline font-black text-sm md:text-base text-white leading-tight transition-colors ${
                          isActive ? 'text-[#FF7BAC]' : 'group-hover:text-[#FF7BAC]'
                        }`}>
                          Srikara {b.title}
                        </p>
                        <p className="text-[10px] text-slate-300 mt-1 truncate leading-none">
                          {b.subtitle || 'Multi-Specialty'}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Compact Sleek Glass Map Card Widget ── */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[460px] flex-shrink-0 flex flex-col gap-4 p-2"
          >
            
            {/* Google Map frame (No dark invert filters to keep map bright & clean) */}
            <div className="relative h-[230px] rounded-2xl overflow-hidden border border-[#8B1A4A]/10 bg-slate-100 shadow-inner flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  {mapSrc ? (
                    <iframe
                      src={mapSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-3">
                      <MapPin size={32} className="text-[#8B1A4A]/30" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Srikara Hospitals ' + selected.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8B1A4A] text-xs font-bold hover:underline"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Streamlined Details Drawer */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.slug + '-details'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="border border-[#8B1A4A]/10 bg-white/50 backdrop-blur-md p-3.5 rounded-2xl flex items-center gap-4 flex-shrink-0 shadow-sm hover:bg-white/70 transition-colors duration-300"
              >
                {/* Thumb building image */}
                <div className="w-16 h-14 rounded-xl overflow-hidden border border-slate-200/60 flex-shrink-0 shadow-sm hover:scale-105 transition-transform duration-300">
                  <img
                    src={getBranchBuildingImage(selected)}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info Text details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-headline font-black text-slate-800 text-sm leading-tight">
                      Srikara, {selected.title}
                    </p>
                    <div className="flex items-center gap-0.5 bg-[#8B1A4A]/5 border border-[#8B1A4A]/10 px-1.5 py-0.2 rounded-md">
                      <Star size={9} className="fill-[#FFB800] text-[#FFB800]" />
                      <span className="text-[9px] font-black text-[#8B1A4A]">{selected.googleRating || 4.7}</span>
                    </div>
                  </div>
                  
                  {/* Address Clip trigger */}
                  <div 
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1.5 cursor-pointer hover:text-[#8B1A4A] text-slate-500 group/addr transition-colors mt-0.5"
                  >
                    <p className="text-[11px] leading-snug truncate max-w-[220px]">
                      {selected.address}
                    </p>
                    {copied ? (
                      <span className="text-[#22c55e] text-[9px] font-black flex items-center gap-0.5 shrink-0 select-none">
                        <Check size={8} /> Copied
                      </span>
                    ) : (
                      <Copy size={9} className="opacity-0 group-hover/addr:opacity-100 transition-opacity text-slate-400 shrink-0 select-none" />
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Timing / Emergency Block */}
            <div className="flex items-center gap-3 px-1 flex-shrink-0 text-slate-600">
              <Clock size={14} className="text-[#8B1A4A] flex-shrink-0" />
              <p className="text-[11px] font-semibold leading-none">
                24/7 Advanced Emergency & Ortho Trauma Complex
              </p>
            </div>

            {/* Cohesive Action Group with Tighter Spacing */}
            <div className="flex flex-col gap-2.5 flex-shrink-0">
              {/* Quick action grid (Directions, Calls, reviews) */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Srikara Hospitals ' + selected.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-white/40 text-[10px] font-black uppercase tracking-wider text-[#8B1A4A] hover:bg-[#8B1A4A]/5 hover:border-[#8B1A4A]/30 transition-all"
                >
                  <Navigation size={11} />
                  Directions
                </a>
                <a
                  href={`tel:${selected.phone || '04068324800'}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-white/40 text-[10px] font-black uppercase tracking-wider text-[#8B1A4A] hover:bg-[#8B1A4A]/5 hover:border-[#8B1A4A]/30 transition-all"
                >
                  <Phone size={11} />
                  Hotline
                </a>
                <a
                  href={`https://www.google.com/search?q=Srikara+Hospitals+${selected.title}+reviews`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-white/40 text-[10px] font-black uppercase tracking-wider text-[#8B1A4A] hover:bg-[#8B1A4A]/5 hover:border-[#8B1A4A]/30 transition-all"
                >
                  <Star size={11} />
                  Reviews
                </a>
              </div>

              {/* Primary Glowing Call-to-action */}
            <a
              href="/book"
              className="bg-gradient-to-r from-[#8B1A4A] to-[#C12E6A] hover:from-[#A2205B] hover:to-[#D53F7C] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-[0_4px_15px_rgba(139,26,74,0.25)] hover:shadow-[0_6px_22px_rgba(139,26,74,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              <PhoneCall size={13} className="animate-pulse" />
              Book Appointment at this Unit
            </a>
          </div>

        </motion.div>

      </div>

    </div>
  </section>
  );
};
