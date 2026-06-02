import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, X } from 'lucide-react'
import { branches } from '@/data/branches'

const getGreetingMessage = (pathname, currentBranch) => {
  const cleanPath = pathname.replace(/\/$/, '')
  
  if (!cleanPath) {
    return "Hi! Welcome to Srikara Hospitals. How can we help you today? 🏥"
  }
  
  if (cleanPath.startsWith('/branches/')) {
    let branchName = ''
    if (currentBranch?.title) {
      branchName = currentBranch.title
    } else {
      const parts = cleanPath.split('/')
      const slug = parts[parts.length - 1]
      branchName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }
    return `Hi! Welcome to Srikara ${branchName} branch. How can we assist you today? 📍`
  }
  
  if (cleanPath === '/branches') {
    return "Hi! Looking for the nearest Srikara Hospital branch? Chat with us! 🗺️"
  }
  
  if (cleanPath === '/doctors') {
    return "Hi! Welcome to our Doctors Directory. Need help finding the right specialist? 👨‍⚕️"
  }
  
  if (cleanPath.startsWith('/doctors/')) {
    return "Hi! Need help booking an appointment with our specialist? Let's chat! 📅"
  }
  
  if (cleanPath.startsWith('/specialties')) {
    return "Hi! Welcome to our Specialties section. Exploring our 3D Anatomy? 🧠"
  }
  
  if (cleanPath === '/services') {
    return "Hi! Exploring our healthcare services? Chat with us for details. 🌟"
  }
  
  if (cleanPath === '/about') {
    return "Hi! Welcome to Srikara Hospitals. Learn about our legacy of care. 🏛️"
  }
  
  if (cleanPath.startsWith('/book')) {
    return "Hi! Need help booking your appointment? Let's chat on WhatsApp! ✍️"
  }
  
  if (cleanPath === '/blogs') {
    return "Hi! Welcome to our Health Blogs. Reading up on wellness? 📖"
  }
  
  return "Hi! Welcome to Srikara Hospitals. Chat with us on WhatsApp for any queries! 👋"
}

const getPrefilledMessage = (pathname, currentBranch) => {
  const cleanPath = pathname.replace(/\/$/, '')
  
  if (!cleanPath) {
    return "Hi, I am visiting Srikara Hospitals Home Page and have a query."
  }
  
  if (cleanPath.startsWith('/branches/')) {
    let branchName = ''
    if (currentBranch?.title) {
      branchName = currentBranch.title
    } else {
      const parts = cleanPath.split('/')
      const slug = parts[parts.length - 1]
      branchName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }
    return `Hi, I am visiting the Srikara ${branchName} branch page and have a query.`
  }
  
  if (cleanPath === '/branches') {
    return "Hi, I am looking for Srikara Hospital branch locations and need help."
  }
  
  if (cleanPath === '/doctors') {
    return "Hi, I am looking at Srikara doctors list and need help finding a specialist."
  }
  
  if (cleanPath.startsWith('/doctors/')) {
    return "Hi, I am interested in booking an appointment with one of your doctors."
  }
  
  if (cleanPath.startsWith('/specialties')) {
    return "Hi, I am exploring your clinical specialties and need more information."
  }
  
  if (cleanPath === '/services') {
    return "Hi, I have a query regarding Srikara hospital services."
  }
  
  if (cleanPath === '/about') {
    return "Hi, I would like to learn more about Srikara Hospitals."
  }
  
  if (cleanPath.startsWith('/book')) {
    return "Hi, I need help booking an appointment with Srikara Hospitals."
  }
  
  if (cleanPath === '/blogs') {
    return "Hi, I am reading the Srikara wellness blogs."
  }
  
  return "Hi, I have a query about Srikara Hospitals."
}

export function AppointmentWidget({ currentBranch }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: currentBranch?.slug || '',
    specialty: '',
  })

  useEffect(() => {
    // Show the greeting automatically after 1.5 seconds if they haven't closed it in this session
    const isDismissed = sessionStorage.getItem('wa_greeting_dismissed') === 'true'
    
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setShowGreeting(true)
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [location.pathname])

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Appointment request submitted! We will contact you shortly.')
    setOpen(false)
    setFormData({ name: '', phone: '', branch: currentBranch?.slug || '', specialty: '' })
  }

  const prefilledText = getPrefilledMessage(location.pathname, currentBranch)
  const greetingText = getGreetingMessage(location.pathname, currentBranch)

  return (
    <>
      {/* Dynamic WhatsApp Greeting Bubble */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-[160px] lg:bottom-[96px] right-4 lg:right-8 z-40 w-[260px] sm:w-[280px] bg-white border border-slate-100/80 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-4 select-none font-sans"
          >
            {/* Speech bubble tail */}
            <div className="absolute bottom-[-6px] right-5 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-100/80" />

            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">WhatsApp Support</span>
                </div>
                <p className="text-[11px] text-slate-700 font-bold leading-normal pr-4">
                  {greetingText}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowGreeting(false)
                  sessionStorage.setItem('wa_greeting_dismissed', 'true')
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-50 flex items-center justify-center shrink-0"
                aria-label="Dismiss greeting"
              >
                <X size={12} />
              </button>
            </div>
            
            {/* Quick Chat Link inside the bubble */}
            <div className="mt-2.5 pt-2 border-t border-slate-50 flex justify-end">
              <a
                href={`https://wa.me/914068324800?text=${encodeURIComponent(prefilledText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-black uppercase tracking-wider text-[#25D366] hover:text-[#1ebd59] flex items-center gap-1"
              >
                Chat Now →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/914068324800?text=${encodeURIComponent(prefilledText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-40 bg-[#25D366] text-white rounded-full p-4 shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Full Name
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Phone Number
              </label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Select Branch
              </label>
              <Select
                required
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              >
                <option value="">Choose a branch</option>
                {branches.map(branch => (
                  <option key={branch.slug} value={branch.slug}>
                    {branch.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Specialty
              </label>
              <Select
                required
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              >
                <option value="">Choose a specialty</option>
                <option value="cardiology">Cardiology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="neurosciences">Neurosciences</option>
                <option value="general">General Medicine</option>
                <option value="pediatrics">Pediatrics</option>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Submit Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
