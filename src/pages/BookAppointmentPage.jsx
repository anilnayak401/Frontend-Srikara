import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ChevronRight, MapPin, Stethoscope, Calendar, 
  Clock, User, Mail, Phone, X, Star, Award, 
  Activity, Heart, Brain, Bone, Baby, Zap, ShieldCheck 
} from 'lucide-react'

import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { useBranches } from '@/hooks/useBranches'
import { assetUrl } from '@/lib/assetUrl'
import { ALL_DOCTORS } from '@/data/doctors'
import { useDoctors } from '@/hooks/useDoctors'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

// Professional Luxury Tokens
const COLORS = {
  navy: '#1A0D14',
  gold: '#8B1A4A',
  pink: '#2D3A4A',
  glass: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(212, 175, 55, 0.2)',
}

const ICON_MAP = {
  ortho: Bone,
  cardio: Heart,
  neuro: Brain,
  neurosurg: Brain,
  spine: Brain,
  gyn: Baby,
  physician: Stethoscope,
  urology: ShieldCheck,
  nephro: ShieldCheck,
  onco: Activity,
  pulmo: Activity,
  general: Activity,
  peds: Baby,
  ent: Stethoscope,
  dermo: Stethoscope,
  dental: Stethoscope,
  psych: Brain,
  radio: Activity,
  physio: Activity,
  anesthesia: ShieldCheck,
}

