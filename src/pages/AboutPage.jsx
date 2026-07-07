import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Calendar, Heart, Shield, Award, Users, MapPin, Activity, Star, Building2, Globe, Clock, Quote } from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { PremiumDoctorFinder } from '@/components/sections/PremiumDoctorFinder'
import { ScrollSequence } from '@/components/sections/ScrollSequence'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'

// --- PREMIUM ABOUT PAGE DESIGN TOKENS ---
const ABO_STYLES = `
  .font-garamond { font-family: 'Cormorant Garamond', serif; }
  .glass-surface {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 26, 74,0.08);
  }
  .brand-accent { color: #8B1A4A; }
  .brand-accent-teal { color: #2D3A4A; }
`

const STATS = [
  { label: 'Licensed Beds', value: '900+', icon: Building2 },
  { label: 'Clinical Units', value: '09', icon: MapPin },
  { label: 'Joint Replacements', value: '30K+', icon: Activity },
  { label: 'Years of Excellence', value: '12+', icon: Clock },
]

const CORE_VALUES = [
  { 
    title: 'Expertise', 
    desc: 'Led by visionaries like Dr. Akhil Dadi, our clinical leadership ensures every procedure meets global benchmarks.',
    icon: Award 
  },
  { 
    title: 'Innovation', 
    desc: 'Home to the first i-SUITE operation theatre in the state, utilizing integrated modular technology for surgical precision.',
    icon: Shield 
  },
  { 
    title: 'Compassion', 
    desc: 'Affordable, world-class care designed around human warmth and rapid patient recovery.',
    icon: Heart 
  }
]

