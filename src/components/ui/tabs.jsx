import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = ({ defaultValue, value, onValueChange, children, className }) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue)

  const handleChange = (newValue) => {
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, onTabChange: handleChange })
      )}
    </div>
  )
}

const TabsList = ({ className, children, activeTab, onTabChange }) => (
  <div className={cn("inline-flex h-12 items-center justify-center rounded-clinical bg-surface-high p-1", className)}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, onTabChange })
    )}
  </div>
)

const TabsTrigger = ({ className, value, children, activeTab, onTabChange }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-clinical px-4 py-2 text-sm font-medium transition-all",
      activeTab === value
        ? "bg-surface-lowest text-primary shadow-sm"
        : "text-on-surface-variant hover:text-on-surface",
      className
    )}
    onClick={() => onTabChange(value)}
  >
    {children}
  </button>
)

const TabsContent = ({ className, value, children, activeTab }) => {
  if (activeTab !== value) return null
  return <div className={cn("mt-4", className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