export function BookAppointmentPage() {
  const navigate = useNavigate()
  const { branches } = useBranches()
  const { doctors } = useDoctors()
  const [step, setStep] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedSpec, setSelectedSpec] = useState(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  
  const [bookingName, setBookingName] = useState('')
  const [bookingPhone, setBookingPhone] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('10:00 AM')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successDetails, setSuccessDetails] = useState(null)

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)

    const appointmentDetails = {
      name: bookingName.trim(),
      phone: bookingPhone.trim(),
      branch: selectedBranch?.title || 'Unknown Branch',
      doctor: selectedDoc?.name || 'Any Consultant',
      specialty: selectedSpec?.name || 'General Consultation',
      slot: `${bookingDate} at ${bookingTime}`,
      status: 'Pending',
      crmSync: 'Pending',
      timestamp: Date.now(),
      created_at: new Date().toISOString()
    }

    try {
      if (db) {
        await addDoc(collection(db, 'appointments'), appointmentDetails)
      } else {
        console.warn('Firebase DB is not initialized. Simulating success.', appointmentDetails)
      }
      
      setSuccessDetails({
        name: bookingName.trim(),
        doctor: selectedDoc?.name || 'Any Consultant',
        specialty: selectedSpec?.name || 'General Consultation',
        slot: `${bookingDate} at ${bookingTime}`,
        branch: selectedBranch?.title || 'Unknown Branch'
      })
      setIsSuccess(true)
      setIsBookingOpen(false)
      
      // Reset form
      setBookingName('')
      setBookingPhone('')
      setBookingDate('')
      setBookingTime('10:00 AM')
    } catch (err) {
      console.error('Failed to create appointment in Firestore:', err)
      alert('Failed to request appointment. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Dynamic specialties based on selected branch
  const specialties = useMemo(() => {
    if (!selectedBranch) return []
    const normalize = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const normBranch = normalize(selectedBranch.title)
    
    const specMap = {}
    doctors.forEach(doc => {
      if (normalize(doc.branch) === normBranch) {
        const specId = doc.specialtyId
        if (!specMap[specId]) {
          specMap[specId] = {
            id: specId,
            name: doc.specialty,
            icon: ICON_MAP[specId] || Stethoscope,
            count: 0
          }
        }
        specMap[specId].count++
      }
    })
    
    // Sort: Ortho first, then alphabetically
    return Object.values(specMap).sort((a, b) => {
      if (a.id === 'ortho') return -1
      if (b.id === 'ortho') return 1
      return a.name.localeCompare(b.name)
    })
  }, [selectedBranch, doctors])

  // Filtered doctors based on branch + specialty
  const filteredDoctors = useMemo(() => {
    if (!selectedBranch || !selectedSpec) return []
    const normalize = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const normBranch = normalize(selectedBranch.title)
    const specId = selectedSpec.id
    
    return doctors.filter(doc => 
      normalize(doc.branch) === normBranch && 
      doc.specialtyId === specId
    ).map(doc => ({
      id: doc.id,
      name: doc.name,
      role: doc.label || doc.sub || 'Specialist',
      image: doc.image,
      fallback: doc.fallback,
      experience: doc.exp,
      skills: doc.expertise || [],
      rating: parseFloat(doc.rating) || 4.8,
      slug: doc.slug
    }))
  }, [selectedBranch, selectedSpec, doctors])

  const steps = [
    { id: 1, label: 'Choose Location' },
    { id: 2, label: 'Select Specialty' },
    { id: 3, label: 'Choose Consultant' },
    { id: 4, label: 'Reserve Slot' },
  ]

  const handleBooking = (doc) => {
    setSelectedDoc(doc)
    setIsBookingOpen(true)
  }

  return (
    <>
      <Helmet>
        <title>Reserve a Consultation | Srikara Hospitals Luxury</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] font-body text-[#1A202C] antialiased">

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-24 relative z-10">
          
          {/* Step Tracker */}
          <div className="text-center mb-16 pt-0">

            {/* Progress Bar Container */}
            <div className="max-w-xl mx-auto relative mt-6 px-6">
               <div className="absolute top-[22px] left-0 w-full h-[1px] bg-[#E2E8F0]" />
               <motion.div 
                 className="absolute top-[22px] left-0 h-[1px] bg-gradient-to-r from-[#8B1A4A] to-[#2D3A4A]"
                 initial={{ width: 0 }}
                 animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
               />
               <div className="flex justify-between relative">
                  {steps.map((s) => (
                    <div key={s.id} className="group flex flex-col items-center">
                       <button
                         onClick={() => s.id < step && setStep(s.id)}
                         className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-black transition-all duration-700 z-10 border ${
                           step >= s.id 
                           ? 'bg-[#8B1A4A] border-[#8B1A4A] text-white shadow-lg scale-110' 
                           : 'bg-white border-[#E2E8F0] text-[#94A3B8]'
                         }`}
                       >
                         {step > s.id ? '✓' : s.id}
                       </button>
                       <span className={`mt-4 text-[9px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-[#8B1A4A]' : 'text-[#94A3B8]'}`}>{s.label}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Journey Steps Section */}
          <main className="min-h-[500px]">
             <AnimatePresence mode="wait">
               {step === 1 && (
                 <motion.div 
                   key="locations"
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -30 }}
                   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                 >
                   {branches.map((b) => (
                     <div 
                       key={b.slug}
                       onClick={() => { setSelectedBranch(b); setStep(2); }}
                       className="group relative h-[320px] rounded-3xl overflow-hidden cursor-pointer border border-[#E2E8F0] hover:border-[#8B1A4A]/40 hover:shadow-[0_20px_60px_rgba(139,26,74,0.12)] transition-all duration-500"
                     >
                       <img src={b.heroImage} alt={b.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                       <div className="absolute inset-0 p-8 flex flex-col justify-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#8B1A4A] mb-2 opacity-0 group-hover:opacity-100 transition-all">Select →</span>
                          <h3 className="font-headline text-2xl font-bold text-white">{b.title}</h3>
                          <p className="text-white/60 text-xs mt-2 flex items-center gap-1.5">
                            <MapPin size={12} /> {b.address}
                          </p>
                       </div>
                     </div>
                   ))}
                 </motion.div>
               )}

               {step === 2 && (
                 <motion.div 
                   key="specialty"
                   initial={{ opacity: 0, x: 40 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -40 }}
                   className="max-w-4xl mx-auto"
                 >
                   <div className="flex flex-wrap justify-center gap-6">
                      {specialties.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => { setSelectedSpec(s); setStep(3); }}
                          className={`group min-w-[200px] p-8 rounded-3xl border transition-all duration-300 ${
                            selectedSpec?.id === s.id 
                            ? 'bg-[#8B1A4A] border-[#8B1A4A] shadow-lg' 
                            : 'bg-white border-[#E2E8F0] hover:border-[#8B1A4A]/40 hover:shadow-md'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                            selectedSpec?.id === s.id ? 'bg-white/20 text-white' : 'bg-[#8B1A4A]/5 text-[#8B1A4A]'
                          }`}>
                            <s.icon size={28} />
                          </div>
                          <h4 className={`font-bold text-xl mb-1 ${selectedSpec?.id === s.id ? 'text-white' : 'text-[#1A202C]'}`}>{s.name}</h4>
                          <p className={`text-xs font-semibold ${selectedSpec?.id === s.id ? 'text-white/70' : 'text-[#94A3B8]'}`}>{s.count} Consultants</p>
                        </button>
                      ))}
                   </div>
                   <div className="text-center mt-12">
                      <button onClick={() => setStep(1)} className="text-[#8B1A4A] text-xs font-bold uppercase tracking-widest hover:underline">← Back to Locations</button>
                   </div>
                 </motion.div>
               )}

               {step === 3 && (
                 <motion.div 
                   key="doctors"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto"
                 >
                   {filteredDoctors.map((doc, i) => (
                     <motion.div 
                       key={doc.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="group bg-white border border-[#E2E8F0] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 hover:border-[#8B1A4A]/30 hover:shadow-lg transition-all duration-300"
                     >
                        <div className="w-28 h-28 shrink-0">
                           <img src={doc.image} alt={doc.name} className="w-full h-full rounded-full object-cover object-top border-4 border-[#F8FAFC]" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B1A4A] block mb-1">{doc.role}</span>
                           <h3 className="font-bold text-2xl text-[#1A202C] mb-2">{doc.name}</h3>
                           <div className="flex items-center justify-center md:justify-start gap-3 mb-6 text-[#64748B] text-xs font-semibold">
                              <span><Star size={12} className="inline text-[#8B1A4A] -mt-0.5 mr-1" />{doc.rating}</span>
                              <span>{doc.experience}</span>
                           </div>
                           <button 
                             onClick={() => handleBooking(doc)}
                             className="w-full h-12 bg-[#8B1A4A] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#7a1640] transition-all"
                           >
                             Select & Proceed
                           </button>
                        </div>
                     </motion.div>
                   ))}
                   <div className="lg:col-span-2 text-center mt-8">
                      <button onClick={() => setStep(2)} className="text-[#8B1A4A] text-xs font-bold uppercase tracking-widest hover:underline">← Back to Specialties</button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </main>
        </div>

        {/* Booking Overlay (Deep Luxury) */}
        <AnimatePresence>
          {isBookingOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 overflow-y-auto">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsBookingOpen(false)}
                 className="absolute inset-0 bg-black/40 backdrop-blur-sm"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 30 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 30 }}
                 className="relative w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
               >
                 <button onClick={() => setIsBookingOpen(false)} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[#94A3B8] hover:text-[#1A202C] transition-colors z-20 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center border border-slate-100 sm:border-0 shadow-sm sm:shadow-none">
                    <X size={18} />
                 </button>

                 <div className="grid grid-cols-1 md:grid-cols-5 flex-1 overflow-y-auto">
                    <div className="md:col-span-2 bg-[#0D1B2A] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1 bg-[#8B1A4A]" />
                       <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B1A4A]/70 mb-3 sm:mb-8 block">Booking Summary</span>
                          <h2 className="font-bold text-xl sm:text-3xl text-white leading-tight mb-4 sm:mb-8">Confirm Your <span className="text-[#8B1A4A]">Appointment.</span></h2>
                          <div className="space-y-4 sm:space-y-6">
                             <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8B1A4A]"><User size={15} /></div>
                                <div>
                                   <p className="text-[8px] sm:text-[9px] font-bold uppercase text-white/30 tracking-widest">Consultant</p>
                                   <p className="text-xs sm:text-base font-semibold text-white">{selectedDoc?.name}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8B1A4A]"><MapPin size={15} /></div>
                                <div>
                                   <p className="text-[8px] sm:text-[9px] font-bold uppercase text-white/30 tracking-widest">Branch</p>
                                   <p className="text-xs sm:text-base font-semibold text-white">{selectedBranch?.title}</p>
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 pt-6 sm:pt-8">
                          <ShieldCheck size={14} className="text-[#8B1A4A]" />
                          <span className="text-[8px] sm:text-[9px] font-bold uppercase text-white/30 tracking-widest">Secure & Confidential</span>
                       </div>
                    </div>

                    <div className="md:col-span-3 p-6 sm:p-10">
                       <form className="space-y-4 sm:space-y-6" onSubmit={handleFormSubmit}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                             <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8B1A4A]">Full Name</label>
                                <input 
                                  type="text" 
                                  placeholder="Your name" 
                                  required 
                                  value={bookingName}
                                  onChange={(e) => setBookingName(e.target.value)}
                                  className="w-full h-11 sm:h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm transition-all" 
                                />
                             </div>
                             <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8B1A4A]">Mobile Number</label>
                                <input 
                                  type="tel" 
                                  placeholder="+91 00000 00000" 
                                  required 
                                  value={bookingPhone}
                                  onChange={(e) => setBookingPhone(e.target.value)}
                                  className="w-full h-11 sm:h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm transition-all" 
                                />
                             </div>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                             <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8B1A4A]">Preferred Slot</label>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="relative">
                                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
                                   <input 
                                     type="date" 
                                     required 
                                     value={bookingDate}
                                     onChange={(e) => setBookingDate(e.target.value)}
                                     className="w-full h-11 sm:h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm transition-all" 
                                   />
                                </div>
                                <div className="relative">
                                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
                                   <select 
                                     value={bookingTime}
                                     onChange={(e) => setBookingTime(e.target.value)}
                                     className="w-full h-11 sm:h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm appearance-none transition-all"
                                   >
                                      <option value="10:00 AM">10:00 AM</option>
                                      <option value="02:30 PM">02:30 PM</option>
                                      <option value="06:00 PM">06:00 PM</option>
                                   </select>
                                </div>
                             </div>
                          </div>
                          <div className="pt-2 sm:pt-4">
                             <button 
                               type="submit"
                               disabled={isSubmitting}
                               className="w-full h-11 sm:h-12 bg-[#8B1A4A] text-white rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-[#7a1640] transition-all disabled:opacity-50"
                             >
                                {isSubmitting ? 'Confirming...' : 'Confirm Appointment →'}
                             </button>
                             <p className="text-center text-[#94A3B8] text-[10px] sm:text-xs mt-3 sm:mt-4">Our team will call you within 15 minutes</p>
                          </div>
                       </form>
                    </div>
                 </div>
               </motion.div>
            </div>
          )}
        {/* Premium Theme Success Modal */}
        {isSuccess && successDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuccess(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-[32px] overflow-hidden shadow-2xl p-8 text-center space-y-6"
            >
              {/* Gold & Burgundy Header Graphic */}
              <div className="w-20 h-20 bg-[#8B1A4A]/5 rounded-full flex items-center justify-center mx-auto text-[#8B1A4A] border-2 border-[#8B1A4A]/25 shadow-inner">
                <ShieldCheck size={40} className="stroke-[1.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-headline text-2xl font-black text-[#2D3A4A] leading-tight">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-gray-500 font-medium px-2 leading-relaxed">
                  Your reservation request has been processed successfully. Our patient coordination team will call you within 15 minutes.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-100/80 text-left space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Patient</span>
                  <span className="font-semibold text-slate-800">{successDetails.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Consultant</span>
                  <span className="font-semibold text-[#8B1A4A]">{successDetails.doctor}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Department</span>
                  <span className="font-semibold text-slate-800">{successDetails.specialty}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Preferred Slot</span>
                  <span className="font-semibold text-slate-800">{successDetails.slot}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Branch</span>
                  <span className="font-semibold text-slate-800">📍 {successDetails.branch}</span>
                </div>
              </div>

              <button 
                onClick={() => setIsSuccess(false)}
                className="w-full h-12 bg-[#8B1A4A] hover:bg-[#7a1640] text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#8B1A4A]/25 focus:scale-95"
              >
                Okay, Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>{/* end light bg wrapper */}

      <TestimonialsSection category="Book Appointment" />
      <Footer />
      <MobileBottomNav />
    </>
  )
}
