import { motion } from 'framer-motion'
import { Quote, Stethoscope, Building2, HeartPulse, GraduationCap, Users, ShieldCheck } from 'lucide-react'
import { PageShell, SectionHeading } from '@/components/shared/PageShell'

const LEADERS = [
  {
    name: 'Dr. Akhil Dadi',
    role: 'Founder & Chairman',
    dept: 'Joint Replacement & Robotic Surgery',
    icon: Building2,
    bio: 'Visionary orthopedic surgeon and the driving force behind Srikara Hospitals. A pioneer of robotic joint replacement in South India with over 30,000 successful procedures.',
    accent: { bg: 'bg-[#FFF0F5]', text: 'text-[#8B1A4A]', border: 'border-[#FFE4E1]' },
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Medical Director',
    dept: 'Internal Medicine',
    icon: Stethoscope,
    bio: 'Leads clinical governance across all nine Srikara centers, ensuring every patient receives evidence-based, protocol-driven care.',
    accent: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
  },
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Director — Surgical Services',
    dept: 'Orthopedics & Trauma',
    icon: HeartPulse,
    bio: 'Oversees surgical excellence programmes, operating theatre standards and the robotic surgery training curriculum.',
    accent: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  },
  {
    name: 'Dr. Ananya Reddy',
    role: 'Director — Academics',
    dept: 'Medical Education',
    icon: GraduationCap,
    bio: 'Heads the Arthroplasty Fellowship and continuing medical education, mentoring the next generation of orthopedic surgeons.',
    accent: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  },
  {
    name: 'Mr. Vikram Rao',
    role: 'Chief Executive Officer',
    dept: 'Hospital Administration',
    icon: Users,
    bio: 'Drives operational strategy and expansion across Telangana & Andhra Pradesh while keeping patient experience at the centre.',
    accent: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  },
  {
    name: 'Ms. Kavitha Nair',
    role: 'Chief Nursing Officer',
    dept: 'Nursing Excellence',
    icon: ShieldCheck,
    bio: 'Champions nursing standards, infection control and compassionate bedside care across the entire Srikara network.',
    accent: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },
  },
]

export function LeadershipTeamPage() {
  return (
    <PageShell
      seoTitle="Leadership Team | Srikara Hospitals"
      seoDescription="Meet the leadership team of Srikara Hospitals — the visionaries guiding our mission of clinical precision and human connection."
      badge="About Srikara"
      title="Our Leadership Team"
      subtitle="Guided by clinicians and administrators who believe healthcare is equal parts precision and compassion."
    >
      {/* Chairman spotlight */}
      <section className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="dark-glass-card rounded-[32px] p-8 md:p-14 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,26,74,0.22),transparent)] pointer-events-none" />
          <Quote className="w-10 h-10 text-white/15 mb-6" />
          <p className="font-garamond text-2xl md:text-4xl text-white font-semibold leading-snug max-w-3xl mb-8">
            "We built Srikara on a simple promise — world-class surgical outcomes should never come at the cost of human warmth."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white font-garamond font-bold text-xl">
              AD
            </div>
            <div>
              <p className="text-white font-headline font-bold">Dr. Akhil Dadi</p>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mt-0.5">Founder & Chairman, Srikara Hospitals</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Leadership grid */}
      <section className="mb-20">
        <SectionHeading
          title="The People Behind Srikara"
          subtitle="A leadership collective of surgeons, physicians and administrators shaping the future of accessible super-specialty care."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LEADERS.map((leader, idx) => (
            <motion.div
              key={leader.name}
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
              className="glass-card-colorful rounded-[28px] p-8 group relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-garamond font-bold text-lg shadow-sm ${leader.accent.bg} ${leader.accent.text} ${leader.accent.border}`}>
                  {leader.name.replace(/^(Dr\.|Mr\.|Ms\.)\s*/, '').split(' ').map(w => w[0]).join('')}
                </div>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ml-auto ${leader.accent.bg} ${leader.accent.text} ${leader.accent.border}`}>
                  <leader.icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-headline font-bold text-lg text-[#1A202C] group-hover:text-[#8B1A4A] transition-colors">
                {leader.name}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8B1A4A] mt-1">{leader.role}</p>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 mb-4">{leader.dept}</p>
              <p className="text-sm text-[#4A4A4A] leading-relaxed font-light">{leader.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
