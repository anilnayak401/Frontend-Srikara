import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Sparkles, Calendar, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBranches } from '@/hooks/useBranches'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

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

const getAIResponse = (userQuery) => {
  const query = userQuery.toLowerCase().trim()
  
  if (query.includes('book') || query.includes('appoint') || query.includes('schedule') || query.includes('consult') || query.includes('form') || query.includes('request')) {
    return {
      text: "I can help you request a consultation! You can open and fill out our Srikara Appointment Request Form right here in this window by clicking the button below, or visit the Bookings page.",
      action: "open_booking",
      actionLabel: "Open Appointment Form"
    }
  }
  
  if (query.includes('cardio') || query.includes('heart') || query.includes('beat') || query.includes('valve') || query.includes('angioplasty')) {
    return {
      text: "Srikara's Cardiology Excellence Center pioneers beating-heart CABG, robotic valve replacements, and 24/7 emergency primary angioplasties. You can browse our cardiology specialists on the Doctors Directory page.",
      action: "view_doctors",
      actionLabel: "Find a Cardiologist",
      link: "/doctors?specialty=cardio"
    }
  }
  
  if (query.includes('neuro') || query.includes('brain') || query.includes('spine') || query.includes('stroke') || query.includes('tumor')) {
    return {
      text: "Srikara's Stroke and Neuro-Endovascular clinic delivers microscopic, ultra-rapid interventions for brain tumors, spinal corrections, and neurological anomalies. Explore the 3D Anatomy simulator to visualize the brain and nervous systems.",
      action: "view_specialties",
      actionLabel: "Anatomy Explorer",
      link: "/specialties"
    }
  }
  
  if (query.includes('ortho') || query.includes('joint') || query.includes('knee') || query.includes('hip') || query.includes('bone') || query.includes('robotic replacement') || query.includes('sports')) {
    return {
      text: "Srikara is a national leader in Orthopaedics, utilizing high-precision robotic joint replacements (TKR/THR) and rapid-recovery sports reconstructions. Would you like to check our orthopaedics specialists?",
      action: "view_doctors",
      actionLabel: "Find Joint Specialists",
      link: "/doctors?specialty=ortho"
    }
  }
  
  if (query.includes('doctor') || query.includes('specialist') || query.includes('surgeon') || query.includes('physician') || query.includes('find doctor')) {
    return {
      text: "We have over 50+ world-class surgeons and specialists across our branches. You can search by branch or specialty on our Doctors Directory page.",
      action: "view_doctors",
      actionLabel: "Browse Doctors Directory",
      link: "/doctors"
    }
  }
  
  if (query.includes('branch') || query.includes('location') || query.includes('where') || query.includes('center') || query.includes('hospital') || query.includes('miyapur') || query.includes('ecil') || query.includes('nagar') || query.includes('kompally') || query.includes('lakdikapul') || query.includes('rtc') || query.includes('peerzadiguda') || query.includes('vijayawada') || query.includes('rajahmundry') || query.includes('secunderabad')) {
    return {
      text: "Srikara has 9 state-of-the-art hospitals: ECIL, LB Nagar, Miyapur, Kompally, Lakdikapul, Peerzadiguda, RTC X Roads, Vijayawada, and Rajahmundry. You can view addresses, phones, and maps on our Centers page.",
      action: "view_branches",
      actionLabel: "Browse Centers Page",
      link: "/branches"
    }
  }
  
  if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('greeting') || query.includes('welcome')) {
    return {
      text: "Hello! I am Srikara's AI Clinical Assistant. How can I help you today with finding a doctor, locating a branch, or scheduling an appointment?"
    }
  }

  if (query.includes('rate') || query.includes('success') || query.includes('stat') || query.includes('percent')) {
    return {
      text: "Srikara Hospitals maintains elite clinical standards: a 98.6% critical recovery rate in neurology, over 25,000+ successful robotic joint replacements, and a sub-30 minute emergency cardiac response time."
    }
  }
  
  if (query.includes('thanks') || query.includes('thank you') || query.includes('cool') || query.includes('nice') || query.includes('great') || query.includes('bye')) {
    return {
      text: "You're very welcome! It's my pleasure to assist. Let me know if you have any other questions about Srikara Hospitals. Have a healthy day!"
    }
  }
  
  return {
    text: "Srikara Hospitals is dedicated to high-precision medicine and surgical excellence. I can help you search for specialists, check branch contact details, or request an appointment. What would you like to explore?",
    suggestions: ["Book an Appointment", "Find a Cardiologist", "Browse Locations", "Orthopaedics Robot Surgery"]
  }
}

