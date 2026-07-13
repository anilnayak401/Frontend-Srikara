import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Quote, ArrowRight, Award, Star, Stethoscope, Sparkles, BadgeCheck } from 'lucide-react'
import { ALL_DOCTORS } from '@/data/doctors'
import { useDoctors } from '@/hooks/useDoctors'
import { assetUrl } from '@/lib/assetUrl'

/**
 * FounderChairmanCard
 * Premium liquid-glass (glassmorphism) leadership spotlight for the homepage,
 * featuring Dr. Akhil Dadi. White background, frosted translucent panels.
 * Title is fixed to "Founder & Chairman" and intentionally omits any branch location.
 */
export function FounderChairmanCard() {
  const navigate = useNavigate()
  const { doctors } = useDoctors()

  const founder = useMemo(() => {
    return doctors.find((d) => d.slug === 'dr-akhil-dadi') ||
           doctors.find((d) => d.name?.includes('Akhil Dadi'))
  }, [doctors])

  const name = founder?.name || 'Dr. Akhil Dadi'
  const slug = founder?.slug || 'dr-akhil-dadi'
  const image = founder?.image || assetUrl('doctors/akhil-dadi.png')
  const fallback = founder?.fallback || assetUrl('doctors/akhil-dadi.png')

  const MAROON = '#8B1A4A'
  const GOLD = '#C9A227'

  const stats = [
    { value: '30,000+', label: 'Surgeries', accent: MAROON },
    { value: '29+', label: 'Years Exp.', accent: '#2D3A4A' },
    { value: '99%', label: 'Success Rate', accent: GOLD },
  ]

  const credentials = [
    'MBBS, MS — Orthopedics',
    'Fellowship in Joint Replacement (Germany)',
    "South India's First NAVIO Robotic Surgeon",
  ]

  return (
    <section className="relative py-20 lg:py-28 px-6 sm:px-8 bg-white overflow-hidden">
      {/* ── Ambient colour field (gives the glass something to refract) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[8%] w-[460px] h-[460px] rounded-full blur-[120px] opacity-50 bg-[#8B1A4A]/25" />
        <div className="absolute top-1/3 -right-20 w-[520px] h-[520px] rounded-full blur-[130px] opacity-40" style={{ background: 'rgba(201,162,39,0.28)' }} />
        <div className="absolute -bottom-32 left-1/3 w-[480px] h-[480px] rounded-full blur-[130px] opacity-30 bg-[#2D3A4A]/20" />
        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #2D3A4A 1px, transparent 1px), linear-gradient(to bottom, #2D3A4A 1px, transparent 1px)',
            backgroundSize: '54px 54px',
          }}
        />
      </div>

      {/* ── Section heading ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto mb-12 lg:mb-16">
        <div className="flex items-center gap-4 mb-5">
          <span className="h-[2px] w-12" style={{ background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
          <span className="text-[11px] font-black uppercase tracking-[0.45em]" style={{ color: GOLD }}>
            Leadership
          </span>
        </div>
        <h2 className="editorial-title text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] text-[#2D3A4A]">
          The Vision <span className="text-[#8B1A4A]">Behind Srikara</span>
        </h2>
      </div>

      {/* ── Liquid-glass card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 max-w-[1280px] mx-auto rounded-[2.5rem] overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow:
            '0 30px 90px -30px rgba(45,58,74,0.30), inset 0 1px 0 rgba(255,255,255,0.85)',
        }}
      >
        {/* top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        <div className="relative flex flex-col lg:flex-row items-stretch gap-2">
          {/* ── Portrait panel ── */}
          <div className="relative w-full lg:w-[42%] p-6 sm:p-8 lg:p-8 flex items-stretch justify-center">
            <div
              className="relative w-full max-w-[400px] lg:max-w-none aspect-[4/5] lg:aspect-auto lg:h-full rounded-[2rem] overflow-hidden flex items-end justify-center self-stretch"
              style={{
                background:
                  'linear-gradient(155deg, rgba(139,26,74,0.10), rgba(201,162,39,0.08) 60%, rgba(255,255,255,0.25))',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 20px 50px -25px rgba(139,26,74,0.4)',
              }}
            >
              {/* glass orbs inside frame */}
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full blur-2xl bg-[#8B1A4A]/20" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2/3 rounded-b-[2rem] bg-gradient-to-t from-black/10 to-transparent" />
              <img
                src={image}
                alt={name}
                onError={(e) => {
                  e.currentTarget.src = fallback
                }}
                className="relative z-10 w-auto h-full mx-auto object-contain object-bottom drop-shadow-2xl"
              />

              {/* Floating verified rating chip */}
              <div
                className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                }}
              >
                <Star size={13} fill={GOLD} color={GOLD} />
                <span className="text-[#2D3A4A] text-xs font-extrabold tracking-wide">5.0</span>
              </div>

              {/* Floating experience chip */}
              <div
                className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-2xl px-4 py-2.5"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 10px 30px -12px rgba(45,58,74,0.4)',
                }}
              >
                <Stethoscope size={16} style={{ color: MAROON }} />
                <div className="leading-none">
                  <span className="block text-sm font-black text-[#2D3A4A]">29+ Years</span>
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-[#2D3A4A]/50">
                    Surgical Mastery
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Content panel ── */}
          <div className="flex-1 px-7 sm:px-9 lg:px-12 py-10 lg:py-14">
            {/* Slanted Parallelogram Burgundy Badge (Refined Size & Shifted Left) */}
            <div
              className="relative inline-flex items-center -skew-x-[15deg] mb-6 transition-all hover:scale-105 duration-300"
              style={{
                background: 'linear-gradient(135deg, #5c0f30 0%, #8B1A4A 50%, #a22453 100%)',
                border: '2px solid #C9A227', // premium gold border
                boxShadow: '0 8px 24px -6px rgba(139,26,74,0.4), inset 0 1px 1px rgba(255,255,255,0.25)',
                padding: '10px 28px', // slightly reduced padding
                marginLeft: '-16px', // shifted to the left to align with the name below
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* CSS style block for keyframe animation */}
              <style>{`
                @keyframes shiny-glare {
                  0% { left: -260%; }
                  100% { left: 260%; }
                }
              `}</style>
              
              {/* Shiny glare lines moving left to right slowly in a loop */}
              <div
                className="absolute top-0 bottom-0 w-[240px] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0) 100%)',
                  animation: 'shiny-glare 7s infinite linear',
                  opacity: 1.0,
                }}
              />

              {/* Un-skew content inside so text and medal remain upright */}
              <div className="relative z-10 skew-x-[15deg] flex items-center gap-3">
                {/* 3D Medal SVG */}
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-[0_2px_6px_rgba(201,162,39,0.7)]">
                  <defs>
                    <linearGradient id="ribbonLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E13B30" />
                      <stop offset="100%" stopColor="#8C1610" />
                    </linearGradient>
                    <linearGradient id="ribbonRight" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4A90E2" />
                      <stop offset="100%" stopColor="#1B365D" />
                    </linearGradient>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF6D1" />
                      <stop offset="30%" stopColor="#F5C400" />
                      <stop offset="70%" stopColor="#B58900" />
                      <stop offset="100%" stopColor="#735600" />
                    </linearGradient>
                    <linearGradient id="innerGold" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#FFFAD9" />
                      <stop offset="50%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#C9A227" />
                    </linearGradient>
                  </defs>
                  <path d="M10 2 L16 16 L19 2 Z" fill="url(#ribbonLeft)" />
                  <path d="M22 2 L16 16 L13 2 Z" fill="url(#ribbonRight)" />
                  <circle cx="16" cy="18" r="9" fill="url(#goldGrad)" />
                  <circle cx="16" cy="18" r="6.8" fill="url(#innerGold)" />
                  <path d="M16 14.5 L17.2 16.9 L19.8 17.3 L17.9 19.1 L18.4 21.7 L16 20.5 L13.6 21.7 L14.1 19.1 L12.2 17.3 L14.8 16.9 Z" fill="#FFFFFF" opacity="0.95" />
                </svg>
                <span className="text-[15px] sm:text-[17px] font-black uppercase tracking-[0.20em] text-white">
                  Founder &amp; Chairman
                </span>
              </div>
            </div>

            <h3 className="editorial-title text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight leading-[1.05] mb-4 text-[#2D3A4A]">
              {name}
            </h3>

            <p className="text-[#8B1A4A] text-xs font-bold uppercase tracking-[0.16em] mb-7">
              Chief Joint Replacement Surgeon
            </p>

            {/* Signature bio */}
            <div className="relative pl-7 mb-8 max-w-2xl">
              <Quote size={26} className="absolute -left-1 -top-1" style={{ color: GOLD, opacity: 0.55 }} />
              <p className="text-[#3A4654] text-base md:text-[17px] font-light leading-relaxed italic">
                Under his visionary leadership, Srikara Hospitals introduced South India&apos;s first NAVIO
                robotic orthopaedic system — pioneering precision joint replacement and setting national
                benchmarks for surgical excellence and faster recovery.
              </p>
            </div>

            {/* Credentials list */}
            <ul className="mb-9 space-y-2.5 max-w-xl">
              {credentials.map((c) => (
                <li key={c} className="flex items-start gap-2.5">
                  <BadgeCheck size={17} className="mt-0.5 shrink-0" style={{ color: MAROON }} />
                  <span className="text-[#3A4654] text-sm font-medium leading-snug">{c}</span>
                </li>
              ))}
            </ul>

            {/* Stats — frosted tiles */}
            <div className="grid grid-cols-3 gap-3.5 max-w-lg mb-10">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl px-3 py-4 text-center"
                  style={{
                    background: 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 24px -16px rgba(45,58,74,0.5)',
                  }}
                >
                  <span className="block text-2xl sm:text-[28px] font-black leading-none mb-1.5" style={{ color: s.accent }}>
                    {s.value}
                  </span>
                  <span className="block text-[9px] font-bold uppercase tracking-[0.13em] text-[#2D3A4A]/55">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(`/doctors/${slug}`)}
                className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-bold uppercase tracking-widest text-xs text-white transition-all duration-300 hover:brightness-110"
                style={{ background: MAROON, boxShadow: '0 14px 34px -12px rgba(139,26,74,0.55)' }}
              >
                Chairman&apos;s Profile
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate(`/book/${slug}`)}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-bold uppercase tracking-widest text-xs text-[#2D3A4A] transition-all duration-300 hover:bg-white"
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(45,58,74,0.18)',
                }}
              >
                <Sparkles size={15} style={{ color: GOLD }} />
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
