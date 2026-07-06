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
  Sparkles,
  HelpCircle,
  Clock,
  Eye,
  FileText,
  Sliders,
  DollarSign,
  Home,
  Building2,
  FolderOpen,
  Mail,
  ShieldCheck,
  Calendar,
  Layers,
  Star,
  Settings
} from 'lucide-react'

// Import Firebase SDK Statically
import { auth, db, storage } from '@/lib/firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
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
  .active-tab-nav {
    background: #8B1A4A;
    color: white !important;
    box-shadow: 0 10px 25px -10px rgba(139, 26, 74, 0.45);
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

const MOCK_CLICKS = [
  { element: 'button#book-now', text: 'Book Appointment', path: '/home', count: 142 },
  { element: 'a#careers-link', text: 'Careers & Fellowship', path: '/footer', count: 98 },
  { element: 'button#email-launch', text: 'Launch Email Client', path: '/careers', count: 64 }
]

const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Akhil Dadi', specialty: 'Robotic Joint Replacement', experience: '20+ Yrs', branch: 'LB Nagar', bio: 'Renowned joint replacement specialist.', photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300', status: 'Active' },
  { id: '2', name: 'Dr. Radhika Sen', specialty: 'Cardiology & Heart Care', experience: '15 Yrs', branch: 'Kompally', bio: 'Expert interventional cardiologist.', photoUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300', status: 'Active' }
]

const MOCK_JOBS = [
  { id: '1', title: 'Consultant Orthopedic Surgeon', department: 'Orthopedics', location: 'LB Nagar, Hyd', experience: '5+ Yrs', description: 'Requires MS Orthopedics. Experience in robotic joint replacement surgery is preferred.', status: 'Active' }
]

const MOCK_APPOINTMENTS = [
  { id: '101', name: 'John Doe', phone: '9876543210', email: 'john@gmail.com', department: 'Orthopedics', doctor: 'Dr. Akhil Dadi', date: '2026-07-08', time: '10:30 AM', status: 'Confirmed', crmSync: 'Synced' },
  { id: '102', name: 'Alice Smith', phone: '9123456789', email: 'alice@gmail.com', department: 'Cardiology', doctor: 'Dr. Radhika Sen', date: '2026-07-09', time: '02:15 PM', status: 'Pending', crmSync: 'Failed' }
]

