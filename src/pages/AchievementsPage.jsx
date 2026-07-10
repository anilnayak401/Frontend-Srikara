import { motion } from 'framer-motion'
import { PageShell, SectionHeading } from '@/components/shared/PageShell'

const STATS = [
  { value: '30,000+', label: 'Joint Replacements', sub: 'Successful procedures performed', icon: '🦴' },
  { value: '99%', label: 'Success Rate', sub: 'Across all surgical departments', icon: '✅' },
  { value: '12+', label: 'Years of Excellence', sub: 'Serving Hyderabad since 2013', icon: '🏆' },
  { value: '9', label: 'Clinical Centers', sub: 'Across AP & Telangana', icon: '📍' },
  { value: '500+', label: 'Expert Doctors', sub: 'Board-certified specialists', icon: '👨‍⚕️' },
  { value: '100K+', label: 'Families Served', sub: 'Trusted by the community', icon: '❤️' },
]

const MILESTONES = [
  { year: '2013', title: 'Srikara is Born', desc: 'Our first center opens in Hyderabad with a focused orthopedic and joint replacement practice.' },
  { year: '2016', title: '5,000th Joint Replacement', desc: 'Crossing our first major surgical milestone with outcomes matching international benchmarks.' },
  { year: '2019', title: 'Robotic Surgery Programme', desc: 'Srikara becomes one of South India\'s early adopters of robotic-assisted knee and hip replacement.' },
  { year: '2021', title: 'Multi-City Expansion', desc: 'New centers open across Telangana and Andhra Pradesh, bringing super-specialty care closer to home.' },
  { year: '2023', title: 'Arthroplasty Fellowship Launched', desc: 'Our academic wing begins training surgeons from across India and abroad in advanced arthroplasty.' },
  { year: '2025', title: '30,000 Surgeries & Counting', desc: 'A landmark of trust — thirty thousand successful joint replacements with a 99% success rate.' },
]

export function AchievementsPage() {
  return (
    <PageShell
      seoTitle="Achievements | Srikara Hospitals"
      seoDescription="Milestones and achievements of Srikara Hospitals — 30,000+ joint replacements, 99% success rate and a decade of clinical excellence."
      badge="About Srikara"
      title="Our Achievements"
      subtitle="Numbers tell part of the story. Behind each one is a patient who walked in with pain and walked out with their life back."
    >
      {/* Stats grid */}
      <section className="mb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.07 }}
              style={{
                '--glass-border': 'rgba(139, 26, 74, 0.12)',
                '--glass-border-hover': 'rgba(139, 26, 74, 0.4)',
                '--glass-shadow': 'rgba(139, 26, 74, 0.05)',
                '--glass-shadow-hover': 'rgba(139, 26, 74, 0.15)',
              }}
              className="glass-card-colorful rounded-[28px] p-6 md:p-8 text-center group"
            >
              <span className="text-3xl md:text-4xl block mb-3">{stat.icon}</span>
              <p className="font-garamond text-3xl md:text-5xl font-bold text-[#8B1A4A]">{stat.value}</p>
              <p className="font-headline font-bold text-sm md:text-base text-[#1A202C] mt-2">{stat.label}</p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Milestone timeline */}
      <section className="mb-16 max-w-4xl mx-auto">
        <SectionHeading
          title="Milestones on Our Journey"
          subtitle="From a single center in 2013 to a nine-center network — the moments that shaped Srikara."
        />
        <div className="relative pl-8 md:pl-0">
          {/* Vertical rail */}
          <div className="absolute left-[7px] md:left-1/2 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#8B1A4A]/40 via-[#8B1A4A]/15 to-transparent md:-translate-x-1/2" />

          <div className="space-y-10">
            {MILESTONES.map((m, idx) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className={`relative md:w-[calc(50%-32px)] ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}
              >
                {/* Node */}
                <span className={`absolute top-6 w-4 h-4 rounded-full bg-[#8B1A4A] border-4 border-[#FFF9FA] shadow -left-[38px] md:left-auto ${
                  idx % 2 === 0 ? 'md:-right-[42px]' : 'md:-left-[42px]'
                }`} />
                <div
                  style={{
                    '--glass-border': 'rgba(139, 26, 74, 0.12)',
                    '--glass-border-hover': 'rgba(139, 26, 74, 0.35)',
                    '--glass-shadow': 'rgba(139, 26, 74, 0.05)',
                    '--glass-shadow-hover': 'rgba(139, 26, 74, 0.14)',
                  }}
                  className="glass-card-colorful rounded-[24px] p-6"
                >
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest text-white bg-[#8B1A4A] px-3 py-1 rounded-full mb-3">
                    {m.year}
                  </span>
                  <h3 className="font-headline font-bold text-base text-[#1A202C] mb-1.5">{m.title}</h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed font-light">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
