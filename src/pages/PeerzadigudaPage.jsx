import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { BranchSideNav } from '@/components/layout/BranchSideNav'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { AppointmentWidget } from '@/components/sections/AppointmentWidget'
import { peerzadiguda as branch } from '@/data/branches/peerzadiguda'
import { VideoHero } from '@/components/sections/VideoHero'
import { PeerzadigudaDiseasesSearch } from '@/components/sections/PeerzadigudaDiseasesSearch'
import { PremiumDoctorFinder } from '@/components/sections/PremiumDoctorFinder'
import { DepartmentSearch } from '@/components/sections/DepartmentSearch'
import { PremiumLocation } from '@/components/sections/PremiumLocation'
import { AchievementsSection } from '@/components/sections/AchievementsSection'
import { DarkCentersOfExcellence } from '@/components/sections/DarkCentersOfExcellence'
import { UnevenDepartmentCollage } from '@/components/sections/UnevenDepartmentCollage'

const SPECIALTY_IMAGES = [
  'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
]

const GALLERY_SPANS = [
  'md:col-span-2 md:row-span-4 col-span-1',
  'md:col-span-2 md:row-span-2 col-span-1',
  'md:col-span-1 md:row-span-2 col-span-1',
  'md:col-span-1 md:row-span-2 col-span-1',
  'md:col-span-2 md:row-span-2 col-span-1',
]

export function PeerzadigudaPage() {
  const navigate = useNavigate()

  const galleryItems = branch.specialtiesCards?.map((item, i) => ({
    id: i + 1,
    type: 'image',
    title: item.title,
    desc: item.description,
    url: SPECIALTY_IMAGES[i % SPECIALTY_IMAGES.length],
    span: GALLERY_SPANS[i % GALLERY_SPANS.length],
  })) || []

  return (
    <>
      <Helmet>
        <title>Srikara Hospitals Peerzadiguda | Affordable Advanced Care</title>
        <meta name="description" content="Bringing world-class Orthopedic, General, and Urology care to Peerzadiguda with robotic-assisted precision." />
      </Helmet>

      <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
        <StickyNavbar currentBranch={branch} />
        <BranchSideNav currentSlug={branch.slug} />

        <div className="xl:pl-16">

          {/* ── 1. HERO ── */}
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
                  className="w-full sm:w-auto min-h-[48px] bg-gradient-to-br from-[#8B1A4A] to-[#5E0F30] text-white px-8 py-3 md:py-4 rounded-full font-label font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform text-sm md:text-base"
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

          {/* ── 1.5 DEPARTMENT SEARCH ── */}
          <DepartmentSearch />

          {/* ── 2. CENTERS OF EXCELLENCE ── */}
          <DarkCentersOfExcellence />

          {/* ── 3. CLINICAL SEARCH ── */}
          <section className="bg-surface-container-low border-y border-[#1A202C]/5">
            <div className="max-w-full">
              <PeerzadigudaDiseasesSearch />
            </div>
          </section>

          {/* ── 4. MODERN INFRASTRUCTURE ── */}
          <section className="py-24 bg-surface-container-low px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="editorial-title text-4xl font-black tracking-tight leading-none mb-4">
                  <span className="block text-[#2D3A4A]">Modern</span>
                  <span className="block text-[#8B1A4A] mt-2">Infrastructure</span>
                </h2>
                <div className="w-16 h-[2px] bg-[#8B1A4A]/25 mx-auto mb-6" />
                <p className="text-[#4A4A4A] max-w-2xl mx-auto">
                  A seamless integration of robotics and diagnostics to ensure zero-error outcomes.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  {
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsy4QyvBAKqMc5jm3QR4_8UqR5L8nBrBgSREo9VuccfjCP3HBJs0ziEeXOzXDxHo0B3FHdgZ94q_LEkHTkaduFMpK7zhxxI5IWdcvN-1EW4X966vG-PKPso_lzppnnHlGyDyIMsO28rwYH6wDicKFOGBFapr15cRMuWLdd7kHDCSeiZIIlZVlSJHQkqMo4S7-j0KlCMmDIP3hLCOb2cYxW_Hg7zw1YIrLHAd8sA7shqELw9iCyfi6M_vOzb255-_fJs3YgQtG8S1g',
                    title: 'Modern Diagnostics',
                    desc: 'Equipped with ultra-modern MRI, CT Scan, and Digital X-Ray systems for hyper-accurate visualization.',
                    gradient: 'from-primary/90',
                  },
                  {
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkocaQxiMvMjVnD-a1ILZHkSv0qki-DziBAXey5cwaDbJPVJvUPjnQjskOai_Q8_37liZrGjoFcMZ8_ODtSqXvJiNU2tF5rt-YivEOSUkYsCfTRhxw7tIRSaqIU_zuodeWQLdnc0uAaaD3izQ6GubO1gO8RfpQyAGriwKDkRABilUPTxf1BlBpDfHmSA4rKljqGXmFIZu_9LwdTZcG6j84B2RphtdSEII3i5Oc5ICvuC_nANM4MerXxn9dvzbIe4fwaYrRonxFrbs',
                    title: 'Surgical Robotics',
                    desc: 'State-of-the-art robotic systems that assist our surgeons in performing complex procedures with sub-millimeter precision.',
                    gradient: 'from-secondary/90',
                  },
                ].map((item, i) => (
                  <div key={i} className="group relative rounded-3xl overflow-hidden h-96">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} to-transparent flex flex-col justify-end p-10`}>
                      <h4 className="text-white font-headline text-2xl font-bold mb-2">{item.title}</h4>
                      <p className="text-white/80 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <AppointmentWidget currentBranch={branch} />
        </div>{/* end xl:pl-16 */}

        {/* Centers of Excellence Asymmetric Collage */}
        <UnevenDepartmentCollage />

        {/* ── DOCTOR SLIDER ── */}
        <PremiumDoctorFinder branchTitle={branch.title} branchId={branch.title} />

        {/* ── LOCATION ── */}
        <AchievementsSection />
        <PremiumLocation branch={branch} />

        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
