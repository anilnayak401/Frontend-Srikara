import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Navigation, Star, MessageSquare } from 'lucide-react';
import { branches } from '@/data/branches';

export const PremiumLocation = ({ branch: currentBranch }) => {
  const [selected, setSelected] = useState(
    branches.find(b => b.slug === currentBranch?.slug) || branches[0]
  );

  const mapSrc = selected.googleMapEmbed || currentBranch?.googleMapEmbed;

  return (
    <section className="py-24 bg-[#F8FAFC] font-sans">
      <div className="max-w-[1400px] mx-auto px-8">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-10 h-[1px] bg-[#8B1A4A]" />
            <span className="text-[#8B1A4A] text-[11px] font-black uppercase tracking-[0.6em]">Our Locations</span>
            <div className="w-10 h-[1px] bg-[#8B1A4A]" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-[#1A202C] font-serif tracking-tight">
            Find Us <span className="italic text-[#8B1A4A]">Near You.</span>
          </h2>
          <p className="text-[#4A4A4A]/60 text-base mt-4 font-light max-w-lg mx-auto">
            9 strategic centers across Hyderabad and Andhra Pradesh — always within reach.
          </p>
        </div>

        {/* ── Main layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT — branch selector */}
          <div className="lg:w-[380px] flex-shrink-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#0D1B2A] px-6 py-4">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">Our Locations</p>
              <p className="text-white font-bold text-lg mt-0.5">Select a Branch</p>
            </div>

            {/* Branch list */}
            <div className="divide-y divide-[#F1F5F9]">
              {branches.map((b) => {
                const isHyderabad = b.address?.includes('Hyderabad') || b.address?.includes('Telangana');
                const isActive = selected.slug === b.slug;
                return (
                  <button
                    key={b.slug}
                    onClick={() => setSelected(b)}
                    className={`group w-full text-left px-5 py-4 flex items-center gap-4 transition-all duration-200 ${
                      isActive
                        ? 'bg-[#8B1A4A] text-white'
                        : 'hover:bg-[#F8FAFC] text-[#2D3A4A]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black transition-all ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#8B1A4A]/10 text-[#8B1A4A]'
                    }`}>
                      {b.title.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm leading-tight ${isActive ? 'text-white' : 'text-[#1A202C]'}`}>
                        Srikara Hospitals, {b.title}
                      </p>
                      <p className={`text-[11px] mt-0.5 truncate ${isActive ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                        {isHyderabad ? 'Hyderabad, Telangana' : b.address?.split(',').slice(-2).join(',').trim()}
                      </p>
                    </div>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-white flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — map + address */}
          <div className="flex-1 min-w-0 flex flex-col gap-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden mt-8">

            {/* Map */}
            <div className="relative h-[340px]">
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
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Srikara Hospitals ' + selected.title + ' Hyderabad')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full bg-[#F1F5F9] flex flex-col items-center justify-center gap-3 hover:bg-[#EDF2F7] transition-colors"
                    >
                      <MapPin size={40} className="text-[#8B1A4A]/40" />
                      <span className="text-[#8B1A4A] text-sm font-bold">Open in Google Maps →</span>
                    </a>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Address bar */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.slug + '-bar'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="border-t border-[#E2E8F0] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5"
              >
                {/* Thumbnail */}
                <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-[#E2E8F0]">
                  <img
                    src={selected.heroImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200'}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name + address */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1A202C] text-base leading-tight mb-1">
                    Srikara Hospitals, {selected.title}
                    {(selected.address?.includes('Hyderabad') || selected.address?.includes('Telangana')) && ', Hyderabad'}
                  </p>
                  <p className="text-[#4A4A4A]/60 text-sm">{selected.address}</p>
                </div>

                {/* Action links */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 flex-shrink-0">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Srikara Hospitals ' + selected.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#8B1A4A] text-xs font-bold hover:underline whitespace-nowrap"
                  >
                    <Navigation size={13} /> Get Directions
                  </a>
                  <a
                    href={`tel:${selected.phone || '04068324800'}`}
                    className="flex items-center gap-1.5 text-[#8B1A4A] text-xs font-bold hover:underline whitespace-nowrap"
                  >
                    <Phone size={13} /> {selected.phone || '040-68324800'}
                  </a>
                  <button className="flex items-center gap-1.5 text-[#8B1A4A] text-xs font-bold hover:underline whitespace-nowrap">
                    <MessageSquare size={13} /> Enquire Now
                  </button>
                  <a
                    href={`https://www.google.com/search?q=Srikara+Hospitals+${selected.title}+reviews`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#8B1A4A] text-xs font-bold hover:underline whitespace-nowrap"
                  >
                    <Star size={13} /> Google Reviews
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
