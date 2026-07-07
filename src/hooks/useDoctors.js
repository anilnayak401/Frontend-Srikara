import { useState, useEffect } from 'react'
import { ALL_DOCTORS } from '@/data/doctors'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { assetUrl } from '@/lib/assetUrl'

let cachedDoctorsList = [...ALL_DOCTORS]
let isFetched = false
const listeners = new Set()

const loadDynamicDoctors = async (force = false) => {
  if (isFetched && !force) return

  // Helper to normalize strings for comparison
  const normalizeName = (name) => name ? name.trim().toLowerCase() : ''

  const mapSpecialtyToId = (specialty) => {
    if (!specialty) return 'ortho'
    const clean = specialty.trim().toLowerCase()
    if (clean.includes('ortho')) return 'ortho'
    if (clean.includes('cardio')) return 'cardio'
    if (clean.includes('neuro')) return 'neuro'
    if (clean.includes('nephro')) return 'nephro'
    if (clean.includes('pulmo')) return 'pulmo'
    if (clean.includes('gastro')) return 'gastro'
    if (clean.includes('physician') || clean.includes('general')) return 'physician'
    if (clean.includes('urology')) return 'urology'
    if (clean.includes('gyn') || clean.includes('obstetric')) return 'gyn'
    return clean.slice(0, 5) || 'ortho'
  }

  // Format dynamic doctors consistently with static schema
  // Resolve image paths — full URLs (http, data:, blob:) are kept as-is,
  // relative paths (e.g. 'doctors/akhil-dadi.png') are run through assetUrl
  // so they resolve correctly on every deployment target.
  const resolveImage = (raw) => {
    if (!raw) return assetUrl('doctors/doctor-placeholder.png')
    if (/^(https?:\/\/|data:|blob:)/i.test(raw)) return raw
    return assetUrl(raw.replace(/^\//, ''))
  }

  const formatDoctor = (d) => {
    const rawSpecialty = d.specialty || 'Orthopedics'
    const generatedSlug = d.name
      ? d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : 'unknown-doctor'
    const resolvedBio = d.about || d.bio || ''

    const imgSrc = resolveImage(d.photoUrl || d.image)
    const fbSrc = resolveImage(d.photoUrl || d.image)

    return {
      ...d,
      id: Number(d.id) || d.id,
      slug: d.slug || generatedSlug,
      specialtyId: mapSpecialtyToId(rawSpecialty),
      image: imgSrc,
      fallback: fbSrc,
      label: d.tagline || d.label || rawSpecialty,
      expertise: Array.isArray(d.expertise) ? d.expertise : [rawSpecialty],
      sub: d.sub || '',
      exp: d.exp || '10+ Years',
      branch: d.branch || 'LB Nagar',
      availability: d.availability || 'Mon - Sat: 10:00 AM - 5:00 PM',
      phone: d.phone || '04068324803',
      whatsapp: d.whatsapp || '914068324803',
      about: resolvedBio,
      bio: resolvedBio,
      languages: Array.isArray(d.languages)
        ? d.languages
        : (d.languages ? d.languages.split(',').map(s => s.trim()) : ['English']),
      education: Array.isArray(d.education)
        ? d.education
        : (d.education ? d.education.split(',').map(s => s.trim()) : [])
    }
  }

  // 1. Try to load from Firestore
  try {
    if (db) {
      const docSnap = await getDocs(collection(db, 'doctors'))
      if (!docSnap.empty) {
        const fbDocs = docSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        const formatted = fbDocs.map(formatDoctor)
        
        // Filter out static doctors that are overridden by CMS edited doctors (matched by ID or Name)
        const filteredStatic = ALL_DOCTORS.filter(sd => 
          !formatted.some(fd => String(fd.id) === String(sd.id) || normalizeName(fd.name) === normalizeName(sd.name))
        )
        
        cachedDoctorsList = [...filteredStatic, ...formatted]
        isFetched = true
        listeners.forEach(l => l(cachedDoctorsList))
        return // success
      }
    }
  } catch (err) {
    console.warn('Firestore fetch failed in useDoctors, falling back to local storage:', err)
  }

  // 2. Try to load from LocalStorage cache
  try {
    const cached = localStorage.getItem('srikara_cms_data')
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed.doctors && parsed.doctors.length > 0) {
        const formatted = parsed.doctors.map(formatDoctor)
        
        // Filter out static doctors that are overridden by CMS edited doctors (matched by ID or Name)
        const filteredStatic = ALL_DOCTORS.filter(sd => 
          !formatted.some(fd => String(fd.id) === String(sd.id) || normalizeName(fd.name) === normalizeName(sd.name))
        )
        
        cachedDoctorsList = [...filteredStatic, ...formatted]
        isFetched = true
        listeners.forEach(l => l(cachedDoctorsList))
      }
    }
  } catch (e) {
    console.warn('Error loading dynamic doctors in useDoctors:', e)
  }
}

export function useDoctors() {
  const [doctors, setDoctors] = useState(cachedDoctorsList)
  const [loading, setLoading] = useState(!isFetched)

  useEffect(() => {
    const handleChange = (newList) => {
      setDoctors(newList)
      setLoading(false)
    }
    listeners.add(handleChange)
    
    // Trigger background fetch/revalidation
    loadDynamicDoctors(true)

    // If it was already fetched once, we don't wait for loading state
    if (isFetched) {
      setLoading(false)
    }

    return () => {
      listeners.delete(handleChange)
    }
  }, [])

  return { doctors, loading }
}
