import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { Star, MapPin } from 'lucide-react'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { BranchSideNav } from '@/components/layout/BranchSideNav'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { AppointmentWidget } from '@/components/sections/AppointmentWidget'
import { VideoHero } from '@/components/sections/VideoHero'
import { PremiumDiseasesSearch } from '@/components/sections/PremiumDiseasesSearch'
import { DoctorsGroupBanner } from '@/components/sections/DoctorsGroupBanner'
import { PremiumDoctorFinder } from '@/components/sections/PremiumDoctorFinder'
import { PremiumCaseStudies } from '@/components/sections/PremiumCaseStudies'
import { PremiumLocation } from '@/components/sections/PremiumLocation'
import { DepartmentSearch } from '@/components/sections/DepartmentSearch'
import { UnevenDepartmentCollage } from '@/components/sections/UnevenDepartmentCollage'
import { ecil as branch } from '@/data/branches/ecil'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Srikara Hospitals | Multi-Specialty Healthcare Excellence</title>
        <meta name="description" content={branch.description} />
      </Helmet>

      <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
        <StickyNavbar currentBranch={branch} />
        <BranchSideNav currentSlug={branch.slug} />

        <div className="xl:pl-16">

          {/* 1. HERO */}
          <VideoHero branch={branch}>
            <div className="max-w-2xl">
              <h1 className="font-headline font-extrabold tracking-tighter mb-5 md:mb-6">
                <span className="hero-line-1 block text-[28px] md:text-5xl lg:text-7xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                  {branch.heroHeadline}
                </span>
                <span className="hero-line-2 block text-[26px] md:text-5xl lg:text-7xl hero-gradient-text">
                  {branch.heroHighlight}
                </span>
              </h1>
              <p className="hero-desc text-sm md:text-lg text-white/70 max-w-xl mb-6 md:mb-8 leading-relaxed">
                {branch.description}
              </p>
              <div className="hero-btn-wrap flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                <button
                  onClick={() => navigate('/book')}
                  className="w-full sm:w-auto min-h-[48px] bg-[#8B1A4A] text-white px-8 py-3 md:py-4 rounded-full font-label font-bold uppercase tracking-widest shadow-lg hover:bg-[#2D3A4A] transition-all duration-300 text-sm md:text-base"
                >
                  Book an Appointment
                </button>
                <button
                  onClick={() => navigate('/specialties')}
                  className="w-full sm:w-auto min-h-[48px] bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 md:py-4 rounded-full font-label font-bold uppercase tracking-widest hover:bg-white/20 transition-all text-sm md:text-base"
                >
                  Explore Specialties
                </button>
              </div>
            </div>
          </VideoHero>

          {/* 1.5 DEPARTMENT SEARCH */}
          <DepartmentSearch />
          {/* ── DOCTORS TEAM BANNER ── */}
          <DoctorsGroupBanner />

          {/* 2. CENTERS OF EXCELLENCE (Uneven Department Collage) */}
          <UnevenDepartmentCollage />

          {/* 3. CLINICAL ENCYCLOPEDIA */}
          <section className="pt-12 pb-0 px-8">
            <div className="max-w-7xl mx-auto">
              <PremiumDiseasesSearch />
            </div>
          </section>

          {/* 5. PREMIUM DOCTOR FINDER */}
          <PremiumDoctorFinder branchTitle={branch.title} branchId={branch.title} />

          {/* 6. INFRASTRUCTURE */}
          {branch.infrastructure && (
            <section className="pt-12 pb-20 bg-surface-container-low px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                  <h2 className="editorial-title text-4xl font-black tracking-tight leading-none mb-4">
                    <span className="block text-[#2D3A4A]">Precision</span>
                    <span className="block text-[#8B1A4A] mt-2">Ecosystem</span>
                  </h2>
                  <div className="w-16 h-[2px] bg-[#8B1A4A]/25 mx-auto mb-6" />
                  <p className="text-[#4A4A4A] max-w-2xl mx-auto">
                    We invest in the future of healthcare so you can invest in your health.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {branch.infrastructure.map((item, i) => (
                    <div key={i} className="group relative rounded-3xl overflow-hidden h-80">
                      <video
                        src={i === 0
                          ? 'https://assets.mixkit.co/videos/preview/mixkit-doctor-analysing-a-brain-mri-on-a-screen-40032-large.mp4'
                          : 'https://assets.mixkit.co/videos/preview/mixkit-surgeons-performing-a-surgery-with-a-surgical-monitor-35515-large.mp4'
                        }
                        poster={item.image || (i === 0
                          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsy4QyvBAKqMc5jm3QR4_8UqR5L8nBrBgSREo9VuccfjCP3HBJs0ziEeXOzXDxHo0B3FHdgZ94q_LEkHTkaduFMpK7zhxxI5IWdcvN-1EW4X966vG-PKPso_lzppnnHlGyDyIMsO28rwYH6wDicKFOGBFapr15cRMuWLdd7kHDCSeiZIIlZVlSJHQkqMo4S7-j0KlCMmDIP3hLCOb2cYxW_Hg7zw1YIrLHAd8sA7shqELw9iCyfi6M_vOzb255-_fJs3YgQtG8S1g'
                          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkocaQxiMvMjVnD-a1ILZHkSv0qki-DziBAXey5cwaDbJPVJvUPjnQjskOai_Q8_37liZrGjoFcMZ8_ODtSqXvJiNU2tF5rt-YivEOSUkYsCfTRhxw7tIRSaqIU_zuodeWQLdnc0uAaaD3izQ6GubO1gO8RfpQyAGriwKDkRABilUPTxf1BlBpDfHmSA4rKljqGXmFIZu_9LwdTZcG6j84B2RphtdSEII3i5Oc5ICvuC_nANM4MerXxn9dvzbIe4fwaYrRonxFrbs'
                        )}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} to-transparent flex flex-col justify-end p-8`}>
                        <h4 className="text-white font-headline text-2xl font-bold mb-2">{item.title}</h4>
                        <p className="text-white/80 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 6.5 CASE STUDIES */}
          <PremiumCaseStudies />

          {/* 7. PREMIUM LOCATION & REVIEWS */}
          <PremiumLocation branch={branch} />

        </div>

        <AppointmentWidget currentBranch={branch} />
        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
