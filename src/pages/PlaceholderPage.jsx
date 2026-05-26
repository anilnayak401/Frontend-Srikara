
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'

export function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen bg-surface">

      <section className="py-32 text-center">
        <h1 className="font-headline text-5xl font-extrabold text-primary mb-4">{title}</h1>
        <p className="text-on-surface-variant text-lg">This page is coming soon.</p>
      </section>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
