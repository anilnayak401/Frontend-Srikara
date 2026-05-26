import { useState, useMemo, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Brain, Bone, Baby, Zap, Activity, ShieldCheck, 
  Search, ChevronRight, Microscope, Syringe, Scissors, 
  Stethoscope, Thermometer, User, ArrowRight, Filter,
  Star, Award, Pill, Radiation, Wind, Droplets, FlaskConical,
  Cross, Info, Sparkles
} from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'

import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { AlphabetDiseaseSearch } from '@/components/sections/AlphabetDiseaseSearch'

// Brand palette for this dark-bg page
const P = '#8B1A4A'   // primary rose
const S = '#2D3A4A'   // secondary teal
const STYLES = `
  .glass-card {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 26, 74,0.08);
    transition: all 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }
  .glass-card:hover {
    border-color: rgba(139, 26, 74,0.25);
    box-shadow: 0 20px 40px rgba(139, 26, 74,0.05), 0 0 0 1px rgba(139, 26, 74,0.05);
    transform: translateY(-6px);
  }
`;

const CATEGORIES = [
  { id: 'ALL', label: 'All Specialities', icon: '✦' },
  { id: 'MEDICAL', label: 'Medical', icon: '🔷' },
  { id: 'SURGICAL', label: 'Surgical', icon: '⚔️' },
  { id: 'WOMEN_CHILD', label: 'Women & Child', icon: '🌸' },
  { id: 'DIAGNOSTICS', label: 'Diagnostics', icon: '🔬' },
  { id: 'EMERGENCY', label: 'Emergency', icon: '🚨' },
]

const DEPARTMENTS = [
  // --- MEDICAL ---
  { name: 'Cardiology', category: 'MEDICAL', icon: Heart, desc: 'Advanced interventional cardiology and structural heart protocols.', docs: 18 },
  { name: 'Neurology', category: 'MEDICAL', icon: Brain, desc: 'Comprehensive brain, spine, and neurological disorder management.', docs: 14 },
  { name: 'Pulmonology', category: 'MEDICAL', icon: Wind, desc: 'Advanced respiratory care and interstitial lung disease clinic.', docs: 9 },
  { name: 'Nephrology', category: 'MEDICAL', icon: Droplets, desc: 'Renal replacement therapy and dialysis excellence center.', docs: 11 },
  { name: 'Gastroenterology', category: 'MEDICAL', icon: Activity, desc: 'Digestive health, therapeutic endoscopy, and hepatology.', docs: 15 },
  { name: 'Oncology', category: 'MEDICAL', icon: Radiation, desc: 'Comprehensive medical oncology and targeted therapy.', docs: 22, featured: true },
  
  // --- SURGICAL ---
  { name: 'Cardiac Surgery', category: 'SURGICAL', icon: Heart, desc: 'Minimally invasive bypass and valve replacement surgery.', docs: 8 },
  { name: 'Neurosurgery', category: 'SURGICAL', icon: Brain, desc: 'Micro-neurosurgery and precision spinal reconstruction.', docs: 7 },
  { name: 'Orthopaedics', category: 'SURGICAL', icon: Bone, desc: 'Robotic joint replacement and complex limb salvage.', docs: 25, featured: true },
  { name: 'Urology', category: 'SURGICAL', icon: Activity, desc: 'Advanced laparo-urology and renal transplant surgery.', docs: 12 },
  { name: 'Vascular Surgery', category: 'SURGICAL', icon: Activity, desc: 'Endovascular repairs and diabetic foot management.', docs: 6 },
  
  // --- WOMEN & CHILD ---
  { name: 'Obstetrics & Gynaec', category: 'WOMEN_CHILD', icon: Baby, desc: 'High-risk pregnancy care and advanced laparoscopic gynaecology.', docs: 16 },
  { name: 'Fertility & IVF', category: 'WOMEN_CHILD', icon: Sparkles, desc: 'Precision reproductive medicine and genetic screening.', docs: 5 },
  { name: 'Neonatology', category: 'WOMEN_CHILD', icon: Baby, desc: 'Level III NICU for advanced neonatal intensive care.', docs: 10 },
  { name: 'Paediatrics', category: 'WOMEN_CHILD', icon: Baby, desc: 'Comprehensive child healthcare and immunisations.', docs: 12 },
  
  // --- DIAGNOSTICS ---
  { name: 'Radiology', category: 'DIAGNOSTICS', icon: Microscope, desc: 'Interventional radiology and high-resolution imaging.', docs: 20 },
  { name: 'Pathology', category: 'DIAGNOSTICS', icon: FlaskConical, desc: 'Automated molecular pathology and histopathology.', docs: 14 },
  { name: 'Physiotherapy', category: 'DIAGNOSTICS', icon: Activity, desc: 'Neuro-rehabilitation and sports injury recovery.', docs: 18 },
  
  // --- EMERGENCY ---
  { name: 'Emergency Medicine', category: 'EMERGENCY', icon: Zap, desc: 'Golden-hour trauma care and immediate life support.', docs: 30, featured: true, availableNow: true },
  { name: 'Intensive Care Unit', category: 'EMERGENCY', icon: ShieldCheck, desc: 'Advanced multi-specialty life monitoring and 1:1 care.', docs: 24, availableNow: true },
]

