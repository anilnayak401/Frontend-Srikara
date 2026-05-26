export function InfrastructureSection({ items }) {
  const defaultItems = [
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsy4QyvBAKqMc5jm3QR4_8UqR5L8nBrBgSREo9VuccfjCP3HBJs0ziEeXOzXDxHo0B3FHdgZ94q_LEkHTkaduFMpK7zhxxI5IWdcvN-1EW4X966vG-PKPso_lzppnnHlGyDyIMsO28rwYH6wDicKFOGBFapr15cRMuWLdd7kHDCSeiZIIlZVlSJHQkqMo4S7-j0KlCMmDIP3hLCOb2cYxW_Hg7zw1YIrLHAd8sA7shqELw9iCyfi6M_vOzb255-_fJs3YgQtG8S1g',
      title: 'Modern Diagnostics',
      description: 'Equipped with ultra-modern MRI, CT Scan, and Digital X-Ray systems for hyper-accurate visualization.',
      gradientFrom: 'from-primary/90',
    },
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkocaQxiMvMjVnD-a1ILZHkSv0qki-DziBAXey5cwaDbJPVJvUPjnQjskOai_Q8_37liZrGjoFcMZ8_ODtSqXvJiNU2tF5rt-YivEOSUkYsCfTRhxw7tIRSaqIU_zuodeWQLdnc0uAaaD3izQ6GubO1gO8RfpQyAGriwKDkRABilUPTxf1BlBpDfHmSA4rKljqGXmFIZu_9LwdTZcG6j84B2RphtdSEII3i5Oc5ICvuC_nANM4MerXxn9dvzbIe4fwaYrRonxFrbs',
      title: 'Surgical Robotics',
      description: 'State-of-the-art robotic systems that assist our surgeons in performing complex procedures with sub-millimeter precision.',
      gradientFrom: 'from-secondary/90',
    },
  ]

  const displayItems = items || defaultItems

  return (
    <section className="py-24 bg-surface-container-low px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-4 uppercase">
            Modern Infrastructure
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            A seamless integration of robotics and diagnostics to ensure zero-error outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {displayItems.map((item, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden h-96">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${item.gradientFrom} to-transparent flex flex-col justify-end p-10`}>
                <h4 className="text-white font-headline text-2xl font-bold mb-2">{item.title}</h4>
                <p className="text-white/80 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
