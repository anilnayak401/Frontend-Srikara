import { useState, useEffect } from 'react'
import { branches as staticBranches } from '@/data/branches'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

let cachedBranchesList = [...staticBranches]
let isFetched = false
const listeners = new Set()

const loadDynamicBranches = async (force = false) => {
  if (isFetched && !force) return

  const formatBranch = (b) => {
    return {
      ...b,
      googleRating: Number(b.googleRating) || b.googleRating || 4.5,
      heroStats: Array.isArray(b.heroStats) ? b.heroStats : [
        { value: '100K+', label: 'Families Served' },
        { value: '10+', label: 'Specialties' }
      ],
      specialtiesCards: Array.isArray(b.specialtiesCards) ? b.specialtiesCards : [
        { icon: '👶', title: 'Pediatrics', description: 'Comprehensive child healthcare.' },
        { icon: '🦴', title: 'Orthopaedics', description: 'Joint care and fracture management.' }
      ],
      highlights: Array.isArray(b.highlights) ? b.highlights : [
        'Integrated care for all age groups under one roof'
      ],
      infrastructure: Array.isArray(b.infrastructure) ? b.infrastructure : [
        { title: 'Modern Infrastructure', desc: 'State of the art medical equipment.', gradient: 'from-primary/90' }
      ]
    }
  }

  // 1. Try to load from Firestore site_contents/pages document
  try {
    if (db) {
      const docRef = doc(db, 'site_contents', 'pages')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.branchesList && Array.isArray(data.branchesList) && data.branchesList.length > 0) {
          const formatted = data.branchesList.map(formatBranch)
          cachedBranchesList = formatted
          isFetched = true
          listeners.forEach(l => l(cachedBranchesList))
          return
        }
      }
    }
  } catch (err) {
    console.warn('Firestore branches fetch failed, falling back to cache:', err)
  }

  // 2. Try to load from LocalStorage cache
  try {
    const cached = localStorage.getItem('srikara_branches')
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed && parsed.length > 0) {
        cachedBranchesList = parsed.map(formatBranch)
        isFetched = true
        listeners.forEach(l => l(cachedBranchesList))
        return
      }
    }
  } catch (e) {
    console.warn('Error loading dynamic branches from cache:', e)
  }

  // Use static fallback if nothing loaded
  cachedBranchesList = staticBranches.map(formatBranch)
  isFetched = true
  listeners.forEach(l => l(cachedBranchesList))
}

export function useBranches() {
  const [branches, setBranches] = useState(cachedBranchesList)
  const [loading, setLoading] = useState(!isFetched)

  useEffect(() => {
    const handleChange = (newList) => {
      setBranches(newList)
      setLoading(false)
    }
    listeners.add(handleChange)

    loadDynamicBranches(true)

    if (isFetched) {
      setLoading(false)
    }

    return () => {
      listeners.delete(handleChange)
    }
  }, [])

  const refetch = async () => {
    setLoading(true)
    await loadDynamicBranches(true)
  }

  return { branches, loading, refetch }
}
