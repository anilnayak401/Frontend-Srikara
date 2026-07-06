import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
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
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react'

// Import Firebase SDK references statically
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
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(139, 26, 74, 0.1);
    box-shadow: 0 10px 30px -10px rgba(139, 26, 74, 0.05);
  }
  .active-tab {
    background: #8B1A4A;
    color: white !important;
    box-shadow: 0 8px 20px -8px rgba(139, 26, 74, 0.4);
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

const MOCK_CLICKS = [
  { element: 'button#book-now', text: 'Book Appointment', path: '/home', count: 142 },
  { element: 'a#careers-link', text: 'Careers & Fellowship', path: '/footer', count: 98 },
  { element: 'button#email-launch', text: 'Launch Email Client', path: '/careers', count: 64 },
  { element: 'a#specialties-3d', text: '3D Anatomy Explorer', path: '/navbar', count: 52 }
]

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
  const [clickLogs, setClickLogs] = useState(MOCK_CLICKS)
  const [doctors, setDoctors] = useState([])
  const [jobs, setJobs] = useState([])
  const [fellowship, setFellowship] = useState({
    duration: '1 Month',
    eligibility: 'MS (Orthopedics) / D.Ortho',
    seats: 2,
    fees: [
      { period: 'June 2024 – Feb 2025', rate: '₹60,000 / mo', active: false },
      { period: 'March 2025 – March 2026', rate: '₹80,000 / mo', active: false },
      { period: 'April 2026 – Dec 2026', rate: '₹1,00,000 / mo', active: true }
    ],
    postponementCharge: '₹10,000'
  })

  // Inputs
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', experience: '', branch: '', bio: '', photoUrl: '' })
  const [newJob, setNewJob] = useState({ title: '', department: '', location: '', experience: '', description: '', status: 'Active' })
  const [photoFile, setPhotoFile] = useState(null)

  // 1. Auth Observer
  useEffect(() => {
    if (!auth) {
      console.log('Firebase auth not initialized. Running in demo layout.')
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
      setDoctors(docList)

      // Load Job Openings
      const jobSnap = await getDocs(collection(db, 'job_openings'))
      const jobList = jobSnap.docs.map(j => ({ id: j.id, ...j.data() }))
      setJobs(jobList)

      // Load Fellowship Settings
      const fellSnap = await getDocs(collection(db, 'fellowship_details'))
      if (!fellSnap.empty) {
        setFellowship(fellSnap.docs[0].data())
      }

      // Load Analytics
      const q = query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'), limit(100))
      const eventSnap = await getDocs(q)
      const rawEvents = eventSnap.docs.map(e => e.data())
      
      // Parse visits over time
      const viewEvents = rawEvents.filter(e => e.type === 'page_view')
      const parsedAnalytics = processPageViewData(viewEvents)
      if (parsedAnalytics.length > 0) setAnalyticsData(parsedAnalytics)

      // Parse clicks
      const clickEvents = rawEvents.filter(e => e.type === 'click')
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

  const processClickData = (clicks) => {
    const counts = {}
    clicks.forEach(c => {
      const key = `${c.element}-${c.text}`
      counts[key] = counts[key] || { element: c.element, text: c.text, path: c.path, count: 0 }
      counts[key].count++
    })
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5)
  }

  // 3. User Actions
  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    if (!auth) {
      // Demo authentication fallback
      if (email === 'admin@srikara.com' && password === 'admin123') {
        setUser({ email: 'admin@srikara.com', displayName: 'Hospital Manager' })
      } else {
        setAuthError('Demo Login: use admin@srikara.com & admin123')
      }
      return
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setAuthError('Invalid credentials. Check your email/password setup.')
    }
  }

  const handleLogout = async () => {
    if (!auth) {
      setUser(null)
      return
    }
    await signOut(auth)
  }

  // Doctor Submissions
  const handleAddDoctor = async (e) => {
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

      setNewDoctor({ name: '', specialty: '', experience: '', branch: '', bio: '', photoUrl: '' })
      setPhotoFile(null)
      setMessage({ type: 'success', text: 'Doctor added successfully!' })
      loadAllData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to write doctor profile.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Delete doctor record?')) return
    try {
      if (db) {
        await deleteDoc(doc(db, 'doctors', id))
      } else {
        setDoctors(prev => prev.filter(d => d.id !== id))
      }
      setMessage({ type: 'success', text: 'Doctor profile deleted.' })
      loadAllData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete record.' })
    }
  }

  // Job Submissions
  const handleAddJob = async (e) => {
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
      setMessage({ type: 'success', text: 'Job opening posted!' })
      loadAllData()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add job opening.' })
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
      setMessage({ type: 'error', text: 'Failed to delete job post.' })
    }
  }

  // Fellowship parameters
  const handleUpdateFellowship = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (db) {
        await setDoc(doc(db, 'fellowship_details', 'arthroplasty'), fellowship)
      }
      setMessage({ type: 'success', text: 'Fellowship details updated successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to write fellowship data.' })
    } finally {
      setLoading(false)
    }
  }

  const handleFellowshipFeeChange = (idx, val) => {
    const updatedFees = [...fellowship.fees]
    updatedFees[idx].rate = val
    setFellowship(prev => ({ ...prev, fees: updatedFees }))
  }

  return (
    <>
      <Helmet>
        <title>Srikara | Admin Portal</title>
        <style>{DASH_STYLES}</style>
      </Helmet>

      <div className="min-h-screen bg-[#FFF9FA] text-[#1A202C] selection:bg-[#8B1A4A] selection:text-white font-body relative overflow-hidden pb-12">
        
        {/* Decorative background glows */}
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
                  className="h-10 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-bold flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Data
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Sidebar Menu */}
              <nav className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto gap-2 lg:gap-1.5 p-1 bg-white/40 border border-white/60 shadow-sm rounded-2xl h-fit">
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
                        activeTab === tab.id ? 'active-tab' : ''
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
                  
                  {/* MODULE A: ANALYTICS */}
                  {activeTab === 'analytics' && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Traffic Graph */}
                        <div className="glass-card-admin rounded-3xl p-6">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Traffic Statistics (Last 7 Days)</h3>
                          <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <ReLineChart data={analyticsData}>
                                <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} />
                                <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="pageviews" stroke="#8B1A4A" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                              </ReLineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Top Clicks */}
                        <div className="glass-card-admin rounded-3xl p-6">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Top Click Interactions</h3>
                          <div className="space-y-4">
                            {clickLogs.map((click, i) => (
                              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/40 border border-slate-100 shadow-sm">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#1A202C] truncate">{click.text || 'Generic Element'}</p>
                                  <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">{click.element} ({click.path})</p>
                                </div>
                                <span className="bg-[#8B1A4A]/10 text-[#8B1A4A] text-xs font-black px-3 py-1 rounded-full">{click.count} clicks</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* MODULE B: DOCTORS CMS */}
                  {activeTab === 'doctors' && (
                    <motion.div
                      key="doctors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        
                        {/* List */}
                        <div className="glass-card-admin rounded-3xl p-6">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Active Roster ({doctors.length})</h3>
                          <div className="space-y-4 max-h-[480px] overflow-y-auto custom-scrollbar">
                            {doctors.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">No doctors uploaded to database yet.</p>
                            ) : (
                              doctors.map(doc => (
                                <div key={doc.id} className="flex gap-4 items-center justify-between p-3.5 rounded-2xl bg-white/50 border border-slate-100 shadow-sm">
                                  <div className="flex gap-3 items-center min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 border overflow-hidden flex-shrink-0">
                                      {doc.photoUrl ? <img src={doc.photoUrl} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-gray-400 m-2.5" />}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                                      <p className="text-[10px] text-[#8B1A4A] font-semibold mt-0.5 truncate">{doc.specialty}</p>
                                    </div>
                                  </div>
                                  <button onClick={() => handleDeleteDoctor(doc.id)} className="text-rose-600 hover:text-rose-800 p-2 rounded-lg hover:bg-rose-50">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Add Form */}
                        <form onSubmit={handleAddDoctor} className="glass-card-admin rounded-3xl p-6 space-y-4">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-2">Create Doctor Profile</h3>
                          
                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Full Name</label>
                            <input 
                              type="text" 
                              placeholder="Dr. Akhil Dadi" 
                              value={newDoctor.name} 
                              onChange={e => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
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
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Experience (Years)</label>
                            <input 
                              type="text" 
                              placeholder="15+ Years" 
                              value={newDoctor.experience} 
                              onChange={e => setNewDoctor(prev => ({ ...prev, experience: e.target.value }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Doctor Photo (File Upload)</label>
                            <div className="relative h-11 border border-slate-200 rounded-xl bg-white flex items-center px-4 gap-2 cursor-pointer">
                              <Upload className="w-4 h-4 text-[#8B1A4A]" />
                              <span className="text-xs text-gray-500 truncate">{photoFile ? photoFile.name : 'Select file (JPG, PNG)...'}</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => setPhotoFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-11 rounded-full bg-[#8B1A4A] text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 mt-4"
                          >
                            Add Doctor Profile
                          </button>
                        </form>

                      </div>
                    </motion.div>
                  )}

                  {/* MODULE C: JOB OPENINGS */}
                  {activeTab === 'jobs' && (
                    <motion.div
                      key="jobs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        
                        {/* List */}
                        <div className="glass-card-admin rounded-3xl p-6">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-4">Active Openings ({jobs.length})</h3>
                          <div className="space-y-4 max-h-[480px] overflow-y-auto custom-scrollbar">
                            {jobs.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">No job openings posted.</p>
                            ) : (
                              jobs.map(job => (
                                <div key={job.id} className="flex gap-4 items-center justify-between p-3.5 rounded-2xl bg-white/50 border border-slate-100 shadow-sm">
                                  <div>
                                    <p className="text-xs font-bold text-slate-800">{job.title}</p>
                                    <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{job.department} · {job.location}</p>
                                  </div>
                                  <button onClick={() => handleDeleteJob(job.id)} className="text-rose-600 hover:text-rose-800 p-2 rounded-lg hover:bg-rose-50">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Add Form */}
                        <form onSubmit={handleAddJob} className="glass-card-admin rounded-3xl p-6 space-y-4">
                          <h3 className="font-headline font-bold text-base text-[#2D3A4A] mb-2">Post New Position</h3>
                          
                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Job Title</label>
                            <input 
                              type="text" 
                              placeholder="Consultant Orthopedic Surgeon" 
                              value={newJob.title} 
                              onChange={e => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Department</label>
                              <input 
                                type="text" 
                                placeholder="Orthopedics" 
                                value={newJob.department} 
                                onChange={e => setNewJob(prev => ({ ...prev, department: e.target.value }))}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Location</label>
                              <input 
                                type="text" 
                                placeholder="LB Nagar, Hyd" 
                                value={newJob.location} 
                                onChange={e => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Description & Requirements</label>
                            <textarea 
                              placeholder="Key responsibilities and qualifications required..." 
                              value={newJob.description} 
                              onChange={e => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none"
                              required
                            />
                          </div>

                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-11 rounded-full bg-[#8B1A4A] text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 mt-4"
                          >
                            Publish Opening
                          </button>
                        </form>

                      </div>
                    </motion.div>
                  )}

                  {/* MODULE D: FELLOWSHIP PARAMETERS */}
                  {activeTab === 'fellowship' && (
                    <motion.div
                      key="fellowship"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <form onSubmit={handleUpdateFellowship} className="glass-card-admin rounded-3xl p-8 space-y-6">
                        <h3 className="font-headline font-bold text-base text-[#2D3A4A]">Configure Fellowship Details</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1.5">Course Duration</label>
                            <input 
                              type="text" 
                              value={fellowship.duration} 
                              onChange={e => setFellowship(prev => ({ ...prev, duration: e.target.value }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1.5">Eligibility</label>
                            <input 
                              type="text" 
                              value={fellowship.eligibility} 
                              onChange={e => setFellowship(prev => ({ ...prev, eligibility: e.target.value }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1.5">Capacity (Seats/Mo)</label>
                            <input 
                              type="number" 
                              value={fellowship.seats} 
                              onChange={e => setFellowship(prev => ({ ...prev, seats: parseInt(e.target.value) || 0 }))}
                              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
                            />
                          </div>
                        </div>

                        {/* Fee structures */}
                        <div>
                          <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-3">Adjust Period Fees</label>
                          <div className="space-y-4">
                            {fellowship.fees.map((fee, idx) => (
                              <div key={idx} className="flex gap-4 items-center">
                                <span className="text-xs font-semibold text-[#2D3A4A] w-48 truncate">{fee.period}</span>
                                <input 
                                  type="text" 
                                  value={fee.rate} 
                                  onChange={e => handleFellowshipFeeChange(idx, e.target.value)}
                                  className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm"
                                />
                                {fee.active && <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full">Active</span>}
                              </div>
                            ))}
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