const MOCK_MEDIA = [
  { name: 'logo.png', type: 'image', size: '45 KB', url: 'https://i.ibb.co/qF1tmZrW/convert-into-high-202604060154.jpg' },
  { name: 'doctor_profile_dadi.jpg', type: 'image', size: '120 KB', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300' },
  { name: 'arthroplasty_flyer.pdf', type: 'document', size: '2.4 MB', url: '#' }
]

export function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState('Super Admin') // Super Admin, Marketing, HR, Doctor, Reception
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('analytics')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Roster lists
  const [analyticsData, setAnalyticsData] = useState(MOCK_ANALYTICS)
  const [deviceData, setDeviceData] = useState(MOCK_DEVICE_DATA)
  const [clickLogs, setClickLogs] = useState(MOCK_CLICKS)
  const [doctors, setDoctors] = useState(MOCK_DOCTORS)
  const [jobs, setJobs] = useState(MOCK_JOBS)
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [mediaFiles, setMediaFiles] = useState(MOCK_MEDIA)
  const [blogs, setBlogs] = useState([])
  const [faqs, setFaqs] = useState([])

  // Selection editors
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedBlog, setSelectedBlog] = useState(null)

  // Creation states
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', experience: '', branch: '', bio: '', photoUrl: '', status: 'Active' })
  const [newJob, setNewJob] = useState({ title: '', department: '', location: '', experience: '', description: '', status: 'Active' })
  const [newBlog, setNewBlog] = useState({ title: '', category: 'Clinical', body: '', status: 'Draft', slug: '', seoTitle: '', seoDesc: '' })
  
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'General' })
  const [photoFile, setPhotoFile] = useState(null)

  // 1. Firebase Auth Listener
  useEffect(() => {
    if (!auth) {
      console.log('Firebase auth bypassed. Auto-logging into simulated workspace.')
      setUser({ email: 'superadmin@srikara.com' })
      setUserRole('Super Admin')
      return
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // Resolve user's role from custom claims or database document
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          if (userDoc.exists()) {
            const role = userDoc.data().role || 'Super Admin'
            setUserRole(role)
            adjustTabForRole(role)
          }
        } catch (e) {
          // Default role if database fetch fails
          setUserRole('Super Admin')
        }
        loadAllData()
      }
    })
    return () => unsubscribe()
  }, [])

  const adjustTabForRole = (role) => {
    if (role === 'HR') setActiveTab('jobs')
    else if (role === 'Doctor Admin') setActiveTab('doctors')
    else if (role === 'Reception') setActiveTab('appointments')
    else setActiveTab('analytics')
  }

  // 2. Fetch Data from Firestore
  const loadAllData = async () => {
    if (!db) return
    setLoading(true)
    try {
      // Fetch Doctors
      const docSnap = await getDocs(collection(db, 'doctors'))
      setDoctors(docSnap.docs.map(d => ({ id: d.id, ...d.data() })))

      // Fetch Jobs
      const jobSnap = await getDocs(collection(db, 'job_openings'))
      setJobs(jobSnap.docs.map(j => ({ id: j.id, ...j.data() })))

      // Fetch Appointments
      const appSnap = await getDocs(collection(db, 'appointments'))
      setAppointments(appSnap.docs.map(a => ({ id: a.id, ...a.data() })))

      // Fetch Blogs
      const blogSnap = await getDocs(collection(db, 'blogs'))
      setBlogs(blogSnap.docs.map(b => ({ id: b.id, ...b.data() })))

      // Fetch FAQs
      const faqSnap = await getDocs(collection(db, 'faqs'))
      setFaqs(faqSnap.docs.map(f => ({ id: f.id, ...f.data() })))

      // Fetch Analytics
      const eventSnap = await getDocs(query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'), limit(100)))
      const rawEvents = eventSnap.docs.map(e => e.data())
      
      const viewEvents = rawEvents.filter(e => e.type === 'page_view')
      const days = {}
      viewEvents.forEach(v => {
        const dateStr = new Date(v.timestamp).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })
        days[dateStr] = (days[dateStr] || 0) + 1
      })
      const parsedAnalytics = Object.entries(days).map(([date, pageviews]) => ({ date, pageviews })).reverse().slice(-7)
      if (parsedAnalytics.length > 0) setAnalyticsData(parsedAnalytics)

      const clickEvents = rawEvents.filter(e => e.type === 'click')
      const counts = {}
      clickEvents.forEach(c => {
        const key = `${c.element}-${c.text}`
        counts[key] = counts[key] || { element: c.element, text: c.text, path: c.path, count: 0 }
        counts[key].count++
      })
      const parsedClicks = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5)
      if (parsedClicks.length > 0) setClickLogs(parsedClicks)

    } catch (err) {
      console.error('Error fetching datasets:', err.message)
    } finally {
      setLoading(false)
    }
  }

  // 3. Authenticate Actions
  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    
    // Simulate user logs in dev environment
    if (!auth) {
      if (email.includes('admin') && password === 'admin123') {
        setUser({ email })
        if (email.startsWith('hr')) setUserRole('HR')
        else if (email.startsWith('doctor')) setUserRole('Doctor Admin')
        else if (email.startsWith('reception')) setUserRole('Reception')
        else if (email.startsWith('marketing')) setUserRole('Marketing Admin')
        else setUserRole('Super Admin')
        adjustTabForRole(email.startsWith('hr') ? 'HR' : email.startsWith('doctor') ? 'Doctor Admin' : email.startsWith('reception') ? 'Reception' : 'Super Admin')
      } else {
        setAuthError('Simulated login error. Enter any email containing "admin" and password "admin123".')
      }
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setAuthError('Authentication failed. Check your password.')
    }
  }

  const handleLogout = async () => {
    if (!auth) {
      setUser(null)
      return
    }
    await signOut(auth)
  }

  // 4. Appointment Status updates & CRM triggers
  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      if (db) {
        const docRef = doc(db, 'appointments', id)
        await setDoc(docRef, { status }, { merge: true })
      } else {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      }
      setMessage({ type: 'success', text: `Appointment status set to ${status}.` })
      loadAllData()
    } catch (e) {
      setMessage({ type: 'error', text: 'Error editing appointment status.' })
    }
  }

  const handleRetryCRMSync = async (appointment) => {
    setMessage({ type: 'success', text: `Sync request for lead ${appointment.name} sent to retry queue.` })
    try {
      // Simulate backend CRM retry endpoint push
      const crmUrl = 'https://crm.srikara.com/api/leads'
      await fetch(crmUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      })
      if (db) {
        await setDoc(doc(db, 'appointments', appointment.id), { crmSync: 'Synced' }, { merge: true })
        loadAllData()
      }
    } catch (err) {
      console.warn('CRM sync retry logged.')
    }
  }

  // 5. CMS doctor management
  const handleCreateDoctor = async (e) => {
    e.preventDefault()
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
      setMessage({ type: 'success', text: 'Doctor profile created.' })
      loadAllData()
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to write doctor.' })
    } finally {
      setLoading(false)
    }
  }

  // 6. Blog CMS Actions
  const handleCreateBlog = async (e) => {
    e.preventDefault()
    setLoading(true)
    const slug = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const payload = { ...newBlog, slug, author: user.email, timestamp: Date.now() }
    try {
      if (db) {
        await addDoc(collection(db, 'blogs'), payload)
      } else {
        setBlogs(prev => [...prev, { id: Date.now().toString(), ...payload }])
      }
      setNewBlog({ title: '', category: 'Clinical', body: '', status: 'Draft', slug: '', seoTitle: '', seoDesc: '' })
      setMessage({ type: 'success', text: 'Blog entry published / drafted!' })
      loadAllData()
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to write blog.' })
    } finally {
      setLoading(false)
    }
  }

  // 7. General FAQs Manager
  const handleAddFaq = async (e) => {
    e.preventDefault()
    try {
      if (db) {
        await addDoc(collection(db, 'faqs'), newFaq)
      } else {
        setFaqs(prev => [...prev, { id: Date.now().toString(), ...newFaq }])
      }
      setNewFaq({ question: '', answer: '', category: 'General' })
      setMessage({ type: 'success', text: 'FAQ item saved.' })
      loadAllData()
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save FAQ.' })
    }
  }

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return
    try {
      if (db) {
        await deleteDoc(doc(db, 'faqs', id))
      } else {
        setFaqs(prev => prev.filter(f => f.id !== id))
      }
      setMessage({ type: 'success', text: 'FAQ removed.' })
      loadAllData()
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to delete FAQ.' })
    }
  }

  // Helper validation for role authorization
  const isAuthorized = (allowedRoles) => {
    return allowedRoles.includes(userRole)
  }

  return (
    <>
      <Helmet>
        <title>Srikara | Enterprise Dashboard</title>
        <style>{DASH_STYLES}</style>
      </Helmet>

      <div className="min-h-screen bg-[#FFF9FA] text-[#1A202C] selection:bg-[#8B1A4A] selection:text-white font-body relative overflow-hidden pb-12">
        
        {/* Background glows */}
        <div className="absolute top-[80px] -left-[100px] w-[350px] h-[350px] rounded-full bg-[#8B1A4A] opacity-5 blur-[120px] pointer-events-none" />

        {/* ══════════════ AUTH WALL ══════════════ */}
        <AnimatePresence>
          {!user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md px-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 md:p-10 rounded-[32px] bg-white/80 border border-white/60 shadow-2xl backdrop-blur-xl"
              >
                <div className="text-center mb-8">
                  <span className="w-12 h-12 rounded-2xl bg-[#8B1A4A]/10 flex items-center justify-center text-[#8B1A4A] mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                  </span>
                  <h1 className="font-garamond text-3xl font-bold text-[#1A202C]">Srikara Control Panel</h1>
                  <p className="text-xs text-gray-500 mt-2">Sign in using your Enterprise admin credentials</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">Enterprise Email</label>
                    <input 
                      type="email" 
                      placeholder="superadmin@srikara.com" 
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
                    Login
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
                <h1 className="font-garamond text-4xl font-bold text-[#1A202C]">Srikara Control Panel</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="bg-[#8B1A4A] text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                    {userRole}
                  </span>
                  <span className="text-xs text-gray-500">Logged: <strong>{user.email}</strong></span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={loadAllData}
                  className="h-10 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-bold flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="h-10 px-4 rounded-full bg-[#2D3A4A] text-white hover:bg-[#8B1A4A] transition-all text-xs font-bold flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </header>

            {/* Notification alert */}
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Navigation Sidebar */}
              <nav className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto gap-1.5 p-1.5 bg-white/40 border border-white/60 shadow-sm rounded-2xl h-fit">
                {isAuthorized(['Super Admin', 'Marketing Admin', 'Reception']) && (
                  <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-3 h-11 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] transition-all cursor-pointer ${activeTab === 'analytics' ? 'active-tab-nav' : ''}`}>
                    <LineChart className="w-4 h-4" /> Analytics
                  </button>
                )}
                {isAuthorized(['Super Admin', 'Reception']) && (
                  <button onClick={() => setActiveTab('appointments')} className={`flex items-center gap-3 h-11 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] transition-all cursor-pointer ${activeTab === 'appointments' ? 'active-tab-nav' : ''}`}>
                    <Calendar className="w-4 h-4" /> Appointments
                  </button>
                )}
                {isAuthorized(['Super Admin', 'Doctor Admin']) && (
                  <button onClick={() => setActiveTab('doctors')} className={`flex items-center gap-3 h-11 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] transition-all cursor-pointer ${activeTab === 'doctors' ? 'active-tab-nav' : ''}`}>
                    <Users className="w-4 h-4" /> Doctors CMS
                  </button>
                )}
                {isAuthorized(['Super Admin', 'HR']) && (
                  <button onClick={() => setActiveTab('jobs')} className={`flex items-center gap-3 h-11 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] transition-all cursor-pointer ${activeTab === 'jobs' ? 'active-tab-nav' : ''}`}>
                    <Briefcase className="w-4 h-4" /> Careers CMS
                  </button>
                )}
                {isAuthorized(['Super Admin', 'Marketing Admin']) && (
                  <button onClick={() => setActiveTab('blogs')} className={`flex items-center gap-3 h-11 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] transition-all cursor-pointer ${activeTab === 'blogs' ? 'active-tab-nav' : ''}`}>
                    <FileText className="w-4 h-4" /> Blogs CMS
                  </button>
                )}
                {isAuthorized(['Super Admin', 'Marketing Admin']) && (
                  <button onClick={() => setActiveTab('media')} className={`flex items-center gap-3 h-11 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] transition-all cursor-pointer ${activeTab === 'media' ? 'active-tab-nav' : ''}`}>
                    <FolderOpen className="w-4 h-4" /> Media Library
                  </button>
                )}
                {isAuthorized(['Super Admin', 'Marketing Admin']) && (
                  <button onClick={() => setActiveTab('faqs')} className={`flex items-center gap-3 h-11 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-[#8B1A4A]/5 hover:text-[#8B1A4A] transition-all cursor-pointer ${activeTab === 'faqs' ? 'active-tab-nav' : ''}`}>
                    <HelpCircle className="w-4 h-4" /> FAQs CMS
                  </button>
                )}
              </nav>

              {/* Panel Area */}
              <main className="lg:col-span-9 w-full">
                <AnimatePresence mode="wait">
                  
                  {/* PANEL A: TRAFFIC & CLICK ANALYTICS */}
                  {activeTab === 'analytics' && isAuthorized(['Super Admin', 'Marketing Admin', 'Reception']) && (
                    <motion.div key="analytics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 glass-card-admin rounded-3xl p-6">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Traffic Statistics</h3>
                          <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={analyticsData}>
                                <defs>
                                  <linearGradient id="viewGrad2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B1A4A" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8B1A4A" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#888" fontSize={10} tickLine={false} />
                                <YAxis stroke="#888" fontSize={10} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="pageviews" stroke="#8B1A4A" strokeWidth={3} fill="url(#viewGrad2)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="glass-card-admin rounded-3xl p-6 flex flex-col justify-between">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Device Usage %</h3>
                          <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={deviceData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>
                                  {deviceData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex justify-around border-t border-slate-100 pt-4 text-xs font-bold">
                            <span className="text-[#8B1A4A]">Mobile: {deviceData[0]?.value}%</span>
                            <span className="text-[#2D3A4A]">Desktop: {deviceData[1]?.value}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PANEL B: APPOINTMENTS VIEWER & CRM CONTROLS */}
                  {activeTab === 'appointments' && isAuthorized(['Super Admin', 'Reception']) && (
                    <motion.div key="appointments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="glass-card-admin rounded-3xl p-6">
                      <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-6">Patient Appointment Manager</h3>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-gray-400 font-bold uppercase tracking-wider">
                              <th className="pb-3">Patient</th>
                              <th className="pb-3">Contact</th>
                              <th className="pb-3">Department/Doctor</th>
                              <th className="pb-3">Slot</th>
                              <th className="pb-3">CRM Sync</th>
                              <th className="pb-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100/50">
                            {appointments.map(app => (
                              <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 font-bold text-slate-800">{app.name}</td>
                                <td className="py-4 text-gray-500">{app.phone}<br/>{app.email}</td>
                                <td className="py-4 text-gray-500"><span className="font-bold text-[#2D3A4A]">{app.department}</span><br/>{app.doctor}</td>
                                <td className="py-4 text-gray-500">{app.date} at {app.time}</td>
                                <td className="py-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                                    app.crmSync === 'Synced' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                  }`}>
                                    {app.crmSync}
                                  </span>
                                </td>
                                <td className="py-4 text-right space-x-2">
                                  {app.crmSync === 'Failed' && (
                                    <button 
                                      onClick={() => handleRetryCRMSync(app)}
                                      className="px-3 h-8 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition-all shadow-sm"
                                    >
                                      Retry Sync
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleUpdateAppointmentStatus(app.id, 'Confirmed')}
                                    className="px-3 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-[#2C3E50] font-bold"
                                  >
                                    Confirm
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {/* PANEL C: DOCTORS CMS */}
                  {activeTab === 'doctors' && isAuthorized(['Super Admin', 'Doctor Admin']) && (
                    <motion.div key="doctors" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 glass-card-admin rounded-3xl p-6">
                        <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Doctor Profiles ({doctors.length})</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {doctors.map(doc => (
                            <div key={doc.id} className="p-4 rounded-2xl bg-white/50 border border-slate-100 flex flex-col justify-between">
                              <div className="flex gap-3 items-center mb-3">
                                <div className="w-10 h-10 rounded-full border overflow-hidden bg-slate-50 flex-shrink-0">
                                  {doc.photoUrl ? <img src={doc.photoUrl} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-gray-400 m-2.5" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                                  <p className="text-[9px] text-[#8B1A4A] font-bold uppercase truncate">{doc.specialty}</p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{doc.status || 'Active'}</span>
                                <button onClick={() => handleDeleteDoctor(doc.id)} className="text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={handleCreateDoctor} className="lg:col-span-5 glass-card-admin rounded-3xl p-6 space-y-4">
                        <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-2">Create Doctor Profile</h3>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Name</label>
                          <input type="text" value={newDoctor.name} onChange={e => setNewDoctor(prev => ({ ...prev, name: e.target.value }))} className="w-full h-10 px-3 rounded-xl border bg-white text-xs" required />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Specialty</label>
                          <input type="text" value={newDoctor.specialty} onChange={e => setNewDoctor(prev => ({ ...prev, specialty: e.target.value }))} className="w-full h-10 px-3 rounded-xl border bg-white text-xs" required />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Photo Upload</label>
                          <input type="file" onChange={e => setPhotoFile(e.target.files[0])} className="text-xs w-full" />
                        </div>
                        <button type="submit" className="w-full h-11 bg-[#8B1A4A] text-white rounded-full text-xs font-bold uppercase mt-2">Publish Profile</button>
                      </form>
                    </motion.div>
                  )}

                  {/* PANEL D: CAREER OPENINGS CMS */}
                  {activeTab === 'jobs' && isAuthorized(['Super Admin', 'HR']) && (
                    <motion.div key="jobs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 glass-card-admin rounded-3xl p-6">
                        <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Job Board ({jobs.length})</h3>
                        <div className="space-y-4">
                          {jobs.map(job => (
                            <div key={job.id} className="p-4 rounded-2xl bg-white/50 border border-slate-100 flex justify-between items-center">
                              <div>
                                <p className="text-xs font-bold text-slate-800">{job.title}</p>
                                <p className="text-[10px] text-gray-400">{job.department} · {job.location}</p>
                              </div>
                              <button onClick={() => handleDeleteJob(job.id)} className="text-rose-600 p-2 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={handleCreateJob} className="lg:col-span-5 glass-card-admin rounded-3xl p-6 space-y-4">
                        <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-2">Publish Career Post</h3>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Title</label>
                          <input type="text" value={newJob.title} onChange={e => setNewJob(prev => ({ ...prev, title: e.target.value }))} className="w-full h-10 px-3 rounded-xl border bg-white text-xs" required />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Department</label>
                          <input type="text" value={newJob.department} onChange={e => setNewJob(prev => ({ ...prev, department: e.target.value }))} className="w-full h-10 px-3 rounded-xl border bg-white text-xs" required />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Description</label>
                          <textarea value={newJob.description} onChange={e => setNewJob(prev => ({ ...prev, description: e.target.value }))} className="w-full h-20 p-3 rounded-xl border bg-white text-xs" required />
                        </div>
                        <button type="submit" className="w-full h-11 bg-[#8B1A4A] text-white rounded-full text-xs font-bold uppercase mt-2">Publish Position</button>
                      </form>
                    </motion.div>
                  )}

                  {/* PANEL E: BLOGS CMS */}
                  {activeTab === 'blogs' && isAuthorized(['Super Admin', 'Marketing Admin']) && (
                    <motion.div key="blogs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 glass-card-admin rounded-3xl p-6">
                        <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Blogs Catalog ({blogs.length})</h3>
                        <div className="space-y-4">
                          {blogs.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No blogs created yet.</p>
                          ) : (
                            blogs.map(b => (
                              <div key={b.id} className="p-4 rounded-2xl bg-white/50 border border-slate-100 flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-bold text-slate-800">{b.title}</p>
                                  <span className={`text-[8px] px-2 py-0.5 rounded-full ${b.status === 'Draft' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>{b.status}</span>
                                </div>
                                <button className="text-rose-600 p-2 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <form onSubmit={handleCreateBlog} className="lg:col-span-5 glass-card-admin rounded-3xl p-6 space-y-4">
                        <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-2">Write Blog Article</h3>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Title</label>
                          <input type="text" value={newBlog.title} onChange={e => setNewBlog(prev => ({ ...prev, title: e.target.value }))} className="w-full h-10 px-3 rounded-xl border bg-white text-xs" required />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Content Body</label>
                          <textarea value={newBlog.body} onChange={e => setNewBlog(prev => ({ ...prev, body: e.target.value }))} className="w-full h-24 p-3 rounded-xl border bg-white text-xs" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Category</label>
                            <select value={newBlog.category} onChange={e => setNewBlog(prev => ({ ...prev, category: e.target.value }))} className="w-full h-10 px-2 rounded-xl border bg-white text-xs">
                              <option>Clinical</option>
                              <option>Research</option>
                              <option>General Health</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Status</label>
                            <select value={newBlog.status} onChange={e => setNewBlog(prev => ({ ...prev, status: e.target.value }))} className="w-full h-10 px-2 rounded-xl border bg-white text-xs">
                              <option>Draft</option>
                              <option>Active</option>
                            </select>
                          </div>
                        </div>
                        <button type="submit" className="w-full h-11 bg-[#8B1A4A] text-white rounded-full text-xs font-bold uppercase mt-2">Publish Article</button>
                      </form>
                    </motion.div>
                  )}

                  {/* PANEL F: MEDIA LIBRARY */}
                  {activeTab === 'media' && isAuthorized(['Super Admin', 'Marketing Admin']) && (
                    <motion.div key="media" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="glass-card-admin rounded-3xl p-6">
                      <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Enterprise Media Assets</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {mediaFiles.map((media, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-white/40 border border-slate-100 text-center flex flex-col justify-between min-h-[140px]">
                            <div className="flex justify-center mb-2">
                              {media.type === 'image' ? (
                                <img src={media.url} className="w-12 h-12 object-cover rounded-lg border" />
                              ) : (
                                <FileText className="w-10 h-10 text-[#8B1A4A]" />
                              )}
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-slate-800 truncate">{media.name}</p>
                              <p className="text-[9px] text-gray-400 mt-0.5">{media.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* PANEL G: FAQS CMS */}
                  {activeTab === 'faqs' && isAuthorized(['Super Admin', 'Marketing Admin']) && (
                    <motion.div key="faqs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 glass-card-admin rounded-3xl p-6">
                        <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">General Website Q&As ({faqs.length})</h3>
                        <div className="space-y-4 max-h-[480px] overflow-y-auto custom-scrollbar">
                          {faqs.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No FAQs written yet.</p>
                          ) : (
                            faqs.map(faq => (
                              <div key={faq.id} className="p-4 rounded-2xl bg-white/50 border border-slate-100 flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-slate-800">Q: {faq.question}</p>
                                  <p className="text-xs text-gray-500 italic">A: {faq.answer}</p>
                                  <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{faq.category}</span>
                                </div>
                                <button onClick={() => handleDeleteFaq(faq.id)} className="text-rose-600 p-2 hover:bg-rose-50 rounded-lg flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <form onSubmit={handleAddFaq} className="lg:col-span-5 glass-card-admin rounded-3xl p-6 space-y-4">
                        <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-2">Add FAQ Entry</h3>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Question</label>
                          <input type="text" value={newFaq.question} onChange={e => setNewFaq(prev => ({ ...prev, question: e.target.value }))} className="w-full h-10 px-3 rounded-xl border bg-white text-xs" required />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Answer</label>
                          <textarea value={newFaq.answer} onChange={e => setNewFaq(prev => ({ ...prev, answer: e.target.value }))} className="w-full h-20 p-3 rounded-xl border bg-white text-xs" required />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Category</label>
                          <select value={newFaq.category} onChange={e => setNewFaq(prev => ({ ...prev, category: e.target.value }))} className="w-full h-10 px-2 rounded-xl border bg-white text-xs">
                            <option>General</option>
                            <option>Billing</option>
                            <option>Treatments</option>
                          </select>
                        </div>
                        <button type="submit" className="w-full h-11 bg-[#8B1A4A] text-white rounded-full text-xs font-bold uppercase mt-2">Publish FAQ</button>
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