export function AppointmentWidget({ currentBranch }) {
  const { branches } = useBranches()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: getGreetingMessage(location.pathname, currentBranch),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [suggestions, setSuggestions] = useState([
    "Book an Appointment",
    "Browse Locations",
    "Find a Doctor",
    "Robotic Ortho Surgery"
  ])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: currentBranch?.slug || '',
    specialty: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Show the greeting automatically after 2 seconds if not dismissed
    const isDismissed = sessionStorage.getItem('ai_greeting_dismissed') === 'true'
    
    if (!isDismissed && !isChatOpen) {
      const timer = setTimeout(() => {
        setShowGreeting(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [location.pathname, isChatOpen])

  useEffect(() => {
    // Reset messages when current branch shifts, to keep page-context correct
    setMessages([
      {
        sender: 'ai',
        text: getGreetingMessage(location.pathname, currentBranch),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }, [location.pathname, currentBranch])

  useEffect(() => {
    // Scroll to bottom of message list on updates
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  const handleSend = (textToSend) => {
    const text = textToSend || inputText
    if (!text.trim()) return

    // Add user message
    const userMsg = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    // Simulate AI thinking and typing delay
    setTimeout(() => {
      const aiReply = getAIResponse(text)
      const aiMsg = {
        sender: 'ai',
        text: aiReply.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: aiReply.action,
        actionLabel: aiReply.actionLabel,
        link: aiReply.link
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)

      if (aiReply.suggestions) {
        setSuggestions(aiReply.suggestions)
      } else {
        setSuggestions([
          "Book an Appointment",
          "Browse Locations",
          "Explore 3D Anatomy",
          "Cardiac Center Info"
        ])
      }
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)

    const branchInfo = branches.find(b => b.slug === formData.branch)
    const branchName = branchInfo?.title || formData.branch || 'General Srikara'

    const appointmentDetails = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      branch: branchName,
      doctor: 'Any Consultant',
      specialty: formData.specialty || 'General Consultation',
      slot: 'Requested via Chat Widget',
      timestamp: Date.now(),
      created_at: new Date().toISOString()
    }

    try {
      if (db) {
        await addDoc(collection(db, 'appointments'), appointmentDetails)
      } else {
        console.warn('Firebase DB is not initialized. Simulating success.', appointmentDetails)
      }

      alert(`Appointment request submitted successfully for ${formData.name}! Our coordinator will contact you at ${formData.phone} shortly.`)
      setOpen(false)
      setFormData({ name: '', phone: '', branch: currentBranch?.slug || '', specialty: '' })
    } catch (err) {
      console.error('Failed to save appointment in Firestore:', err)
      alert('Failed to request appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Dynamic AI Greeting Bubble */}
      <AnimatePresence>
        {showGreeting && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-[160px] lg:bottom-[96px] right-4 lg:right-8 z-40 w-[260px] sm:w-[290px] bg-white border border-slate-100/80 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.12)] p-4 select-none font-sans"
          >
            {/* Speech bubble tail */}
            <div className="absolute bottom-[-6px] right-5 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-100/80" />

            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B1A4A] animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-[#8B1A4A] tracking-wider flex items-center gap-1">
                    <Sparkles size={9} className="animate-spin-slow" /> Srikara AI Assistant
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 font-bold leading-normal pr-4">
                  {messages[0]?.text}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowGreeting(false)
                  sessionStorage.setItem('ai_greeting_dismissed', 'true')
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-50 flex items-center justify-center shrink-0"
                aria-label="Dismiss greeting"
              >
                <X size={12} />
              </button>
            </div>
            
            <div className="mt-2.5 pt-2 border-t border-slate-50 flex justify-end">
              <button
                onClick={() => {
                  setIsChatOpen(true)
                  setShowGreeting(false)
                }}
                className="text-[9px] font-black uppercase tracking-wider text-[#8B1A4A] hover:text-[#5E0F30] flex items-center gap-1"
              >
                Start Chat →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Bot Action Button */}
      {!isChatOpen && (
        <button
          onClick={() => {
            setIsChatOpen(true)
            setShowGreeting(false)
          }}
          className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-40 bg-gradient-to-br from-[#8B1A4A] to-[#2D3A4A] text-white rounded-full p-4 shadow-[0_12px_30px_rgba(139,26,74,0.35)] hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          aria-label="Srikara AI Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 group-hover:scale-95 transition-transform duration-200" />
            <Sparkles size={11} className="absolute -top-1.5 -right-1.5 text-pink-300 animate-pulse" />
          </div>
        </button>
      )}

      {/* Interactive AI Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 w-[320px] sm:w-[360px] h-[450px] sm:h-[500px] bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.18)] flex flex-col font-sans overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B1A4A] to-[#2D3A4A] px-4 py-3 text-white flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative p-1.5 bg-white/10 rounded-xl">
                  <Sparkles size={16} className="text-pink-300 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-wider leading-none">Srikara AI Care</span>
                  <span className="text-[9px] text-pink-200/80 font-bold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online Assistant
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/90 hover:text-white"
                aria-label="Close Chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFD]/50">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex flex-col max-w-[82%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div 
                    className={`px-3.5 py-2.5 rounded-2xl text-[11px] sm:text-xs leading-relaxed font-medium ${
                      msg.sender === 'user' 
                        ? 'bg-[#8B1A4A] text-white rounded-tr-none shadow-sm' 
                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    
                    {/* Render action trigger in chat */}
                    {msg.action === 'open_booking' && (
                      <button
                        onClick={() => setOpen(true)}
                        className="mt-3 w-full py-2 px-3 bg-[#8B1A4A] hover:bg-[#5E0F30] text-white font-bold text-[9px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Calendar size={10} /> {msg.actionLabel}
                      </button>
                    )}
                    
                    {/* Render Router page navigation links in chat */}
                    {msg.link && (
                      <Link 
                        to={msg.link}
                        onClick={() => setIsChatOpen(false)}
                        className="mt-3 w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[9px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md"
                      >
                        {msg.actionLabel} →
                      </Link>
                    )}
                  </div>
                  <span className="text-[8px] text-slate-400 mt-1 px-1 font-semibold">{msg.time}</span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex flex-col mr-auto max-w-[80%] items-start">
                  <div className="px-3.5 py-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions scrollbar */}
            <div className="px-3 py-2 bg-slate-50/70 border-t border-slate-100 overflow-x-auto flex gap-1.5 shrink-0 select-none custom-scrollbar">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200/60 rounded-full text-[9px] font-bold text-slate-600 hover:text-[#8B1A4A] whitespace-nowrap transition-all duration-200 shrink-0"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input area */}
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center shrink-0"
            >
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask AI Clinical Assistant..."
                disabled={isTyping}
                className="flex-1 text-xs h-[36px] bg-slate-50/50 border-slate-200/80 focus-visible:ring-[#8B1A4A]"
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="h-[36px] w-[36px] rounded-full bg-[#8B1A4A] hover:bg-[#5E0F30] text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 disabled:hover:bg-[#8B1A4A]"
                aria-label="Send message"
              >
                <Send size={14} className="stroke-[2.5]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog Form for Booking */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle className="text-[#8B1A4A] uppercase tracking-widest text-sm font-black flex items-center gap-1.5">
              <Calendar size={16} /> Request Srikara Appointment
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block text-slate-600 font-bold uppercase tracking-wider text-[9px] mb-1.5">
                Full Name
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter patient full name"
                className="text-xs focus-visible:ring-[#8B1A4A]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase tracking-wider text-[9px] mb-1.5">
                Phone Number
              </label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter contact number"
                className="text-xs focus-visible:ring-[#8B1A4A]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase tracking-wider text-[9px] mb-1.5">
                Select Branch
              </label>
              <Select
                required
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="text-xs focus-visible:ring-[#8B1A4A]"
              >
                <option value="">Choose Srikara Branch</option>
                {branches.map(branch => (
                  <option key={branch.slug} value={branch.slug}>
                    {branch.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase tracking-wider text-[9px] mb-1.5">
                Clinical Specialty
              </label>
              <Select
                required
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="text-xs focus-visible:ring-[#8B1A4A]"
              >
                <option value="">Choose Clinical Department</option>
                <option value="cardiology">Cardiology (Cardiac Care)</option>
                <option value="orthopedics">Orthopedics (Joint & Robotics)</option>
                <option value="neurosciences">Neurosciences (Neuro-Endovascular)</option>
                <option value="gastroenterology">Gastroenterology (GI & Liver)</option>
                <option value="nephrology">Nephrology (Renal Care)</option>
                <option value="pulmonology">Pulmonology (Respiratory)</option>
              </Select>
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#8B1A4A] hover:bg-[#5E0F30] text-white font-bold uppercase tracking-wider text-xs py-5 rounded-full mt-6 shadow-md transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Request Form'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
