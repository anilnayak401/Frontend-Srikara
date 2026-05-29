import { Link, useLocation } from 'react-router-dom'
import { Home, Stethoscope, MapPin, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const location = useLocation()

  const tabs = [
    { icon: Home, label: 'Home', path: '/branches/ecil' },
    { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
    { icon: MapPin, label: 'Specialties', path: '/specialties' },
    { icon: Calendar, label: 'Book', path: '/book' },
  ]

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-[0_12px_40px_rgba(139,26,74,0.15)] z-50 py-2 px-1">
      <div className="grid grid-cols-4">
        {tabs.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || 
            (path !== '/' && location.pathname.startsWith(path)) ||
            (path === '/branches/ecil' && location.pathname === '/')
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 transition-all duration-300 transform active:scale-90",
                isActive ? "text-[#8B1A4A]" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 mb-0.5 transition-transform duration-300", isActive ? "scale-110" : "")} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8B1A4A] rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider scale-90">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

