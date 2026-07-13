import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

const DEFAULT_TESTIMONIALS = [
  { 
    id: '1', 
    patientName: 'Lakshmi Devi', 
    rating: 5, 
    review: 'Fantastic robotic surgery care at Srikara Hospital. I walked within 3 days without pain!', 
    videoUrl: 'https://www.youtube.com/embed/ho9JlBnrGWg',
    page: 'General / Home' 
  },
  {
    id: '2',
    patientName: 'Srinivas Rao',
    rating: 5,
    review: 'Highly satisfied with the cardiology treatment at Srikara ECIL branch. The doctors and staff were very professional.',
    videoUrl: 'https://www.youtube.com/embed/ox2rT1KRkFI',
    page: 'ECIL'
  },
  {
    id: '3',
    patientName: 'Radhika Reddy',
    rating: 5,
    review: 'Excellent joint replacement care at Miyapur branch. The robotic technique made recovery very quick.',
    videoUrl: 'https://www.youtube.com/embed/ho9JlBnrGWg',
    page: 'Miyapur'
  }
]

let cachedTestimonials = [...DEFAULT_TESTIMONIALS]
let isFetched = false
const listeners = new Set()

const loadTestimonials = async (force = false) => {
  if (isFetched && !force) return

  let list = [...DEFAULT_TESTIMONIALS]
  let loadedFromStore = false

  // 1. Try LocalStorage
  try {
    const cached = localStorage.getItem('srikara_cms_data')
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed.testimonials !== undefined) {
        list = parsed.testimonials
        loadedFromStore = true
      }
    }
  } catch (e) {
    console.warn('LocalStorage testimonials load failed:', e)
  }

  // 2. Try Firestore
  try {
    if (db) {
      const docSnap = await getDocs(collection(db, 'testimonials'))
      const fbList = docSnap.docs.map(d => ({ 
        id: d.id, 
        ...d.data() 
      }))
      
      if (fbList.length > 0) {
        list = fbList
      } else if (loadedFromStore) {
        list = fbList
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
