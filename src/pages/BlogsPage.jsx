import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, X } from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

const blogs = [
  {
    id: 1,
    category: 'Orthopaedics',
    tag: 'Case Study',
    title: 'Walking Again at 68: A Bilateral Robotic Knee Replacement Story',
    excerpt: 'A retired school teacher from ECIL had been living with severe bilateral knee arthritis for over 6 years. After NAVIO robotic-assisted bilateral knee replacement at Srikara, she walked unaided within 3 days.',
    date: 'March 12, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800',
    content: '<h3>Patient Background</h3><p>Mrs. Lakshmi Devi, 68, a retired school teacher from ECIL, had been suffering from severe bilateral knee osteoarthritis for over six years. She could barely walk 50 metres without stopping due to pain, and climbing stairs had become impossible.</p><h3>The Srikara Approach</h3><p>Dr. Akhil Dadi and his team performed a simultaneous bilateral robotic knee replacement using the NAVIO system. The robotic platform allowed sub-millimetre precision in implant positioning, reducing soft tissue damage and blood loss significantly.</p><p>The procedure was completed in under 3 hours. Mrs. Devi was mobilised with a walker the very next morning and was walking unaided by day 3.</p><h3>Outcome</h3><p>At her 6-week follow-up, she demonstrated full range of motion in both knees and returned to her daily routine within 6 weeks. Her case is one of over 30,000 successful joint replacements performed at Srikara Hospitals since 2013.</p><blockquote>"I had given up hope of living without pain. The doctors at Srikara gave me my life back." — Mrs. Lakshmi Devi</blockquote>',
  },
  {
    id: 2,
    category: 'Cardiology',
    tag: 'Clinical Insight',
    title: 'Heart Attack at 44: How Rapid Intervention Saved a Young Father',
    excerpt: 'A 44-year-old software engineer from Peerzadiguda was brought to Srikara in cardiac arrest. The cardiology team performed emergency angioplasty within 45 minutes, restoring full heart function.',
    date: 'February 8, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800',
    content: '<h3>The Emergency</h3><p>Mr. Ravi Kumar, 44, collapsed at his office with chest pain and was rushed to Srikara Hospitals. His ECG confirmed a massive STEMI — a complete blockage of the left anterior descending artery, often called the "widow maker."</p><h3>Door-to-Balloon Time: 45 Minutes</h3><p>Dr. Venkatesh Kumar performed an emergency primary angioplasty. A drug-eluting stent was deployed within 45 minutes of arrival — well within the international benchmark of 90 minutes.</p><h3>Recovery</h3><p>His heart function, which had dropped to 30% at admission, recovered to 55% within two weeks. He was discharged on day 5 and returned to work within 6 weeks.</p>',
  },
  {
    id: 3,
    category: 'Neurosurgery',
    tag: 'Case Study',
    title: 'Back to Work in 6 Weeks: Minimally Invasive Spine Surgery Success',
    excerpt: 'A 38-year-old IT professional with a severely herniated L4-L5 disc was unable to sit for more than 10 minutes. After minimally invasive spine surgery at Srikara, he returned to his desk job in just 6 weeks.',
    date: 'January 20, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    content: '<h3>The Problem</h3><p>Mr. Suresh Reddy, 38, had been suffering from severe lower back pain radiating down his left leg for 8 months. An MRI confirmed a large L4-L5 disc herniation compressing the nerve root. He could not sit for more than 10 minutes.</p><h3>Minimally Invasive Approach</h3><p>Dr. K. Naresh Babu performed a minimally invasive microdiscectomy through a 2 cm incision. The herniated disc fragment was removed without disturbing the surrounding muscles. The procedure lasted 90 minutes and Mr. Reddy was walking the same evening.</p><h3>Outcome</h3><p>His leg pain resolved completely within 48 hours. At his 6-week follow-up, he had returned to full-time work with no restrictions.</p>',
  },
  {
    id: 4,
    category: 'General Surgery',
    tag: 'Patient Story',
    title: 'Gallbladder Removed, Home the Same Day: Laparoscopic Surgery at Srikara',
    excerpt: 'A 52-year-old homemaker from Kompally underwent laparoscopic cholecystectomy at Srikara and was discharged the same day — a testament to how far minimally invasive surgery has come.',
    date: 'December 15, 2024',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&q=80&w=800',
    content: '<h3>Recurring Pain for Two Years</h3><p>Mrs. Padmavathi, 52, had been experiencing recurring upper abdominal pain after meals for nearly two years. An ultrasound revealed multiple gallstones. Fear of a large scar and long recovery had kept her from seeking treatment.</p><h3>Day-Care Laparoscopic Surgery</h3><p>Dr. M. Anurag performed a laparoscopic cholecystectomy through four tiny incisions, each less than 1 cm. The procedure took 45 minutes. Mrs. Padmavathi was awake and sipping fluids within 2 hours and discharged the same evening.</p><h3>Back to Normal</h3><p>She resumed light household activities within 3 days and was fully active within a week. "I was home the same day. I couldn\'t believe it," she said.</p>',
  },
  {
    id: 5,
    category: 'Diabetology',
    tag: 'Health Guide',
    title: 'Managing Diabetes in Hyderabad: What Every Patient Should Know',
    excerpt: 'With over 11% of Hyderabad\'s urban population living with Type 2 diabetes, Dr. Murali Mohan Rao shares practical guidance on managing blood sugar and preventing complications.',
    date: 'November 28, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800',
    content: '<h3>The Diabetes Burden in Hyderabad</h3><p>Hyderabad has one of the highest rates of Type 2 diabetes in India, with studies suggesting over 11% of the urban population is affected. Sedentary lifestyles, high-carbohydrate diets, and genetic predisposition make Telangana residents particularly vulnerable.</p><h3>Early Warning Signs</h3><p>Dr. Murali Mohan Rao advises patients to watch for: frequent urination, unusual thirst, unexplained weight loss, blurred vision, slow-healing wounds, and tingling in the feet.</p><h3>The Three Pillars of Management</h3><p><strong>Diet:</strong> Reduce refined carbohydrates. Increase fibre through vegetables and whole grains.</p><p><strong>Exercise:</strong> 30 minutes of brisk walking five days a week can reduce HbA1c by 0.5–1%.</p><p><strong>Medication adherence:</strong> Never skip doses. Modern diabetes medications are safe and effective when taken consistently.</p>',
  },
  {
    id: 6,
    category: 'Orthopaedics',
    tag: 'Innovation',
    title: 'NAVIO Robotic Surgery: Why Srikara Leads India\'s Joint Replacement Revolution',
    excerpt: 'Srikara Hospitals has performed over 5,000 NAVIO robotic-assisted joint replacements. Here\'s what makes robotic surgery different and why it matters for patients.',
    date: 'October 10, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800',
    content: '<h3>What is NAVIO Robotic Surgery?</h3><p>The NAVIO system is a handheld robotic platform that assists surgeons in performing knee replacement surgery with sub-millimetre precision. The surgeon controls every movement, while the robot provides real-time guidance and prevents cuts outside the planned zone.</p><h3>Why Precision Matters</h3><p>The longevity of a knee implant depends critically on its alignment. Even a 2–3 degree error can accelerate wear and lead to early failure. Robotic-assisted surgery achieves target alignment in over 95% of cases, compared to 75–80% with conventional techniques.</p><h3>Srikara\'s Track Record</h3><p>Under Dr. Akhil Dadi, Srikara has performed over 5,000 NAVIO robotic procedures — one of the highest-volume robotic joint replacement centres in South India — with a 99% success rate.</p>',
  },
]

