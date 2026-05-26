import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = ({ children, className }) => {
  return <div className={cn("space-y-2", className)}>{children}</div>
}

const AccordionItem = ({ value, children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="border-b border-outline-variant">
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  )
}

const AccordionTrigger = ({ className, children, isOpen, setIsOpen }) => (
  <button
    className={cn(
      "flex w-full items-center justify-between py-4 font-medium transition-all hover:text-primary",
      className
    )}
    onClick={() => setIsOpen(!isOpen)}
  >
    {children}
    <ChevronDown
      className={cn(
        "h-4 w-4 transition-transform duration-200",
        isOpen && "rotate-180"
      )}
    />
  </button>
)

const AccordionContent = ({ className, children, isOpen }) => {
  if (!isOpen) return null
  return (
    <div className={cn("pb-4 pt-0 text-on-surface-variant", className)}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
