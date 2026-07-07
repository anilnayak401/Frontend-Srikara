import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

const DEFAULT_TESTIMONIALS = [
  { 
    id: '1', 
    patientName: 'Lakshmi Devi', 
    rating: 5, 
    review: 'Fantastic robotic surgery care at Srikara Hospital. I walked within 3 days without pain!', 
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    page: 'General / Home' 
  }
]

let cachedTestimonials = [...DEFAULT_TESTIMONIALS]
let isFetched = false
const listeners = new Set()

const loadTestimonials = async (force = false) => {
  if (isFetched && !force) return

  let list = [...DEFAULT_TESTIMONIALS]

  // 1. Try LocalStorage
  try {
    const cached = localStorage.getItem('srikara_cms_data')
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed.testimonials && parsed.testimonials.length > 0) {
        list = parsed.testimonials
      }
    }
  } catch (e) {
    console.warn('LocalStorage testimonials load failed:', e)
  }

  // 2. Try Firestore
  try {
    if (db) {
      const docSnap = await getDocs(collection(db, 'testimonials'))
      if (!docSnap.empty) {
        const fbList = docSnap.docs.map(d => ({ 
          id: d.id, 
          page: 'General / Home',
          ...d.data() 
        }))
        // Merge Firestore testimonials into list
        fbList.forEach(item => {
          const idx = list.findIndex(x => String(x.id) === String(item.id))
          if (idx > -1) {
            list[idx] = item
          } else {
            list.push(item)
          }
        })
      }
    }
  } catch (err) {
    console.warn('Firestore testimonials load failed:', err)
  }

  cachedTestimonials = list.map(t => ({
    page: 'General / Home',
    ...t
  }))
  isFetched = true
  listeners.forEach(l => l(cachedTestimonials))
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState(cachedTestimonials)
  const [loading, setLoading] = useState(!isFetched)

  useEffect(() => {
    const handleChange = (newList) => {
      setTestimonials(newList)
      setLoading(false)
    }
    listeners.add(handleChange)
    
    // Background load/revalidate
    loadTestimonials(true)

    if (isFetched) {
      setLoading(false)
    }

    return () => {
      listeners.delete(handleChange)
    }
  }, [])

  return { testimonials, loading }
}
