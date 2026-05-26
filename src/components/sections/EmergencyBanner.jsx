export function EmergencyBanner({ phone = '040-68324800', branchName = '' }) {
  return (
    <section className="bg-error text-on-error py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-pulse text-3xl">
            🚑
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Need Urgent Help?</h2>
            <p className="opacity-90 font-medium">
              {branchName} Branch Emergency Trauma Support Available 24/7
            </p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm font-bold opacity-75 uppercase mb-1">Call Now</p>
          <a href={`tel:${phone}`} className="text-4xl font-black tracking-tighter">
            {phone}
          </a>
        </div>
      </div>
    </section>
  )
}
