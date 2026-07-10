import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Newspaper, ArrowRight, Microscope, HeartPulse, Bone, Brain, Baby, Syringe } from 'lucide-react'
import { PageShell, SectionHeading } from '@/components/shared/PageShell'

const UPDATES = [
  {
    date: 'Jul 2, 2026',
    category: 'Orthopedics',
    icon: Bone,
    title: 'Srikara Crosses 30,000 Robotic-Assisted Joint Replacements',
    excerpt: 'A landmark for South India — our robotic arthroplasty programme records a 99% success rate with faster recovery times and shorter hospital stays.',
    accent: { bg: 'bg-[#FFF0F5]', text: 'text-[#8B1A4A]', border: 'border-[#FFE4E1]' },
    featured: true,
  },
  {
    date: 'Jun 24, 2026',
    category: 'Cardiology',
    icon: HeartPulse,
    title: 'New 24×7 Cardiac Emergency Protocol Across All Centers',
    excerpt: 'Door-to-balloon times reduced to under 60 minutes with a unified STEMI protocol now live across all nine Srikara centers.',
    accent: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  },
  {
    date: 'Jun 10, 2026',
    category: 'Research',
    icon: Microscope,
    title: 'Srikara Study on Early Mobilisation Published',
    excerpt: 'Our clinical team publishes outcomes data showing same-day walking after robotic knee replacement significantly improves 90-day recovery scores.',
    accent: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
  },
  {
    date: 'May 28, 2026',
    category: 'Neurosciences',
    icon: Brain,
    title: 'Advanced Neuro-Navigation Suite Commissioned at LB Nagar',
    excerpt: 'Sub-millimetre precision for complex brain and spine procedures with the newly commissioned intra-operative navigation platform.',
    accent: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
  },
  {
    date: 'May 12, 2026',
    category: 'Women & Child',
    icon: Baby,
    title: 'Level-III NICU Now Operational at Miyapur',
    excerpt: 'Round-the-clock neonatology cover, advanced ventilation and kangaroo-care protocols for our tiniest patients.',
    accent: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  },
  {
    date: 'Apr 30, 2026',
    category: 'Preventive Care',
    icon: Syringe,
    title: 'Annual Vaccination & Bone-Health Drive Announced',
    excerpt: 'Subsidised flu vaccination and DEXA bone-density screening packages open for booking across Telangana and Andhra Pradesh.',
    accent: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  },
]

const CATEGORIES = ['All', ...new Set(UPDATES.map(u => u.category))]

export function MedicalUpdatesPage() {
  const [category, setCategory] = useState('All')
  const updates = UPDATES.filter(u => category === 'All' || u.category === category)
  const featured = updates.find(u => u.featured)
  const rest = updates.filter(u => u !== featured)

  return (
    <PageShell
      seoTitle="Medical Updates | Srikara Hospitals"
      seoDescription="The latest medical updates from Srikara Hospitals — new technology, clinical research, protocols and departmental milestones."
      badge="News & Events"
      title="Medical Updates"
      subtitle="New technology, published research and clinical milestones — the latest from inside Srikara's departments."
    >
      {/* Category chips */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border shadow-sm ${
              category === cat
                ? 'bg-[#8B1A4A] text-white border-[#8B1A4A] shadow-[#8B1A4A]/25 shadow-md'
                : 'bg-white/70 text-[#4A4A4A] border-slate-200 hover:border-[#8B1A4A]/40 hover:text-[#8B1A4A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured update */}
      {featured && (
        <motion.article
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="dark-glass-card rounded-[32px] p-8 md:p-12 mb-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,26,74,0.22),transparent)] pointer-events-none" />
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-white text-[#8B1A4A]">Featured</span>
            <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/25 text-white/80">{featured.category}</span>
            <span className="text-white/50 text-[11px] font-bold">{featured.date}</span>
          </div>
          <h2 className="font-garamond text-2xl md:text-4xl font-bold text-white leading-snug max-w-3xl mb-4">
            {featured.title}
          </h2>
          <p className="text-white/70 font-light text-sm md:text-base max-w-2xl mb-8">{featured.excerpt}</p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#8B1A4A] font-bold uppercase tracking-wider text-[11px] hover:bg-[#FFF9FA] transition-all shadow-lg"
          >
            Read Full Story <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.article>
      )}

      {/* Updates grid */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((update, idx) => (
            <motion.article
              key={update.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.07 }}
              style={{
                '--glass-border': 'rgba(139, 26, 74, 0.12)',
                '--glass-border-hover': 'rgba(139, 26, 74, 0.4)',
                '--glass-shadow': 'rgba(139, 26, 74, 0.05)',
                '--glass-shadow-hover': 'rgba(139, 26, 74, 0.15)',
              }}
              className="glass-card-colorful rounded-[28px] p-8 flex flex-col group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm transition-all duration-500 group-hover:scale-110 ${update.accent.bg} ${update.accent.text} ${update.accent.border}`}>
                  <update.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-gray-400 font-bold">{update.date}</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#8B1A4A]/70 mb-2">{update.category}</span>
              <h3 className="font-headline font-bold text-base text-[#1A202C] mb-3 leading-snug group-hover:text-[#8B1A4A] transition-colors">
                {update.title}
              </h3>
              <p className="text-sm text-[#4A4A4A] leading-relaxed font-light mb-6 flex-1">{update.excerpt}</p>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#8B1A4A] hover:gap-3 transition-all"
              >
                Read More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Subscribe strip */}
      <section className="mb-12 max-w-4xl mx-auto">
        <div
          style={{
            '--glass-border': 'rgba(139, 26, 74, 0.18)',
            '--glass-shadow': 'rgba(139, 26, 74, 0.08)',
          }}
          className="glass-card-colorful rounded-[28px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F5] border border-[#FFE4E1] flex items-center justify-center text-[#8B1A4A] flex-shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-[#1A202C]">Never Miss an Update</h3>
              <p className="text-sm text-[#4A4A4A] font-light mt-0.5">Health tips and hospital news, straight from our specialists on the Srikara blog.</p>
            </div>
          </div>
          <Link
            to="/blogs"
            className="flex-shrink-0 px-7 py-3.5 rounded-full bg-[#8B1A4A] text-white font-bold uppercase tracking-wider text-[11px] hover:bg-[#2D3A4A] transition-all shadow-md shadow-[#8B1A4A]/20"
          >
            Visit Our Blog
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
