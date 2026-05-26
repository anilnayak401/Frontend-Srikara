import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronRight, ArrowRight, X, AlertCircle, HeartPulse, Stethoscope
} from 'lucide-react';
import { ALL_DISEASES, getDiseaseDetail } from '@/data/diseases';
import { ShineBorder } from '@/components/ui/shine-border';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const DiseaseDetail = ({ name, detail, onBack }) => {
  if (!detail) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 30 }}
      className="mt-8 bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.08)] border border-[#E2E8F0] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F7FAFC] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#8B1A4A]/5 text-[#8B1A4A] text-[10px] font-bold uppercase tracking-widest mb-3">
              <Stethoscope size={12} /> {detail.specialist} Care
            </span>
            <h4 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#1A202C] font-bold leading-tight">{name}</h4>
          </div>
          <button onClick={onBack} className="w-12 h-12 rounded-full bg-[#F7FAFC] flex items-center justify-center text-[#4A5568] hover:bg-[#EDF2F7] transition-all self-end md:self-start">
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 xl:col-span-4 lg:pr-8 lg:border-r border-[#E2E8F0]">
            <h5 className="text-[#8B1A4A] font-black uppercase text-[10px] tracking-[0.3em] mb-4">Patient Overview</h5>
            <p className="text-[#4A5568] leading-relaxed text-lg font-medium">{detail.description}</p>
          </div>
          <div className="lg:col-span-6 xl:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"><AlertCircle size={16} /></div>
              <h5 className="font-bold text-[#1A202C] text-sm">Typical Symptoms</h5>
            </div>
            <ul className="grid grid-cols-1 gap-2">
              {detail.symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#F7FAFC] text-[#2D3748] text-xs font-semibold border border-transparent hover:border-[#E2E8F0] transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 flex-shrink-0" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 xl:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#8B1A4A]/5 flex items-center justify-center text-[#8B1A4A]"><HeartPulse size={16} /></div>
              <h5 className="font-bold text-[#1A202C] text-sm">Standard Treatment</h5>
            </div>
            <ul className="grid grid-cols-1 gap-2">
              {detail.treatment.map((t, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#F7FAFC] text-[#2D3748] text-xs font-semibold border border-transparent hover:border-[#E2E8F0] transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B1A4A]/40 mt-1 flex-shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-[#EDF2F7] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1,2,3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-[#E2E8F0] overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="doctor" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-[#1A202C] font-bold text-sm">Consult our Specialists</p>
              <p className="text-[#718096] text-xs">Expert team of 500+ clinical specialists</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-[#1A202C] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#8B1A4A] transition-all flex items-center justify-center gap-3 group shadow-2xl text-sm">
            Book a Specialist Call
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const PremiumDiseasesSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const resultsRef = useRef(null);

  const filteredDiseases = ALL_DISEASES.filter(name => {
    if (searchTerm) return name.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedLetter) return name.toUpperCase().startsWith(selectedLetter);
    return false;
  });

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm('');
    setSelectedDisease(null);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full pt-10 pb-0">
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#FFF1F2] via-[#FCE7F3] to-[#FDF2F8] border border-[#FBCFE8] shadow-[0_40px_100px_rgba(0,0,0,0.05)]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 pt-12 pb-8 px-8 md:px-16">
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 text-[#8B1A4A]/50 text-[10px] font-bold uppercase tracking-[0.4em] mb-8">
              MEDICAL RESOURCE CENTER
            </div>
            <h2 className="font-serif text-6xl md:text-8xl text-[#1A202C] font-bold mb-8 leading-[0.85] tracking-tighter">
              Diseases <br /><span className="text-[#8B1A4A]"> & Conditions</span>
            </h2>
            <div className="h-1 w-24 bg-[#8B1A4A]/10 mb-8 rounded-full" />
            <p className="text-[#4A5568] text-xl font-medium leading-relaxed max-w-xl">
              Access globally-verified clinical insights into conditions, treatments, and patient care.
            </p>
          </div>

          <div className="w-full lg:w-[480px]">
            <ShineBorder borderRadius={48} borderWidth={2} duration={14} color={["#8B1A4A","#FCE7F3","#FFFFFF"]} className="p-0 bg-transparent">
              <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl h-full w-full">
                <div className="mb-8 text-center flex flex-col items-center">
                  <h3 className="text-[#1A202C] font-bold text-2xl mb-2">Clinical Search</h3>
                  <div className="h-0.5 w-12 bg-[#8B1A4A]/10" />
                </div>
                <div className="relative mb-10">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B1A4A]/40" size={20} />
                  <input
                    type="text"
                    placeholder="Symptoms, Conditions..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setSelectedDisease(null); }}
                    className="w-full pl-12 pr-12 py-4 bg-[#8B1A4A]/5 border border-transparent rounded-2xl text-[#1A202C] placeholder-[#8B1A4A]/30 focus:outline-none focus:bg-white focus:border-[#8B1A4A]/10 transition-all text-sm shadow-inner"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-[#8B1A4A]/5 text-[#8B1A4A] transition-all">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[#1A202C]/30 text-[9px] font-bold uppercase tracking-[0.2em] mb-6">BROWSE BY ALPHABET</p>
                  <div className="grid grid-cols-9 gap-2">
                    {ALPHABET.map(letter => (
                      <button
                        key={letter}
                        onClick={() => handleLetterSelect(letter)}
                        className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          selectedLetter === letter && !searchTerm
                            ? 'bg-[#8B1A4A] text-white shadow-lg scale-110'
                            : 'bg-[#8B1A4A]/5 text-[#8B1A4A]/40 hover:bg-[#8B1A4A]/10 hover:text-[#8B1A4A]'
                        }`}
                      >{letter}</button>
                    ))}
                  </div>
                </div>
              </div>
            </ShineBorder>
          </div>
        </div>
      </div>

      <div ref={resultsRef} className="mt-4 scroll-mt-24 px-4 md:px-0">
        <AnimatePresence mode="wait">
          {selectedDisease ? (
            <DiseaseDetail key="detail" name={selectedDisease} detail={getDiseaseDetail(selectedDisease)} onBack={() => setSelectedDisease(null)} />
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {filteredDiseases.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-[#94A3B8]">{filteredDiseases.length} condition{filteredDiseases.length !== 1 ? 's' : ''} found</p>
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedLetter(null); setSelectedDisease(null); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#8B1A4A] border border-[#8B1A4A]/30 px-4 py-1.5 rounded-full hover:bg-[#8B1A4A]/5 transition-all"
                  >
                    <X size={12} /> Clear Results
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredDiseases.map(name => {
                const detail = getDiseaseDetail(name);
                return (
                  <button key={name} onClick={() => setSelectedDisease(name)}
                    className="group p-4 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#8B1A4A] hover:bg-[#8B1A4A]/[0.02] shadow-sm hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-[#1A202C] font-bold text-base mb-1 group-hover:text-[#8B1A4A] transition-colors leading-tight">{name}</h4>
                      <p className="text-[#718096] text-[11px] line-clamp-1 italic">Care under {detail.specialist}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[#8B1A4A] text-[9px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all">
                      View Protocol <ChevronRight size={12} />
                    </div>
                  </button>
                );
              })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
