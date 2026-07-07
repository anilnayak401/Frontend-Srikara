import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ShieldCheck, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { ALL_DOCTORS } from '@/data/doctors'
import { useDoctors } from '@/hooks/useDoctors'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export function IndividualBookingPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { doctors, loading } = useDoctors()
  const doctor = doctors.find(d => d.slug === slug)

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!doctor) {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#cca830] border-t-transparent rounded-full animate-spin" />
        </div>
      )
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <p className="text-[#94A3B8] text-xl mb-4">Doctor not found</p>
          <button onClick={() => navigate('/doctors')} className="text-[#8B1A4A] font-bold hover:underline">← Back to Doctors</button>
        </div>
      </div>
    )
  }

  const [bookingName, setBookingName] = useState('')
  const [bookingPhone, setBookingPhone] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('10:00 AM')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleBooking = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    const appointmentDetails = {
      name: bookingName.trim(),
      phone: bookingPhone.trim(),
      branch: doctor.branch || 'Unknown Branch',
      doctor: doctor.name || 'Any Consultant',
      specialty: doctor.specialty || 'General Consultation',
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
      
      setIsSuccess(true)
    } catch (err) {
      console.error('Failed to create appointment in Firestore:', err)
      alert('Failed to request appointment. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Helmet><title>Book Appointment with {doctor.name} | Srikara Hospitals</title></Helmet>
      <div className="min-h-screen bg-[#F8FAFC] font-body text-[#1A202C] antialiased flex flex-col">
        <StickyNavbar />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 py-24">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#64748B] hover:text-[#8B1A4A] transition-colors mb-8 text-sm font-bold">
            <ArrowLeft size={16} /> Back
          </button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 min-h-[560px]">
              <div className="md:col-span-2 bg-[#0D1B2A] p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#8B1A4A]" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B1A4A]/70 mb-8 block">Booking Summary</span>
                  <h2 className="font-bold text-3xl text-white leading-tight mb-8">Confirm Your <span className="text-[#8B1A4A]">Appointment.</span></h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center text-[#8B1A4A] shadow-md border border-white/10">
                         <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" onError={e => { if (doctor.fallback) e.target.src = doctor.fallback }} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Consultant</p>
                        <p className="font-semibold text-white">{doctor.name}</p>
                        <p className="text-xs text-white/50">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#8B1A4A] border border-white/10"><MapPin size={20} /></div>
                      <div>
                        <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Branch</p>
                        <p className="font-semibold text-white">{doctor.branch}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <ShieldCheck size={14} className="text-[#8B1A4A]" />
                  <span className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Secure & Confidential</span>
                </div>
              </div>

              <div className="md:col-span-3 p-10 flex flex-col justify-center">
                <form className="space-y-6" onSubmit={handleBooking}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#8B1A4A]">Full Name</label>
                      <input type="text" placeholder="Your name" required value={bookingName} onChange={e => setBookingName(e.target.value)} className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#8B1A4A]">Mobile Number</label>
                      <input type="tel" placeholder="+91 00000 00000" required value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8B1A4A]">Preferred Slot</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={15} />
                        <input type="date" required value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm transition-all" />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={15} />
                        <select value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm appearance-none transition-all">
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="02:30 PM">02:30 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className="w-full h-12 bg-[#8B1A4A] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#7a1640] transition-all focus:scale-95 disabled:opacity-50">
                      {isSubmitting ? 'Confirming...' : 'Confirm Appointment →'}
                    </button>
                    <p className="text-center text-[#94A3B8] text-xs mt-4">Our team will call you within 15 minutes</p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </main>
        
      </div>

      {/* Premium Theme Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSuccess(false)
                navigate(-1)
              }}
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
                  <span className="font-semibold text-slate-800">{bookingName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Consultant</span>
                  <span className="font-semibold text-[#8B1A4A]">{doctor.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Department</span>
                  <span className="font-semibold text-slate-800">{doctor.specialty}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Preferred Slot</span>
                  <span className="font-semibold text-slate-800">{bookingDate} at {bookingTime}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Branch</span>
                  <span className="font-semibold text-slate-800">📍 {doctor.branch}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsSuccess(false)
                  navigate(-1)
                }}
                className="w-full h-12 bg-[#8B1A4A] hover:bg-[#7a1640] text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#8B1A4A]/25 focus:scale-95"
              >
                Okay, Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
