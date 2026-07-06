import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { 
  Calendar, 
  Award, 
  GraduationCap, 
  ChevronRight, 
  Mail, 
  Users, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  Globe, 
  Percent, 
  Send,
  Briefcase,
  HelpCircle
} from 'lucide-react'

// Styles for colourful glassmorphic elements matching the Srikara website's guidelines
const CAREER_STYLES = `
  .font-garamond { font-family: 'Cormorant Garamond', serif; }
  
  .glass-card-colorful {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.5));
    box-shadow: 0 10px 30px -10px var(--glass-shadow, rgba(139, 26, 74, 0.05)),
                inset 0 0 0 1px rgba(255, 255, 255, 0.8);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  
  .glass-card-colorful:hover {
    transform: translateY(-6px);
    border-color: var(--glass-border-hover, rgba(139, 26, 74, 0.25));
    box-shadow: 0 20px 40px -10px var(--glass-shadow-hover, rgba(139, 26, 74, 0.15)),
                inset 0 0 0 1px rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.85);
  }

  .dark-glass-card {
    background: rgba(45, 58, 74, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }

  .animate-pulse-slow {
    animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.12; transform: scale(1); }
    50% { opacity: 0.22; transform: scale(1.08); }
  }
`

const WHY_CHOOSE_US = [
  {
    title: 'Intensive, Hands-on Training',
    desc: 'Unlike traditional fellowships, our fellows actively assist as first assistants in surgeries rather than merely observing.',
    icon: Activity,
    style: {
      '--glass-border': 'rgba(244, 63, 94, 0.15)',
      '--glass-border-hover': 'rgba(244, 63, 94, 0.45)',
      '--glass-shadow': 'rgba(244, 63, 94, 0.06)',
      '--glass-shadow-hover': 'rgba(244, 63, 94, 0.16)',
    },
    iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
    blobColor: 'bg-rose-500/10'
  },
  {
    title: 'High Surgical Volume',
    desc: 'Gain exposure to a wide spectrum of arthroplasty surgeries in a short period.',
    icon: Calendar,
    style: {
      '--glass-border': 'rgba(245, 158, 11, 0.15)',
      '--glass-border-hover': 'rgba(245, 158, 11, 0.45)',
      '--glass-shadow': 'rgba(245, 158, 11, 0.06)',
      '--glass-shadow-hover': 'rgba(245, 158, 11, 0.16)',
    },
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    blobColor: 'bg-amber-500/10'
  },
  {
    title: 'World-Class Faculty',
    desc: 'Learn under the guidance of renowned orthopedic surgeons specializing in robotic and conventional joint replacement.',
    icon: Users,
    style: {
      '--glass-border': 'rgba(16, 185, 129, 0.15)',
      '--glass-border-hover': 'rgba(16, 185, 129, 0.45)',
      '--glass-shadow': 'rgba(16, 185, 129, 0.06)',
      '--glass-shadow-hover': 'rgba(16, 185, 129, 0.16)',
    },
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    blobColor: 'bg-emerald-500/10'
  },
  {
    title: 'Global Recognition',
    desc: 'Our past fellows have ranked this as one of the best arthroplasty fellowships in India.',
    icon: Globe,
    style: {
      '--glass-border': 'rgba(99, 102, 241, 0.15)',
      '--glass-border-hover': 'rgba(99, 102, 241, 0.45)',
      '--glass-shadow': 'rgba(99, 102, 241, 0.06)',
      '--glass-shadow-hover': 'rgba(99, 102, 241, 0.16)',
    },
    iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    blobColor: 'bg-indigo-500/10'
  },
  {
    title: 'Limited Availability',
    desc: 'Only 2 seats per month, ensuring focused, high-quality training.',
    icon: Award,
    style: {
      '--glass-border': 'rgba(139, 26, 74, 0.15)',
      '--glass-border-hover': 'rgba(139, 26, 74, 0.45)',
      '--glass-shadow': 'rgba(139, 26, 74, 0.06)',
      '--glass-shadow-hover': 'rgba(139, 26, 74, 0.16)',
    },
    iconBg: 'bg-[#FFF0F5] text-[#8B1A4A] border border-[#FFE4E1]',
    blobColor: 'bg-[#8B1A4A]/10'
  },
]

