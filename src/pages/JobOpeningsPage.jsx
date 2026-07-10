import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, MapPin, Briefcase, Clock, ChevronDown, Plus, Minus,
  Bookmark, BookmarkCheck, GraduationCap, ChevronRight, Send,
  X, Upload, FileText, CheckCircle2, User, Phone, Mail, MessageSquare
} from 'lucide-react'
import { PageShell } from '@/components/shared/PageShell'

// Static fallback used when the CMS (Firebase) is unavailable
const FALLBACK_JOBS = [
  {
    id: 'static-1',
    title: 'Consultant — Orthopedic Surgeon',
    department: 'Orthopedics',
    location: 'LB Nagar, Hyderabad',
    experience: '5 - 10 Years',
    description: 'Join our flagship joint replacement team performing robotic-assisted arthroplasty alongside Dr. Akhil Dadi.',
    postedAt: 20260701,
  },
  {
    id: 'static-2',
    title: 'Staff Nurse — Operation Theatre',
    department: 'Nursing',
    location: 'Miyapur, Hyderabad',
    experience: '2 - 5 Years',
    description: 'OT-trained nurses for our robotic surgery suites. NABH exposure preferred.',
    postedAt: 20260628,
  },
  {
    id: 'static-3',
    title: 'Physiotherapist — Rehabilitation',
    department: 'Physiotherapy',
    location: 'Peerzadiguda, Hyderabad',
    experience: '1 - 3 Years',
    description: 'Post-operative joint replacement rehabilitation and sports injury recovery programmes.',
    postedAt: 20260625,
  },
  {
    id: 'static-4',
    title: 'Executive — Digital Marketing',
    department: 'Marketing',
    location: 'Corporate Office, Hyderabad',
    experience: '3 - 8 Years',
    description: 'Own Srikara\'s digital presence — SEO, social campaigns and patient-education content.',
    postedAt: 20260620,
  },
  {
    id: 'static-5',
    title: 'Front Office Executive',
    department: 'Administration',
    location: 'Vijayawada, Andhra Pradesh',
    experience: '0 - 2 Years',
    description: 'Patient registration, appointment coordination and front-desk experience management.',
    postedAt: 20260615,
  },
  {
    id: 'static-6',
    title: 'Duty Medical Officer',
    department: 'Emergency Medicine',
    location: 'Kompally, Hyderabad',
    experience: '1 - 4 Years',
    description: 'MBBS with emergency/casualty experience for our 24×7 emergency department.',
    postedAt: 20260610,
  },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'Title (A–Z)' },
]

const MAX_RESUME_BYTES = 5 * 1024 * 1024 // 5 MB