export function AboutPage() {
  const [aboutData, setAboutData] = useState({
    chairmanName: 'Dr. Akhil Dadi',
    chairmanSubtitle: 'Chairman & Chief Joint Replacement Surgeon',
    chairmanBio: 'Pioneered robotic joint surgeries in South India and envisioned premium hospital modules to deliver patient care with transparency.',
    milestones: 'Over 30,000+ joint replacements and 9 centers across Telangana and Andhra Pradesh.'
  })

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        if (db) {
          const docRef = doc(db, 'site_contents', 'pages')
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data()
            if (data.about) {
              setAboutData(prev => ({ ...prev, ...data.about }))
              return
            }
          }
        }
      } catch (err) {
        console.warn('Firestore load failed for about:', err)
      }
      try {
        const cached = localStorage.getItem('srikara_cms_data')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed.pageData && parsed.pageData.about) {
            setAboutData(prev => ({ ...prev, ...parsed.pageData.about }))
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached about page:', e)
      }
    }
    loadAboutData()
  }, [])

  return (
    <>
      <Helmet>
        <title>About Srikara Group | Legacy of Clinical Excellence</title>
        <style>{ABO_STYLES}</style>
      </Helmet>

      <div className="min-h-screen bg-[#FFF9FA] text-[#1A202C] selection:bg-[#8B1A4A] selection:text-white">
        <StickyNavbar />

        {/* Interactive Scroll Sequence Hero */}
        <ScrollSequence />

        {/* Global Stats Grid */}
        <section className="pb-32 relative z-10">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-surface rounded-3xl p-10 relative overflow-hidden group hover:border-[#8B1A4A]/40 transition-all duration-500"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <stat.icon size={60} />
                  </div>
                  <h3 className="text-5xl font-black text-[#1A202C] mb-2 tracking-tighter">{stat.value}</h3>
                  <p className="text-[#8B1A4A] text-[11px] font-bold uppercase tracking-[0.3em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Institutional Narrative */}
        <section className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-24 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="relative"
             >
                <div className="absolute inset-0 bg-[#8B1A4A]/10 blur-[100px] rounded-full scale-125" />
                <img 
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
                  alt="Modern Hospital Architecture" 
                  className="relative z-10 rounded-[40px] border border-white/10 shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute -bottom-10 -right-10 glass-surface p-10 rounded-3xl z-20 border-[#8B1A4A]/20 shadow-xl">
                   <p className="font-garamond text-3xl font-bold italic text-[#8B1A4A]">9 Strategic Units</p>
                   <p className="text-[10px] uppercase font-black tracking-widest text-[#1A202C]/40 mt-2">Across AP & Telangana</p>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="space-y-10"
             >
                 <div className="space-y-4">
                   <span className="text-[#8B1A4A] text-[11px] font-black uppercase tracking-[0.4em]">Our Reach</span>
                   <h2 className="text-5xl font-garamond font-bold leading-tight text-[#1A202C]">Strategically Located for Absolute Access</h2>
                 </div>
                 <p className="text-[#4A4A4A] text-lg leading-relaxed font-light">
                   Operating across 9 strategic units including RTC X Roads, Miyapur, LB Nagar, and Vijayawada, our locations are situated at key entry points to major cities. This ensures that world-class orthopedic and multispeciality care is always within reach.
                 </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {CORE_VALUES.map((val) => (
                     <div key={val.title} className="space-y-3">
                        <div className="flex items-center gap-3 text-[#8B1A4A]">
                           <val.icon size={20} />
                           <h4 className="font-bold text-[13px] uppercase tracking-widest">{val.title}</h4>
                        </div>
                        <p className="text-[13px] text-[#4A4A4A] leading-relaxed italic font-light">{val.desc}</p>
                     </div>
                   ))}
                </div>
             </motion.div>
          </div>
        </section>

        {/* Founder's Vision - High Prestige */}
        <section className="py-48 relative overflow-hidden bg-[#8B1A4A]/[0.02]">
          <div className="max-w-4xl mx-auto px-8 relative z-10">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center"
             >
                 <Quote className="text-[#8B1A4A]/40 w-16 h-16 mx-auto mb-10" />
                 <h2 className="font-garamond text-5xl md:text-6xl font-bold leading-[1.2] mb-12">
                    "SRIKARA Multispeciality Hospitals is synonymous with quality, expertise, innovation, and international standards, offering a comprehensive spectrum of medical excellence under one roof."
                 </h2>
                 <div className="flex flex-col items-center">
                    <span className="h-px w-20 bg-[#8B1A4A] mb-6" />
                    <p className="text-2xl font-garamond font-bold text-[#1A202C]">Dr. Akhil Dadi</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.4em] text-[#8B1A4A] mt-2">Founder & Managing Director</p>
                    <p className="text-[10px] text-[#1A202C]/40 uppercase tracking-widest mt-4">World Orthopaedic Concern Member</p>
                 </div>
             </motion.div>
          </div>
        </section>

        {/* Global & Infrastructure Spotlight */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-12 gap-10">
               <motion.div 
                 className="lg:col-span-7 glass-surface rounded-[40px] p-16 relative overflow-hidden group"
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
               >
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B1A4A]/5 blur-[100px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-[#8B1A4A]/10" />
                  <Star className="text-[#8B1A4A] w-12 h-12 mb-10" />
                  <h3 className="text-4xl font-garamond font-bold mb-8 text-[#1A202C]">i-SUITE: The Future of Surgery</h3>
                  <p className="text-[#4A4A4A] text-lg leading-relaxed mb-10 font-light">
                    We take pride in the first i-SUITE Operation Theatre in the state. Featuring four integrated modular operating rooms designed specifically for high-precision joint replacements and complex neurosurgeries, our infrastructure allows for zero-contamination environments and digital surgical navigation.
                  </p>
                  <div className="flex flex-wrap gap-10 border-t border-black/5 pt-10">
                     <div>
                        <p className="text-3xl font-garamond font-bold text-[#8B1A4A]">30,000+</p>
                        <p className="text-[9px] uppercase font-black text-[#1A202C]/40 tracking-[0.2em] mt-1">Joint Replacements</p>
                     </div>
                     <div>
                        <p className="text-3xl font-garamond font-bold text-[#8B1A4A]">1,000+</p>
                        <p className="text-[9px] uppercase font-black text-[#1A202C]/40 tracking-[0.2em] mt-1">Neuro Procedures</p>
                     </div>
                  </div>
               </motion.div>

               <motion.div 
                 className="lg:col-span-5 bg-gradient-to-br from-[#2D3A4A] to-[#2D3A4A] rounded-[40px] p-16 border border-white/5 relative group overflow-hidden"
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
               >
                  <Globe className="text-[#8B1A4A] w-12 h-12 mb-10" />
                  <h3 className="text-4xl font-garamond font-bold mb-8 italic text-white/95">Global Concierge</h3>
                  <p className="text-white/70 text-lg leading-relaxed mb-12 font-light">
                    Our dedicated International Patient Cell manages overseas healthcare journeys, from visa assistance to personalized recovery suites, ensuring global proximity to clinical mastery.
                  </p>
                  <button className="w-full h-16 rounded-full border border border-[#8B1A4A]/30 text-[#8B1A4A] font-bold uppercase tracking-widest text-[11px] hover:bg-[#8B1A4A] hover:text-[#2D3A4A] transition-all duration-500">
                    International Desk
                  </button>
               </motion.div>
            </div>
          </div>
        </section>

        <TimelineSection />
        <PremiumDoctorFinder isGlobal={true} />
        
        <TestimonialsSection category="About Page" />
        
        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
