import { useParams } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeatureCard } from '@/components/sections/FeatureCard'
import { DoctorProfile } from '@/components/sections/DoctorProfile'
import { TechnologySection } from '@/components/sections/TechnologySection'
import { SpecialtyGrid } from '@/components/sections/SpecialtyGrid'
import { AppointmentWidget } from '@/components/sections/AppointmentWidget'
import { getBranchBySlug } from '@/data/branches'
import { Helmet } from 'react-helmet-async'

export function BranchPage() {
  const { slug } = useParams()
  const branch = getBranchBySlug(slug)

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-primary mb-4">
            Branch Not Found
          </h1>
          <p className="text-on-surface-variant">
            The branch you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Srikara {branch.title} – {branch.subtitle} | Srikara Hospitals</title>
        <meta name="description" content={`${branch.tagline}. ${branch.headline}`} />
      </Helmet>

      <div className="min-h-screen">

        
        <HeroSection branch={branch} />

        {/* Features */}
        {branch.features && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary text-center mb-12">
                Why Choose {branch.title}?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branch.features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        <DoctorProfile doctor={branch.doctor} />
        
        <TechnologySection technologies={branch.technologies} />
        
        <SpecialtyGrid specialties={branch.specialties} />

        <AppointmentWidget currentBranch={branch} />
        
        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