const CATEGORIES = ['All', 'Orthopaedics', 'Cardiology', 'Neurosurgery', 'General Surgery', 'Diabetology']

function BlogModal({ blog, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[760px] max-h-[88vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="relative h-56 flex-shrink-0">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow">
            <X size={16} />
          </button>
          <span className="absolute top-4 left-4 bg-[#8B1A4A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{blog.tag}</span>
        </div>
        <div className="flex-1 overflow-y-auto px-8 pb-10">
          <div className="flex items-center gap-4 text-xs text-[#94A3B8] mt-4 mb-4">
            <span className="flex items-center gap-1"><Calendar size={12} />{blog.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{blog.readTime}</span>
            <span className="text-[#8B1A4A] font-semibold">{blog.category}</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A202C] mb-6 leading-tight">{blog.title}</h2>
          <div
            className="text-[#475569] text-sm leading-relaxed [&_h3]:text-[#1A202C] [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#8B1A4A] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#8B1A4A] [&_strong]:text-[#1A202C]"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export function BlogsPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedBlog, setSelectedBlog] = useState(null)

  const [allBlogs, setAllBlogs] = useState(blogs)

  useEffect(() => {
    const loadDynamicBlogs = async () => {
      try {
        if (db) {
          const docSnap = await getDocs(collection(db, 'blogs'))
          if (!docSnap.empty) {
            const fbDocs = docSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            const formatted = fbDocs.map(b => ({
              ...b,
              tag: b.tag || 'Clinical',
              readTime: b.readTime || '5 min read',
              image: b.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
              content: b.body || b.content
            }))
            const filteredStatic = blogs.filter(sb => 
              !formatted.some(fb => fb.title.toLowerCase() === sb.title.toLowerCase())
            )
            setAllBlogs([...filteredStatic, ...formatted])
            return // success
          }
        }
      } catch (err) {
        console.warn('Firestore fetch failed in BlogsPage, falling back to local storage:', err)
      }

      try {
        const cached = localStorage.getItem('srikara_cms_data')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed.blogs && parsed.blogs.length > 0) {
            const formatted = parsed.blogs.map(b => ({
              ...b,
              tag: b.tag || 'Clinical',
              readTime: b.readTime || '5 min read',
              image: b.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
              content: b.body || b.content
            }))
            const filteredStatic = blogs.filter(sb => 
              !formatted.some(fb => fb.title.toLowerCase() === sb.title.toLowerCase())
            )
            setAllBlogs([...filteredStatic, ...formatted])
          }
        }
      } catch (e) {
        console.warn('Error loading dynamic blogs in BlogsPage:', e)
      }
    }
    loadDynamicBlogs()
  }, [])

  const filtered = activeCategory === 'All' ? allBlogs : allBlogs.filter(b => b.category === activeCategory)

  return (
    <>
      <Helmet><title>Blogs & Case Studies | Srikara Hospitals</title></Helmet>

      {selectedBlog && <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />}

      <div className="min-h-screen bg-[#F8FAFC] font-body text-[#1A202C] antialiased">
        <StickyNavbar />

        {/* Hero */}
        <section className="pt-24 pb-16 px-8 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-[#8B1A4A] text-[11px] font-black uppercase tracking-[0.5em] mb-4 block">Clinical Insights</span>
              <h1 className="text-5xl md:text-6xl font-bold text-[#1A202C] tracking-tight leading-tight mb-4">
                Blogs &amp; <span className="text-[#8B1A4A]">Case Studies</span>
              </h1>
              <p className="text-[#64748B] text-lg max-w-2xl">
                Real patient stories, clinical insights, and health guides from the specialists at Srikara Hospitals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category filter */}
        <div className="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-b border-[#EDF2F7] px-8 py-4">
          <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat ? 'bg-[#8B1A4A] text-white' : 'bg-[#F1F5F9] text-[#4A4A4A] hover:bg-[#8B1A4A]/10'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <section className="py-16 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((blog, i) => (
              <motion.article key={blog.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => setSelectedBlog(blog)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-[#8B1A4A]/30 hover:shadow-[0_16px_48px_rgba(139,26,74,0.1)] transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-52 overflow-hidden bg-[#F1F5F9]">
                  <img src={blog.image} alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' }}
                  />
                  <span className="absolute top-4 left-4 bg-[#8B1A4A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{blog.tag}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8] mb-3">
                    <span className="text-[#8B1A4A] font-semibold">{blog.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />{blog.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{blog.readTime}</span>
                  </div>
                  <h2 className="font-bold text-[#1A202C] text-lg leading-snug mb-3 group-hover:text-[#8B1A4A] transition-colors">{blog.title}</h2>
                  <p className="text-[#64748B] text-sm leading-relaxed line-clamp-3 mb-5">{blog.excerpt}</p>
                  <div className="flex items-center gap-2 text-[#8B1A4A] text-xs font-bold uppercase tracking-wider">
                    Read More <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-8 bg-[#0D1B2A]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-white text-3xl font-bold mb-2">Have a health concern?</p>
              <p className="text-white/40 text-sm">Our specialists are available across all 9 Srikara centres.</p>
            </div>
            <button onClick={() => navigate('/book')} className="bg-[#8B1A4A] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#8B1A4A] transition-all">
              Book a Consultation
            </button>
          </div>
        </section>

        <Footer />
        <MobileBottomNav />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}
