export function AccessibleCareSection({ branch }) {
  const highlights = branch.accessibleCareHighlights || [
    'Minimized Travel for Critical Procedures',
    'Affordable Pricing without Quality Compromise',
    'Local Expert Doctors & Post-op Care',
  ]

  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative">
          <div className="aspect-square rounded-full overflow-hidden border-[12px] border-surface-container-lowest shadow-2xl">
            <img
              src={branch.accessibleCareImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNyy4liwb1yNO6ySjCQ0B_tOc6U-1WSyfGI5FxQ5xPeqkp54hB7-51ex_W4oBrs32IyPrfyruE4mOrF8RxViNtbKEex8XjkVYbOX8dbKzgp1PDUQtKHvzXXz8ZzHmJqbddap-JBcxcsieMy9iC8_UxXT1V_iKJLdoekdef7rQiYwTiqdAWZEYVpBQ5ifRR1OMYW0E0AY3N0bK8z46jyWMPh150-b5yCx0es87h4z_LoRCP2kIQ4lGU4nsj69UFJLtsutt3IXadXEs'}
              alt="Surgeon using robotic surgical console"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Quote card */}
          <div className="absolute -bottom-8 -right-8 bg-surface/70 backdrop-blur-[20px] p-8 rounded-2xl border border-white/30 max-w-xs shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-tertiary text-xl">⚙️</span>
              <p className="font-bold text-primary uppercase text-xs tracking-tighter">Robotic Advantage</p>
            </div>
            <p className="text-sm font-medium text-on-surface-variant italic">
              "We've brought the precision of elite city centers to Peerzadiguda, ensuring no one has to travel far for the best surgery."
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-8">
            Accessible Advanced Care.{' '}
            <br />
            <span className="text-secondary italic">Now Closer to Home.</span>
          </h2>
          <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
            At Srikara Hospitals Peerzadiguda, we believe precision shouldn't be a privilege. By integrating high-tech robotic surgery into our neighborhood facility, we ensure that advanced healthcare is both geographically and financially accessible to the local community.
          </p>
          <ul className="space-y-4 mb-10">
            {highlights.map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-on-surface font-semibold">
                <span className="text-secondary text-xl">✅</span>
                {item}
              </li>
            ))}
          </ul>
          <button className="bg-secondary text-white px-8 py-4 rounded-full font-label font-bold uppercase tracking-widest hover:bg-secondary/90 transition-all">
            Learn about our mission
          </button>
        </div>
      </div>
    </section>
  )
}