function FilterGroup({ label, options, selected, onToggle }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{ '--glass-border': 'rgba(139, 26, 74, 0.1)', '--glass-shadow': 'rgba(139, 26, 74, 0.04)' }}
      className="glass-card-colorful rounded-2xl overflow-hidden !transform-none"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-7 py-6 text-left"
      >
        <span className="font-headline font-bold text-base md:text-lg text-[#2D3A4A]">
          {label}
          {selected.length > 0 && (
            <span className="ml-2.5 text-[11px] font-black text-white bg-[#8B1A4A] rounded-full px-2.5 py-0.5 align-middle">{selected.length}</span>
          )}
        </span>
        {open ? <Minus className="w-5 h-5 text-[#8B1A4A]" /> : <Plus className="w-5 h-5 text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-slate-100/60"
          >
            <div className="px-7 py-4 space-y-2.5 max-h-64 overflow-y-auto">
              {options.map(opt => (
                <label key={opt} className="flex items-center gap-3.5 cursor-pointer group py-1.5">
                  <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={() => onToggle(opt)}
                    className="w-5 h-5 rounded border-slate-300 accent-[#8B1A4A] cursor-pointer"
                  />
                  <span className="text-[15px] text-[#4A4A4A] group-hover:text-[#8B1A4A] transition-colors">{opt}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Custom sort dropdown in the site theme (replaces the native <select>) */
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const activeLabel = SORT_OPTIONS.find(o => o.value === value)?.label

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 pl-5 pr-4 h-12 rounded-xl bg-white/80 border border-slate-200 text-sm font-semibold text-[#2D3A4A] hover:border-[#8B1A4A]/40 shadow-sm transition-all"
      >
        {activeLabel}
        <ChevronDown className={`w-4 h-4 text-[#8B1A4A] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+6px)] w-[200px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.14)] border border-black/5 overflow-hidden z-40"
          >
            <span className="block h-[3px] w-full bg-[#8B1A4A]" />
            <div className="py-2">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-left transition-all ${
                    opt.value === value
                      ? 'text-[#8B1A4A] bg-[#8B1A4A]/5'
                      : 'text-gray-700 hover:text-[#8B1A4A] hover:bg-[#8B1A4A]/5'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${opt.value === value ? 'bg-[#8B1A4A]' : 'bg-[#8B1A4A]/30'}`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Application popup form, pre-filled with the selected job's parameters */
function ApplyModal({ job, onClose }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [resume, setResume] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const fileInputRef = useRef(null)

  // Lock body scroll while the modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const handleFile = file => {
    if (!file) return
    if (file.size > MAX_RESUME_BYTES) {
      setResume(null)
      setErrors(e => ({ ...e, resume: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB — must be below 5 MB.` }))
      return
    }
    setErrors(({ resume: _drop, ...rest }) => rest)
    setResume(file)
  }

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Please enter your full name.'
    if (!/^[\d\s+\-()]{10,15}$/.test(phone.trim())) errs.phone = 'Please enter a valid phone number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Please enter a valid email address.'
    if (!resume) errs.resume = 'Please attach your resume (below 5 MB).'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate() || status === 'submitting') return
    setStatus('submitting')

    const application = {
      jobId: job.id,
      jobTitle: job.title,
      department: job.department || '',
      location: job.location || '',
      experience: job.experience || '',
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
      resumeName: resume.name,
      status: 'New',
    }

    try {
      const { db, storage } = await import('@/lib/firebase')
      if (!db) throw new Error('CMS offline')
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')

      let resumeUrl = ''
      if (storage) {
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
        const safeName = resume.name.replace(/[^\w.\-]+/g, '_')
        const fileRef = ref(storage, `job_applications/${Date.now()}_${safeName}`)
        await uploadBytes(fileRef, resume)
        resumeUrl = await getDownloadURL(fileRef)
      }

      await addDoc(collection(db, 'job_applications'), {
        ...application,
        resumeUrl,
        submittedAt: serverTimestamp(),
      })
      setStatus('success')
    } catch (err) {
      console.warn('Online application failed, falling back to email client:', err)
      // Fallback: open the visitor's email client with everything pre-filled
      const subject = encodeURIComponent(`Application for ${job.title} — ${job.location}`)
      const body = encodeURIComponent(
        `Respected HR Team,\n\nI would like to apply for the ${job.title} position (${job.department}) at Srikara Hospitals, ${job.location}.\n\nName: ${application.name}\nPhone: ${application.phone}\nEmail: ${application.email}${application.message ? `\n\nMessage:\n${application.message}` : ''}\n\nNote: My resume "${application.resumeName}" is attached.\n\nWarm regards,\n${application.name}`
      )
      window.location.href = `mailto:hr@srikarahospitals.com?subject=${subject}&body=${body}`
      setStatus('success')
    }
  }

  const inputClass = err =>
    `w-full px-4 h-12 rounded-xl bg-white/80 border outline-none text-sm transition-all shadow-sm placeholder:text-slate-400 ${
      err ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-[#8B1A4A]/50'
    }`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[300] bg-[#2D0A1C]/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-[#FFF9FA] rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.3)] border border-white overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header with pre-filled job parameters */}
        <div className="px-7 py-6 relative" style={{ background: 'linear-gradient(135deg, #8B1A4A, #5E0F30)' }}>
          <button
            onClick={onClose}
            aria-label="Close application form"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all"
          >
            <X size={17} />
          </button>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60 mb-1.5">Applying For</p>
          <h3 className="font-headline font-bold text-lg text-white leading-snug pr-10">{job.title}</h3>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[11px] font-semibold text-white/80">
            {job.department && <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.department}</span>}
            {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>}
            {job.experience && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.experience}</span>}
          </div>
        </div>

        {status === 'success' ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="font-garamond text-2xl font-bold text-[#1A202C] mb-2">Application Submitted!</h4>
            <p className="text-sm text-[#4A4A4A] font-light max-w-sm mx-auto mb-8">
              Thank you, {name.split(' ')[0] || 'applicant'}. Our HR team will review your application for
              {' '}<strong>{job.title}</strong> and get back to you shortly.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-full bg-[#8B1A4A] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#2D3A4A] transition-all shadow-md shadow-[#8B1A4A]/20"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-7 space-y-5 overflow-y-auto">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">
                <User className="w-3 h-3" /> Full Name *
              </label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Dr. Sanjay Kumar" className={inputClass(errors.name)} />
              {errors.name && <p className="text-[11px] text-rose-600 font-semibold mt-1.5">{errors.name}</p>}
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">
                  <Phone className="w-3 h-3" /> Phone Number *
                </label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210" className={inputClass(errors.phone)} />
                {errors.phone && <p className="text-[11px] text-rose-600 font-semibold mt-1.5">{errors.phone}</p>}
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">
                  <Mail className="w-3 h-3" /> Email *
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass(errors.email)} />
                {errors.email && <p className="text-[11px] text-rose-600 font-semibold mt-1.5">{errors.email}</p>}
              </div>
            </div>

            {/* Resume upload */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">
                <FileText className="w-3 h-3" /> Resume (PDF / DOC, below 5 MB) *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={e => handleFile(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full rounded-xl border-2 border-dashed p-5 flex items-center gap-4 text-left transition-all ${
                  errors.resume
                    ? 'border-rose-300 bg-rose-50/40'
                    : resume
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : 'border-[#8B1A4A]/25 bg-white/60 hover:border-[#8B1A4A]/50 hover:bg-[#8B1A4A]/[0.03]'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                  resume ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-[#FFF0F5] text-[#8B1A4A] border-[#FFE4E1]'
                }`}>
                  {resume ? <CheckCircle2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  {resume ? (
                    <>
                      <p className="text-sm font-bold text-[#1A202C] truncate">{resume.name}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        {(resume.size / 1024 / 1024).toFixed(2)} MB — click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-[#2D3A4A]">Click to upload your resume</p>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">PDF, DOC or DOCX · maximum 5 MB</p>
                    </>
                  )}
                </div>
              </button>
              {errors.resume && <p className="text-[11px] text-rose-600 font-semibold mt-1.5">{errors.resume}</p>}
            </div>

            {/* Message (optional) */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-[#2D3A4A]/60 mb-2">
                <MessageSquare className="w-3 h-3" /> Message <span className="normal-case font-semibold text-slate-400">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                placeholder="Anything you'd like our HR team to know…"
                className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 focus:border-[#8B1A4A]/50 outline-none text-sm transition-all shadow-sm placeholder:text-slate-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full h-13 py-4 rounded-full bg-[#8B1A4A] text-white text-[12px] font-black uppercase tracking-wider hover:bg-[#2D3A4A] transition-all shadow-md shadow-[#8B1A4A]/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
            >
              {status === 'submitting'
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting…</>
                : <><Send className="w-4 h-4" /> Submit Application</>}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export function JobOpeningsPage() {
  const [jobs, setJobs] = useState(FALLBACK_JOBS)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [deptFilter, setDeptFilter] = useState([])
  const [locFilter, setLocFilter] = useState([])
  const [expFilter, setExpFilter] = useState([])
  const [saved, setSaved] = useState([])
  const [expandedJob, setExpandedJob] = useState(null)
  const [applyJob, setApplyJob] = useState(null)

  // Pull live openings from the same CMS collection the Careers page uses
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { db } = await import('@/lib/firebase')
        if (!db) return
        const { collection, getDocs } = await import('firebase/firestore')
        const snap = await getDocs(collection(db, 'job_openings'))
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(j => j.status === 'Active')
        if (list.length > 0) setJobs(list)
      } catch {
        console.warn('CMS offline — showing static job openings.')
      }
    }
    fetchJobs()
  }, [])

  const departments = useMemo(() => [...new Set(jobs.map(j => j.department).filter(Boolean))].sort(), [jobs])
  const locations = useMemo(() => [...new Set(jobs.map(j => j.location).filter(Boolean))].sort(), [jobs])
  const experiences = useMemo(() => [...new Set(jobs.map(j => j.experience).filter(Boolean))].sort(), [jobs])

  const toggle = (setter) => (value) =>
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = jobs.filter(j =>
      (!q || [j.title, j.department, j.location].some(f => f?.toLowerCase().includes(q))) &&
      (deptFilter.length === 0 || deptFilter.includes(j.department)) &&
      (locFilter.length === 0 || locFilter.includes(j.location)) &&
      (expFilter.length === 0 || expFilter.includes(j.experience))
    )
    list = [...list].sort((a, b) => {
      if (sort === 'title') return (a.title || '').localeCompare(b.title || '')
      const diff = (b.postedAt || 0) - (a.postedAt || 0)
      return sort === 'oldest' ? -diff : diff
    })
    return list
  }, [jobs, query, sort, deptFilter, locFilter, expFilter])

  const toggleSave = id => setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  return (
    <PageShell
      wide
      seoTitle="Current Job Openings | Careers at Srikara Hospitals"
      seoDescription="Explore current job openings at Srikara Hospitals — clinical, nursing, paramedical and administrative roles across Telangana and Andhra Pradesh."
      badge="Careers at Srikara"
      title="Current Job Openings"
      subtitle="Build your career with a team that treats excellence and empathy as equals."
    >
      {/* Search bar */}
      <div
        style={{ '--glass-border': 'rgba(139, 26, 74, 0.15)', '--glass-shadow': 'rgba(139, 26, 74, 0.06)' }}
        className="glass-card-colorful rounded-2xl flex items-center px-7 h-16 mb-10 w-full !transform-none"
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by role, department or location"
          className="flex-1 bg-transparent outline-none text-sm text-[#1A202C] placeholder:text-slate-400"
        />
        <Search className="w-5 h-5 text-[#8B1A4A] flex-shrink-0" />
      </div>

      {/* Count + sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <p className="font-garamond text-2xl md:text-3xl font-bold text-[#1A202C]">
          <span className="text-[#8B1A4A]">{filtered.length}</span> Open {filtered.length === 1 ? 'job' : 'jobs'} available
        </p>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-20 items-start">
        {/* Filter sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-5">
          <p className="font-headline font-bold text-base text-[#2D3A4A] uppercase tracking-wider px-1">Filters</p>
          <FilterGroup label="Department" options={departments} selected={deptFilter} onToggle={toggle(setDeptFilter)} />
          <FilterGroup label="Location" options={locations} selected={locFilter} onToggle={toggle(setLocFilter)} />
          <FilterGroup label="Experience" options={experiences} selected={expFilter} onToggle={toggle(setExpFilter)} />
          {(deptFilter.length + locFilter.length + expFilter.length) > 0 && (
            <button
              onClick={() => { setDeptFilter([]); setLocFilter([]); setExpFilter([]) }}
              className="w-full text-[11px] font-black uppercase tracking-wider text-[#8B1A4A] hover:underline py-2"
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Job list */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-5">
          {filtered.length === 0 && (
            <div className="text-center py-20 rounded-[28px] border border-dashed border-[#8B1A4A]/25 bg-white/40">
              <Briefcase className="w-8 h-8 text-[#8B1A4A]/40 mx-auto mb-4" />
              <p className="font-headline font-bold text-[#2D3A4A]">No matching openings right now</p>
              <p className="text-sm text-[#4A4A4A] font-light mt-1">Try clearing filters, or email your CV to hr@srikarahospitals.com</p>
            </div>
          )}

          {filtered.map((job, idx) => (
            <motion.article
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              style={{
                '--glass-border': 'rgba(139, 26, 74, 0.12)',
                '--glass-border-hover': 'rgba(139, 26, 74, 0.35)',
                '--glass-shadow': 'rgba(139, 26, 74, 0.05)',
                '--glass-shadow-hover': 'rgba(139, 26, 74, 0.14)',
              }}
              className="glass-card-colorful rounded-[24px] p-7 !transform-none"
            >
              <h3 className="font-headline font-bold text-lg md:text-xl text-[#1A202C] mb-3">{job.title}</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-semibold text-gray-500 mb-5">
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-[#8B1A4A]" /> {job.department}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#8B1A4A]" /> {job.location}</span>
                {job.experience && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#8B1A4A]" /> {job.experience}</span>}
              </div>

              <AnimatePresence initial={false}>
                {expandedJob === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-[#4A4A4A] leading-relaxed font-light mb-5 whitespace-pre-line border-t border-slate-100 pt-4">
                      {job.description || 'Reach out to our HR team for the full job description.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3">
                {expandedJob === job.id ? (
                  <button
                    onClick={() => setApplyJob(job)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B1A4A] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#2D3A4A] transition-all shadow-md shadow-[#8B1A4A]/20"
                  >
                    <Send className="w-3.5 h-3.5" /> Apply Now
                  </button>
                ) : (
                  <button
                    onClick={() => setExpandedJob(job.id)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#8B1A4A]/30 text-[#8B1A4A] text-[11px] font-black uppercase tracking-wider hover:bg-[#8B1A4A] hover:text-white transition-all"
                  >
                    View and Apply <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => toggleSave(job.id)}
                  aria-label={saved.includes(job.id) ? 'Remove from saved jobs' : 'Save this job'}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                    saved.includes(job.id)
                      ? 'bg-[#8B1A4A] border-[#8B1A4A] text-white'
                      : 'border-slate-200 text-slate-400 hover:border-[#8B1A4A]/40 hover:text-[#8B1A4A]'
                  }`}
                >
                  {saved.includes(job.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Application popup */}
      <AnimatePresence>
        {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
      </AnimatePresence>

      {/* Academics cross-link */}
      <section className="mb-12 max-w-4xl mx-auto">
        <div
          style={{ '--glass-border': 'rgba(139, 26, 74, 0.18)', '--glass-shadow': 'rgba(139, 26, 74, 0.08)' }}
          className="glass-card-colorful rounded-[28px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between !transform-none"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F5] border border-[#FFE4E1] flex items-center justify-center text-[#8B1A4A] flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-[#1A202C]">Looking for Academics Instead?</h3>
              <p className="text-sm text-[#4A4A4A] font-light mt-0.5">Explore our Arthroplasty Fellowship and surgical training programmes.</p>
            </div>
          </div>
          <Link
            to="/careers"
            className="flex-shrink-0 px-7 py-3.5 rounded-full bg-[#8B1A4A] text-white font-bold uppercase tracking-wider text-[11px] hover:bg-[#2D3A4A] transition-all shadow-md shadow-[#8B1A4A]/20"
          >
            Academics & Fellowship
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
