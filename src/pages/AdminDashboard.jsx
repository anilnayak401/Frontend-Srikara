import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid
} from 'recharts'
import { 
  LineChart, 
  Users, 
  Briefcase, 
  Award, 
  LogOut, 
  Lock, 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Search,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Clock,
  Eye,
  FileText,
  Sliders,
  DollarSign
} from 'lucide-react'

// Import Firebase SDK statically
import { auth, db, storage } from '@/lib/firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const DASH_STYLES = `
  .font-garamond { font-family: 'Cormorant Garamond', serif; }
  .glass-card-admin {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid rgba(139, 26, 74, 0.08);
    box-shadow: 0 10px 35px -10px rgba(139, 26, 74, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  }
  .glass-input {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(139, 26, 74, 0.12);
    outline: none;
    transition: all 0.3s ease;
  }
  .glass-input:focus {
    border-color: rgba(139, 26, 74, 0.45);
    box-shadow: 0 0 0 3px rgba(139, 26, 74, 0.08);
  }
  .active-tab-nav {
    background: #8B1A4A;
    color: white !important;
    box-shadow: 0 10px 25px -10px rgba(139, 26, 74, 0.45);
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(139, 26, 74, 0.02);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(139, 26, 74, 0.15);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 26, 74, 0.3);
  }
