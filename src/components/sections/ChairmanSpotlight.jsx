export function ChairmanSpotlight({ doctor }) {
  if (!doctor) return null

  return (
    <section className="py-24 bg-surface px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Photo */}
        <div className="w-full md:w-1/3">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary to-primary-container opacity-10 rounded-2xl rotate-3 transition-transform group-hover:rotate-6" />
            <img
              src={doctor.image || '/doctors/akhil-dadi.png'}
              alt={`Dr. ${doctor.name}`}
              className="relative z-10 w-full aspect-[3/4] object-cover object-top rounded-2xl transition-all duration-500 shadow-xl"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-tertiary font-bold uppercase tracking-[0.3em] mb-4">Leadership</p>
          <h2 className="font-headline text-4xl font-extrabold text-primary mb-6">
            Led by a Pioneer in Robotic Joint Replacement
          </h2>
          <h3 className="text-2xl font-bold text-on-surface-variant mb-6 italic">{doctor.name}</h3>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
            {doctor.bio}
          </p>
          <div className="grid grid-cols-2 gap-8 mb-8 border-l-2 border-secondary/20 pl-8">
            <div>
              <p className="text-3xl font-black text-primary">{doctor.surgeries}</p>
              <p className="text-xs font-bold uppercase text-on-surface-variant">Joint Replacements</p>
            </div>
            <div>
              <p className="text-3xl font-black text-primary">{doctor.experience} Years</p>
              <p className="text-xs font-bold uppercase text-on-surface-variant">of Excellence</p>
            </div>
          </div>
          <button className="bg-primary text-white px-10 py-4 rounded-full font-label font-bold uppercase tracking-widest hover:bg-primary-container transition-all">
            View Chairman's Message
          </button>
        </div>
      </div>
    </section>
  )
}
