import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// Eagerly loaded (critical path)
import { BranchLandingPage } from './pages/BranchLandingPage'
import { PeerzadigudaPage } from './pages/PeerzadigudaPage'
import { EcilPage } from './pages/EcilPage'
import { MiyapurPage } from './pages/MiyapurPage'

// Lazy loaded (non-critical)
const BranchesIndex     = lazy(() => import('./pages/BranchesIndex').then(m => ({ default: m.BranchesIndex })))
const DoctorsPage       = lazy(() => import('./pages/DoctorsPage').then(m => ({ default: m.DoctorsPage })))
const DoctorProfilePage = lazy(() => import('./pages/DoctorProfilePage').then(m => ({ default: m.DoctorProfilePage })))
const BlogsPage         = lazy(() => import('./pages/BlogsPage').then(m => ({ default: m.BlogsPage })))
const BookAppointmentPage = lazy(() => import('./pages/BookAppointmentPage').then(m => ({ default: m.BookAppointmentPage })))
const IndividualBookingPage = lazy(() => import('./pages/IndividualBookingPage').then(m => ({ default: m.IndividualBookingPage })))
const SpecialtiesPage   = lazy(() => import('./pages/SpecialtiesPage').then(m => ({ default: m.SpecialtiesPage })))
const SpecialtyDetailPage = lazy(() => import('./pages/SpecialtyDetailPage').then(m => ({ default: m.SpecialtyDetailPage })))
const ServicesPage      = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })))
const AboutPage         = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const PlaceholderPage   = lazy(() => import('./pages/PlaceholderPage').then(m => ({ default: m.PlaceholderPage })))
const AnatomyExplorerPage = lazy(() => import('./pages/AnatomyExplorerPage').then(m => ({ default: m.AnatomyExplorerPage })))

import { lbNagar, kompally, lakdikapul, ecil, miyapur, vijayawada, rajahmundry, rtcXRoads } from './data/branches'

// Minimal page-level loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#cca830] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <HashRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Homepage → ECIL */}
            <Route path="/" element={<Navigate to="/branches/ecil" replace />} />

            {/* Peerzadiguda — custom page */}
            <Route path="/branches/peerzadiguda" element={<PeerzadigudaPage />} />

            {/* All other branches — shared template with branch-specific data */}
            <Route path="/branches/lb-nagar"      element={<BranchLandingPage branch={lbNagar} />} />
            <Route path="/branches/kompally"      element={<BranchLandingPage branch={kompally} />} />
            <Route path="/branches/lakdikapul"    element={<BranchLandingPage branch={lakdikapul} />} />
            <Route path="/branches/ecil"          element={<EcilPage />} />
            <Route path="/branches/miyapur"       element={<MiyapurPage />} />
            <Route path="/branches/vijayawada"    element={<BranchLandingPage branch={vijayawada} />} />
            <Route path="/branches/rajahmundry"   element={<BranchLandingPage branch={rajahmundry} />} />
            <Route path="/branches/rtc-x-roads"   element={<BranchLandingPage branch={rtcXRoads} />} />

            {/* Index & nav pages */}
            <Route path="/branches"     element={<BranchesIndex />} />
            <Route path="/doctors"      element={<DoctorsPage />} />
            <Route path="/doctors/:slug" element={<DoctorProfilePage />} />
            <Route path="/specialties"  element={<AnatomyExplorerPage />} />
            <Route path="/specialties/:specialtyId" element={<SpecialtyDetailPage />} />
            <Route path="/specialties-list" element={<SpecialtiesPage />} />
            <Route path="/anatomy-explorer" element={<Navigate to="/specialties" replace />} />
            <Route path="/services"     element={<ServicesPage />} />
            <Route path="/about"        element={<AboutPage />} />
            <Route path="/book"          element={<BookAppointmentPage />} />
            <Route path="/book/:slug"    element={<IndividualBookingPage />} />
            <Route path="/blogs"         element={<BlogsPage />} />

            <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </HelmetProvider>
  )
}

export default App
