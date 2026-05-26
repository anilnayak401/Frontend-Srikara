import { Link } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone } from 'lucide-react'
import { branches } from '@/data/branches'
import { Helmet } from 'react-helmet-async'

export function BranchesIndex() {
  return (
    <>
      <Helmet>
        <title>Our Centers | Srikara Hospitals</title>
        <meta name="description" content="Find a Srikara Hospital near you. 9 centers across Telangana and Andhra Pradesh." />
      </Helmet>

      <div className="min-h-screen">

        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
                Our Centers
              </h1>
              <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
                9 state-of-the-art healthcare facilities across Telangana and Andhra Pradesh
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map(branch => (
                <Card key={branch.slug} className="hover:shadow-glass transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-primary">{branch.title}</CardTitle>
                      <Badge variant="available">Open</Badge>
                    </div>
                    <p className="text-on-surface-variant">{branch.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{branch.phone}</span>
                      </div>
                    </div>
                    <Link to={`/branches/${branch.slug}`}>
                      <Button variant="ghost" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
        <MobileBottomNav />
      </div>
    </>
  )
}
