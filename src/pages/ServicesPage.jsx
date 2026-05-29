import { useState, useMemo, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Brain, Bone, Baby, Zap, Activity, ShieldCheck, 
  Search, ChevronRight, Microscope, Syringe, Scissors, 
  Stethoscope, Thermometer, User, ArrowRight, Filter,
  Star, Award, Pill, Radiation, Wind, Droplets, FlaskConical,
  Cross, Info, Sparkles, Home, Phone, Globe, Shield, 
  UserPlus, Bed, Waves, Info as InfoIcon, Microscope as PathIcon,
  Smile, Radio, Truck, Activity as TraumaIcon, Scale, Flame,
  Ear, Eye, Trees, ShoppingCart, Video, MapPin, ClipboardList,
  Flame as BurnsIcon, HeartPulse, BrainCircuit
} from 'lucide-react'

import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { AlphabetDiseaseSearch } from '@/components/sections/AlphabetDiseaseSearch'
import { PremiumDoctorFinder } from '@/components/sections/PremiumDoctorFinder'

// Brand palette
const STYLES = `
  .glass-card-premium {
    background: rgba(255,255,255,0.035);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.07);
    transition: all 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }
  .glass-card-premium:hover {
    border-color: rgba(139, 26, 74,0.35);
    box-shadow: 0 28px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(139, 26, 74,0.15);
    transform: translateY(-7px);
  }
  .emergency-card { border-left: 3px solid #BA1A1A; }
  .shimmer-btn { position:relative; overflow:hidden; }
  .shimmer-btn::after {
    content:''; position:absolute; top:0; left:-150%; width:50%; height:100%;
    background:linear-gradient(to right,transparent,rgba(255,255,255,0.35),transparent);
    transform:skewX(-25deg); transition:0.75s;
  }
  .shimmer-btn:hover::after { left:150%; }
`;

const CATEGORIES = [
  { id: 'ALL', label: 'All Services' },
  { id: 'MEDICAL', label: 'Medical' },
  { id: 'SURGICAL', label: 'Surgical' },
  { id: 'WOMEN_CHILD', label: 'Women & Child' },
  { id: 'DIAGNOSTICS', label: 'Diagnostics' },
  { id: 'EMERGENCY', label: 'Emergency' },
  { id: 'WELLNESS', label: 'Wellness' },
]