export function SpecialtiesPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    return DEPARTMENTS.filter(d => {
      const matchCat = activeFilter === 'ALL' || d.category === activeFilter
      const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.desc.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeFilter, searchQuery])

  // Split into grouped sections for the UI
  const groupedData = useMemo(() => {
    if (activeFilter !== 'ALL') return { [activeFilter]: filteredData }
    
    return {
      'MEDICAL': filteredData.filter(d => d.category === 'MEDICAL'),
      'SURGICAL': filteredData.filter(d => d.category === 'SURGICAL'),
      'WOMEN_CHILD': filteredData.filter(d => d.category === 'WOMEN_CHILD'),
      'DIAGNOSTICS': filteredData.filter(d => d.category === 'DIAGNOSTICS'),
      'EMERGENCY': filteredData.filter(d => d.category === 'EMERGENCY'),
    }
  }, [filteredData, activeFilter])

  return (
    <>
      <Helmet>
        <title>Centres of Excellence | Srikara Hospitals</title>
        <style>{STYLES}</style>
      </Helmet>

      <div className="min-h-screen bg-[#FFF9FA] font-['Inter'] text-[#1A202C] antialiased">
        <StickyNavbar />

        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139, 26, 74,0.05)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45, 58, 74,0.03)_0%,transparent_60%)]" />
        </div>

        <main className="relative z-10 max-w-[1400px] mx-auto px-8 pt-32 pb-48">

          {/* Search + Filter */}
          <div className="mb-20 flex flex-col items-center gap-12">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8B1A4A]/50 group-hover:text-[#8B1A4A] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search for your department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[58px] bg-white border border-[#8B1A4A]/10 rounded-[18px] pl-16 pr-6 outline-none focus:border-[#8B1A4A]/50 text-sm font-medium transition-all placeholder:text-[#1A202C]/30 text-center text-[#1A202C] shadow-sm"
              />
            </div>

            <div className="flex flex-nowrap justify-center gap-2.5 overflow-x-auto pb-4 custom-scrollbar w-full">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-7 py-3.5 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 border whitespace-nowrap flex items-center gap-2.5 ${
                    activeFilter === cat.id
                      ? 'bg-[#8B1A4A] border-[#8B1A4A] text-white shadow-[0_4px_20px_rgba(139, 26, 74,0.2)]'
                      : 'bg-white border-[#8B1A4A]/10 text-[#4A4A4A] hover:border-[#8B1A4A]/40 hover:text-[#8B1A4A]'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Department grid */}
          <div className="space-y-24">
            <AnimatePresence mode="wait">
              {Object.entries(groupedData).map(([group, list]) =>
                list.length > 0 && (
                  <motion.section
                    key={group}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-col gap-5 mb-12">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-md bg-[#8B1A4A]/10 border border-[#8B1A4A]/20 flex items-center justify-center text-[#8B1A4A] text-[10px]">⬡</div>
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B1A4A]">
                          {group.replace('_', ' & ')} SPECIALITIES
                        </h2>
                      </div>
                      <div className="h-px bg-[#8B1A4A]/5 w-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {list.map((dept, i) => (
                        <motion.div
                          key={dept.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="glass-card rounded-[20px] p-[28px] relative group overflow-hidden"
                        >
                          <div className="absolute top-[-20%] left-[-20%] w-1/2 h-1/2 bg-[#8B1A4A]/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                          <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden group-hover:scale-[1.1] border border-[#8B1A4A]/10 bg-[#8B1A4A]/5 text-[#8B1A4A] group-hover:bg-[#8B1A4A] group-hover:text-white group-hover:shadow-[0_0_30px_rgba(139, 26, 74,0.3)]">
                              <dept.icon size={26} className="relative z-10" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {dept.featured && (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[#8B1A4A] px-2.5 py-1 bg-[#8B1A4A]/10 rounded-full border border-[#8B1A4A]/20">
                                  ✦ Featured
                                </span>
                              )}
                              {dept.availableNow && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                  <span className="text-[9px] font-bold text-green-400 uppercase">Live</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <h3 className="text-[18px] font-bold text-[#1A202C] mb-3 group-hover:text-[#8B1A4A] transition-colors">{dept.name}</h3>
                          <p className="text-[#4A4A4A] text-[13.5px] leading-[1.7] mb-8 font-light">{dept.desc}</p>

                          <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#1A202C]/40 tracking-wider lowercase">{dept.docs} specialists</span>
                            <button
                              onClick={() => navigate('/book')}
                              className="text-[11px] font-bold uppercase tracking-widest text-[#8B1A4A] flex items-center gap-2 group/btn"
                            >
                              Reserve <ArrowRight size={14} className="opacity-0 -translate-x-2 transition-all duration-300 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )
              )}
            </AnimatePresence>
          </div>

          {/* Alphabet Disease Search */}
          <div className="mt-24">
            <AlphabetDiseaseSearch theme="light" />
          </div>

          {/* Bottom CTA */}
          <div className="mt-48 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6">
                <span className="text-[#1A202C]">Find the Right</span>
                <br />
                <span className="text-[#8B1A4A]">Specialist for Your Needs</span>
              </h2>
              <p className="text-[#4A4A4A] max-w-2xl mx-auto text-lg mb-12 font-light">
                Our team of 500+ specialists is ready to provide world-class care, tailored to you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <button
                  onClick={() => navigate('/book')}
                  className="h-[58px] px-12 bg-[#8B1A4A] text-white rounded-full font-bold uppercase tracking-[0.1em] text-[13px] shadow-[0_20px_40px_rgba(139, 26, 74,0.3)] hover:bg-[#2D3A4A] hover:shadow-[0_20px_40px_rgba(45, 58, 74,0.3)] transition-all duration-300"
                >
                  Book an Appointment
                </button>
                <button
                  onClick={() => navigate('/doctors')}
                  className="h-[58px] px-12 glass-card rounded-full font-bold uppercase tracking-[0.1em] text-[13px] text-[#4A4A4A] hover:text-[#1A202C] hover:border-[#8B1A4A]/30 transition-all border-[#8B1A4A]/20"
                >
                  Explore Our Doctors
                </button>
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-[#8B1A4A]/40">
                <span>✦ 500+ Specialists</span>
                <span>✦ 40+ Departments</span>
                <span>✦ NABH Accredited</span>
              </div>
            </motion.div>
          </div>

        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