const ROLES = [
  'OPD at different centers',
  'Regular ward work & patient care',
  'Surgical assistance as First Assistant',
  'Academic & research participation',
]

const FEES = [
  { 
    period: 'June 2024 – Feb 2025', 
    rate: '₹60,000 / mo', 
    badge: 'Past Cohorts',
    style: {
      '--glass-border': 'rgba(100, 116, 139, 0.15)',
      '--glass-border-hover': 'rgba(100, 116, 139, 0.45)',
      '--glass-shadow': 'rgba(100, 116, 139, 0.06)',
      '--glass-shadow-hover': 'rgba(100, 116, 139, 0.16)',
    },
    badgeColor: 'bg-slate-100 text-slate-500 border border-slate-200'
  },
  { 
    period: 'March 2025 – March 2026', 
    rate: '₹80,000 / mo', 
    badge: 'Past Cohorts',
    style: {
      '--glass-border': 'rgba(99, 102, 241, 0.15)',
      '--glass-border-hover': 'rgba(99, 102, 241, 0.45)',
      '--glass-shadow': 'rgba(99, 102, 241, 0.06)',
      '--glass-shadow-hover': 'rgba(99, 102, 241, 0.16)',
    },
    badgeColor: 'bg-indigo-50 text-indigo-600 border border-indigo-100'
  },
  { 
    period: 'April 2026 – Dec 2026', 
    rate: '₹1,00,000 / mo', 
    badge: 'Active Cohort', 
    active: true,
    style: {
      '--glass-border': 'rgba(139, 26, 74, 0.35)',
      '--glass-border-hover': 'rgba(139, 26, 74, 0.65)',
      '--glass-shadow': 'rgba(139, 26, 74, 0.12)',
      '--glass-shadow-hover': 'rgba(139, 26, 74, 0.28)',
    },
    badgeColor: 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
  },
]

const REFUNDS = [
  { 
    timeline: '6+ Months Before', 
    pct: '100% Refund', 
    amt: '₹10,000',
    style: {
      '--glass-border': 'rgba(16, 185, 129, 0.15)',
      '--glass-border-hover': 'rgba(16, 185, 129, 0.45)',
      '--glass-shadow': 'rgba(16, 185, 129, 0.06)',
      '--glass-shadow-hover': 'rgba(16, 185, 129, 0.16)',
    },
    textColor: 'text-emerald-700'
  },
  { 
    timeline: '3–6 Months Before', 
    pct: '80% Refund', 
    amt: '₹8,000',
    style: {
      '--glass-border': 'rgba(20, 184, 166, 0.15)',
      '--glass-border-hover': 'rgba(20, 184, 166, 0.45)',
      '--glass-shadow': 'rgba(20, 184, 166, 0.06)',
      '--glass-shadow-hover': 'rgba(20, 184, 166, 0.16)',
    },
    textColor: 'text-teal-700'
  },
  { 
    timeline: '1–3 Months Before', 
    pct: '60% Refund', 
    amt: '₹6,000',
    style: {
      '--glass-border': 'rgba(245, 158, 11, 0.15)',
      '--glass-border-hover': 'rgba(245, 158, 11, 0.45)',
      '--glass-shadow': 'rgba(245, 158, 11, 0.06)',
      '--glass-shadow-hover': 'rgba(245, 158, 11, 0.16)',
    },
    textColor: 'text-amber-700'
  },
  { 
    timeline: 'Less than 1 Month', 
    pct: '40% Refund', 
    amt: '₹4,000',
    style: {
      '--glass-border': 'rgba(244, 63, 94, 0.15)',
      '--glass-border-hover': 'rgba(244, 63, 94, 0.45)',
      '--glass-shadow': 'rgba(244, 63, 94, 0.06)',
      '--glass-shadow-hover': 'rgba(244, 63, 94, 0.16)',
    },
    textColor: 'text-rose-700'
  },
]

