import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

export function FeatureCard({ feature, index = 0 }) {
  const Icon = Icons[feature.icon] || Icons.Heart

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-surface-lowest rounded-clinical p-6 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-ambient group relative overflow-hidden"
    >
      {/* Gold precision bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-tertiary-container scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-in-out origin-top" />
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-clinical bg-secondary-container/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-secondary" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold text-primary mb-2">
            {feature.title}
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