`

// Default mock datasets for demo mode
const MOCK_ANALYTICS = [
  { date: '07/01', pageviews: 450 },
  { date: '07/02', pageviews: 520 },
  { date: '07/03', pageviews: 490 },
  { date: '07/04', pageviews: 610 },
  { date: '07/05', pageviews: 580 },
  { date: '07/06', pageviews: 720 },
  { date: '07/07', pageviews: 890 }
]

const MOCK_DEVICE_DATA = [
  { name: 'Mobile', value: 65, color: '#8B1A4A' },
  { name: 'Desktop', value: 35, color: '#2D3A4A' }
]

// Normalised click coordinates scatter map (Simulating website heat map zones)
const MOCK_CLICK_HEATMAP = [
  { x: 10, y: 15, count: 50 }, // Home
  { x: 30, y: 15, count: 80 }, // Specialties
  { x: 50, y: 15, count: 120 }, // Logo
  { x: 70, y: 15, count: 40 }, // Doctors
  { x: 90, y: 15, count: 95 }, // Book Appointment
  { x: 35, y: 40, count: 30 }, // Hero click left
  { x: 65, y: 45, count: 75 }, // Hero click right
  { x: 25, y: 70, count: 60 }, // Find Hospital card 1
  { x: 50, y: 72, count: 85 }, // Find Hospital card 2
  { x: 75, y: 70, count: 55 }  // Find Hospital card 3
]

const MOCK_CLICKS = [
  { element: 'button#book-now', text: 'Book Appointment', path: '/home', count: 142 },
  { element: 'a#careers-link', text: 'Careers & Fellowship', path: '/footer', count: 98 },
  { element: 'button#email-launch', text: 'Launch Email Client', path: '/careers', count: 64 },
  { element: 'a#specialties-3d', text: '3D Anatomy Explorer', path: '/navbar', count: 52 },
  { element: 'button#contact-branch', text: 'Call Now', path: '/branches/ecil', count: 48 }
]

const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Akhil Dadi', specialty: 'Robotic Joint Replacement', experience: '20+ Yrs', branch: 'LB Nagar', bio: 'Renowned joint replacement specialist.', photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300', status: 'Active' },
  { id: '2', name: 'Dr. Radhika Sen', specialty: 'Cardiology & Heart Care', experience: '15 Yrs', branch: 'Kompally', bio: 'Expert interventional cardiologist.', photoUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300', status: 'Active' }
]

const MOCK_JOBS = [
  { id: '1', title: 'Consultant Orthopedic Surgeon', department: 'Orthopedics', location: 'LB Nagar, Hyd', experience: '5+ Yrs', description: 'Requires MS Orthopedics. Experience in robotic joint replacement surgery is preferred.', status: 'Active' },
  { id: '2', title: 'Senior Physiotherapist', department: 'Rehabilitation', location: 'Miyapur, Hyd', experience: '3 Yrs', description: 'Requires BPT / MPT. Must manage post-operative joint rehabilitation caseloads.', status: 'Closed' }
]

const MOCK_FELLOWSHIP = {
  duration: '1 Month',
  eligibility: 'MS (Orthopedics) / D.Ortho',
  seats: 2,
  fees: [
    { period: 'June 2024 – Feb 2025', rate: '₹60,000 / mo', active: false },
    { period: 'March 2025 – March 2026', rate: '₹80,000 / mo', active: false },
    { period: 'April 2026 – Dec 2026', rate: '₹1,00,000 / mo', active: true }
  ],
  refunds: [
    { timeline: '6+ Months Before', pct: '100% Refund', amt: '₹10,000', textColor: 'text-emerald-700' },
    { timeline: '3–6 Months Before', pct: '80% Refund', amt: '₹8,000', textColor: 'text-teal-700' },
    { timeline: '1–3 Months Before', pct: '60% Refund', amt: '₹6,000', textColor: 'text-amber-700' },
    { timeline: 'Less than 1 Month', pct: '40% Refund', amt: '₹4,000', textColor: 'text-rose-700' }
  ],
  postponementCharge: '₹10,000',
  faqs: [
    { question: 'What surgeries will I assist as First Assistant?', answer: 'Fellows assist in primary/revision knee and hip arthroplasty, and robotic joint replacements.' },
    { question: 'Is accommodation provided during the fellowship?', answer: 'Accommodation is not included but our coordinators assist in locating nearby facilities.' }
  ]
}

export function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('analytics')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Data States
  const [analyticsData, setAnalyticsData] = useState(MOCK_ANALYTICS)
  const [deviceData, setDeviceData] = useState(MOCK_DEVICE_DATA)
  const [clickHeatmap, setClickHeatmap] = useState(MOCK_CLICK_HEATMAP)
  const [clickLogs, setClickLogs] = useState(MOCK_CLICKS)
  const [doctors, setDoctors] = useState(MOCK_DOCTORS)
  const [jobs, setJobs] = useState(MOCK_JOBS)
  const [fellowship, setFellowship] = useState(MOCK_FELLOWSHIP)

  // Filters & Search
  const [doctorSearch, setDoctorSearch] = useState('')
  const [jobSearch, setJobSearch] = useState('')

  // Selected Editor Elements
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)

  // Inputs for creation
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', experience: '', branch: '', bio: '', photoUrl: '', status: 'Active' })
  const [newJob, setNewJob] = useState({ title: '', department: '', location: '', experience: '', description: '', status: 'Active' })
  const [photoFile, setPhotoFile] = useState(null)

  // Dynamic list editors inputs
  const [newRoleText, setNewRoleText] = useState('')
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })

  // 1. Auth Observer
  useEffect(() => {
    if (!auth) {
      console.log('Firebase credentials not set. Booting control center in simulation mode.')
      setUser({ email: 'admin@srikara.com', displayName: 'Manager' }) // Auto login in developer environment
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        loadAllData()
      }
    })
    return () => unsubscribe()
  }, [])

  // 2. Fetch Data from Firestore
  const loadAllData = async () => {
    if (!db) return
    setLoading(true)
    try {
      // Load Doctors
      const docSnap = await getDocs(collection(db, 'doctors'))
      const docList = docSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      if (docList.length > 0) setDoctors(docList)

      // Load Job Openings
      const jobSnap = await getDocs(collection(db, 'job_openings'))
      const jobList = jobSnap.docs.map(j => ({ id: j.id, ...j.data() }))
      if (jobList.length > 0) setJobs(jobList)

      // Load Fellowship Settings
      const fellSnap = await getDocs(collection(db, 'fellowship_details'))
      if (!fellSnap.empty) {
        setFellowship(fellSnap.docs[0].data())
      }

      // Load Analytics
      const q = query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'), limit(150))
      const eventSnap = await getDocs(q)
      const rawEvents = eventSnap.docs.map(e => e.data())
      
      // Parse Traffic Pageviews
      const viewEvents = rawEvents.filter(e => e.type === 'page_view')
      const parsedAnalytics = processPageViewData(viewEvents)
      if (parsedAnalytics.length > 0) setAnalyticsData(parsedAnalytics)

      // Parse Device Splits
      const parsedDevices = processDeviceData(viewEvents)
      if (parsedDevices.length > 0) setDeviceData(parsedDevices)

      // Parse Coordinate Click map
      const clickEvents = rawEvents.filter(e => e.type === 'click')
      const parsedHeatmap = processHeatmapData(clickEvents)
      if (parsedHeatmap.length > 0) setClickHeatmap(parsedHeatmap)

      // Parse Click logs list
      const parsedClicks = processClickData(clickEvents)
      if (parsedClicks.length > 0) setClickLogs(parsedClicks)

    } catch (err) {
      console.error('Error fetching Firestore datasets:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const processPageViewData = (views) => {
    const days = {}
    views.forEach(v => {
      const dateStr = new Date(v.timestamp).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })
      days[dateStr] = (days[dateStr] || 0) + 1
    })
    return Object.entries(days).map(([date, pageviews]) => ({ date, pageviews })).reverse().slice(-7)
  }

  const processDeviceData = (views) => {
    let mob = 0, desk = 0
    views.forEach(v => {
      if (v.screenWidth < 1024) mob++
      else desk++
    })
    const total = mob + desk || 1
    return [
      { name: 'Mobile', value: Math.round((mob / total) * 100), color: '#8B1A4A' },
      { name: 'Desktop', value: Math.round((desk / total) * 100), color: '#2D3A4A' }
    ]
  }

  const processHeatmapData = (clicks) => {
    // Bucket clicks into a 10x10 percentage grid for scatter plotting
    const grid = {}
    clicks.forEach(c => {
      if (c.x && c.y && c.screenWidth && c.screenHeight) {
        const pctX = Math.round((c.x / c.screenWidth) * 100)
        const pctY = Math.round((c.y / c.screenHeight) * 100)
        // Group close coordinates (divide by 10)
        const bucketX = Math.round(pctX / 10) * 10
        const bucketY = Math.round(pctY / 10) * 10
        const key = `${bucketX}-${bucketY}`
        grid[key] = grid[key] || { x: bucketX, y: 100 - bucketY, count: 0 } // Invert Y for standard coordinate grid plotting
        grid[key].count++
      }
    })
    return Object.values(grid)
  }

  const processClickData = (clicks) => {
    const counts = {}
    clicks.forEach(c => {
      const key = `${c.element}-${c.text}`
      counts[key] = counts[key] || { element: c.element, text: c.text, path: c.path, count: 0 }
      counts[key].count++
    })
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5)
  }

  // 3. Authenticate Actions
  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    if (!auth) {
      if (email === 'admin@srikara.com' && password === 'admin123') {
        setUser({ email: 'admin@srikara.com', displayName: 'Manager' })
      } else {
        setAuthError('Simulation Login: use admin@srikara.com & admin123')
      }
      return
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setAuthError('Invalid username or password credentials.')
    }
  }

  const handleLogout = async () => {
    if (!auth) {
      setUser(null)
      return
    }
    await signOut(auth)
  }

  // 4. Doctors CMS Operations
  const handleCreateDoctor = async (e) => {
    e.preventDefault()
    if (!newDoctor.name || !newDoctor.specialty) return
    setLoading(true)
    let photoUrl = newDoctor.photoUrl

    try {
      if (photoFile && storage) {
        const fileRef = ref(storage, `doctors/${Date.now()}_${photoFile.name}`)
        await uploadBytes(fileRef, photoFile)
        photoUrl = await getDownloadURL(fileRef)
      }

      const payload = { ...newDoctor, photoUrl }
      if (db) {
        await addDoc(collection(db, 'doctors'), payload)
      } else {
        setDoctors(prev => [...prev, { id: Date.now().toString(), ...payload }])
      }

      setNewDoctor({ name: '', specialty: '', experience: '', branch: '', bio: '', photoUrl: '', status: 'Active' })
      setPhotoFile(null)
      setMessage({ type: 'success', text: 'New Doctor profile created in system!' })
      loadAllData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Error adding doctor profile.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDoctorEdit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (db) {
        await setDoc(doc(db, 'doctors', selectedDoctor.id), selectedDoctor)
      } else {
        setDoctors(prev => prev.map(d => d.id === selectedDoctor.id ? selectedDoctor : d))
      }
      setMessage({ type: 'success', text: `Profile details for ${selectedDoctor.name} updated.` })
      setSelectedDoctor(null)
      loadAllData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update doctor info.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Delete doctor record from system?')) return
    try {
      if (db) {
        await deleteDoc(doc(db, 'doctors', id))
      } else {
        setDoctors(prev => prev.filter(d => d.id !== id))
      }
      setMessage({ type: 'success', text: 'Doctor profile deleted.' })
      loadAllData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove doctor profile.' })
    }
  }

  // 5. Job Openings CMS Operations
  const handleCreateJob = async (e) => {
    e.preventDefault()
    if (!newJob.title || !newJob.department) return
    setLoading(true)
    try {
      if (db) {
        await addDoc(collection(db, 'job_openings'), newJob)
      } else {
        setJobs(prev => [...prev, { id: Date.now().toString(), ...newJob }])
      }
      setNewJob({ title: '', department: '', location: '', experience: '', description: '', status: 'Active' })
      setMessage({ type: 'success', text: 'Job opening posted successfully.' })
      loadAllData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to create job opening.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveJobEdit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (db) {
        await setDoc(doc(db, 'job_openings', selectedJob.id), selectedJob)
      } else {
        setJobs(prev => prev.map(j => j.id === selectedJob.id ? selectedJob : j))
      }
      setMessage({ type: 'success', text: `Job listing for ${selectedJob.title} updated.` })
      setSelectedJob(null)
      loadAllData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to edit job post.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Remove this job opening?')) return
    try {
      if (db) {
        await deleteDoc(doc(db, 'job_openings', id))
      } else {
        setJobs(prev => prev.filter(j => j.id !== id))
      }
      setMessage({ type: 'success', text: 'Job opening removed.' })
      loadAllData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete job opening.' })
    }
  }

  // 6. Fellowship Parameters CMS Operations
  const handleSaveFellowship = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (db) {
        await setDoc(doc(db, 'fellowship_details', 'arthroplasty'), fellowship)
      }
      setMessage({ type: 'success', text: 'Fellowship specifications saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save fellowship configurations.' })
    } finally {
      setLoading(false)
    }
  }

  const handleFellowshipFeeChange = (idx, field, val) => {
    const updatedFees = [...fellowship.fees]
    updatedFees[idx][field] = val
    setFellowship(prev => ({ ...prev, fees: updatedFees }))
  }

  const handleRefundChange = (idx, field, val) => {
    const updatedRefunds = [...fellowship.refunds]
    updatedRefunds[idx][field] = val
    setFellowship(prev => ({ ...prev, refunds: updatedRefunds }))
  }

  // Dynamic FAQ list actions
  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) return
    setFellowship(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq]
    }))
    setNewFaq({ question: '', answer: '' })
  }

  const handleDeleteFaq = (idx) => {
    const updatedFaqs = [...fellowship.faqs]
    updatedFaqs.splice(idx, 1)
    setFellowship(prev => ({ ...prev, faqs: updatedFaqs }))
  }

  // Filtering results
  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(doctorSearch.toLowerCase()))
  const filteredJobs = jobs.filter(j => j.title.toLowerCase().includes(jobSearch.toLowerCase()))

  return (
    <>
      <Helmet>
        <title>Srikara | Control Dashboard</title>
        <style>{DASH_STYLES}</style>
      </Helmet>

      <div className="min-h-screen bg-[#FFF9FA] text-[#1A202C] selection:bg-[#8B1A4A] selection:text-white font-body relative overflow-hidden pb-12">
        
        {/* Ambient background glows */}
        <div className="absolute top-[80px] -left-[100px] w-[350px] h-[350px] rounded-full bg-[#8B1A4A] opacity-5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[100px] right-[5%] w-[350px] h-[350px] rounded-full bg-[#2D3A4A] opacity-[0.04] blur-[120px] pointer-events-none" />

        {/* ══════════════ AUTH WALL ══════════════ */}
        <AnimatePresence>
          {!user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md px-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md p-8 md:p-10 rounded-[32px] bg-white/80 border border-white/60 shadow-2xl backdrop-blur-xl"
              >
                <div className="text-center mb-8">
                  <span className="w-12 h-12 rounded-2xl bg-[#8B1A4A]/10 flex items-center justify-center text-[#8B1A4A] mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                  </span>
                  <h1 className="font-garamond text-3xl font-bold text-[#1A202C]">Srikara Admin Portal</h1>
                  <p className="text-xs text-gray-500 mt-2">Login to manage analytics and CMS data</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">Username / Email</label>
                    <input 
                      type="email" 
                      placeholder="admin@srikarahospitals.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none focus:border-[#8B1A4A]/50 text-sm shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 outline-none focus:border-[#8B1A4A]/50 text-sm shadow-sm"
                      required
                    />
                  </div>

                  {authError && (
                    <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-100 text-[#8B1A4A] text-xs flex gap-2 items-center">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full h-12 rounded-full bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] transition-colors font-bold uppercase tracking-wider text-xs shadow-md mt-6"
                  >
                    Authenticate
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ══════════════ DASHBOARD INTERFACE ══════════════ */}
        {user && (
          <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
            
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-black/5">
              <div>
                <h1 className="font-garamond text-4xl font-bold text-[#1A202C]">Srikara Control Center</h1>
                <p className="text-xs text-gray-500 mt-1">Logged in as: <strong className="text-[#8B1A4A]">{user.email}</strong></p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={loadAllData}
                  className="h-10 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Data
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="h-10 px-4 rounded-full bg-[#2D3A4A] text-white hover:bg-[#8B1A4A] transition-all text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </header>

            {/* Notification Alerts */}
            {message.text && (
              <div className={`p-4 rounded-2xl border mb-6 flex justify-between items-center text-sm ${
                message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
              }`}>
                <div className="flex items-center gap-3">
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                  <span>{message.text}</span>
                </div>
                <button onClick={() => setMessage({ type: '', text: '' })} className="font-black text-xs">✕</button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Navigation Sidebar */}
              <nav className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto gap-2 lg:gap-1.5 p-1.5 bg-white/40 border border-white/60 shadow-sm rounded-2xl h-fit">
                {[
                  { id: 'analytics', label: 'Visitor Analytics', icon: LineChart },
                  { id: 'doctors', label: 'Doctors Directory', icon: Users },
                  { id: 'jobs', label: 'Job Openings', icon: Briefcase },
                  { id: 'fellowship', label: 'Fellowship Editor', icon: Award }
                ].map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-3 h-12 px-5 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] transition-all cursor-pointer ${
                        activeTab === tab.id ? 'active-tab-nav' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline lg:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Panel Area */}
              <main className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  
                  {/* MODULE A: PREMIUM ANALYTICS */}
                  {activeTab === 'analytics' && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-8"
                    >
                      {/* Charts Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Area Chart: Views over time */}
                        <div className="md:col-span-2 glass-card-admin rounded-3xl p-6">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Traffic Statistics (Last 7 Days)</h3>
                          <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={analyticsData}>
                                <defs>
                                  <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B1A4A" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8B1A4A" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} />
                                <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="pageviews" stroke="#8B1A4A" strokeWidth={3} fillOpacity={1} fill="url(#viewGrad)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Pie Chart: Devices */}
                        <div className="glass-card-admin rounded-3xl p-6 flex flex-col justify-between">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Device Demographics</h3>
                          <div className="h-44 relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie 
                                  data={deviceData} 
                                  dataKey="value" 
                                  cx="50%" 
                                  cy="50%" 
                                  innerRadius={45} 
                                  outerRadius={65} 
                                  paddingAngle={4}
                                >
                                  {deviceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="flex justify-around border-t border-slate-100 pt-4">
                            {deviceData.map((d, i) => (
                              <div key={i} className="text-center">
                                <p className="text-[10px] uppercase font-bold text-gray-400">{d.name}</p>
                                <p className="text-base font-black mt-1" style={{ color: d.color }}>{d.value}%</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Interactive Click Heatmap Zone */}
                        <div className="glass-card-admin rounded-3xl p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-headline font-bold text-base text-[#2D3A4A]">Interactions Coordinate Map</h3>
                            <span className="text-[9px] uppercase font-black text-rose-600 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100">Live Heatmap</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                            Visual coordinate map plotting where visitors click most on screen zones (represented as percentages from left to right).
                          </p>
                          <div className="h-60 border border-dashed border-[#8B1A4A]/25 rounded-2xl bg-white/20 p-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis type="number" dataKey="x" name="Width %" unit="%" domain={[0, 100]} stroke="#888" fontSize={9} />
                                <YAxis type="number" dataKey="y" name="Height %" unit="%" domain={[0, 100]} stroke="#888" fontSize={9} />
                                <ZAxis type="number" dataKey="count" range={[60, 400]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Clicks" data={clickHeatmap} fill="#8B1A4A" opacity={0.65}>
                                  {clickHeatmap.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.count > 90 ? '#8B1A4A' : '#2D3A4A'} />
                                  ))}
                                </Scatter>
                              </ScatterChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Top Clicks Table */}
                        <div className="glass-card-admin rounded-3xl p-6">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Top Visited Elements</h3>
                          <div className="space-y-4">
                            {clickLogs.map((click, i) => (
                              <div key={i} className="flex justify-between items-center p-3.5 rounded-2xl bg-white/50 border border-slate-100 shadow-sm hover:border-[#8B1A4A]/25 transition-all">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#1A202C] truncate">{click.text || 'Element clicked'}</p>
                                  <p className="text-[9px] text-gray-400 font-mono mt-0.5 truncate">{click.element} ({click.path})</p>
                                </div>
                                <span className="bg-[#8B1A4A]/10 text-[#8B1A4A] text-xs font-black px-3.5 py-1.5 rounded-full">{click.count} clicks</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* MODULE B: DOCTORS DIRECTORY CMS */}
                  {activeTab === 'doctors' && (
                    <motion.div
                      key="doctors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6 relative"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Roster & Search */}
                        <div className="lg:col-span-7 glass-card-admin rounded-3xl p-6">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                            <h3 className="font-headline font-bold text-base text-[#2D3A4A]">System Doctors Roster ({filteredDoctors.length})</h3>
                            
                            {/* Search bar */}
                            <div className="relative flex items-center h-10 w-full sm:w-56 glass-input rounded-xl px-3 shadow-inner">
                              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                              <input 
                                type="text" 
                                placeholder="Search by name..." 
                                value={doctorSearch}
                                onChange={e => setDoctorSearch(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-slate-800"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {filteredDoctors.length === 0 ? (
                              <p className="text-xs text-gray-400 italic col-span-2">No matching doctors found.</p>
                            ) : (
                              filteredDoctors.map(doc => (
                                <div 
                                  key={doc.id} 
                                  className="group flex flex-col justify-between p-5 rounded-2xl bg-white/50 border border-slate-100 shadow-sm hover:border-[#8B1A4A]/25 transition-all"
                                >
                                  <div className="flex gap-3.5 items-start mb-4">
                                    <div className="w-12 h-12 rounded-full border overflow-hidden flex-shrink-0 bg-slate-50 shadow-inner">
                                      {doc.photoUrl ? <img src={doc.photoUrl} className="w-full h-full object-cover" /> : <Users className="w-6 h-6 text-gray-400 m-3" />}
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-sm font-bold text-slate-800 truncate leading-snug">{doc.name}</h4>
                                      <p className="text-[10px] text-[#8B1A4A] font-bold uppercase mt-1 truncate">{doc.specialty}</p>
                                      <p className="text-[9px] text-gray-400 mt-0.5">{doc.experience} Experience</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1">
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                      doc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                      {doc.status || 'Active'}
                                    </span>
                                    
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => setSelectedDoctor(doc)}
                                        className="text-[#8B1A4A] hover:bg-[#8B1A4A]/5 p-2 rounded-lg transition-all"
                                        title="Edit Profile"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteDoctor(doc.id)} 
                                        className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-all"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Add Form */}
                        <form onSubmit={handleCreateDoctor} className="lg:col-span-5 glass-card-admin rounded-3xl p-6 space-y-4">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-2 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-[#8B1A4A]" /> Create Doctor Profile
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Full Name</label>
                              <input 
                                type="text" 
                                placeholder="Dr. Akhil Dadi" 
                                value={newDoctor.name} 
                                onChange={e => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Specialty</label>
                              <input 
                                type="text" 
                                placeholder="Robotic Joint Replacement" 
                                value={newDoctor.specialty} 
                                onChange={e => setNewDoctor(prev => ({ ...prev, specialty: e.target.value }))}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Experience</label>
                              <input 
                                type="text" 
                                placeholder="20+ Years" 
                                value={newDoctor.experience} 
                                onChange={e => setNewDoctor(prev => ({ ...prev, experience: e.target.value }))}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Default Branch</label>
                              <input 
                                type="text" 
                                placeholder="LB Nagar" 
                                value={newDoctor.branch} 
                                onChange={e => setNewDoctor(prev => ({ ...prev, branch: e.target.value }))}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Biography / Info</label>
                            <textarea 
                              placeholder="Brief bio describing surgical credentials..." 
                              value={newDoctor.bio} 
                              onChange={e => setNewDoctor(prev => ({ ...prev, bio: e.target.value }))}
                              className="w-full h-20 p-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#8B1A4A]/50"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Photo Upload</label>
                              <div className="relative h-10 border border-slate-200 rounded-xl bg-white flex items-center px-4 gap-2 cursor-pointer">
                                <Upload className="w-4 h-4 text-[#8B1A4A]" />
                                <span className="text-[10px] text-gray-500 truncate">{photoFile ? photoFile.name : 'Select file...'}</span>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={e => setPhotoFile(e.target.files[0])}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Status</label>
                              <select 
                                value={newDoctor.status}
                                onChange={e => setNewDoctor(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs cursor-pointer"
                              >
                                <option>Active</option>
                                <option>On Leave</option>
                              </select>
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-11 rounded-full bg-[#8B1A4A] text-white font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 mt-4"
                          >
                            Add Doctor Profile
                          </button>
                        </form>

                      </div>

                      {/* SLIDE-OUT EDIT DRAWER (Doctor detail editor) */}
                      <AnimatePresence>
                        {selectedDoctor && (
                          <>
                            {/* Overlay backdrop */}
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setSelectedDoctor(null)}
                              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                            />
                            
                            {/* Drawer element */}
                            <motion.div
                              initial={{ x: '100%' }}
                              animate={{ x: 0 }}
                              exit={{ x: '100%' }}
                              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl p-8 overflow-y-auto border-l border-slate-100 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                  <h3 className="font-garamond text-2xl font-bold text-[#2D3A4A]">Modify Profile</h3>
                                  <button onClick={() => setSelectedDoctor(null)} className="font-bold text-gray-400 hover:text-gray-600">✕</button>
                                </div>

                                <form onSubmit={handleSaveDoctorEdit} className="space-y-4">
                                  <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 rounded-full border overflow-hidden relative shadow-inner bg-slate-50">
                                      {selectedDoctor.photoUrl ? <img src={selectedDoctor.photoUrl} className="w-full h-full object-cover" /> : <Users className="w-8 h-8 text-gray-400 m-6" />}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Full Name</label>
                                    <input 
                                      type="text" 
                                      value={selectedDoctor.name}
                                      onChange={e => setSelectedDoctor(prev => ({ ...prev, name: e.target.value }))}
                                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Specialty</label>
                                    <input 
                                      type="text" 
                                      value={selectedDoctor.specialty}
                                      onChange={e => setSelectedDoctor(prev => ({ ...prev, specialty: e.target.value }))}
                                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Experience</label>
                                      <input 
                                        type="text" 
                                        value={selectedDoctor.experience}
                                        onChange={e => setSelectedDoctor(prev => ({ ...prev, experience: e.target.value }))}
                                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Branch</label>
                                      <input 
                                        type="text" 
                                        value={selectedDoctor.branch}
                                        onChange={e => setSelectedDoctor(prev => ({ ...prev, branch: e.target.value }))}
                                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Status</label>
                                    <select 
                                      value={selectedDoctor.status}
                                      onChange={e => setSelectedDoctor(prev => ({ ...prev, status: e.target.value }))}
                                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold cursor-pointer"
                                    >
                                      <option>Active</option>
                                      <option>On Leave</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Biography / Credentials</label>
                                    <textarea 
                                      value={selectedDoctor.bio}
                                      onChange={e => setSelectedDoctor(prev => ({ ...prev, bio: e.target.value }))}
                                      className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#8B1A4A]/50"
                                    />
                                  </div>

                                  <div className="flex gap-3 pt-6">
                                    <button 
                                      type="button" 
                                      onClick={() => setSelectedDoctor(null)}
                                      className="flex-1 h-12 rounded-full border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500"
                                    >
                                      Cancel
                                    </button>
                                    
                                    <button 
                                      type="submit" 
                                      className="flex-1 h-12 rounded-full bg-[#8B1A4A] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                                    >
                                      Save Profile
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  )}

                  {/* MODULE C: CAREER OPPORTUNITIES CMS */}
                  {activeTab === 'jobs' && (
                    <motion.div
                      key="jobs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* List & Search */}
                        <div className="lg:col-span-7 glass-card-admin rounded-3xl p-6">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                            <h3 className="font-headline font-bold text-base text-[#2D3A4A]">Careers Directory ({filteredJobs.length})</h3>
                            
                            {/* Search bar */}
                            <div className="relative flex items-center h-10 w-full sm:w-56 glass-input rounded-xl px-3 shadow-inner">
                              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                              <input 
                                type="text" 
                                placeholder="Search vacancies..." 
                                value={jobSearch}
                                onChange={e => setJobSearch(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-xs text-slate-800"
                              />
                            </div>
                          </div>

                          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {filteredJobs.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">No job postings found.</p>
                            ) : (
                              filteredJobs.map(job => (
                                <div 
                                  key={job.id} 
                                  className="flex gap-4 items-center justify-between p-4 rounded-2xl bg-white/50 border border-slate-100 shadow-sm hover:border-[#8B1A4A]/25 transition-all"
                                >
                                  <div>
                                    <div className="flex gap-2 items-center">
                                      <p className="text-sm font-bold text-slate-800">{job.title}</p>
                                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                        job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                      }`}>
                                        {job.status}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                                      {job.department} · {job.location} · {job.experience || 'Experience: Open'}
                                    </p>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => setSelectedJob(job)}
                                      className="text-[#8B1A4A] hover:bg-[#8B1A4A]/5 p-2 rounded-lg transition-all"
                                      title="Edit Vacancy"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteJob(job.id)} 
                                      className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-all"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Add / Edit Form */}
                        <div className="lg:col-span-5 space-y-6">
                          
                          {/* Live Preview Panel */}
                          <div className="glass-card-admin rounded-3xl p-6 border-dashed border-[#8B1A4A]/30 relative overflow-hidden bg-white/40">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B1A4A]/5 blur-xl rounded-full translate-x-4 -translate-y-4" />
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[9px] uppercase font-black tracking-widest text-[#8B1A4A] flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Live Card Preview</span>
                              <span className="text-[8px] text-gray-400 font-mono">Simulates Career Page</span>
                            </div>
                            
                            <div className="border border-slate-100 rounded-2xl p-5 bg-white/70 shadow-sm">
                              <div className="flex justify-between items-start gap-3 mb-3">
                                <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#8B1A4A] shadow-inner">
                                  <Briefcase className="w-4 h-4" />
                                </span>
                                <span className="text-[8px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-400">
                                  {selectedJob ? selectedJob.department : (newJob.department || 'Department')}
                                </span>
                              </div>
                              <h4 className="font-headline font-bold text-sm text-[#1A202C]">
                                {selectedJob ? selectedJob.title : (newJob.title || 'Vacancy Job Title')}
                              </h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                                📍 {selectedJob ? selectedJob.location : (newJob.location || 'Branch Location')} · 💼 {selectedJob ? selectedJob.experience : (newJob.experience || 'Exp Required')}
                              </p>
                              <p className="text-xs text-[#4A4A4A] leading-relaxed font-light mt-4 line-clamp-2">
                                {selectedJob ? selectedJob.description : (newJob.description || 'Fill in the vacancy description below to preview formatting...')}
                              </p>
                            </div>
                          </div>

                          {/* Editor Form */}
                          <form 
                            onSubmit={selectedJob ? handleSaveJobEdit : handleCreateJob} 
                            className="glass-card-admin rounded-3xl p-6 space-y-4"
                          >
                            <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-2">
                              {selectedJob ? 'Modify Vacancy Post' : 'Publish Career Position'}
                            </h3>
                            
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Job Title</label>
                              <input 
                                type="text" 
                                placeholder="Consultant Orthopedic Surgeon" 
                                value={selectedJob ? selectedJob.title : newJob.title} 
                                onChange={e => {
                                  if (selectedJob) setSelectedJob(prev => ({ ...prev, title: e.target.value }))
                                  else setNewJob(prev => ({ ...prev, title: e.target.value }))
                                }}
                                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Department</label>
                                <input 
                                  type="text" 
                                  placeholder="Orthopedics" 
                                  value={selectedJob ? selectedJob.department : newJob.department} 
                                  onChange={e => {
                                    if (selectedJob) setSelectedJob(prev => ({ ...prev, department: e.target.value }))
                                    else setNewJob(prev => ({ ...prev, department: e.target.value }))
                                  }}
                                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Location</label>
                                <input 
                                  type="text" 
                                  placeholder="LB Nagar, Hyd" 
                                  value={selectedJob ? selectedJob.location : newJob.location} 
                                  onChange={e => {
                                    if (selectedJob) setSelectedJob(prev => ({ ...prev, location: e.target.value }))
                                    else setNewJob(prev => ({ ...prev, location: e.target.value }))
                                  }}
                                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Experience Required</label>
                                <input 
                                  type="text" 
                                  placeholder="5+ Yrs" 
                                  value={selectedJob ? selectedJob.experience : newJob.experience} 
                                  onChange={e => {
                                    if (selectedJob) setSelectedJob(prev => ({ ...prev, experience: e.target.value }))
                                    else setNewJob(prev => ({ ...prev, experience: e.target.value }))
                                  }}
                                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Status</label>
                                <select 
                                  value={selectedJob ? selectedJob.status : newJob.status}
                                  onChange={e => {
                                    if (selectedJob) setSelectedJob(prev => ({ ...prev, status: e.target.value }))
                                    else setNewJob(prev => ({ ...prev, status: e.target.value }))
                                  }}
                                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold cursor-pointer"
                                >
                                  <option>Active</option>
                                  <option>Closed</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Description & Requirements</label>
                              <textarea 
                                placeholder="Write position responsibilities and requirements..." 
                                value={selectedJob ? selectedJob.description : newJob.description} 
                                onChange={e => {
                                  if (selectedJob) setSelectedJob(prev => ({ ...prev, description: e.target.value }))
                                  else setNewJob(prev => ({ ...prev, description: e.target.value }))
                                }}
                                className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#8B1A4A]/50"
                                required
                              />
                            </div>

                            <div className="flex gap-2 pt-2">
                              {selectedJob && (
                                <button 
                                  type="button"
                                  onClick={() => setSelectedJob(null)}
                                  className="flex-1 h-11 rounded-full border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400"
                                >
                                  Cancel
                                </button>
                              )}
                              <button 
                                type="submit" 
                                disabled={loading}
                                className="flex-1 h-11 rounded-full bg-[#8B1A4A] text-white font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2"
                              >
                                {selectedJob ? 'Update Position' : 'Publish Position'}
                              </button>
                            </div>
                          </form>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* MODULE D: FELLOWSHIP CMS PARAMETERS */}
                  {activeTab === 'fellowship' && (
                    <motion.div
                      key="fellowship"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-8"
                    >
                      <form onSubmit={handleSaveFellowship} className="glass-card-admin rounded-3xl p-8 space-y-6">
                        
                        {/* Course Spec */}
                        <div className="flex gap-2 items-center mb-2 pb-4 border-b border-black/5">
                          <Sliders className="w-5 h-5 text-[#8B1A4A]" />
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A]">Fellowship Specifications</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1.5">Course Duration</label>
                            <input 
                              type="text" 
                              value={fellowship.duration} 
                              onChange={e => setFellowship(prev => ({ ...prev, duration: e.target.value }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1.5">Eligibility Credentials</label>
                            <input 
                              type="text" 
                              value={fellowship.eligibility} 
                              onChange={e => setFellowship(prev => ({ ...prev, eligibility: e.target.value }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1.5">Monthly Capacity (Seats)</label>
                            <input 
                              type="number" 
                              value={fellowship.seats} 
                              onChange={e => setFellowship(prev => ({ ...prev, seats: parseInt(e.target.value) || 0 }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                            />
                          </div>
                        </div>

                        {/* Cohort Fees */}
                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex gap-2 items-center mb-4">
                            <DollarSign className="w-4.5 h-4.5 text-[#8B1A4A]" />
                            <h4 className="font-headline font-bold text-sm text-[#2D3A4A]">Cohort Tuition Fees</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {fellowship.fees.map((fee, idx) => (
                              <div key={idx} className="p-4 rounded-2xl bg-white/40 border border-slate-100 relative">
                                {fee.active && <span className="absolute top-2 right-2 bg-rose-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Active</span>}
                                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2">{fee.period}</span>
                                <input 
                                  type="text" 
                                  value={fee.rate} 
                                  onChange={e => handleFellowshipFeeChange(idx, 'rate', e.target.value)}
                                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Refund Policy Tiers */}
                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex gap-2 items-center mb-4">
                            <Percent className="w-4.5 h-4.5 text-[#8B1A4A]" />
                            <h4 className="font-headline font-bold text-sm text-[#2D3A4A]">Refund Guidelines Editor</h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {fellowship.refunds.map((refEntry, idx) => (
                              <div key={idx} className="p-4 rounded-2xl bg-white/40 border border-slate-100 space-y-3">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block">{refEntry.timeline}</span>
                                <div>
                                  <label className="block text-[8px] uppercase font-black text-gray-400 mb-1">Refund %</label>
                                  <input 
                                    type="text" 
                                    value={refEntry.pct}
                                    onChange={e => handleRefundChange(idx, 'pct', e.target.value)}
                                    className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] uppercase font-black text-gray-400 mb-1">Return Amount</label>
                                  <input 
                                    type="text" 
                                    value={refEntry.amt}
                                    onChange={e => handleRefundChange(idx, 'amt', e.target.value)}
                                    className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Postponement charges */}
                        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2">Late Deferral Defer Charge</label>
                            <input 
                              type="text" 
                              value={fellowship.postponementCharge}
                              onChange={e => setFellowship(prev => ({ ...prev, postponementCharge: e.target.value }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                            />
                          </div>
                        </div>

                        {/* Fellowship FAQs Editor */}
                        <div className="pt-6 border-t border-slate-100">
                          <div className="flex gap-2 items-center mb-4">
                            <HelpCircle className="w-4.5 h-4.5 text-[#8B1A4A]" />
                            <h4 className="font-headline font-bold text-sm text-[#2D3A4A]">Frequently Asked Questions Editor ({fellowship.faqs?.length || 0})</h4>
                          </div>
                          
                          <div className="space-y-4 mb-6">
                            {fellowship.faqs?.map((faq, idx) => (
                              <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl bg-white/40 border border-slate-100 justify-between">
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-slate-700">Q: {faq.question}</p>
                                  <p className="text-xs text-gray-500 italic">A: {faq.answer}</p>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteFaq(idx)} 
                                  className="text-rose-600 p-2 rounded-lg hover:bg-rose-50 flex-shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add FAQ form sub-group */}
                          <div className="p-5 rounded-2xl bg-[#8B1A4A]/[0.02] border border-[#8B1A4A]/10 space-y-4">
                            <h5 className="text-xs font-bold text-[#8B1A4A] flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Append FAQ Item</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[8px] uppercase font-black text-gray-400 mb-1">Question</label>
                                <input 
                                  type="text" 
                                  placeholder="Is stipend offered?"
                                  value={newFaq.question}
                                  onChange={e => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] uppercase font-black text-gray-400 mb-1">Answer</label>
                                <input 
                                  type="text" 
                                  placeholder="No, stipends are not provided..."
                                  value={newFaq.answer}
                                  onChange={e => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs"
                                />
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={handleAddFaq}
                              className="px-5 h-9 rounded-lg border border-[#8B1A4A]/25 text-[#8B1A4A] hover:bg-[#8B1A4A] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider shadow-sm"
                            >
                              Append Item
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-black/5 pt-6 flex justify-end">
                          <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-[#8B1A4A] text-white hover:bg-[#2D3A4A] transition-colors font-bold uppercase tracking-wider text-xs px-8 h-12 rounded-full flex items-center justify-center gap-2 shadow-md active:scale-95"
                          >
                            Save Fellowship Specifications
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </main>

            </div>

          </div>
        )}

      </div>
    </>
  )
}
