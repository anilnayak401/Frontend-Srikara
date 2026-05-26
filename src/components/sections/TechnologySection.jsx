import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import * as Icons from 'lucide-react'

export function TechnologySection({ technologies }) {
  if (!technologies || technologies.length === 0) return null

  const [activeTab, setActiveTab] = useState(technologies[0]?.name)

  return (
    <section className="py-16 bg-surface-low">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Advanced Technology
        </h2>

        {/* Desktop: Tabs */}
        <div className="hidden md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {technologies.map(tech => (
                <TabsTrigger key={tech.name} value={tech.name}>
                  {tech.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {technologies.map(tech => {
              const Icon = Icons[tech.icon] || Icons.Cpu
              return (
                <TabsContent key={tech.name} value={tech.name}>
                  <div className="bg-surface-lowest rounded-clinical p-8 shadow-ambient">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 rounded-clinical bg-secondary-container/20 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-primary mb-3">
                          {tech.name}
                        </h3>
                        <p className="text-on-surface-variant leading-relaxed text-lg">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>

        {/* Mobile: Accordion */}
        <div className="md:hidden">
          <Accordion>
            {technologies.map(tech => {
              const Icon = Icons[tech.icon] || Icons.Cpu
              return (
                <AccordionItem key={tech.name} value={tech.name}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-secondary" />
                      <span>{tech.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-on-surface-variant">{tech.description}</p>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
