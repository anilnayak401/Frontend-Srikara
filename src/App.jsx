import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// Eagerly loaded (critical path)
import { HomePage } from './pages/HomePage'
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
const CareersPage       = lazy(() => import('./pages/CareersPage').then(m => ({ default: m.CareersPage })))
const AdminDashboard    = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })))

import { VisitorTracker } from './components/shared/VisitorTracker'
import { lbNagar, kompally, lakdikapul, ecil, miyapur, vijayawada, rajahmundry, rtcXRoads, secunderabad } from './data/branches'

// Minimal page-level loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#cca830] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Reset scroll position on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (!hash) {
      // Temporarily disable smooth scroll on html element
      const html = document.documentElement
      const originalScrollBehavior = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      
      // Scroll instantly to top
      window.scrollTo(0, 0)
      
      // Use requestAnimationFrame for async layout/rendering safety
      const rAF = requestAnimationFrame(() => {
        window.scrollTo(0, 0)
        html.style.scrollBehavior = originalScrollBehavior
      })

      return () => cancelAnimationFrame(rAF)
    } else {
      const element = document.getElementById(hash.slice(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [pathname, hash])

  return null
}

function App() {
  return (
    <HelmetProvider>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <VisitorTracker />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Dedicated Homepage */}
            <Route path="/" element={<HomePage />} />

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
            <Route path="/branches/secunderabad"  element={<BranchLandingPage branch={secunderabad} />} />
            
            {/* Dynamic catch-all for CMS branch locations */}
            <Route path="/branches/:slug"         element={<BranchLandingPage />} />

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
            <Route path="/careers"       element={<CareersPage />} />
            <Route path="/admin"         element={<AdminDashboard />} />

            <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
          </Routes>
          <FloatingAdminTrigger />
        </Suspense>
      </HashRouter>
    </HelmetProvider>
  )
}

function FloatingAdminTrigger() {
  const location = useLocation()
  if (location.pathname === '/admin') return null

  return (
    <Link
      to="/admin"
      className="fixed bottom-4 left-4 z-[9999] w-9 h-9 bg-white/95 hover:bg-[#8B1A4A] text-slate-400 hover:text-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
      title="Admin Control Panel"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 transition-transform group-hover:rotate-45"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </Link>
  )
}

export default App