const SERVICES_DATA = [
  // --- CLINICAL MEDICINE ---
  { name: 'Outpatient (OPD)', cat: 'MEDICAL', icon: Stethoscope, desc: 'Expert consultations across all specialities, same-day appointments.' },
  { name: 'Inpatient Care (IPD)', cat: 'MEDICAL', icon: Bed, desc: 'Comprehensive admission, treatment and round-the-clock monitoring.' },
  { name: 'Cardiology', cat: 'MEDICAL', icon: Heart, desc: 'Advanced diagnosis and treatment of heart diseases and disorders.', featured: true },
  { name: 'Neurology', cat: 'MEDICAL', icon: Brain, desc: 'Expert care for brain, spine and nervous system conditions.', featured: true },
  { name: 'Pulmonology', cat: 'MEDICAL', icon: Wind, desc: 'Comprehensive respiratory and lung disease management.' },
  { name: 'Nephrology', cat: 'MEDICAL', icon: Droplets, desc: 'Kidney disease diagnosis, dialysis and transplant support.' },
  { name: 'Gastroenterology', cat: 'MEDICAL', icon: Microscope, desc: 'Digestive system disorders from esophagus to colon.' },
  { name: 'Endocrinology', cat: 'MEDICAL', icon: FlaskConical, desc: 'Hormonal disorders — diabetes, thyroid, and metabolic conditions.' },
  { name: 'Oncology', cat: 'MEDICAL', icon: Radiation, desc: 'Multidisciplinary cancer care — medical, surgical and radiation.', featured: true },
  { name: 'Rheumatology', cat: 'MEDICAL', icon: Bone, desc: 'Autoimmune and musculoskeletal disease management.' },
  { name: 'Dermatology', cat: 'MEDICAL', icon: Sparkles, desc: 'Skin, hair, nail and cosmetic dermatology.' },
  { name: 'Chronic Disease', cat: 'MEDICAL', icon: ClipboardList, desc: 'Long-term care for diabetes, hypertension, and heart conditions.' },

  // --- SURGICAL EXCELLENCE ---
  { name: 'General Surgery', cat: 'SURGICAL', icon: Scissors, desc: 'Routine and complex procedures with precision surgical teams.' },
  { name: 'Laparoscopic', cat: 'SURGICAL', icon: Microscope, desc: 'Minimally invasive surgery with faster recovery and less scarring.' },
  { name: 'Robotic Surgery', cat: 'SURGICAL', icon: Zap, desc: 'AI-assisted precision surgery for complex procedures.', featured: true },
  { name: 'Cardiac Surgery', cat: 'SURGICAL', icon: HeartPulse, desc: 'Open heart, bypass and valve replacement procedures.' },
  { name: 'Neurosurgery', cat: 'SURGICAL', icon: BrainCircuit, desc: 'Brain tumour, spine, and cerebrovascular surgery.' },
  { name: 'Orthopaedics', cat: 'SURGICAL', icon: Bone, desc: 'Bone, joint, and sports injury surgical care.', featured: true },
  { name: 'Urology', cat: 'SURGICAL', icon: Activity, desc: 'Kidney stone, prostate, and urological surgical procedures.' },
  { name: 'Vascular Surgery', cat: 'SURGICAL', icon: Droplets, desc: 'Arterial and venous disorder surgery.' },
  { name: 'Bariatric Surgery', cat: 'SURGICAL', icon: Scale, desc: 'Surgical weight management and metabolic treatment.' },
  { name: 'Transplant Surgery', cat: 'SURGICAL', icon: UserPlus, desc: 'Kidney, liver, heart, and multi-organ transplant programs.' },
  { name: 'Plastic Surgery', cat: 'SURGICAL', icon: Sparkles, desc: 'Reconstructive, aesthetic, and burns surgery.' },
  { name: 'Day Care Surgery', cat: 'SURGICAL', icon: Zap, desc: 'Same-day discharge procedures with rapid recovery protocols.' },

  // --- WOMEN & CHILD ---
  { name: 'Obstetrics', cat: 'WOMEN_CHILD', icon: Baby, desc: 'Safe, supported pregnancy and delivery services.', featured: true },
  { name: 'Gynaecology', cat: 'WOMEN_CHILD', icon: Sparkles, desc: 'Complete women\'s reproductive health and surgical care.' },
  { name: 'Fertility & IVF', cat: 'WOMEN_CHILD', icon: Star, desc: 'Advanced assisted reproduction with high success rates.' },
  { name: 'Neonatology', cat: 'WOMEN_CHILD', icon: Baby, desc: 'Level III NICU for critical and premature newborn care.' },
  { name: 'Paediatrics', cat: 'WOMEN_CHILD', icon: Baby, desc: 'Comprehensive healthcare for infants, children and adolescents.' },
  { name: 'Paediatric Surgery', cat: 'WOMEN_CHILD', icon: Scissors, desc: 'Specialised surgical care for children of all ages.' },
  { name: 'Foetal Medicine', cat: 'WOMEN_CHILD', icon: Microscope, desc: 'High-risk pregnancy monitoring and foetal intervention.' },
  { name: 'Breast Care', cat: 'WOMEN_CHILD', icon: Award, desc: 'Screening, diagnosis and treatment of breast conditions.' },

  // --- DIAGNOSTICS ---
  { name: 'Radiology', cat: 'DIAGNOSTICS', icon: Radio, desc: 'High-resolution cross-sectional imaging diagnostics.' },
  { name: 'Digital X-Ray', cat: 'DIAGNOSTICS', icon: Zap, desc: 'Instant digital imaging for bone and chest diagnostics.' },
  { name: 'Ultrasound', cat: 'DIAGNOSTICS', icon: Waves, desc: 'Real-time soft tissue and vascular imaging.' },
  { name: 'Pathology', cat: 'DIAGNOSTICS', icon: PathIcon, desc: 'Comprehensive blood, urine and tissue diagnostics.' },
  { name: 'Nuclear Medicine', cat: 'DIAGNOSTICS', icon: Radiation, desc: 'Molecular imaging and radionuclide therapy.' },
  { name: 'Health Screening', cat: 'DIAGNOSTICS', icon: ClipboardList, desc: 'Preventive full-body and executive wellness profiles.' },
  { name: 'Cardiac Diagnostics', cat: 'DIAGNOSTICS', icon: HeartPulse, desc: 'ECG, ECHO, stress tests and holter monitoring.' },

  // --- EMERGENCY ---
  { name: '24/7 Emergency', cat: 'EMERGENCY', icon: Zap, desc: 'Immediate, round-the-clock emergency medical response.', urgent: true },
  { name: 'Trauma Care', cat: 'EMERGENCY', icon: TraumaIcon, desc: 'Advanced polytrauma and accident injury management.', urgent: true },
  { name: 'ICU (General)', cat: 'EMERGENCY', icon: Bed, desc: 'Intensive monitoring with ventilator and life support.', urgent: true },
  { name: 'Cardiac ICU', cat: 'EMERGENCY', icon: Heart, desc: 'Specialised post-cardiac event intensive monitoring.', urgent: true },
  { name: 'Neuro ICU', cat: 'EMERGENCY', icon: Brain, desc: 'Critical brain and neurological condition intensive care.', urgent: true },
  { name: 'Paediatric ICU', cat: 'EMERGENCY', icon: Baby, desc: 'Intensive care unit dedicated to critically ill children.', urgent: true },
  { name: 'Ambulance Services', cat: 'EMERGENCY', icon: Truck, desc: 'Advanced life support and ICU-on-wheels rapid transport.', urgent: true },

  // --- WELLNESS ---
  { name: 'Physiotherapy', cat: 'WELLNESS', icon: Activity, desc: 'Post-surgery and injury mobility recovery programs.' },
  { name: 'Mental Health', cat: 'WELLNESS', icon: Brain, desc: 'Counselling, therapy and psychiatric treatment.' },
  { name: 'Pain Management', cat: 'WELLNESS', icon: Syringe, desc: 'Chronic and acute pain diagnosis and therapy.' },
  { name: 'Diet & Nutrition', cat: 'WELLNESS', icon: Scale, desc: 'Clinical nutrition therapy and personalised health plans.' },
  { name: 'Palliative Care', cat: 'WELLNESS', icon: Star, desc: 'Compassionate end-of-life and chronic illness support.' },
  { name: 'Pharmacy 24/7', cat: 'WELLNESS', icon: ShoppingCart, desc: 'Full dispensary with home delivery available.' },
  { name: 'Telemedicine', cat: 'WELLNESS', icon: Video, desc: 'Virtual specialist consultations from anywhere.' },
  { name: 'Home Healthcare', cat: 'WELLNESS', icon: Home, desc: 'Doctor and nurse visits at your doorstep.' },
  { name: 'International', cat: 'WELLNESS', icon: Globe, desc: 'End-to-end concierge support for global patients.' },
  { name: 'Insurance', cat: 'WELLNESS', icon: Shield, desc: 'Cashless hospitalisation and claim assistance.' },
]

