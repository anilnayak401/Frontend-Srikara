import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, X, Sparkles, Star, Calendar, User, Phone } from 'lucide-react';
import { ALL_DOCTORS } from '@/data/doctors';
import { assetUrl } from '@/lib/assetUrl';

export function DoctorsGroupBanner({ branchName }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);

  const normalize = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

  // Filter doctors for this specific branch if branchName is provided
  const filteredDoctors = branchName
    ? ALL_DOCTORS.filter(d => normalize(d.branch) === normalize(branchName))
    : ALL_DOCTORS;

  // Show all branch-specific doctors (including those with placeholder portraits)
  const doctorsWithImages = filteredDoctors;

  // If no doctors exist in this branch list, do not render the banner
  if (doctorsWithImages.length === 0) {
    return null;
  }

  // Find Dr. Akhil Dadi or fallback to the first doctor in the branch list
  const akhilDadi = doctorsWithImages.find(d => d.slug === 'akhil-dadi' || d.slug === 'dr-akhil-dadi') || doctorsWithImages[0];
  
  // Always find Dr. Akhil Dadi globally from ALL_DOCTORS for the main highlight
  const globalAkhilDadi = ALL_DOCTORS.find(d => d.slug === 'akhil-dadi' || d.slug === 'dr-akhil-dadi') || akhilDadi;
  
  // Others list (excluding Dr. Akhil Dadi to show him as main highlight, but he will be first in the full team list)
  const otherDoctors = akhilDadi ? doctorsWithImages.filter(d => d.id !== akhilDadi.id) : [];
  const fullTeam = akhilDadi ? [akhilDadi, ...otherDoctors] : [];

  // Drag handler to detect swipe up
  const handleDragEnd = (event, info) => {
    if (info.offset.y < -50) {
      setIsExpanded(true);
    }
  };

  const handleCall = (e, doctor) => {
    e.stopPropagation();
    window.location.href = `tel:${doctor.phone || '04068324803'}`;
  };

  return (
    <section className="pt-20 pb-20 bg-transparent overflow-hidden relative font-sans antialiased select-none">
      {/* Pulse line backdrop */}
      <div className="absolute top-1/2 left-0 w-full h-[300px] -translate-y-1/2 pointer-events-none opacity-[0.02] z-0">
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
        
        {/* Header (Animates out/compacts in expanded mode) */}
        <motion.div 
          animate={{ height: isExpanded ? 0 : 'auto', opacity: isExpanded ? 0 : 1, marginBottom: isExpanded ? 0 : 40 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-[#8B1A4A] to-transparent" />
            <span className="text-[#8B1A4A] text-[10px] font-black uppercase tracking-[0.5em] leading-none">Clinical Artistry</span>
          </div>

          <h2 className="editorial-title text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6">
            <span className="text-[#2D3A4A]">Meet Our </span>
            <span className="text-[#8B1A4A]">Medical Team</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#8B1A4A]/25 mb-8" />
          <p className="text-[#4A4A4A] text-lg leading-relaxed font-light opacity-90 max-w-2xl">
            A collaborative team of senior consultants, robotic surgeons, and dedicated healthcare professionals working in synergy to provide top-tier clinical outcomes.
          </p>
        </motion.div>

        {/* Outer Banner Wrapper */}
        <div ref={containerRef} className="relative w-full min-h-[500px]">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              /* ================== COLLAPSED STATE (DR. AKHIL DADI MAIN FOCUS) ================== */
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={handleDragEnd}
                className="relative w-full min-h-[500px] rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_20px_50px_rgba(139,26,74,0.05)] p-8 lg:p-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 cursor-grab active:cursor-grabbing"
              >
                {/* Visual Glare Ring */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B1A4A]/5 rounded-full blur-[120px] -mr-80 -mt-80 pointer-events-none" />

                {/* Left side details */}
                <div className="flex-1 text-[#2D3A4A] relative z-10 max-w-xl">
                  <div className="flex items-center gap-2.5 mb-4 text-[#8B1A4A]">
                    <Sparkles size={16} className="text-[#8B1A4A] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B1A4A]">Founder, Chairman & Chief Joint Replacement Surgeon</span>
                  </div>

                  <h3 className="font-garamond text-5xl sm:text-6xl font-bold leading-tight mb-6 text-[#2D3A4A]">
                    {globalAkhilDadi.name}
                  </h3>

                  <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed mb-8">
                    {globalAkhilDadi.about || 'A visionary in robotic arthroplasty, Dr. Akhil Dadi brings world-class German fellowship expertise to Srikara Hospitals, leading the team with over 15+ years of clinical mastery.'}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="bg-[#8B1A4A]/5 backdrop-blur-md border border-[#8B1A4A]/10 rounded-2xl px-5 py-3 text-center">
                      <span className="block text-2xl font-black text-[#2D3A4A] leading-none mb-1">15+ Yrs</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Experience</span>
                    </div>
                    <div className="bg-[#8B1A4A]/5 backdrop-blur-md border border-[#8B1A4A]/10 rounded-2xl px-5 py-3 text-center">
                      <span className="block text-2xl font-black text-[#8B1A4A] leading-none mb-1">5.0</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Rating ★</span>
                    </div>
                    <div className="bg-[#8B1A4A]/5 backdrop-blur-md border border-[#8B1A4A]/10 rounded-2xl px-5 py-3 text-center">
                      <span className="block text-2xl font-black text-[#2D3A4A] leading-none mb-1">{globalAkhilDadi.branch}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Branch</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/doctors/${globalAkhilDadi.slug}`)}
                      className="bg-[#8B1A4A] hover:bg-[#72123B] text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-lg shadow-[#8B1A4A]/25"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate(`/book/${globalAkhilDadi.slug}`)}
                      className="border border-slate-300 hover:border-[#8B1A4A] hover:bg-[#8B1A4A]/5 text-[#2D3A4A] hover:text-[#8B1A4A] bg-white px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>

                {/* Right side Image Container */}
                <div className="relative w-full lg:w-[420px] aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#8B1A4A]/10 bg-gradient-to-tr from-[#8B1A4A]/10 to-[#8B1A4A]/5 flex items-end justify-center self-end">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8B1A4A]/10 via-transparent to-transparent z-10 pointer-events-none" />
                  <img
                    src={globalAkhilDadi.image}
                    alt={globalAkhilDadi.name}
                    className="w-auto h-[90%] object-contain object-bottom relative z-0 pointer-events-none"
                    onError={e => { e.target.src = globalAkhilDadi.fallback; }}
                  />
                </div>

                {/* Swipe Up/Interact Guide */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 group pointer-events-none select-none z-20">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    <ArrowUp size={16} className="text-[#8B1A4A] group-hover:text-[#8B1A4A]/80" />
                  </motion.div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
                    className="pointer-events-auto text-[10px] font-black uppercase tracking-[0.3em] text-[#2D3A4A] hover:text-[#8B1A4A] transition-colors duration-300 cursor-pointer"
                  >
                    Swipe Up or Click to Explore Team
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ================== EXPANDED STATE (ALL DOCTORS WITH IMAGES) ================== */
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-[#FAF5F7] border border-slate-200/60 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden"
              >
                {/* Header within expanded panel */}
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200/60">
                  <div>
                    <h3 className="text-2xl font-black text-[#2D3A4A] tracking-tight">Srikara Specialists</h3>
                    <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">{fullTeam.length} Elite Doctors with Verified Portraits</p>
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-12 h-12 rounded-full bg-[#8B1A4A] text-white hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Responsive Staggered Grid */}
                <motion.div 
                  variants={{
                    show: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                >
                  {fullTeam.map((doctor, index) => (
                    <motion.div
                      key={doctor.id}
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 22 } }
                      }}
                      className="group bg-white rounded-3xl border border-slate-100 hover:border-[#8B1A4A]/20 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
                      {/* Doctor Image Header */}
                      <div className="relative aspect-[4/4.5] overflow-hidden bg-slate-50 flex items-end justify-center">
                        <div className="absolute inset-0 bg-[#ECD6E0] opacity-40 group-hover:scale-105 transition-transform duration-700" />
                        <img 
                          src={doctor.image} 
                          alt={doctor.name}
                          className="w-auto h-[92%] object-contain object-bottom relative z-10 transition-transform duration-500 group-hover:scale-[1.03]"
                          onError={e => { e.target.src = doctor.fallback; }}
                        />
                        <span className="absolute top-3 left-3 bg-[#8B1A4A]/10 text-[#8B1A4A] text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full z-20">
                          {doctor.specialty}
                        </span>
                      </div>

                      {/* Doctor Info Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="mb-4">
                          <h4 className="font-headline font-black text-sm text-slate-800 line-clamp-1 group-hover:text-[#8B1A4A] transition-colors">
                            {doctor.name}
                          </h4>
                          <p className="text-slate-400 text-[10px] font-bold tracking-wide mt-1 truncate">
                            {doctor.label || doctor.sub}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="flex items-center gap-1 text-[#8B1A4A] font-extrabold text-[10px] uppercase tracking-wider">
                              <Star size={11} fill="#8B1A4A" className="relative -top-px" /> {doctor.rating || '5.0'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              {doctor.exp}
                            </span>
                          </div>
                        </div>

                        {/* Tactical Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => navigate(`/doctors/${doctor.slug}`)}
                            title="View Profile"
                            className="flex-1 py-2 px-3 rounded-xl bg-[#8B1A4A] hover:bg-[#72123B] text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#8B1A4A]/20"
                          >
                            <User size={12} />
                            Profile
                          </button>
                          <button
                            onClick={(e) => handleCall(e, doctor)}
                            title="Call Now"
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] hover:border-[#8B1A4A]/30 transition-all flex items-center justify-center"
                          >
                            <Phone size={12} />
                          </button>
                          <button
                            onClick={() => navigate(`/book/${doctor.slug}`)}
                            title="Book Appointment"
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] hover:border-[#8B1A4A]/30 transition-all flex items-center justify-center"
                          >
                            <Calendar size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
