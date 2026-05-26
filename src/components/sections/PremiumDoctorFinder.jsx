import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronRight, Shield, Heart, Calendar } from 'lucide-react';
import { ImageAutoSlider } from '@/components/ui/image-auto-slider';
import { ALL_DOCTORS, ACCENT_MAP } from '@/data/doctors';

const specialtyIcons = {
  ortho: '🦴',
  neuro: '🧠',
  cardio: '❤️',
  spine: '🧘',
  gyn: '🤰',
  urology: '🚽',
  ent: '👂',
  general: '🔬',
  physician: '🩺',
  critical: '🏥',
  dermo: '✨',
  dental: '🦷',
  psych: '🧠',
  anesthesia: '💉',
  physio: '🏃',
  nephro: '🧼',
  plastic: '🎨',
  radio: '☢️',
};

function DoctorCard({ doctor, onBook }) {
  const navigate = useNavigate();
  const icon = specialtyIcons[doctor.specialtyId] || '🩺';
  
  return (
    <div className="group w-[280px] bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] hover:border-[#8B1A4A]/40 hover:shadow-[0_20px_60px_rgba(139,26,74,0.12)] transition-all duration-500">
      {/* Photo */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={e => { if (doctor.fallback) e.target.src = doctor.fallback; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A202C]/70 via-transparent to-transparent" />

        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#8B1A4A] text-white px-3 py-1.5 rounded-full shadow-lg">
          <Star size={11} className="fill-white" />
          <span className="text-xs font-bold">{doctor.rating || '4.9'}</span>
        </div>

        {/* Department tag */}
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
            {icon} {doctor.specialty}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h4 className="text-lg font-bold text-[#1A202C] leading-tight mb-1">{doctor.name}</h4>
        <p className="text-[#8B1A4A] text-[11px] font-bold uppercase tracking-wider mb-3 line-clamp-1">{doctor.label}</p>
        <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4 line-clamp-2">{doctor.about || doctor.description || 'Expert medical care.'}</p>

        <div className="flex items-center justify-between pt-3 border-t border-[#EDF2F7]">
          <span className="text-[11px] text-[#4A4A4A]/50 font-medium">{doctor.exp}</span>
          <button
            onClick={() => navigate(`/book/${doctor.slug}`)}
            className="flex items-center gap-1.5 text-[#8B1A4A] text-[11px] font-bold uppercase tracking-wider hover:gap-2.5 transition-all"
          >
            <Calendar size={13} /> Book
          </button>
        </div>
      </div>
    </div>
  );
}

export const PremiumDoctorFinder = ({ branchTitle = 'ECIL', branchId = 'ECIL' }) => {
  const navigate = useNavigate();

  // Filter doctors for this specific branch
  const branchDoctors = ALL_DOCTORS.filter(doc => 
    doc.branch.toLowerCase() === branchId.toLowerCase() || 
    doc.branch.toLowerCase() === branchTitle.toLowerCase()
  );

  if (branchDoctors.length === 0) return null;

  return (
    <section className="py-20 bg-white relative overflow-hidden font-sans">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#F8FAFC] to-transparent pointer-events-none" />
      <div className="absolute top-40 right-[-10%] w-[40%] h-[400px] bg-[#8B1A4A]/5 rounded-full blur-[150px] pointer-events-none opacity-40" />

      {/* Header — constrained */}
      <div className="max-w-[1400px] mx-auto px-8 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-[1px] bg-[#8B1A4A]" />
          <span className="text-[#8B1A4A] text-[11px] font-black uppercase tracking-[0.5em]">Global Clinical Registry</span>
        </motion.div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1A202C] tracking-tight leading-[1.1] mb-8 font-serif">
          Clinical Mastery.
          <br />
          <span className="text-[#8B1A4A]/60">Dedicated Specialist Care.</span>
        </h2>
        <p className="text-[#4A4A4A]/60 text-xl font-light leading-relaxed max-w-2xl">
          Meet the board-certified specialists at{' '}
          <span className="font-bold text-[#1A202C]">Srikara {branchTitle}</span>. Pioneers in precision medicine and compassionate human care.
        </p>
      </div>

      {/* Single auto-scrolling row — all departments combined */}
      <div className="relative z-10">
        <ImageAutoSlider
          items={branchDoctors}
          speed={40}
          renderItem={(doctor) => (
            <DoctorCard
              doctor={doctor}
              onBook={() => navigate(`/book/${doctor.slug}`)}
            />
          )}
        />
      </div>

      {/* View All button */}
      <div className="max-w-[1400px] mx-auto px-8 mt-16 flex justify-center relative z-10">
        <button
          onClick={() => navigate('/doctors')}
          className="group bg-[#8B1A4A] text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#2D3A4A] transition-all duration-500 flex items-center gap-4 shadow-xl"
        >
          View All Doctors
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer stats */}
      <div className="max-w-[1400px] mx-auto px-8 mt-16 pt-8 border-t border-[#EDF2F7] flex flex-wrap items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8B1A4A]/5 flex items-center justify-center">
              <Shield size={20} className="text-[#8B1A4A]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#1A202C] uppercase tracking-widest">Standard</p>
              <p className="text-[10px] font-bold text-[#4A4A4A]/60 uppercase tracking-widest">Verified Credentials</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8B1A4A]/5 flex items-center justify-center">
              <Heart size={20} className="text-[#8B1A4A]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#1A202C] uppercase tracking-widest">Outcome</p>
              <p className="text-[10px] font-bold text-[#4A4A4A]/60 uppercase tracking-widest">99.8% Success Rate</p>
            </div>
          </div>
        </div>
        <p className="text-[#4A4A4A]/30 text-[10px] font-black uppercase tracking-[0.6em]">SRIKARA {branchTitle.toUpperCase()} • CLINICAL REGISTRY FY24</p>
      </div>
    </section>
  );
};

