import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function AnimatedCounter({ value, label }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="font-display text-4xl md:text-5xl font-bold text-tertiary-container mb-2">
        {value}
      </div>
      <div className="text-on-surface-variant">{label}</div>
    </motion.div>
  )
}

export function DoctorProfile({ doctor }) {
  if (!doctor) return null

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
              Meet {doctor.name}
            </h2>
            <p className="text-xl text-on-surface-variant">{doctor.title}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {doctor.surgeries && (
              <AnimatedCounter value={doctor.surgeries} label="Successful Surgeries" />
            )}
            {doctor.successRate && (
              <AnimatedCounter value={doctor.successRate} label="Patient Success Rate" />
            )}
            {doctor.experience && (
              <AnimatedCounter value={`${doctor.experience} Years`} label="Experience" />
            )}
          </div>

          {/* Bio */}
          {doctor.bio && (
            <div className="bg-surface-lowest rounded-clinical p-8 shadow-ambient">
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {doctor.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
