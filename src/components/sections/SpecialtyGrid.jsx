export function SpecialtyGrid({ specialties }) {
  if (!specialties) return null

  const categories = [
    { key: 'criticalCare', title: 'Critical Care' },
    { key: 'generalHealth', title: 'General Health' },
    { key: 'surgicalCenters', title: 'Surgical Centers' },
    { key: 'specializedCare', title: 'Specialized Care' },
    { key: 'familyCare', title: 'Family Care' },
    { key: 'diagnostics', title: 'Diagnostics' },
  ]

  return (
    <section className="py-16 bg-surface-low">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Our Specialties
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map(category => (
            <div key={category.key} className="bg-surface-lowest rounded-clinical p-4">
              <h4 className="font-display text-primary font-semibold mb-3 text-sm">
                {category.title}
              </h4>
              <ul className="space-y-2">
                {specialties[category.key]?.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer py-1"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
