import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Globe, Plane, FileCheck2, Languages, Hotel, Stethoscope,
  PhoneCall, Mail, MessageCircle, ChevronRight, HeartHandshake, BadgeDollarSign
} from 'lucide-react'
import { PageShell, SectionHeading } from '@/components/shared/PageShell'

const SERVICES = [
  {
    title: 'Visa & Travel Assistance',
    desc: 'Medical visa invitation letters, FRRO registration support and airport pick-up & drop for patients and attendants.',
    icon: Plane,
    accent: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', blob: 'bg-indigo-500/10' },
  },
  {
    title: 'Treatment Cost Estimates',
    desc: 'Transparent, all-inclusive package estimates shared before you travel — no hidden costs, ever.',
    icon: BadgeDollarSign,
    accent: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', blob: 'bg-emerald-500/10' },
  },
  {
    title: 'Remote Opinion Before You Fly',
    desc: 'Share your reports online and receive a detailed treatment plan and video consultation with our senior specialists.',
    icon: Stethoscope,
    accent: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', blob: 'bg-rose-500/10' },
  },
  {
    title: 'Language Interpreters',
    desc: 'Dedicated interpreters for Arabic, French, Swahili, Bengali and more, available throughout your stay.',
    icon: Languages,
    accent: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', blob: 'bg-amber-500/10' },
  },
  {
    title: 'Accommodation & Cuisine',
    desc: 'Guest-house and hotel tie-ups near the hospital with meal options that respect your dietary preferences.',
    icon: Hotel,
    accent: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', blob: 'bg-teal-500/10' },
  },
  {
    title: 'Dedicated Care Manager',
    desc: 'A single point of contact who coordinates appointments, admissions, billing and follow-up tele-consults after you return home.',
    icon: HeartHandshake,
    accent: { bg: 'bg-[#FFF0F5]', text: 'text-[#8B1A4A]', border: 'border-[#FFE4E1]', blob: 'bg-[#8B1A4A]/10' },
  },
]

const STEPS = [
  { step: '01', title: 'Share Your Reports', desc: 'Email or WhatsApp your medical reports to our international desk.' },
  { step: '02', title: 'Get a Treatment Plan', desc: 'Receive a specialist opinion, cost estimate and visa invitation letter.' },
  { step: '03', title: 'Fly to Hyderabad', desc: 'We receive you at the airport and manage your admission end-to-end.' },
  { step: '04', title: 'Treat & Recover', desc: 'World-class surgery, rehabilitation and follow-up tele-consults back home.' },
]

export function InternationalPatientsPage() {
  return (
    <PageShell
      seoTitle="International Patients | Srikara Hospitals"
      seoDescription="World-class orthopedic and multi-specialty care for international patients — visa assistance, interpreters, transparent packages and a dedicated care manager."
      badge="Global Care"
      title="International Patients"
      subtitle="Patients from over 20 countries choose Srikara for robotic joint replacement and advanced surgical care — at a fraction of western costs, with zero compromise on outcomes."
    >
      {/* Quick contact strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="flex flex-wrap justify-center gap-3 mb-20"
      >
        <a href="tel:+914068324800"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#8B1A4A] text-white font-bold uppercase tracking-wider text-[11px] hover:bg-[#2D3A4A] transition-all shadow-md shadow-[#8B1A4A]/20">
          <PhoneCall className="w-4 h-4" /> +91 40 6832 4800
        </a>
        <a href="mailto:international@srikarahospitals.com"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/80 border border-[#8B1A4A]/20 text-[#8B1A4A] font-bold uppercase tracking-wider text-[11px] hover:bg-[#8B1A4A] hover:text-white transition-all shadow-sm">
          <Mail className="w-4 h-4" /> Email the Intl. Desk
        </a>
        <a href="https://wa.me/914068324800" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold uppercase tracking-wider text-[11px] hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
          <MessageCircle className="w-4 h-4" /> WhatsApp Reports
        </a>
      </motion.div>

      {/* Services grid */}
      <section className="mb-24">
        <SectionHeading
          title="Everything Handled, From Touchdown to Take-off"
          subtitle="Our international patient services desk manages every non-clinical detail so you can focus on getting better."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.title}
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
              <div className={`absolute top-0 right-0 w-24 h-24 blur-xl rounded-full translate-x-6 -translate-y-6 ${service.accent.blob} transition-transform duration-700 group-hover:scale-150`} />
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 shadow-sm transition-all duration-500 group-hover:scale-110 ${service.accent.bg} ${service.accent.text} ${service.accent.border}`}>
                <service.icon className="w-5 h-5" />
              </div>
              <h3 className="font-headline font-bold text-lg text-[#1A202C] mb-3 group-hover:text-[#8B1A4A] transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-[#4A4A4A] leading-relaxed font-light">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4-step journey */}
      <section className="mb-24">
        <SectionHeading
          title="Your Journey in Four Simple Steps"
          subtitle="From your first email to your follow-up consult back home — a clear, guided path."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
              style={{
                '--glass-border': 'rgba(139, 26, 74, 0.12)',
                '--glass-border-hover': 'rgba(139, 26, 74, 0.35)',
                '--glass-shadow': 'rgba(139, 26, 74, 0.05)',
                '--glass-shadow-hover': 'rgba(139, 26, 74, 0.14)',
              }}
              className="glass-card-colorful rounded-[24px] p-7 relative"
            >
              <span className="font-garamond text-5xl font-bold text-[#8B1A4A]/15 absolute top-4 right-6">{s.step}</span>
              <div className="w-9 h-9 rounded-full bg-[#8B1A4A] text-white text-xs font-black flex items-center justify-center mb-5 shadow-md shadow-[#8B1A4A]/25">
                {idx + 1}
              </div>
              <h3 className="font-headline font-bold text-base text-[#1A202C] mb-2">{s.title}</h3>
              <p className="text-sm text-[#4A4A4A] leading-relaxed font-light">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12">
        <div className="dark-glass-card rounded-[32px] p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,26,74,0.18),transparent)] pointer-events-none" />
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="font-garamond text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Begin Your Treatment Journey Today
          </h2>
          <p className="text-white/80 font-light text-base md:text-lg max-w-2xl mx-auto mb-10">
            Send us your reports and receive a specialist opinion with a transparent cost estimate within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:international@srikarahospitals.com?subject=International%20Patient%20Inquiry"
              className="w-full sm:w-auto px-8 h-14 rounded-full bg-white text-[#8B1A4A] font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#FFF9FA] transition-all shadow-lg"
            >
              <FileCheck2 className="w-4 h-4" /> Send My Reports
            </a>
            <Link
              to="/book"
              className="w-full sm:w-auto px-8 h-14 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              Book a Video Consult <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
