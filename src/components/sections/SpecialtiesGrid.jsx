// Specialty card icons mapped from Material Symbols to emoji/text fallback
const iconMap = {
  orthopedics: '🦴',
  medical_services: '🩺',
  urology: '🫘',
  emergency: '🚨',
  biotech: '🔬',
  cardiology: '❤️',
  neurology: '🧠',
}

function ClinicalCard({ icon, iconColor = 'text-primary', title, description }) {
  return (
    <div className="group bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-ambient">
      {/* Gold precision bar */}
      <div className="absolute left-0 top-0 w-1 h-0 bg-tertiary group-hover:h-full transition-all duration-300 ease-in-out" />

      <div className={`w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-6 ${iconColor} text-2xl`}>
        {iconMap[icon] || '⚕️'}
      </div>
      <h3 className="font-headline font-bold text-lg text-primary mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
    </div>
  )
}

export function SpecialtiesGrid({ specialties }) {
  return (
    <section className="py-24 bg-surface px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-4 uppercase">
              Centers of Excellence
            </h2>
            <p className="text-on-surface-variant">
              Our Peerzadiguda facility combines neighborhood accessibility with the surgical power of a global medical hub.
            </p>
          </div>
          <div className="text-right">
            <span className="text-tertiary font-black text-6xl opacity-10">01</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {specialties.map((item, i) => (
            <ClinicalCard
              key={i}
              icon={item.icon}
              iconColor={item.iconColor}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
