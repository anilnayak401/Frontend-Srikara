import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Shield, Heart, Phone, MessageSquare, Mail, Share2 } from 'lucide-react';
import { ALL_DOCTORS } from '@/data/doctors';

const CAROUSEL_TRANSITION = {
  type: 'spring',
  stiffness: 80, // Slower, stately motion
  damping: 20    // Well-balanced damping, no excessive bounce
};

function DoctorCard({ doctor, isActive, transitionEnabled, onClick, getHasDragged, isMobile }) {
  const navigate = useNavigate();

  const currentCardTransition = transitionEnabled ? {
    ...CAROUSEL_TRANSITION,
    width: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    height: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    padding: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    backgroundColor: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    borderColor: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    boxShadow: { type: 'tween', duration: 0.15, ease: 'easeOut' },
  } : { duration: 0 };

  const currentDetailsTransition = transitionEnabled ? {
    ...CAROUSEL_TRANSITION,
    marginTop: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    padding: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    backgroundColor: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    borderRadius: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    boxShadow: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    borderWidth: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    borderColor: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    x: { type: 'tween', duration: 0.15, ease: 'easeOut' },
    width: { type: 'tween', duration: 0.15, ease: 'easeOut' },
  } : { duration: 0 };

  const snappyTransition = transitionEnabled ? { type: 'tween', duration: 0.15, ease: 'easeOut' } : { duration: 0 };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${doctor.phone || '04068324803'}`;
  };

  const handleWhatsapp = (e) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Hi Dr. ${doctor.name}, I would like to book an appointment.`);
    window.open(`https://wa.me/${doctor.whatsapp || '914068324803'}?text=${message}`, '_blank');
  };

  const handleEmail = (e) => {
    e.stopPropagation();
    window.location.href = `mailto:info@srikarahospitals.com?subject=Appointment%20Query%20-%20Dr.%20${encodeURIComponent(doctor.name)}`;
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: doctor.name,
        text: `${doctor.name} - ${doctor.label} at Srikara Hospitals`,
        url: window.location.origin + `/book/${doctor.slug}`,
      }).catch(() => {});
    } else {
      navigate(`/book/${doctor.slug}`);
    }
  };

  const handleCardClick = (e) => {
    if (getHasDragged && getHasDragged()) {
      e.stopPropagation();
      return;
    }
    onClick();
  };

  const handleCardDoubleClick = (e) => {
    if (getHasDragged && getHasDragged()) {
      e.stopPropagation();
      return;
    }
    navigate(`/book/${doctor.slug}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onDoubleClick={handleCardDoubleClick}
      animate={{
        width: isActive ? (isMobile ? 245 : 310) : (isMobile ? 230 : 290),
        height: isActive ? (isMobile ? 330 : 415) : (isMobile ? 315 : 395),
        scale: isActive ? (isMobile ? 1.02 : 1.10) : 0.99,
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.18)',
        borderColor: isActive ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.45)',
        boxShadow: isActive 
          ? '0 0px 0px rgba(0, 0, 0, 0)' 
          : '0 8px 20px rgba(0, 0, 0, 0.015)',
        padding: isActive ? 0 : (isMobile ? 8 : 16),
      }}
      transition={currentCardTransition}
      className={`group relative rounded-[32px] border flex flex-col justify-between overflow-hidden cursor-pointer backdrop-blur-md ${isActive ? 'z-20 opacity-100' : 'z-10 opacity-95 hover:opacity-100'}`}
    >
      {/* Photo Container */}
      <motion.div 
        animate={{
          height: isActive ? (isMobile ? 230 : 310) : (isMobile ? 190 : 260),
          borderRadius: isActive ? 32 : 24
        }}
        transition={currentCardTransition}
        className="relative w-full overflow-hidden flex items-center justify-center flex-shrink-0"
      >
        {/* Backgroundless Transparent Portrait Backdrops (smooth cross-fade opacity) */}
        <div 
          className="absolute inset-0 bg-[#ECD6E0] transition-opacity duration-500 ease-in-out" 
          style={{ opacity: isActive ? 0 : 1 }} 
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#ECD6E0] to-[#DCBCCB] transition-opacity duration-500 ease-in-out" 
          style={{ opacity: isActive ? 1 : 0 }} 
        />

        <img
          src={doctor.image}
          alt={doctor.name}
          className="relative z-10 w-full h-full object-contain object-bottom transition-transform duration-700"
          onError={e => { if (doctor.fallback) e.target.src = doctor.fallback; }}
        />
      </motion.div>

      {/* Floating details overlay for active, flat printed layout for inactive */}
      <motion.div
        animate={{
          marginTop: isActive ? (isMobile ? -36 : -60) : (isMobile ? 6 : 12),
          padding: isActive ? (isMobile ? '8px 8px 10px 8px' : '14px 12px 16px 12px') : '4px 0px 0px 0px',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.42)' : 'rgba(255, 255, 255, 0)',
          borderRadius: isActive ? 20 : 0,
          boxShadow: isActive 
            ? '0 12px 25px rgba(139, 26, 74, 0.12)' 
            : 'none',
          borderWidth: isActive ? 1 : 0,
          borderColor: isActive ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
          x: isActive ? (isMobile ? 3 : 6) : 0,
          width: isActive ? 'calc(100% - 6px)' : '100%'
        }}
        transition={currentDetailsTransition}
        className={`relative z-10 flex flex-col justify-between flex-grow ${isActive ? 'backdrop-blur-md border shadow-lg' : ''}`}
      >
        <div className="w-full">
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 text-center leading-tight mb-0.5 group-hover:text-[#8B1A4A] transition-colors duration-300">
            {doctor.name}
          </h4>
          <p className="text-[#8B1A4A] text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-center mb-1 line-clamp-1">
            {doctor.specialty} • {doctor.exp}
          </p>
 
          {/* Active Card Credentials details overlay to fill vertical space gap */}
          <motion.div
            animate={{
              height: isActive && doctor.sub ? 'auto' : 0,
              opacity: isActive && doctor.sub ? 1 : 0,
              marginBottom: isActive && doctor.sub ? 2 : 0
            }}
            transition={snappyTransition}
            className="overflow-hidden w-full flex justify-center flex-shrink-0"
          >
            <p className="text-slate-400 text-[8px] sm:text-[9px] text-center italic px-1 font-semibold leading-tight">
              {doctor.sub}
            </p>
          </motion.div>
 
          {/* Active Card Tagline details overlay to fill vertical space gap */}
          <motion.div
            animate={{
              height: isActive ? 'auto' : 0,
              opacity: isActive ? 1 : 0,
              marginBottom: isActive ? (isMobile ? 4 : 12) : 0
            }}
            transition={snappyTransition}
            className="overflow-hidden w-full flex justify-center flex-shrink-0"
          >
            <p className="text-slate-600 text-[8px] sm:text-[10px] leading-relaxed text-center px-1 font-semibold">
              {doctor.tagline || doctor.about || 'Expert clinical mastery with dedicated care.'}
            </p>
          </motion.div>
        </div>

        {/* Action Button Row */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          onDoubleClick={(e) => e.stopPropagation()} 
          className="flex items-center justify-center gap-2 pt-0.5 w-full flex-shrink-0"
        >
          {/* Primary Filled Call Button */}
          <button
            onClick={handleCall}
            title="Call Doctor"
            className="w-7 h-7 rounded-full bg-[#8B1A4A] text-white flex items-center justify-center hover:bg-[#72123B] transition-all duration-300 shadow-md shadow-[#8B1A4A]/20 hover:scale-110 flex-shrink-0"
          >
            <Phone size={11} className="fill-white" />
          </button>

          {/* Secondary Outline Buttons */}
          <button
            onClick={handleWhatsapp}
            title="Chat on WhatsApp"
            className="w-7 h-7 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] hover:border-[#8B1A4A]/30 transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <MessageSquare size={11} />
          </button>

          <button
            onClick={handleEmail}
            title="Send Email"
            className="w-7 h-7 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] hover:border-[#8B1A4A]/30 transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <Mail size={11} />
          </button>

          <button
            onClick={handleShare}
            title="Share Profile"
            className="w-7 h-7 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] hover:border-[#8B1A4A]/30 transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <Share2 size={11} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const PremiumDoctorFinder = ({ branchTitle = 'ECIL', branchId = 'ECIL' }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter doctors for this specific branch
  const branchDoctors = ALL_DOCTORS.filter(doc => 
    doc.branch.toLowerCase() === branchId.toLowerCase() || 
    doc.branch.toLowerCase() === branchTitle.toLowerCase()
  );

  const N = branchDoctors.length;

  // Tripled list for infinite looping visual elements
  const tripledDoctors = [...branchDoctors, ...branchDoctors, ...branchDoctors];

  const [slideIndex, setSlideIndex] = useState(N);
  const [transition, setTransition] = useState(true);

  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Set the second card active initially if available
  useEffect(() => {
    if (N > 1) {
      setSlideIndex(N + 1);
    } else {
      setSlideIndex(N);
    }
  }, [N]);

  // Auto-advance every 4.5 seconds (paused if user is interacting/dragging)
  useEffect(() => {
    if (N === 0 || isPaused || isDragging) return;
    const timer = setInterval(() => {
      setTransition(true);
      setSlideIndex((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [N, isPaused, isDragging]);

  const handlePrev = () => {
    setTransition(true);
    setSlideIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setTransition(true);
    setSlideIndex((prev) => prev + 1);
  };

  const handleMouseDown = (e) => {
    // Only drag with left click
    if (e.button !== 0) return;
    setIsDragging(true);
    setIsPaused(true);
    dragStartRef.current = e.clientX;
    hasDraggedRef.current = false;
    setTransition(false); // disable transition while dragging so it follows mouse instantly
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - dragStartRef.current;
    setDragOffset(diff);
    if (Math.abs(diff) > 10) {
      hasDraggedRef.current = true;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    setTransition(true);
    
    if (dragOffset < -threshold) {
      // Dragged left -> show next
      handleNext();
    } else if (dragOffset > threshold) {
      // Dragged right -> show prev
      handlePrev();
    }
    
    setDragOffset(0);
    
    // Maintain hasDragged status for a brief moment to intercept card click events
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
    setIsPaused(false);
  };

  // Support mobile/touch swipe
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    dragStartRef.current = e.touches[0].clientX;
    hasDraggedRef.current = false;
    setTransition(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - dragStartRef.current;
    setDragOffset(diff);
    if (Math.abs(diff) > 10) {
      hasDraggedRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const handleCardSelect = (index) => {
    setTransition(true);
    setSlideIndex(index);
  };

  if (N === 0) return null;

  return (
    <section className="py-24 bg-[#FAF5F7] relative overflow-hidden font-sans">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FFFDFE] to-transparent pointer-events-none" />
      <div className="absolute top-40 right-[-10%] w-[40%] h-[400px] bg-[#8B1A4A]/5 rounded-full blur-[150px] pointer-events-none opacity-40" />
      <div className="absolute bottom-10 left-[-10%] w-[40%] h-[400px] bg-[#8B1A4A]/5 rounded-full blur-[150px] pointer-events-none opacity-40" />

      {/* Header — constrained */}
      <div className="max-w-[1400px] mx-auto px-8 relative z-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            {/* Doctors Badge - Completely aligned to the second image */}
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B1A4A]/80 mb-2.5 block">
              Doctors
            </span>
            
            {/* Title */}
            <h2 className="editorial-title text-3xl md:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.1] mb-4">
              <span className="block text-[#2D3A4A]">Meet Our Specialized</span>
              <span className="block text-[#8B1A4A] mt-2">Medical Team</span>
            </h2>
            <div className="w-16 h-[2px] bg-[#8B1A4A]/25 mb-6" />
          </div>

          {/* Subtitle description */}
          <div className="max-w-md md:text-right">
            <p className="text-slate-500 text-sm md:text-base font-semibold leading-relaxed">
              From General Practitioners To Top Specialists at Srikara {branchTitle}, Our Doctors Are Dedicated To Your Health.
            </p>
          </div>
        </div>
      </div>

      {/* Centered Interactive Slider viewport */}
      <div className="relative w-full overflow-hidden py-4 z-10">
        <div className="max-w-[1400px] mx-auto relative flex items-center justify-center">
          
          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            title="Previous Doctor"
            className="absolute left-2 lg:left-6 z-30 w-12 h-12 rounded-full bg-white shadow-xl border border-slate-200/50 flex items-center justify-center hover:bg-[#8B1A4A] hover:text-white transition-all text-slate-700 hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>

          <button 
            onClick={handleNext}
            title="Next Doctor"
            className="absolute right-2 lg:right-6 z-30 w-12 h-12 rounded-full bg-white shadow-xl border border-slate-200/50 flex items-center justify-center hover:bg-[#8B1A4A] hover:text-white transition-all text-slate-700 hover:scale-105 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slider viewport */}
          <div 
            className="w-full overflow-hidden py-4 px-2 flex justify-center cursor-grab active:cursor-grabbing select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div 
              className="flex gap-4 items-center flex-nowrap"
              animate={{
                x: `calc(50% - ${slideIndex * (isMobile ? 246 : 316) + (isMobile ? 115 : 150)}px + ${dragOffset}px)`
              }}
              transition={transition ? CAROUSEL_TRANSITION : { duration: 0 }}
              onAnimationComplete={() => {
                // Seamless out-of-bounds correction with transition temporarily disabled
                if (slideIndex >= 2 * N) {
                  setTransition(false);
                  setSlideIndex(slideIndex - N);
                } else if (slideIndex < N) {
                  setTransition(false);
                  setSlideIndex(slideIndex + N);
                }
              }}
            >
              {tripledDoctors.map((doctor, index) => {
                const isActive = index === slideIndex;
                return (
                  <div key={`${doctor.id}-${index}`} className={`flex-shrink-0 flex justify-center items-center ${isMobile ? 'w-[235px] h-[350px]' : 'w-[300px] h-[460px]'}`}>
                    <DoctorCard
                      doctor={doctor}
                      isActive={isActive}
                      transitionEnabled={transition}
                      onClick={() => handleCardSelect(index)}
                      getHasDragged={() => hasDraggedRef.current}
                      isMobile={isMobile}
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* View All button */}
      <div className="max-w-[1400px] mx-auto px-8 mt-10 flex justify-center relative z-10">
        <button
          onClick={() => navigate('/doctors')}
          className="group bg-[#8B1A4A] text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition-all duration-500 flex items-center gap-4 shadow-xl shadow-[#8B1A4A]/25"
        >
          View All Doctors
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer stats */}
      <div className="max-w-[1400px] mx-auto px-8 mt-16 pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8B1A4A]/5 flex items-center justify-center">
              <Shield size={20} className="text-[#8B1A4A]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Standard</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified Credentials</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8B1A4A]/5 flex items-center justify-center">
              <Heart size={20} className="text-[#8B1A4A]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Outcome</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">99.8% Success Rate</p>
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.6em]">SRIKARA {branchTitle.toUpperCase()} • CLINICAL REGISTRY FY24</p>
      </div>
    </section>
  );
};