export function ServicesPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    return SERVICES_DATA.filter(service => {
      const matchCat = activeFilter === 'ALL' || service.cat === activeFilter
      const matchSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.desc.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeFilter, searchQuery])

  // Group by category for the grid structure
  const groupedData = useMemo(() => {
    const groups = {}
    filteredData.forEach(item => {
      if (!groups[item.cat]) groups[item.cat] = []
      groups[item.cat].push(item)
    })
    return groups
  }, [filteredData])

  return (
    <>
      <Helmet>
        <title>Our Services | Srikara Hospitals</title>
        <style>{STYLES}</style>
      </Helmet>

      <div className="min-h-screen bg-[#0D0A0C] font-['Inter'] text-[#F8F0F4] antialiased">


        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[#8B1A4A]/8 blur-[140px] opacity-50" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#2D3A4A]/8 blur-[160px] opacity-40" />
        </div>

        <main className="relative z-10 max-w-[1440px] mx-auto px-8 pt-28 pb-32">

          {/* Search + Filter */}
          <div className="mb-24 flex flex-col items-center gap-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-full max-w-2xl group"
            >
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-[#8B1A4A]/50 group-hover:text-[#8B1A4A] transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[64px] bg-white/[0.04] border border-white/8 rounded-[22px] pl-16 pr-8 outline-none focus:border-[#8B1A4A]/40 text-lg font-medium transition-all text-center placeholder:text-white/25 text-white"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-nowrap justify-center gap-3 overflow-x-auto pb-4 custom-scrollbar w-full"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border whitespace-nowrap ${
                    activeFilter === cat.id
                      ? 'bg-[#8B1A4A] border-[#8B1A4A] text-white shadow-[0_4px_24px_rgba(139, 26, 74,0.35)] scale-105'
                      : 'bg-white/[0.04] border-white/8 text-white/50 hover:border-[#8B1A4A]/30 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Services grid */}
          <div className="space-y-32">
            <AnimatePresence mode="wait">
              {Object.entries(groupedData).map(([group, list]) => (
                <motion.section
                  key={group}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="flex flex-col gap-6 mb-16 px-2">
                    <div className="flex items-center gap-5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${group === 'EMERGENCY' ? 'bg-[#BA1A1A]/10 border border-[#BA1A1A]/30 text-[#BA1A1A]' : 'bg-[#8B1A4A]/10 border border-[#8B1A4A]/20 text-[#8B1A4A]'}`}>⬡</div>
                      <h2 className={`text-[11px] font-bold uppercase tracking-[0.3em] ${group === 'EMERGENCY' ? 'text-[#BA1A1A]' : 'text-[#8B1A4A]'}`}>
                        {group === 'WOMEN_CHILD' ? 'MOTHER & CHILD' : `${group.replace('_', ' & ')} SERVICES`}
                      </h2>
                    </div>
                    <div className={`h-px w-full ${group === 'EMERGENCY' ? 'bg-gradient-to-r from-[#BA1A1A]/30 to-transparent' : 'bg-[#8B1A4A]/10'}`} />
                  </div>

                  <div className={`grid gap-5 ${group === 'EMERGENCY' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                    {list.map((service, i) => (
                      <motion.div
                        key={service.name}
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        className={`glass-card-premium rounded-[20px] p-8 relative group overflow-hidden ${service.urgent ? 'emergency-card' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-10">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden group-hover:scale-[1.1] border border-white/5 ${
                            service.urgent
                              ? 'bg-[#BA1A1A]/10 text-[#BA1A1A] group-hover:bg-[#BA1A1A] group-hover:text-white group-hover:shadow-[0_0_30px_rgba(186,26,26,0.4)]'
                              : 'bg-[#8B1A4A]/10 text-[#8B1A4A] group-hover:bg-[#8B1A4A] group-hover:text-white group-hover:shadow-[0_0_30px_rgba(139, 26, 74,0.4)]'
                          }`}>
                            <service.icon size={26} className={`relative z-10 ${service.urgent ? 'animate-pulse' : ''}`} />
                          </div>
                          <div className="flex flex-col items-end gap-2 text-[10px] font-bold uppercase tracking-widest">
                            {service.featured && (
                              <span className="px-3 py-1.5 bg-[#8B1A4A]/10 text-[#8B1A4A] rounded-full border border-[#8B1A4A]/20">✦ Featured</span>
                            )}
                            {service.urgent && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#BA1A1A]/10 text-[#BA1A1A] rounded-full border border-[#BA1A1A]/30">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A] animate-ping" />
                                <span>High Priority</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <h3 className="text-[17px] font-semibold text-white mb-4 tracking-tight group-hover:text-[#8B1A4A] transition-colors duration-300">
                          {service.name}
                        </h3>
                        <p className="text-white/45 text-[13px] leading-[1.75] mb-10 group-hover:text-white/65 transition-colors duration-300">
                          {service.desc}
                        </p>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${service.urgent ? 'bg-[#BA1A1A]' : 'bg-green-500'}`} />
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Available Now</span>
                          </div>
                          <button
                            onClick={() => navigate('/book')}
                            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B1A4A] flex items-center gap-2 group/btn"
                          >
                            Explore <ArrowRight size={14} className="opacity-0 -translate-x-3 transition-all duration-300 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>
          </div>

          {/* Alphabet Disease Search */}
          <div className="mt-24">
            <AlphabetDiseaseSearch theme="dark" />
          </div>

          {/* Bottom CTA */}
          <div className="mt-64 relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-headline text-5xl md:text-6xl font-bold mb-8">
                <span className="text-white">Find the Right Specialist</span>
                <br />
                <span className="hero-gradient-text">for Your Needs</span>
              </h2>
              <p className="text-white/45 text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
                Our team of 500+ specialists is ready to deliver world-class, personalised care.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={() => navigate('/book')}
                  className="shimmer-btn h-[64px] px-14 bg-[#8B1A4A] text-white rounded-full font-bold uppercase tracking-[0.15em] text-[13px] shadow-[0_20px_50px_rgba(139, 26, 74,0.3)] hover:bg-[#2D3A4A] hover:shadow-[0_20px_50px_rgba(45, 58, 74,0.3)] transition-all duration-300"
                >
                  Book an Appointment
                </button>
                <button
                  onClick={() => navigate('/doctors')}
                  className="h-[64px] px-14 glass-card-premium rounded-full text-[#8B1A4A] font-bold uppercase tracking-[0.15em] text-[13px] border-[#8B1A4A]/30 hover:border-[#8B1A4A]/60 hover:bg-[#8B1A4A]/5 transition-all"
                >
                  Explore Our Doctors
                </button>
              </div>
              <div className="mt-20 flex flex-wrap justify-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B1A4A]/40">
                <span className="flex items-center gap-3"><div className="w-1 h-1 bg-[#8B1A4A] rounded-full" /> 500+ Specialists</span>
                <span className="flex items-center gap-3"><div className="w-1 h-1 bg-[#8B1A4A] rounded-full" /> 40+ Departments</span>
                <span className="flex items-center gap-3"><div className="w-1 h-1 bg-[#8B1A4A] rounded-full" /> NABH Accredited</span>
              </div>
            </motion.div>
          </div>

        </main>

        <PremiumDoctorFinder isGlobal={true} />
        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
