import { motion } from 'framer-motion'
import { Trophy, Medal, Star, ShieldCheck, Newspaper, Award } from 'lucide-react'
import { PageShell, SectionHeading } from '@/components/shared/PageShell'

const AWARDS = [
  {
    year: '2025',
    title: 'Best Orthopedic Hospital — Telangana',
    org: 'Times Health Excellence Awards',
    desc: 'Recognized for outstanding outcomes in robotic joint replacement and orthopedic care across the state.',
    icon: Trophy,
    accent: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', blob: 'bg-amber-500/10' },
  },
  {
    year: '2024',
    title: 'Excellence in Robotic Joint Replacement',
    org: 'Indian Arthroplasty Association',
    desc: 'Honoured for pioneering robotic knee and hip replacement techniques with a 99% surgical success rate.',
    icon: Medal,
    accent: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', blob: 'bg-rose-500/10' },
  },
  {
    year: '2024',
    title: 'NABH Accreditation',
    org: 'National Accreditation Board for Hospitals',
    desc: 'Full accreditation for patient safety, infection control and quality of care across our flagship centers.',
    icon: ShieldCheck,
    accent: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', blob: 'bg-emerald-500/10' },
  },
  {
    year: '2023',
    title: 'Patient Choice Award',
    org: 'Healthcare Consumer Forum',
    desc: 'Voted the most trusted multi-specialty hospital chain by patients across Hyderabad.',
    icon: Star,
    accent: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', blob: 'bg-indigo-500/10' },
  },
  {
    year: '2023',
    title: 'Best Emerging Hospital Chain — South India',
    org: 'Economic Times Healthcare Summit',
    desc: 'Acknowledged for rapid, quality-first expansion across Telangana and Andhra Pradesh.',
    icon: Newspaper,
    accent: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', blob: 'bg-teal-500/10' },
  },
  {
    year: '2022',
    title: 'Surgical Excellence Award',
    org: 'Telangana State Medical Council',
    desc: 'Awarded to Dr. Akhil Dadi and team for their contribution to advanced arthroplasty training in India.',
    icon: Award,
    accent: { bg: 'bg-[#FFF0F5]', text: 'text-[#8B1A4A]', border: 'border-[#FFE4E1]', blob: 'bg-[#8B1A4A]/10' },
  },
]

export function AwardsPage() {
  return (
    <PageShell
      seoTitle="Awards & Recognition | Srikara Hospitals"
      seoDescription="Awards, accreditations and honours earned by Srikara Hospitals for excellence in orthopedic and multi-specialty care."
      badge="About Srikara"
      title="Awards & Recognition"
      subtitle="Every award we receive belongs to our patients — their trust drives our pursuit of clinical excellence."
    >
      <section className="mb-20">
        <SectionHeading
          title="Honours That Humble Us"
          subtitle="A timeline of recognitions from healthcare bodies, media houses and — most importantly — our patients."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AWARDS.map((award, idx) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              style={{
                '--glass-border': 'rgba(139, 26, 74, 0.12)',
                '--glass-border-hover': 'rgba(139, 26, 74, 0.4)',
                '--glass-shadow': 'rgba(139, 26, 74, 0.05)',
                '--glass-shadow-hover': 'rgba(139, 26, 74, 0.15)',
              }}
              className="glass-card-colorful rounded-[28px] p-8 flex flex-col group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 blur-xl rounded-full translate-x-6 -translate-y-6 ${award.accent.blob} transition-transform duration-700 group-hover:scale-150`} />
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm transition-all duration-500 group-hover:scale-110 ${award.accent.bg} ${award.accent.text} ${award.accent.border}`}>
                  <award.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  {award.year}
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg text-[#1A202C] mb-1.5 group-hover:text-[#8B1A4A] transition-colors">
                {award.title}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8B1A4A]/70 mb-4">{award.org}</p>
              <p className="text-sm text-[#4A4A4A] leading-relaxed font-light">{award.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Accreditation strip */}
      <section className="mb-12">
        <div className="dark-glass-card rounded-[32px] p-8 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,26,74,0.18),transparent)] pointer-events-none" />
          <h2 className="font-garamond text-3xl md:text-4xl font-bold text-white mb-4">Accredited. Audited. Trusted.</h2>
          <p className="text-white/70 font-light text-sm md:text-base max-w-2xl mx-auto mb-8">
            Our centers follow NABH-aligned quality protocols with regular clinical audits, so every recognition on this page is backed by measurable patient outcomes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['NABH Standards', 'ISO-Aligned Processes', 'Clinical Audit Programme', 'Infection Control Certified'].map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-[10px] font-black uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
