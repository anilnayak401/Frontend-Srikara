import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, X, ChevronRight, PhoneCall, HeartPulse, Navigation } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { branches } from '@/data/branches'

export function BranchSideNav({ currentSlug }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsOpen(false)
  }, [currentSlug])

  return (
    <>

      {/* 2. BACKDROP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-primary/25 backdrop-blur-md z-[60] hidden xl:block"
          />
        )}
      </AnimatePresence>

      {/* 3. PREMIUM SIDE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed left-0 top-0 bottom-0 w-[320px] z-[70] hidden xl:flex flex-col bg-white shadow-[25px_0_100px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            {/* Header Content */}
            <div className="p-6 bg-primary text-white relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all group"
                title="Dismiss Menu"
              >
                <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
              
              <div className="flex items-center gap-3 mb-1">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-xl leading-none">Locations</h3>
                  <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.2em] mt-1.5 italic">Clinical Hub Network</p>
                </div>
              </div>
            </div>

            {/* Branch List Section with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {branches.map((branch, i) => {
                const isActive = branch.slug === currentSlug
                return (
                  <motion.div
                    key={branch.slug}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={`/branches/${branch.slug}`}
                      className={`group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-400 border-2 ${
                        isActive
                          ? 'bg-primary/5 border-primary/40 shadow-inner'
                          : 'bg-white border-transparent hover:bg-surface-container-low hover:border-outline-variant/30 hover:scale-[1.01]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute left-[-2px] top-3 bottom-3 w-1.5 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(0,52,97,0.3)]"
                        />
                      )}
                      
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                        isActive 
                          ? 'bg-primary text-white scale-105 rotate-3' 
                          : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:-rotate-3'
                      }`}>
                        <MapPin className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <p className={`font-headline font-extrabold text-sm leading-tight transition-colors ${
                          isActive ? 'text-primary' : 'text-on-surface'
                        }`}>
                          {branch.title}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5 opacity-60">
                          Srikara {branch.title}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? 'text-primary translate-x-0 opacity-100' : 'text-outline opacity-0 -translate-x-2'
                      } group-hover:opacity-100 group-hover:translate-x-0`} />
                    </Link>
                  </motion.div>
                )
              })}

              {/* Explicit Closing Button at bottom of list */}
              <div className="pt-3 pb-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-primary transition-colors flex items-center justify-center gap-2 border border-dashed border-outline-variant/50 rounded-xl hover:border-primary/50 hover:bg-primary/5"
                >
                  <X className="w-3 h-3" />
                  Close Branch Selection
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 bg-surface-container-lowest border-t border-outline-variant/20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/book')}
                className="w-full bg-error text-white p-4 rounded-[1.5rem] flex items-center justify-center gap-4 shadow-xl shadow-error/30 hover:shadow-error/50 transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                <div className="relative z-10 w-9 h-9 rounded-full bg-white/25 flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 leading-none mb-1 text-white">Need Help Now?</p>
                  <p className="font-headline font-black text-lg leading-none">EMERGENCY</p>
                </div>
                <ChevronRight className="ml-auto w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform" />
              </motion.button>
              
              <div className="mt-6 flex items-center justify-between px-4">
                <div className="text-center group cursor-pointer">
                  <PhoneCall className="w-5 h-5 text-primary/40 mx-auto mb-2 group-hover:text-primary transition-colors" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Hotline</p>
                </div>
                <div className="w-px h-8 bg-outline-variant/40" />
                <div className="text-center group cursor-pointer">
                  <Navigation className="w-5 h-5 text-primary/40 mx-auto mb-2 group-hover:text-primary transition-colors" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Locate</p>
                </div>
                <div className="w-px h-8 bg-outline-variant/40" />
                <div className="text-center group cursor-pointer">
                  <X className="w-5 h-5 text-primary/40 mx-auto mb-2 group-hover:text-error transition-colors" onClick={() => setIsOpen(false)} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Close</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </>
  )
}
