import { Link, useLocation } from 'react-router-dom'
import { Home, Stethoscope, MapPin, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const location = useLocation()

  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
    { icon: MapPin, label: 'Centers', path: '/branches' },
    { icon: UserCircle, label: 'Account', path: '/account' },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-lowest border-t border-outline-variant z-50">
      <div className="grid grid-cols-4">
        {tabs.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || 
            (path !== '/' && location.pathname.startsWith(path))
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center py-3 transition-colors",
                isActive ? "text-primary" : "text-on-surface-variant"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
