import { useState, useEffect } from 'react'
import { ALL_DOCTORS } from '@/data/doctors'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { assetUrl } from '@/lib/assetUrl'
import { DOCTOR_MEDIA } from '@/data/doctorMedia'

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
  // Resolve image paths — full URLs (http, data:, blob:) are kept as-is.
  // Local paths may arrive from Firestore with a stale base-path prefix
  // (e.g. '/sri/doctors/…' saved during a GitHub-Pages session).
  // We strip ALL known prefixes and re-resolve through assetUrl so the
  // path is correct for whatever deployment target is currently active.
  const resolveImage = (raw) => {
    if (!raw) return assetUrl('doctors/doctor-placeholder.png')
    if (/^(https?:\/\/|data:|blob:)/i.test(raw)) return raw
    // Strip any leading slash and any known base-path prefix (e.g. /sri/)
    const cleaned = raw.replace(/^\/?(sri\/)?/, '')
    return cleaned ? assetUrl(cleaned) : assetUrl('doctors/doctor-placeholder.png')
  }

  const formatDoctor = (d) => {
    const rawSpecialty = d.specialty || 'Orthopedics'
    const generatedSlug = d.name
      ? d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : 'unknown-doctor'
    const resolvedBio = d.about || d.bio || ''

    // Try to find the matching static doctor to use its pre-resolved image as fallback
    const staticMatch = ALL_DOCTORS.find(
      sd => String(sd.id) === String(d.id) || normalizeName(sd.name) === normalizeName(d.name)
    )

    const rawImg = d.photoUrl || d.image
    const imgSrc = rawImg ? resolveImage(rawImg) : (staticMatch?.image || assetUrl('doctors/doctor-placeholder.png'))
    const fbSrc = staticMatch?.image || assetUrl('doctors/doctor-placeholder.png')

    const doctorSlug = d.slug || generatedSlug
    const defaultMedia = DOCTOR_MEDIA[doctorSlug] || DOCTOR_MEDIA['default']
    const initialBlogs = d.blogs !== undefined ? d.blogs : (defaultMedia?.blogs || [])

    return {
      ...staticMatch,
      ...d,
      id: Number(d.id) || d.id,
      slug: doctorSlug,
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
        : (d.education ? d.education.split(',').map(s => s.trim()) : []),
      blogs: initialBlogs
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
        
        cachedDoctorsList = [...filteredStatic, ...formatted].filter(d => d.status !== 'Deleted' && d.status !== 'Inactive')
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
        
        cachedDoctorsList = [...filteredStatic, ...formatted].filter(d => d.status !== 'Deleted' && d.status !== 'Inactive')
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