export function CareersPage() {
  const [selectedMonth, setSelectedMonth] = useState('April 2026')
  const [candidateName, setCandidateName] = useState('')
  const [candidateQualification, setCandidateQualification] = useState('MS (Orthopedics)')
  const [emailCopied, setEmailCopied] = useState(false)
  const [targetApplication, setTargetApplication] = useState('Arthroplasty Fellowship')

  // Dynamic CMS States
  const [jobOpenings, setJobOpenings] = useState([])
  const [fellowshipDetails, setFellowshipDetails] = useState({
    duration: '1 Month',
    eligibility: 'MS (Orthopedics) / D.Ortho',
    seats: 2,
    fees: FEES,
    refunds: REFUNDS,
    postponementCharge: '₹10,000',
    faqs: []
  })

  // 1. Fetch Dynamic Data from database if Firebase is initialized
  useEffect(() => {
    const fetchCMSData = async () => {
      try {
        const firebaseLib = await import('@/lib/firebase')
        const db = firebaseLib.db
        if (!db) return

        const firestoreModule = await import('firebase/firestore')
        const { doc, getDoc, collection, getDocs } = firestoreModule

        // Fetch Fellowship Settings
        const fellRef = doc(db, 'fellowship_details', 'arthroplasty')
        const fellSnap = await getDoc(fellRef)
        if (fellSnap.exists()) {
          setFellowshipDetails(prev => ({ ...prev, ...fellSnap.data() }))
        }

        // Fetch Job Openings
        const jobSnap = await getDocs(collection(db, 'job_openings'))
        const jobList = jobSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        // Filter out closed openings
        const activeJobs = jobList.filter(j => j.status === 'Active')
        setJobOpenings(activeJobs)
      } catch (err) {
        console.warn('Firebase config offline. Operating in static mode.')
      }
    }
    fetchCMSData()
  }, [])

  const subject = encodeURIComponent(`Application for ${targetApplication} - ${candidateQualification}`)
  const body = encodeURIComponent(
    `Respected HR Team,\n\nI am writing to apply for the ${targetApplication} position at Srikara Hospitals.\n\nHere are my application details:\n- Name: ${candidateName || '[Your Name]'}\n- Qualification: ${candidateQualification}\n- Preferred Starting: ${selectedMonth}\n\nI have attached my academic credentials and curriculum vitae for your kind perusal.\n\nThank you.\n\nWarm regards,\n${candidateName || '[Your Name]'}`
  )

  const handleApplyClick = () => {
    window.location.href = `mailto:hr@srikarahospitals.com?subject=${subject}&body=${body}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText('hr@srikarahospitals.com')
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  const selectJobForApplication = (jobTitle) => {
    setTargetApplication(jobTitle)
    const element = document.getElementById('apply-portal')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Helmet>
        <title>Careers & Arthroplasty Fellowship | Srikara Hospitals</title>
        <meta 
          name="description" 
          content="Accelerate your orthopedic career with Srikara Hospitals' highly sought-after Arthroplasty Fellowship. Explore dynamic job openings." 
        />
        <style>{CAREER_STYLES}</style>
      </Helmet>

      <div className="min-h-screen bg-[#FFF9FA] text-[#1A202C] selection:bg-[#8B1A4A] selection:text-white relative overflow-hidden pb-12">
        {/* Navigation */}
        <StickyNavbar />

        {/* Ambient Blur Bubbles (Glassmorphism Backdrop) */}
        <div className="absolute top-[120px] -left-[100px] w-[400px] h-[400px] rounded-full bg-[#8B1A4A] opacity-10 blur-[130px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-[500px] -right-[150px] w-[500px] h-[500px] rounded-full bg-[#2D3A4A] opacity-5 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[200px] left-[5%] w-[350px] h-[350px] rounded-full bg-[#8B1A4A] opacity-[0.06] blur-[110px] pointer-events-none animate-pulse-slow" />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-6 pt-32 lg:pt-40 relative z-10">
          
          {/* ══════════════ HERO SECTION ══════════════ */}
          <section className="text-center max-w-4xl mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                '--glass-border': 'rgba(139, 26, 74, 0.2)',
                '--glass-shadow': 'rgba(139, 26, 74, 0.05)'
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-colorful mb-6 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#8B1A4A]" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8B1A4A]">Academics & Surgical Training</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-garamond text-4xl md:text-6xl font-bold leading-tight mb-6 text-[#1A202C]"
            >
              Advancing Surgical Excellence in <span className="hero-gradient-text italic font-serif">Arthroplasty</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#4A4A4A] text-base md:text-lg leading-relaxed font-light mb-10 max-w-3xl mx-auto"
            >
              Srikara Hospitals is a leader in robotic joint replacement surgery and is actively engaged in academics and teaching. Our Arthroplasty Fellowship is one of the most sought-after programs in India, attracting orthopedic surgeons globally.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <a 
                href="#apply-portal"
                className="bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] transition-all duration-300 font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full shadow-lg shadow-[#8B1A4A]/20 active:scale-95 flex items-center gap-2"
              >
                Apply for Fellowship <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
          </section>

          {/* ══════════════ WHY CHOOSE US SECTION ══════════════ */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="font-garamond text-3xl md:text-4xl font-bold mb-4">Why Choose Srikara’s Arthroplasty Fellowship?</h2>
              <div className="w-16 h-[2.5px] bg-[#8B1A4A]/30 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {WHY_CHOOSE_US.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  style={item.style}
                  className="glass-card-colorful rounded-[28px] p-8 flex flex-col group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-xl rounded-full translate-x-6 -translate-y-6 ${item.blobColor} transition-transform duration-700 group-hover:scale-150`} />
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 shadow-sm ${item.iconBg} group-hover:scale-110`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-headline font-bold text-lg text-[#1A202C] mb-3 group-hover:text-[#8B1A4A] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══════════════ FELLOWSHIP DETAILS & ROLES ══════════════ */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24 items-stretch">
            
            {/* Academic Core Parameters */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                '--glass-border': 'rgba(45, 58, 74, 0.15)',
                '--glass-border-hover': 'rgba(45, 58, 74, 0.45)',
                '--glass-shadow': 'rgba(45, 58, 74, 0.06)',
                '--glass-shadow-hover': 'rgba(45, 58, 74, 0.16)'
              }}
              className="lg:col-span-7 glass-card-colorful rounded-[32px] p-8 md:p-10 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-garamond text-3xl font-bold text-[#8B1A4A] mb-6">Fellowship Specifications</h3>
                <p className="text-[#4A4A4A] text-sm font-light mb-8 leading-relaxed">
                  The fellowship runs in monthly cohorts with extremely limited seats to guarantee dedicated surgical training. Our structured guidelines offer a blend of clinical and surgical activities.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex-shrink-0 flex items-center justify-center text-[#2D3A4A] shadow-sm">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60">Duration</p>
                      <p className="font-bold text-base text-[#1A202C] mt-0.5">{fellowshipDetails.duration}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex-shrink-0 flex items-center justify-center text-[#2D3A4A] shadow-sm">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60">Eligibility</p>
                      <p className="font-bold text-base text-[#1A202C] mt-0.5">{fellowshipDetails.eligibility}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex-shrink-0 flex items-center justify-center text-[#2D3A4A] shadow-sm">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60">Certification</p>
                      <p className="font-bold text-base text-[#1A202C] mt-0.5">Fellowship Certificate</p>
                      <p className="text-[10px] text-gray-500 italic mt-0.5">Upon successful completion</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex-shrink-0 flex items-center justify-center text-[#2D3A4A] shadow-sm">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60">Capacity</p>
                      <p className="font-bold text-base text-[#1A202C] mt-0.5">{fellowshipDetails.seats} Seats / Month</p>
                      <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Strictly Limited</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#8B1A4A]/10 pt-6 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-[#4A4A4A] italic font-light">
                  All training is conducted inside Srikara's advanced operating theatres.
                </p>
              </div>
            </motion.div>

            {/* Hands-On Roles */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                '--glass-border': 'rgba(45, 58, 74, 0.15)',
                '--glass-border-hover': 'rgba(45, 58, 74, 0.45)',
                '--glass-shadow': 'rgba(45, 58, 74, 0.06)',
                '--glass-shadow-hover': 'rgba(45, 58, 74, 0.16)'
              }}
              className="lg:col-span-5 glass-card-colorful rounded-[32px] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A4A]/[0.02] to-transparent pointer-events-none" />
              <div>
                <h3 className="font-garamond text-3xl font-bold text-[#2D3A4A] mb-6">Fellowship Roles</h3>
                <p className="text-[#4A4A4A] text-sm font-light mb-8 leading-relaxed">
                  Fellows are fully integrated into our clinical hierarchy to experience comprehensive workflow management:
                </p>

                <div className="space-y-4">
                  {ROLES.map((role, idx) => (
                    <motion.div 
                      key={idx} 
                      style={{
                        '--glass-border': 'rgba(45, 58, 74, 0.08)',
                        '--glass-border-hover': 'rgba(45, 58, 74, 0.25)'
                      }}
                      className="flex items-center gap-3.5 p-3.5 rounded-xl glass-card-colorful shadow-sm"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#8B1A4A]" />
                      <span className="text-sm font-semibold text-[#2D3A4A]">{role}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 text-xs flex gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="leading-relaxed">
                  <strong>Duty Clause:</strong> Attendance at clinical OPD, surgical rotations, and ward rounds is required for final certificate eligibility.
                </p>
              </div>
            </motion.div>

          </section>

          {/* ══════════════ FEE STRUCTURE SECTION ══════════════ */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="font-garamond text-3xl md:text-4xl font-bold mb-4">Fellowship Fee Structure</h2>
              <p className="text-[#4A4A4A] text-sm font-light max-w-xl mx-auto">
                Overview of fees across schedules. The booking amount secures your slot.
              </p>
              <div className="w-16 h-[2.5px] bg-[#8B1A4A]/30 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
              {fellowshipDetails.fees.map((item, idx) => {
                const defaultStyles = FEES[idx] || FEES[FEES.length - 1]
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    style={defaultStyles.style}
                    className={`glass-card-colorful rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden ${
                      item.active 
                      ? 'scale-105 z-10 border-[#8B1A4A]/40' 
                      : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    {item.active && (
                      <>
                        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#8B1A4A]/10 blur-2xl rounded-full animate-pulse-slow" />
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8B1A4A] text-white text-[9px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full shadow-md">
                          Current Cohort
                        </div>
                      </>
                    )}
                    
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${defaultStyles.badgeColor}`}>
                        {item.active ? 'Active Cohort' : 'Past Cohorts'}
                      </span>
                      <h4 className="font-headline font-bold text-base text-[#2D3A4A] mt-6 mb-2">{item.period}</h4>
                      <p className="text-[10px] text-gray-500 font-medium">Fellowship Training Cost</p>
                    </div>

                    <div className="my-8">
                      <p className="text-3xl font-black text-[#8B1A4A] tracking-tight">{item.rate}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Paid monthly in advance</p>
                    </div>

                    <div className="border-t border-gray-200/50 pt-4">
                      <p className="text-xs text-[#4A4A4A] leading-relaxed">
                        Includes hospital rotation rights, theatre access, and documentation.
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Booking callout */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                '--glass-border': 'rgba(139, 26, 74, 0.25)',
                '--glass-border-hover': 'rgba(139, 26, 74, 0.5)',
                '--glass-shadow': 'rgba(139, 26, 74, 0.05)'
              }}
              className="glass-card-colorful rounded-2xl p-6 max-w-xl mx-auto mt-10 border-dashed text-center"
            >
              <p className="text-[#8B1A4A] text-sm font-bold">
                Booking Amount: ₹10,000 <span className="text-[#2D3A4A] font-light">(Adjustable in the final tuition fee structure)</span>
              </p>
            </motion.div>
          </section>

          {/* ══════════════ REFUND & POSTPONEMENT POLICY ══════════════ */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="font-garamond text-3xl md:text-4xl font-bold mb-4">Refund & Postponement Policy</h2>
              <div className="w-16 h-[2.5px] bg-[#8B1A4A]/30 mx-auto" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
              
              {/* Refund percentages */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-5">
                {fellowshipDetails.refunds.map((r, idx) => {
                  const defaultRef = REFUNDS[idx] || REFUNDS[REFUNDS.length - 1]
                  return (
                    <div 
                      key={idx} 
                      style={defaultRef.style}
                      className="glass-card-colorful rounded-2xl p-6 flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">{r.timeline}</p>
                        <p className={`font-garamond ${defaultRef.textColor} text-xl font-bold mt-2`}>{r.pct}</p>
                      </div>
                      <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#8B1A4A]">Returns</span>
                        <span className={`text-sm font-black ${defaultRef.textColor}`}>{r.amt}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Postponement rules */}
              <div 
                style={{
                  '--glass-border': 'rgba(139, 26, 74, 0.25)',
                  '--glass-border-hover': 'rgba(139, 26, 74, 0.5)',
                  '--glass-shadow': 'rgba(139, 26, 74, 0.08)',
                  '--glass-shadow-hover': 'rgba(139, 26, 74, 0.18)'
                }}
                className="lg:col-span-5 glass-card-colorful rounded-[28px] p-8 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B1A4A]/5 blur-xl rounded-full translate-x-8 -translate-y-8" />
                <div>
                  <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-[#8B1A4A] mb-5 shadow-sm">
                    <Percent className="w-5 h-5" />
                  </div>
                  <h3 className="font-headline font-bold text-lg text-[#2D3A4A] mb-3">Postponement Policy</h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed font-light mb-6">
                    We understand that emergencies arise. Candidates must inform our academic cell at least <strong>1 month in advance</strong> to change slots to a future date without additional fees.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-[#8B1A4A] text-xs">
                  <p className="font-semibold leading-relaxed">
                    🚨 Late Requests: Requests submitted less than 1 month before the fellowship start date will incur a {fellowshipDetails.postponementCharge || '₹10,000'} deferral charge.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ══════════════ FREQUENTLY ASKED QUESTIONS (DYNAMIC FAQ ACCORDIONS) ══════════════ */}
          {fellowshipDetails.faqs && fellowshipDetails.faqs.length > 0 && (
            <section className="mb-24 max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-garamond text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                  <HelpCircle className="w-7 h-7 text-[#8B1A4A]" /> Frequently Asked Questions
                </h2>
                <div className="w-16 h-[2.5px] bg-[#8B1A4A]/30 mx-auto mt-4" />
              </div>

              <div className="space-y-4">
                {fellowshipDetails.faqs.map((faq, idx) => (
                  <FAQAccordionItem key={idx} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </section>
          )}

          {/* ══════════════ DYNAMIC ACTIVE JOB OPENINGS ══════════════ */}
          {jobOpenings.length > 0 && (
            <section className="mb-24">
              <div className="text-center mb-16">
                <h2 className="font-garamond text-3xl md:text-4xl font-bold mb-4">Active Career Opportunities</h2>
                <p className="text-[#4A4A4A] text-sm font-light max-w-xl mx-auto">
                  Join our clinical team across various specialties and locations.
                </p>
                <div className="w-16 h-[2.5px] bg-[#8B1A4A]/30 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {jobOpenings.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                      '--glass-border': 'rgba(45, 58, 74, 0.15)',
                      '--glass-border-hover': 'rgba(139, 26, 74, 0.45)',
                      '--glass-shadow': 'rgba(45, 58, 74, 0.05)',
                      '--glass-shadow-hover': 'rgba(139, 26, 74, 0.15)',
                    }}
                    className="glass-card-colorful rounded-[28px] p-8 flex flex-col justify-between group transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#8B1A4A] shadow-sm">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                          {job.department}
                        </span>
                      </div>
                      
                      <h3 className="font-headline font-bold text-lg text-[#1A202C] mb-2 group-hover:text-[#8B1A4A] transition-colors">
                        {job.title}
                      </h3>
                      
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">
                        📍 {job.location} · 💼 {job.experience || 'Experience: Open'}
                      </p>

                      <p className="text-sm text-[#4A4A4A] leading-relaxed font-light mb-6 whitespace-pre-line">
                        {job.description}
                      </p>
                    </div>

                    <button
                      onClick={() => selectJobForApplication(job.title)}
                      className="w-full h-12 rounded-xl border border-[#8B1A4A]/25 text-[#8B1A4A] hover:bg-[#8B1A4A] hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                    >
                      Apply For This Position <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ══════════════ HOW TO APPLY (INTERACTIVE COMPONENT) ══════════════ */}
          <section id="apply-portal" className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="font-garamond text-3xl md:text-4xl font-bold mb-4">Interactive Application Portal</h2>
              <p className="text-[#4A4A4A] text-sm font-light">
                Fill in your details below to generate your direct application email layout.
              </p>
              <div className="w-16 h-[2.5px] bg-[#8B1A4A]/30 mx-auto mt-4" />
            </div>

            <div 
              style={{
                '--glass-border': 'rgba(139, 92, 246, 0.2)',
                '--glass-border-hover': 'rgba(139, 92, 246, 0.45)',
                '--glass-shadow': 'rgba(139, 92, 246, 0.08)',
                '--glass-shadow-hover': 'rgba(139, 92, 246, 0.18)'
              }}
              className="glass-card-colorful rounded-[32px] p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-400/5 blur-2xl rounded-full translate-x-12 -translate-y-12" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8B1A4A]/5 blur-2xl rounded-full -translate-x-12 translate-y-12" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
                
                {/* Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">Applying For</label>
                    <input 
                      type="text" 
                      value={targetApplication}
                      onChange={(e) => setTargetApplication(e.target.value)}
                      className="w-full px-4 h-12 rounded-xl bg-white/70 border border-slate-200 focus:border-[#8B1A4A]/50 outline-none text-sm transition-all shadow-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">Your Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Dr. Sanjay Kumar" 
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full px-4 h-12 rounded-xl bg-white/70 border border-slate-200 focus:border-[#8B1A4A]/50 outline-none text-sm transition-all shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">Qualifications</label>
                      <select 
                        value={candidateQualification}
                        onChange={(e) => setCandidateQualification(e.target.value)}
                        className="w-full px-3 h-12 rounded-xl bg-white/70 border border-slate-200 focus:border-[#8B1A4A]/50 outline-none text-sm transition-all shadow-sm cursor-pointer"
                      >
                        <option>MS (Orthopedics)</option>
                        <option>D.Ortho</option>
                        <option>Other Equivalent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">Preferred Slot</label>
                      <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full px-3 h-12 rounded-xl bg-white/70 border border-slate-200 focus:border-[#8B1A4A]/50 outline-none text-sm transition-all shadow-sm cursor-pointer"
                      >
                        <option>April 2026</option>
                        <option>May 2026</option>
                        <option>June 2026</option>
                        <option>July 2026</option>
                        <option>August 2026</option>
                        <option>September 2026</option>
                        <option>October 2026</option>
                        <option>November 2026</option>
                        <option>December 2026</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Live Preview Pane */}
                <div className="flex flex-col">
                  <span className="block text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">Email Preview</span>
                  <div className="flex-1 p-5 rounded-2xl bg-white/50 border border-slate-100 shadow-sm text-xs font-mono text-[#2D3A4A] overflow-y-auto max-h-[230px] leading-relaxed relative">
                    <p className="text-slate-400 mb-2">To: hr@srikarahospitals.com</p>
                    <p className="text-slate-400 mb-4 pb-2 border-b border-slate-200/50">Subject: Application for {targetApplication} - {candidateQualification}</p>
                    <p className="whitespace-pre-line text-[#4A4A4A]">
                      Respected HR Team,
                      {"\n\n"}I am writing to apply for the {targetApplication} position at Srikara Hospitals.
                      {"\n\n"}Details:
                      {"\n"}- Name: {candidateName || 'Dr. [Your Name]'}
                      {"\n"}- Qualification: {candidateQualification}
                      {"\n"}- Preferred Slot: {selectedMonth}
                      {"\n\n"}I have attached my credentials and CV.
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between pt-6 border-t border-black/5 relative z-10">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Direct Application Contact</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-sm text-[#2D3A4A]">hr@srikarahospitals.com</span>
                    <button 
                      onClick={copyToClipboard}
                      className="text-[10px] font-black uppercase text-[#8B1A4A] hover:underline"
                    >
                      {emailCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleApplyClick}
                  className="w-full sm:w-auto bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] transition-all duration-300 font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full flex items-center justify-center gap-2.5 shadow-md active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" /> Launch Email Client
                </button>
              </div>

            </div>
          </section>

          {/* ══════════════ CALL TO ACTION BANNER ══════════════ */}
          <section className="mb-12">
            <div className="dark-glass-card rounded-[32px] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,26,74,0.18),transparent)] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 blur-2xl rounded-full pointer-events-none" />
              
              <h2 className="font-garamond text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Take the Next Step in Your Career!
              </h2>
              <p className="text-white/80 font-light text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Join us at Srikara Hospitals and gain unparalleled surgical expertise in arthroplasty and joint replacement surgery. Be part of a program that shapes the future of orthopedic excellence!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="mailto:hr@srikarahospitals.com?subject=Inquiry about Arthroplasty Fellowship"
                  className="w-full sm:w-auto px-8 h-14 rounded-full bg-white text-[#8B1A4A] font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#FFF9FA] transition-all shadow-lg"
                >
                  <Mail className="w-4 h-4" /> Inquiry via Email
                </a>
                <a 
                  href="#apply-portal"
                  className="w-full sm:w-auto px-8 h-14 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center transition-all shadow-md"
                >
                  Apply Online
                </a>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <Footer />
        
        {/* Mobile bottom nav for phone layouts */}
        <MobileBottomNav />
      </div>
    </>
  )
}

// ══════════════ ACCORDION FAQ ITEM HELPER ══════════════
function FAQAccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div 
      style={{
        '--glass-border': 'rgba(139, 26, 74, 0.12)',
        '--glass-border-hover': 'rgba(139, 26, 74, 0.25)',
        '--glass-shadow': 'rgba(139, 26, 74, 0.02)'
      }}
      className="glass-card-colorful rounded-2xl overflow-hidden"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-[#8B1A4A]/[0.02] transition-colors outline-none"
      >
        <span className="font-headline font-bold text-sm text-[#2D3A4A]">{question}</span>
        <span className="text-lg font-black text-[#8B1A4A] transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>
          ＋
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-100/50 bg-white/30"
          >
            <p className="p-6 text-xs text-[#4A4A4A] leading-relaxed font-light whitespace-pre-line">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
