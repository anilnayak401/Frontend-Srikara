import { Link } from 'react-router-dom'
import { MapPin, Phone } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { useBranches } from '@/hooks/useBranches'

export function BranchesIndex() {
  const { branches } = useBranches()
  const getCardThemeVariables = (idx) => {
    const themeIndex = idx % 3
    if (themeIndex === 0) {
      // Soft Rose
      return {
        '--glass-bg-1': 'rgba(255, 248, 250, 0.45)',
        '--glass-bg-2': 'rgba(255, 240, 244, 0.50)',
        '--glass-border-1': 'rgba(139, 26, 74, 0.08)',
        '--glass-border-2': 'rgba(139, 26, 74, 0.15)',
        '--glass-shadow-1': 'rgba(139, 26, 74, 0.03)',
        '--glass-shadow-2': 'rgba(139, 26, 74, 0.06)',
        '--glass-hover-bg': 'rgba(255, 240, 244, 0.75)',
        '--card-accent-color': '#8B1A4A',
        '--card-accent-bg': 'rgba(139, 26, 74, 0.05)'
      }
    } else if (themeIndex === 1) {
      // Soft Teal
      return {
        '--glass-bg-1': 'rgba(245, 253, 252, 0.45)',
        '--glass-bg-2': 'rgba(235, 250, 248, 0.50)',
        '--glass-border-1': 'rgba(13, 148, 136, 0.08)',
        '--glass-border-2': 'rgba(13, 148, 136, 0.15)',
        '--glass-shadow-1': 'rgba(13, 148, 136, 0.03)',
        '--glass-shadow-2': 'rgba(13, 148, 136, 0.06)',
        '--glass-hover-bg': 'rgba(235, 250, 248, 0.75)',
        '--card-accent-color': '#0d9488',
        '--card-accent-bg': 'rgba(13, 148, 136, 0.05)'
      }
    } else {
      // Soft Lavender
      return {
        '--glass-bg-1': 'rgba(252, 248, 255, 0.45)',
        '--glass-bg-2': 'rgba(247, 240, 255, 0.50)',
        '--glass-border-1': 'rgba(124, 58, 237, 0.08)',
        '--glass-border-2': 'rgba(124, 58, 237, 0.15)',
        '--glass-shadow-1': 'rgba(124, 58, 237, 0.03)',
        '--glass-shadow-2': 'rgba(124, 58, 237, 0.06)',
        '--glass-hover-bg': 'rgba(247, 240, 255, 0.75)',
        '--card-accent-color': '#7c3aed',
        '--card-accent-bg': 'rgba(124, 58, 237, 0.05)'
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Our Centers | Srikara Hospitals</title>
        <meta name="description" content="Find a Srikara Hospital near you. 9 centers across Telangana and Andhra Pradesh." />
      </Helmet>

      <div className="min-h-screen bg-[#FAFAFC] relative overflow-hidden font-['Inter'] antialiased">
        <StickyNavbar />

        {/* Ambient Glowing Blobs for glassmorphism backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[#8B1A4A]/5 blur-[120px] -top-96 -left-48 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#2D3A4A]/5 blur-[100px] top-1/2 -right-48 animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute w-[700px] h-[700px] rounded-full bg-[#7c3aed]/4 blur-[130px] -bottom-96 -left-96 animate-pulse" style={{ animationDuration: '10s' }} />
        </div>
        
        <section className="pt-28 pb-20 relative z-10">
          <div className="container mx-auto px-4 max-w-[1400px]">
            {/* Header section with modern editorial design */}
            <div className="text-center mb-16 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-pink-500/10 text-[#8B1A4A] border border-[#8B1A4A]/10 mb-4 animate-pulse">
                <MapPin size={11} className="animate-bounce" /> Regional Healthcare Network
              </span>
              <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-slate-800 uppercase tracking-tight leading-none mb-4">
                OUR <span className="text-[#8B1A4A]">CENTERS</span>
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-[#8B1A4A] to-[#2D3A4A] mx-auto rounded-full mb-6" />
              <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed font-light">
                Explore our 9 state-of-the-art medical centers across Telangana and Andhra Pradesh, equipped with specialized clinics, top surgeons, and modern diagnostic facilities.
              </p>
            </div>

            {/* Premium Glassmorphic Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {branches.map((branch, idx) => {
                const themeVars = getCardThemeVariables(idx)
                return (
                  <div 
                    key={branch.slug} 
                    className="premium-glass-card p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                    style={{ ...themeVars, animationDelay: `${idx * 0.4}s` }}
                  >
                    {/* Subtle inner border light glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-[1.5rem]" />
                    
                    <div>
                      {/* Header: Title and Status Badge */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-display font-black text-lg sm:text-xl text-slate-800 transition-colors duration-300 group-hover:text-[var(--card-accent-color)] leading-tight">
                          {branch.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          Open
                        </span>
                      </div>
                      
                      <p className="text-slate-500 text-xs sm:text-sm font-medium mb-6 leading-relaxed">
                        {branch.subtitle}
                      </p>
                      
                      {/* Info items */}
                      <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3 text-slate-600 text-xs sm:text-sm font-medium">
                          <div className="p-1.5 rounded-lg bg-slate-100/50 group-hover:bg-[var(--card-accent-bg)] transition-colors duration-300 flex items-center justify-center">
                            <MapPin size={15} className="text-slate-400 group-hover:text-[var(--card-accent-color)] transition-colors duration-300" />
                          </div>
                          <span className="leading-snug">{branch.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 text-xs sm:text-sm font-medium">
                          <div className="p-1.5 rounded-lg bg-slate-100/50 group-hover:bg-[var(--card-accent-bg)] transition-colors duration-300 flex items-center justify-center">
                            <Phone size={15} className="text-slate-400 group-hover:text-[var(--card-accent-color)] transition-colors duration-300" />
                          </div>
                          <span className="font-mono">{branch.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Link */}
                    <Link to={`/branches/${branch.slug}`} className="w-full mt-auto">
                      <button className="w-full py-3 px-4 rounded-xl bg-white/60 hover:bg-[var(--card-accent-color)] text-[var(--card-accent-color)] hover:text-white border border-[#8B1A4A]/10 hover:border-[var(--card-accent-color)] font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-sm group-hover:shadow-md flex items-center justify-center gap-2">
                        <span>View Details</span>
                        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
