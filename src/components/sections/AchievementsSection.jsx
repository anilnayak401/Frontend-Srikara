import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 30000, suffix: '+', label: 'Joint Replacements', sub: 'Successful procedures performed', icon: '🦴' },
  { value: 99,    suffix: '%', label: 'Success Rate',       sub: 'Across all surgical departments', icon: '✅' },
  { value: 12,    suffix: '+', label: 'Years of Excellence', sub: 'Serving Hyderabad since 2013',   icon: '🏆' },
  { value: 9,     suffix: '',  label: 'Clinical Centers',   sub: 'Across AP & Telangana',           icon: '📍' },
  { value: 500,   suffix: '+', label: 'Expert Doctors',     sub: 'Board-certified specialists',     icon: '👨‍⚕️' },
  { value: 100,   suffix: 'K+', label: 'Families Served',  sub: 'Trusted by the community',        icon: '❤️' },
];

function CountUp({ target, suffix, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

export function AchievementsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden font-sans">
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B1A4A]/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#8B1A4A]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-10 h-[1px] bg-[#8B1A4A]" />
            <span className="text-[#8B1A4A] text-[11px] font-black uppercase tracking-[0.6em]">Real-Time Achievements</span>
            <div className="w-10 h-[1px] bg-[#8B1A4A]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-[#1A202C] tracking-tight leading-tight">
            Numbers That <span className="text-[#8B1A4A]">Speak.</span>
          </h2>
          <p className="text-[#4A4A4A]/50 text-base mt-4 font-light max-w-lg mx-auto">
            Every statistic represents a life transformed, a family reassured, a future restored.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#E2E8F0] rounded-3xl overflow-hidden border border-[#E2E8F0]">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-white hover:bg-[#8B1A4A]/5 transition-all duration-500 p-10 flex flex-col gap-4"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139,26,74,0.06) 0%, transparent 70%)' }} />

              <span className="text-3xl">{stat.icon}</span>

              <div>
                <p className="text-4xl md:text-5xl font-black text-[#1A202C] leading-none tracking-tight">
                  <CountUp target={stat.value} suffix={stat.suffix} active={inView} />
                </p>
                <p className="text-[#8B1A4A] text-sm font-bold uppercase tracking-widest mt-2">{stat.label}</p>
              </div>

              <p className="text-[#4A4A4A]/50 text-xs font-light leading-relaxed">{stat.sub}</p>

              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#8B1A4A] group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>

        {/* Bottom quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center text-[#4A4A4A]/20 text-xs uppercase tracking-[0.4em] font-bold mt-10"
        >
          Srikara Hospitals · Clinical Excellence Since 2013
        </motion.p>
      </div>
    </section>
  );
}
