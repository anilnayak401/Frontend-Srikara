import { Link } from 'react-router-dom'

const sideLinks = [
  { label: 'Miyapur', slug: 'miyapur', icon: '📍' },
  { label: 'Peerzadiguda', slug: 'peerzadiguda', icon: '⚙️', active: true },
]

export function SideNavBranches({ currentSlug }) {
  return (
    <aside className="hidden xl:flex fixed left-0 top-1/2 -translate-y-1/2 flex-col gap-2 z-40 bg-white/40 backdrop-blur-md p-2 rounded-r-2xl border-y border-r border-slate-200">
      <div className="px-2 py-4 border-b border-slate-200 mb-2">
        <p className="text-[8px] font-black uppercase text-primary mb-1">Branches</p>
        <p className="text-[10px] font-bold text-slate-400">Centers of Excellence</p>
      </div>

      {sideLinks.map(link => {
        const isActive = currentSlug === link.slug
        return (
          <Link
            key={link.slug}
            to={`/branches/${link.slug}`}
            className={`p-3 rounded-lg transition-all flex flex-col items-center gap-1 ${
              isActive
                ? 'bg-blue-50 text-primary font-bold border-l-4 border-primary'
                : 'text-slate-500 hover:bg-blue-50 hover:text-primary'
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-[10px] font-bold">{link.label}</span>
          </Link>
        )
      })}

      <div className="mt-4 p-2 bg-error text-on-error rounded-lg text-center cursor-pointer">
        <span className="text-xl">🚨</span>
      </div>
    </aside>
  )
}
