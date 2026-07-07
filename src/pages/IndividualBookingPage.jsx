import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { MapPin, ShieldCheck, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { ALL_DOCTORS } from '@/data/doctors'
import { useDoctors } from '@/hooks/useDoctors'

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

  const handleBooking = (e) => {
    e.preventDefault()
    alert('Appointment Confirmed! Our team will contact you shortly.')
    navigate(-1)
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
                      <input type="text" placeholder="Your name" required className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#8B1A4A]">Mobile Number</label>
                      <input type="tel" placeholder="+91 00000 00000" required className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#8B1A4A]">Preferred Slot</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={15} />
                        <input type="date" required className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm transition-all" />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={15} />
                        <select className="w-full h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 outline-none focus:border-[#8B1A4A] text-[#1A202C] text-sm appearance-none transition-all">
                          <option>Choose Time...</option>
                          <option>10:00 AM</option>
                          <option>02:30 PM</option>
                          <option>06:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="w-full h-12 bg-[#8B1A4A] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#7a1640] transition-all focus:scale-95">
                      Confirm Appointment →
                    </button>
                    <p className="text-center text-[#94A3B8] text-xs mt-4">Our team will call you within 15 minutes</p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </main>
        
        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
