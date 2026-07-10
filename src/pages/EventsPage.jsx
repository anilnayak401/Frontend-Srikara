import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, Clock, Users, ArrowRight } from 'lucide-react'
import { PageShell, SectionHeading } from '@/components/shared/PageShell'

const EVENTS = [
  {
    date: { day: '26', month: 'Jul', year: '2026' },
    title: 'Free Joint Pain Screening Camp',
    location: 'Srikara Hospitals, LB Nagar',
    time: '9:00 AM – 4:00 PM',
    tag: 'Health Camp',
    upcoming: true,
    desc: 'Free consultation with senior orthopedic surgeons, bone density screening and personalised joint-care advice for patients above 40.',
  },
  {
    date: { day: '09', month: 'Aug', year: '2026' },
    title: 'Robotic Knee Replacement — Live Workshop',
    location: 'Srikara Hospitals, Miyapur',
    time: '10:00 AM – 1:00 PM',
    tag: 'CME / Workshop',
    upcoming: true,
    desc: 'A hands-on academic workshop for practicing orthopedic surgeons featuring live robotic arthroplasty demonstrations.',
  },
  {
    date: { day: '23', month: 'Aug', year: '2026' },
    title: 'World Senior Citizens Day — Wellness Drive',
    location: 'All Srikara Centers',
    time: '9:00 AM – 6:00 PM',
    tag: 'Community',
    upcoming: true,
    desc: 'Discounted health check-ups, physiotherapy sessions and fall-prevention counselling for senior citizens across all nine centers.',
  },
  {
    date: { day: '14', month: 'Jun', year: '2026' },
    title: 'Sports Injury Awareness Marathon',
    location: 'Hussain Sagar, Hyderabad',
    time: '5:30 AM onwards',
    tag: 'Community',
    upcoming: false,
    desc: 'A 5K community run promoting sports-injury awareness, flagged off by the Srikara sports medicine team.',
  },
  {
    date: { day: '17', month: 'May', year: '2026' },
    title: 'Arthroplasty Fellowship Convocation',
    location: 'Srikara Hospitals, LB Nagar',
    time: '11:00 AM',
    tag: 'Academics',
    upcoming: false,
    desc: 'Felicitation of graduating fellows of the 2025–26 arthroplasty cohort by Dr. Akhil Dadi and the academic faculty.',
  },
  {
    date: { day: '07', month: 'Apr', year: '2026' },
    title: 'World Health Day — Free OPD',
    location: 'All Srikara Centers',
    time: '9:00 AM – 5:00 PM',
    tag: 'Health Camp',
    upcoming: false,
    desc: 'Complimentary outpatient consultations across all specialties to mark World Health Day.',
  },
]

const FILTERS = ['All', 'Upcoming', 'Past']

export function EventsPage() {
  const [filter, setFilter] = useState('All')
  const events = EVENTS.filter(e =>
    filter === 'All' ? true : filter === 'Upcoming' ? e.upcoming : !e.upcoming
  )

  return (
    <PageShell
      seoTitle="Events | Srikara Hospitals"
      seoDescription="Health camps, CME workshops and community events hosted by Srikara Hospitals across Telangana and Andhra Pradesh."
      badge="News & Events"
      title="Events at Srikara"
      subtitle="Health camps, academic workshops and community initiatives — where Srikara meets the people it serves."
    >
      {/* Filter chips */}
      <div className="flex justify-center gap-3 mb-12">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 border shadow-sm ${
              filter === f
                ? 'bg-[#8B1A4A] text-white border-[#8B1A4A] shadow-[#8B1A4A]/25 shadow-md'
                : 'bg-white/70 text-[#4A4A4A] border-slate-200 hover:border-[#8B1A4A]/40 hover:text-[#8B1A4A]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event cards */}
      <section className="mb-20 max-w-5xl mx-auto space-y-6">
        {events.map((event, idx) => (
          <motion.article
            key={event.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: idx * 0.06 }}
            style={{
              '--glass-border': 'rgba(139, 26, 74, 0.12)',
              '--glass-border-hover': 'rgba(139, 26, 74, 0.4)',
              '--glass-shadow': 'rgba(139, 26, 74, 0.05)',
              '--glass-shadow-hover': 'rgba(139, 26, 74, 0.15)',
            }}
            className="glass-card-colorful rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row gap-6 group"
          >
            {/* Date block */}
            <div className={`flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center border shadow-sm ${
              event.upcoming
                ? 'bg-[#8B1A4A] text-white border-[#8B1A4A]'
                : 'bg-white/70 text-[#8B1A4A] border-[#8B1A4A]/15'
            }`}>
              <span className="font-garamond text-3xl font-bold leading-none">{event.date.day}</span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">{event.date.month} {event.date.year}</span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  {event.tag}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                  event.upcoming
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {event.upcoming ? 'Upcoming' : 'Completed'}
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg md:text-xl text-[#1A202C] group-hover:text-[#8B1A4A] transition-colors mb-2">
                {event.title}
              </h3>
              <p className="text-sm text-[#4A4A4A] leading-relaxed font-light mb-4">{event.desc}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#8B1A4A]" /> {event.location}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#8B1A4A]" /> {event.time}</span>
              </div>
            </div>

            {/* CTA */}
            {event.upcoming && (
              <div className="flex md:flex-col justify-end md:justify-center">
                <a
                  href="mailto:info@srikarahospitals.com?subject=Event%20Registration"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B1A4A]/5 border border-[#8B1A4A]/20 text-[#8B1A4A] hover:bg-[#8B1A4A] hover:text-white transition-all text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
                >
                  Register <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </motion.article>
        ))}
      </section>

      {/* Host-an-event CTA */}
      <section className="mb-12">
        <div className="dark-glass-card rounded-[32px] p-8 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,26,74,0.18),transparent)] pointer-events-none" />
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="font-garamond text-3xl md:text-4xl font-bold text-white mb-4">Partner With Us for a Health Camp</h2>
          <p className="text-white/70 font-light text-sm md:text-base max-w-2xl mx-auto mb-8">
            Schools, companies and residential communities can invite Srikara for on-site screening camps and health-awareness sessions — at no cost.
          </p>
          <a
            href="mailto:info@srikarahospitals.com?subject=Health%20Camp%20Request"
            className="inline-flex items-center gap-2 px-8 h-13 py-4 rounded-full bg-white text-[#8B1A4A] font-bold uppercase tracking-wider text-xs hover:bg-[#FFF9FA] transition-all shadow-lg"
          >
            <CalendarDays className="w-4 h-4" /> Request a Camp
          </a>
        </div>
      </section>
    </PageShell>
  )
}
