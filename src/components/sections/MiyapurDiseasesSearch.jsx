import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, AlertCircle, HeartPulse, Stethoscope } from 'lucide-react';
import { ALL_DISEASES, getDiseaseDetail } from '@/data/diseases';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const DiseaseDetail = ({ name, detail, onBack }) => {
  if (!detail) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-6 bg-white rounded-2xl border border-[#E8EDF2] shadow-sm overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 px-8 py-6 border-b border-[#E8EDF2]">
        <div>
          <span className="text-[#8B1A4A] text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Stethoscope size={12} /> {detail.specialist}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-[#1A202C]">{name}</h3>
        </div>
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-all flex-shrink-0 mt-1">
          <X size={16} />
        </button>
      </div>

      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-3">About</p>
          <p className="text-[#475569] text-sm leading-relaxed">{detail.description}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <AlertCircle size={11} className="text-red-400" /> Symptoms
          </p>
          <ul className="space-y-1.5">
            {detail.symptoms.map((s, i) => (
              <li key={i} className="text-sm text-[#475569] flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />{s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <HeartPulse size={11} className="text-[#8B1A4A]" /> Treatment
          </p>
          <ul className="space-y-1.5">
            {detail.treatment.map((t, i) => (
              <li key={i} className="text-sm text-[#475569] flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#8B1A4A]/50 mt-2 flex-shrink-0" />{t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-8 py-5 bg-[#F8FAFC] border-t border-[#E8EDF2] flex items-center justify-between gap-4">
        <p className="text-sm text-[#64748B]">Speak to a specialist about <span className="font-semibold text-[#1A202C]">{name}</span></p>
        <button className="group flex items-center gap-2 bg-[#8B1A4A] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#7a1640] transition-all">
          Book Consultation <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export const MiyapurDiseasesSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const resultsRef = useRef(null);

  const filteredDiseases = ALL_DISEASES.filter(name => {
    if (searchTerm) return name.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedLetter) return name.toUpperCase().startsWith(selectedLetter);
    return false;
  });

  const handleLetter = (l) => {
    setSelectedLetter(l === selectedLetter ? null : l);
    setSearchTerm('');
    setSelectedDisease(null);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const clearAll = () => { setSearchTerm(''); setSelectedLetter(null); setSelectedDisease(null); };

  return (
    <div className="w-full py-12">

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[#8B1A4A] text-xs font-bold uppercase tracking-widest mb-3">Medical Resource Center</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A202C] leading-tight">
            Diseases &amp; <span className="text-[#8B1A4A]">Conditions</span>
          </h2>
          <p className="text-[#64748B] text-base mt-3 max-w-lg">
            Search any condition to access clinical insights, symptoms, and treatment options.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-[360px] flex-shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Search conditions, symptoms..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setSelectedDisease(null); setSelectedLetter(null); }}
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-[#E2E8F0] rounded-full text-sm text-[#1A202C] placeholder-[#94A3B8] focus:outline-none focus:border-[#8B1A4A]/50 shadow-sm transition-all"
          />
          {searchTerm && (
            <button onClick={clearAll} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1A202C] transition-colors">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Alphabet strip */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ALPHABET.map(l => (
          <button
            key={l}
            onClick={() => handleLetter(l)}
            className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
              selectedLetter === l && !searchTerm
                ? 'bg-[#8B1A4A] text-white shadow-md'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#8B1A4A]/40 hover:text-[#8B1A4A]'
            }`}
          >{l}</button>
        ))}
        {(searchTerm || selectedLetter) && (
          <button onClick={clearAll} className="px-4 h-9 rounded-full text-xs font-semibold text-[#8B1A4A] border border-[#8B1A4A]/20 hover:bg-[#8B1A4A]/5 transition-all flex items-center gap-1.5">
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Results */}
      <div ref={resultsRef} className="scroll-mt-24">
        <AnimatePresence mode="wait">
          {selectedDisease ? (
            <DiseaseDetail key="detail" name={selectedDisease} detail={getDiseaseDetail(selectedDisease)} onBack={() => setSelectedDisease(null)} />
          ) : filteredDiseases.length > 0 ? (
            <motion.div key="grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-xs text-[#94A3B8] mb-4">{filteredDiseases.length} condition{filteredDiseases.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredDiseases.map(name => {
                  const detail = getDiseaseDetail(name);
                  return (
                    <button key={name} onClick={() => setSelectedDisease(name)}
                      className="group text-left p-4 bg-white rounded-xl border border-[#E8EDF2] hover:border-[#8B1A4A]/30 hover:shadow-md transition-all duration-200"
                    >
                      <p className="text-sm font-semibold text-[#1A202C] group-hover:text-[#8B1A4A] transition-colors leading-snug mb-1">{name}</p>
                      <p className="text-[11px] text-[#94A3B8]">{detail?.specialist}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (searchTerm || selectedLetter) ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#94A3B8] text-sm py-8 text-center">
              No conditions found. Try a different search.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
