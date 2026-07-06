import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export function VisitorTracker() {
  const location = useLocation()

  // 1. Log Page Views on Route Changes
  useEffect(() => {
    const logPageView = async () => {
      try {
        // Skip analytics logging if Firebase hasn't been initialized or is missing config
        if (!db) return
        
        await addDoc(collection(db, 'analytics_events'), {
          type: 'page_view',
          path: location.pathname + location.search,
          screenWidth: window.innerWidth,
          timestamp: Date.now()
        })
      } catch (err) {
        console.warn('Analytics pageview log bypassed:', err.message)
      }
    }
    
    logPageView()
  }, [location])

  // 2. Log User Clicks (Throttled & Filtered for efficiency)
  useEffect(() => {
    let lastLoggedClick = 0
    
    const handleGlobalClick = async (e) => {
      // Find closest interactive element
      const interactiveEl = e.target.closest('button, a, input, select, textarea, [role="button"], .clickable')
      const now = Date.now()
      
      // If it's not an interactive element, throttle logging to once every 3 seconds to save database write costs
      if (!interactiveEl && now - lastLoggedClick < 3000) {
        return
      }
      
      const targetElement = interactiveEl || e.target
      const elementTag = targetElement.tagName.toLowerCase()
      const elementId = targetElement.id ? `#${targetElement.id}` : ''
      const elementClasses = targetElement.className ? `.${Array.from(targetElement.classList).slice(0, 2).join('.')}` : ''
      const elementText = targetElement.innerText ? targetElement.innerText.slice(0, 30).trim() : ''

      try {
        if (!db) return

        await addDoc(collection(db, 'analytics_events'), {
          type: 'click',
          path: location.pathname,
          x: e.clientX,
          y: e.clientY,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          element: `${elementTag}${elementId}${elementClasses}`,
          text: elementText,
          timestamp: now
        })
        
        lastLoggedClick = now
      } catch (err) {
        // Silently bypass analytics logging errors
      }
    }

    window.addEventListener('click', handleGlobalClick)
    return () => window.removeEventListener('click', handleGlobalClick)
  }, [location])

  // This tracker is a silent background observer and renders nothing
  return null
}
