import { Helmet } from 'react-helmet-async'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Search, Star, ChevronLeft, ChevronRight, Sparkles, Award, Clock, 
  Calendar, MapPin, ArrowUpRight, Info, Instagram, Facebook, MessageCircle, Phone, User 
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { StickyNavbar } from '@/components/layout/StickyNavbar'
import { BranchSideNav } from '@/components/layout/BranchSideNav'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { ALL_DOCTORS, getSpecialties, ACCENT_MAP } from '@/data/doctors'

// Custom Tilt Hover Effect Hook for a premium feel
function useTiltEffect(ref, active = true) {
  useEffect(() => {
    if (!active || !ref.current) return
    const el = ref.current

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const xc = rect.width / 2
      const yc = rect.height / 2
      const angleX = (yc - y) / 15
      const angleY = (x - xc) / 15
      el.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, active])
}

// ─────────────────────────────────────────────────────────────
// EDITORIAL DOCTOR CARD (Uses strictly logo themed colors)
// ─────────────────────────────────────────────────────────────
function DoctorCard({ doctor, onView, onBook }) {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  
  useTiltEffect(cardRef, true)

  const handleProfile = (e) => {
    e.stopPropagation()
    onView(doctor)
  }

  const handleBook = (e) => {
    e.stopPropagation()
    onBook(doctor)
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleProfile}
      className="group relative bg-white rounded-[32px] p-3 shadow-md border border-slate-100 flex flex-col justify-start cursor-pointer hover:border-slate-200 transition-all duration-500 ease-out h-[460px] overflow-hidden hover:shadow-[0_20px_45px_rgba(139,26,74,0.12)] hover:-translate-y-1.5"
    >
      {/* 1. PORTRAIT PHOTO CONTAINER WITH INTERACTIVE FADED BURGUNDY BACKGROUND (TALLER SIZE) */}
      <div 
        ref={cardRef}
        className="relative w-full h-[340px] rounded-[24px] overflow-hidden transition-all duration-500 bg-[#E8EDF2] group-hover:bg-gradient-to-b group-hover:from-[#F5E8EF] group-hover:to-[#E8B4C8] flex items-end justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img 
          src={doctor.image} 
          alt={doctor.name}
          className="w-auto max-w-[95%] h-[88%] object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-105"
          onError={e => { if (doctor.fallback) e.target.src = doctor.fallback }} 
        />
        
        {/* Subtle pink/burgundy brand overlay on hover */}
        <div className="absolute inset-0 bg-[#8B1A4A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* 2. DYNAMIC SLIDING DETAILS CONTAINER (ALWAYS CENTERED WHITE FLOATING CARD OVERLAPPING THE PHOTO) */}
      <div 
        className="absolute left-6 right-6 transition-all duration-500 ease-out flex flex-col justify-between z-10
          bottom-6 bg-white shadow-[0_8px_30px_rgba(45,58,74,0.08)] border border-slate-100/80 rounded-[24px] p-4 text-center items-center
          group-hover:bottom-8 group-hover:shadow-[0_15px_35px_rgba(139,26,74,0.15)] group-hover:border-slate-200/50"
      >
        <div className="w-full flex flex-col items-center">
          {/* Doctor Name */}
          <h3 
            className="font-display font-extrabold text-[#2D3A4A] leading-snug transition-all duration-500 mb-1 text-center
              text-base group-hover:text-lg group-hover:text-[#2D3A4A]"
          >
            {doctor.name}
          </h3>
          
          {/* Specialty/Label */}
          <p 
            className="font-semibold transition-all duration-500 line-clamp-1 text-center
              text-[11px] text-slate-500 mb-4
              group-hover:text-xs group-hover:text-[#8B1A4A]"
          >
            {doctor.specialty}
          </p>
        </div>

        {/* Action Buttons Row: Profile & Book (Centered) */}
        <div 
          className="flex items-center gap-2 w-full transition-all duration-500 justify-center"
        >
          {/* Profile Button */}
          <button
            onClick={handleProfile}
            title="View Full Profile"
            className="flex-grow py-2 px-3 bg-[#2D3A4A] hover:bg-[#8B1A4A] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1 shadow-sm hover:scale-[1.03] active:scale-95"
          >
            <User size={13} /> Profile
          </button>

          {/* Book Button */}
          <button
            onClick={handleBook}
            title="Book Consultation"
            className="flex-grow py-2 px-3 bg-[#8B1A4A] hover:bg-[#72113A] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1 shadow-md hover:scale-[1.03] active:scale-95"
          >
            <Calendar size={13} /> Book
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// VOLUMETRIC 3D REAL-TIME ANATOMICAL KNEE RENDERER (Canvas 3D Engine)
// Enhanced: Smooth continuous rotation, specular highlights, rim lighting,
// ambient occlusion, and glow effects — zero visual resets
// ─────────────────────────────────────────────────────────────
function VolumetricKnee3D({ className }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  // Use refs for mouse state to avoid re-triggering useEffect and resetting animation
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    // Use performance.now() for a stable, monotonic time base that never resets
    const baseTime = performance.now()

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas._dpr = dpr
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    const render = () => {
      const time = performance.now() - baseTime
      const dpr = canvas._dpr || 2
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      // Smooth mouse interpolation (lerp) for fluid interactive response
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.06
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.06
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      ctx.save()
      ctx.scale(dpr, dpr)
      
      // Continuous 360-degree automatic rotation — never resets
      const rotY = (time * 0.00035) + (mx * 0.008)
      const rotX = -0.15 + (my * 0.004)
      
      // Continuous flexion/extension angle
      const jointAngle = Math.sin(time * 0.0006) * 0.20 - 0.08

      // Light direction for enhanced shading (rotates slowly with time for dynamic highlights)
      const lightAngle = time * 0.0002
      const lightDir = { x: Math.cos(lightAngle) * 0.5, y: -0.7, z: Math.sin(lightAngle) * 0.5 + 0.5 }
      const lightLen = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z)
      lightDir.x /= lightLen; lightDir.y /= lightLen; lightDir.z /= lightLen
      
      // cx shifted slightly right (+25) to align perfectly behind the spotlight whitespace
      const cx = w / 2 + 25
      const cy = h / 2 - 15
      const zoom = Math.min(w, h) / 400
      const dist = 650
      
      // Perspective projection and articulation transform
      const projectPoint = (x, y, z, isThigh) => {
        let px = x
        let py = y
        let pz = z
        
        if (isThigh) {
          const cosJ = Math.cos(jointAngle)
          const sinJ = Math.sin(jointAngle)
          const yNew = py * cosJ - pz * sinJ
          const zNew = py * sinJ + pz * cosJ
          py = yNew
          pz = zNew
        }
        
        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const xRot = px * cosY - pz * sinY
        let zRot = px * sinY + pz * cosY
        
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)
        const yRot = py * cosX - zRot * sinX
        const zRotFinal = py * sinX + zRot * cosX
        
        const scale = dist / (dist - zRotFinal)
        const sx = cx + xRot * scale * zoom
        const sy = cy + yRot * scale * zoom
        
        return {
          sx,
          sy,
          sz: zRotFinal,
          scale: scale * zoom,
          // Return world-space normals for lighting calculations
          nx: xRot / (Math.abs(xRot) + Math.abs(yRot) + Math.abs(zRotFinal) + 0.001),
          ny: yRot / (Math.abs(xRot) + Math.abs(yRot) + Math.abs(zRotFinal) + 0.001),
          nz: zRotFinal / (Math.abs(xRot) + Math.abs(yRot) + Math.abs(zRotFinal) + 0.001)
        }
      }

      // Enhanced Shaded 3D Sphere with specular highlight, rim lighting, and ambient occlusion
      const drawSphere = (sx, sy, sr, colorType, alpha = 1, depth = 0) => {
        if (sr < 0.5 || alpha < 0.01) return
        ctx.save()

        // Depth-based ambient occlusion factor (further = slightly darker)
        const depthNorm = (depth + 100) / 200
        const aoFactor = 0.85 + 0.15 * Math.max(0, Math.min(1, 1 - depthNorm * 0.3))
        
        // Main body gradient with enhanced color depth
        const grad = ctx.createRadialGradient(
          sx - sr * 0.32, sy - sr * 0.32, sr * 0.02,
          sx, sy, sr
        )
        
        if (colorType === 'bone') {
          grad.addColorStop(0, `rgba(255, 255, 255, ${0.97 * alpha * aoFactor})`)
          grad.addColorStop(0.2, `rgba(240, 244, 248, ${0.92 * alpha * aoFactor})`)
          grad.addColorStop(0.5, `rgba(210, 220, 232, ${0.88 * alpha * aoFactor})`)
          grad.addColorStop(0.78, `rgba(148, 163, 184, ${0.82 * alpha * aoFactor})`)
          grad.addColorStop(1, `rgba(60, 75, 95, ${0.85 * alpha * aoFactor})`)
        } else if (colorType === 'muscle') {
          grad.addColorStop(0, `rgba(255, 160, 178, ${0.90 * alpha * aoFactor})`)
          grad.addColorStop(0.18, `rgba(240, 110, 148, ${0.85 * alpha * aoFactor})`)
          grad.addColorStop(0.45, `rgba(200, 60, 115, ${0.82 * alpha * aoFactor})`)
          grad.addColorStop(0.75, `rgba(139, 26, 74, ${0.78 * alpha * aoFactor})`)
          grad.addColorStop(1, `rgba(40, 2, 16, ${0.80 * alpha * aoFactor})`)
        } else if (colorType === 'muscleDeep') {
          grad.addColorStop(0, `rgba(230, 90, 145, ${0.60 * alpha * aoFactor})`)
          grad.addColorStop(0.35, `rgba(170, 45, 95, ${0.65 * alpha * aoFactor})`)
          grad.addColorStop(0.7, `rgba(92, 13, 48, ${0.68 * alpha * aoFactor})`)
          grad.addColorStop(1, `rgba(25, 1, 10, ${0.65 * alpha * aoFactor})`)
        } else if (colorType === 'tendon') {
          grad.addColorStop(0, `rgba(255, 255, 255, ${0.97 * alpha * aoFactor})`)
          grad.addColorStop(0.25, `rgba(220, 235, 255, ${0.90 * alpha * aoFactor})`)
          grad.addColorStop(0.6, `rgba(160, 200, 255, ${0.85 * alpha * aoFactor})`)
          grad.addColorStop(1, `rgba(29, 78, 216, ${0.82 * alpha * aoFactor})`)
        } else if (colorType === 'cartilage') {
          grad.addColorStop(0, `rgba(230, 252, 255, ${0.90 * alpha * aoFactor})`)
          grad.addColorStop(0.3, `rgba(160, 240, 248, ${0.85 * alpha * aoFactor})`)
          grad.addColorStop(0.65, `rgba(34, 211, 238, ${0.78 * alpha * aoFactor})`)
          grad.addColorStop(1, `rgba(6, 120, 155, ${0.80 * alpha * aoFactor})`)
        }
        
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(sx, sy, sr, 0, Math.PI * 2)
        ctx.fill()

        // Specular highlight (small bright dot offset from center)
        if (sr > 3) {
          const specGrad = ctx.createRadialGradient(
            sx - sr * 0.28, sy - sr * 0.28, 0,
            sx - sr * 0.28, sy - sr * 0.28, sr * 0.45
          )
          specGrad.addColorStop(0, `rgba(255, 255, 255, ${0.45 * alpha})`)
          specGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.12 * alpha})`)
          specGrad.addColorStop(1, `rgba(255, 255, 255, 0)`)
          ctx.fillStyle = specGrad
          ctx.beginPath()
          ctx.arc(sx, sy, sr, 0, Math.PI * 2)
          ctx.fill()
        }

        // Rim lighting (subtle bright edge on the opposite side of the light)
        if (sr > 4) {
          const rimGrad = ctx.createRadialGradient(
            sx + sr * 0.35, sy + sr * 0.35, sr * 0.6,
            sx + sr * 0.35, sy + sr * 0.35, sr * 1.05
          )
          let rimColor = '200, 220, 240'
          if (colorType === 'muscle' || colorType === 'muscleDeep') rimColor = '255, 140, 180'
          else if (colorType === 'cartilage') rimColor = '100, 230, 245'
          else if (colorType === 'tendon') rimColor = '180, 210, 255'
          rimGrad.addColorStop(0, `rgba(${rimColor}, 0)`)
          rimGrad.addColorStop(0.7, `rgba(${rimColor}, ${0.10 * alpha})`)
          rimGrad.addColorStop(1, `rgba(${rimColor}, ${0.22 * alpha})`)
          ctx.fillStyle = rimGrad
          ctx.beginPath()
          ctx.arc(sx, sy, sr, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      const elements = []

      // 1. FEMUR (Thigh bone) - High Density (60 slices) to eliminate sphere gaps
      const numFemurSlices = 60
      for (let i = 0; i <= numFemurSlices; i++) {
        const t = i / numFemurSlices
        const y = -120 + t * 108 // runs perfectly down to y = -12
        const rad = 11 + t * 3.5
        elements.push({
          type: 'slice', x: 0, y, z: 0, r: rad, colorType: 'bone', isThigh: true
        })
      }
      // Femur Condyles centered perfectly at the bottom with zero gap
      elements.push({ type: 'sphere', x: -11, y: -12, z: -2, r: 13, colorType: 'bone', isThigh: true })
      elements.push({ type: 'sphere', x: 11, y: -12, z: -2, r: 13, colorType: 'bone', isThigh: true })

      // 2. TIBIA (Shin bone) - High Density (65 slices)
      const numTibiaSlices = 65
      for (let i = 0; i <= numTibiaSlices; i++) {
        const t = i / numTibiaSlices
        const y = 12 + t * 118 // runs perfectly from y = 12 to 130
        const rad = 14 - t * 3.5
        elements.push({
          type: 'slice', x: 0, y, z: 0, r: rad, colorType: 'bone', isThigh: false
        })
      }
      // Tibia plateau spheres centered perfectly at the top of tibia shaft
      elements.push({ type: 'sphere', x: -11, y: 12, z: 0, r: 13, colorType: 'bone', isThigh: false })
      elements.push({ type: 'sphere', x: 11, y: 12, z: 0, r: 13, colorType: 'bone', isThigh: false })

      // 3. FIBULA (Thin Lateral Bone) - 45 slices
      const numFibulaSlices = 45
      for (let i = 0; i <= numFibulaSlices; i++) {
        const t = i / numFibulaSlices
        const y = 22 + t * 108
        elements.push({
          type: 'slice', x: -20, y, z: -6, r: 4.8, colorType: 'bone', isThigh: false
        })
      }
      elements.push({ type: 'sphere', x: -20, y: 22, z: -6, r: 6.2, colorType: 'bone', isThigh: false })

      // 4. PATELLA (Kneecap) - 15 slices for seamless dome
      const numPatellaSlices = 15
      for (let i = 0; i <= numPatellaSlices; i++) {
        const t = i / numPatellaSlices
        const y = -12 + t * 16 // runs from y = -12 to y = 4
        const factor = Math.sin(t * Math.PI)
        const rad = 4.5 + factor * 7
        elements.push({
          type: 'slice', x: 0, y, z: 17, r: rad, colorType: 'bone', isThigh: true
        })
      }

      // 5. MENISCUS CARTILAGE crescent cushions centered in joint space
      const numMeniscusSlices = 15
      for (let i = 0; i < numMeniscusSlices; i++) {
        const angle = -Math.PI / 2 + (i / (numMeniscusSlices - 1)) * Math.PI
        const smx = -12 + Math.cos(angle) * 9
        const mz = Math.sin(angle) * 9
        elements.push({
          type: 'sphere', x: smx, y: 6, z: mz, r: 3.5, colorType: 'cartilage', isThigh: false
        })
      }
      for (let i = 0; i < numMeniscusSlices; i++) {
        const angle = -Math.PI / 2 + (i / (numMeniscusSlices - 1)) * Math.PI
        const smx = 12 - Math.cos(angle) * 9
        const mz = Math.sin(angle) * 9
        elements.push({
          type: 'sphere', x: smx, y: 6, z: mz, r: 3.5, colorType: 'cartilage', isThigh: false
        })
      }

      // 6. ACL & PCL (Cruciate Ligaments) - 20 spheres
      for (let i = 0; i <= 20; i++) {
        const t = i / 20
        elements.push({
          type: 'sphere', x: -5 + t * 10, y: -6 + t * 18, z: -2 + t * 6, r: 2.8, colorType: 'tendon', isThigh: true
        })
      }
      for (let i = 0; i <= 20; i++) {
        const t = i / 20
        elements.push({
          type: 'sphere', x: 5 - t * 10, y: -6 + t * 18, z: -2 + t * 6, r: 2.8, colorType: 'tendon', isThigh: true
        })
      }

      // 7. LCL & MCL (Collateral Ligaments) - 25 spheres
      for (let i = 0; i <= 25; i++) {
        const t = i / 25
        elements.push({
          type: 'sphere', x: -15 - t * 5, y: -12 + t * 37, z: 0 - t * 6, r: 2.2, colorType: 'tendon', isThigh: false
        })
      }
      for (let i = 0; i <= 25; i++) {
        const t = i / 25
        elements.push({
          type: 'sphere', x: 15 - t * 1, y: -12 + t * 37, z: 0, r: 2.6, colorType: 'tendon', isThigh: false
        })
      }

      // 8. QUADRICEPS MUSCLE GROUP - High Density (60 slices)
      const numQuadSlices = 60
      for (let i = 0; i <= numQuadSlices; i++) {
        const t = i / numQuadSlices
        const y = -120 + t * 85
        const factor = Math.sin(t * Math.PI)
        const rad = 17 + factor * 9
        
        elements.push({
          type: 'slice', x: -9 * (1 - t), y, z: 4, r: rad * 0.9, colorType: 'muscle', isThigh: true
        })
        elements.push({
          type: 'slice', x: 9 * (1 - t), y, z: 4, r: rad * 0.9, colorType: 'muscle', isThigh: true
        })
        elements.push({
          type: 'slice', x: 0, y, z: 6, r: rad * 0.8, colorType: 'muscle', isThigh: true
        })
      }

      // 9. GASTROCNEMIUS (posterior calf muscle) - 50 slices
      const numCalfSlices = 50
      for (let i = 0; i <= numCalfSlices; i++) {
        const t = i / numCalfSlices
        const y = 12 + t * 83
        const factor = Math.sin(t * Math.PI)
        const rad = 11 + factor * 8.5
        elements.push({
          type: 'slice', x: 11 * (1 - t * 0.6), y, z: -14, r: rad, colorType: 'muscleDeep', isThigh: false
        })
        elements.push({
          type: 'slice', x: -11 * (1 - t * 0.6), y, z: -14, r: rad * 0.9, colorType: 'muscleDeep', isThigh: false
        })
      }

      // 10. TIBIALIS ANTERIOR (shin muscle) - 45 slices
      const numShinSlices = 45
      for (let i = 0; i <= numShinSlices; i++) {
        const t = i / numShinSlices
        const y = 20 + t * 90
        const rad = 12 * (1 - t * 0.7)
        elements.push({
          type: 'slice', x: -12 * (1 - t * 0.5), y, z: 7, r: rad, colorType: 'muscle', isThigh: false
        })
      }

      // 11. QUADRICEPS TENDON - 25 slices
      const numTendonSlices = 25
      for (let i = 0; i <= numTendonSlices; i++) {
        const t = i / numTendonSlices
        const y = -40 + t * 25 // runs from -40 to -15
        elements.push({
          type: 'slice', x: 0, y, z: 15 + t * 2, r: 8 - t * 1, colorType: 'tendon', isThigh: true
        })
      }

      // 12. PATELLAR LIGAMENT (stretching from moving patella bottom to static tibia tuberosity) - 25 slices
      const numLigSlices = 25
      for (let i = 0; i <= numLigSlices; i++) {
        const t = i / numLigSlices
        const py_pat = 4 * Math.cos(jointAngle) - 17 * Math.sin(jointAngle)
        const pz_pat = 4 * Math.sin(jointAngle) + 17 * Math.cos(jointAngle)
        const lx = 0
        const ly = py_pat + t * (24 - py_pat)
        const lz = pz_pat + t * (8 - pz_pat)
        
        elements.push({
          type: 'slice', x: lx, y: ly, z: lz, r: 6.5, colorType: 'tendon', isThigh: false, manualRotated: true
        })
      }

      // Project elements
      const projected = elements.map(el => {
        let p
        if (el.manualRotated) {
          const cosY = Math.cos(rotY)
          const sinY = Math.sin(rotY)
          const xRot = el.x * cosY - el.z * sinY
          let zRot = el.x * sinY + el.z * cosY
          
          const cosX = Math.cos(rotX)
          const sinX = Math.sin(rotX)
          const yRot = el.y * cosX - zRot * sinX
          const zRotFinal = el.y * sinX + zRot * cosX
          
          const scale = dist / (dist - zRotFinal)
          p = {
            sx: cx + xRot * scale * zoom,
            sy: cy + yRot * scale * zoom,
            sz: zRotFinal,
            scale: scale * zoom
          }
        } else {
          p = projectPoint(el.x, el.y, el.z, el.isThigh)
        }
        
        // Soft vignette fade-out for top/bottom margins of the 3D model
        let alpha = 1
        if (el.manualRotated) {
          // Ligament centered at joint doesn't need vertical fade
        } else {
          if (el.isThigh && el.y < -75) {
            alpha = Math.max(0, 1 - (Math.abs(el.y) - 75) / 45)
          } else if (!el.isThigh && el.y > 75) {
            alpha = Math.max(0, 1 - (el.y - 75) / 50)
          }
        }
        
        return {
          type: el.type,
          sx: p.sx,
          sy: p.sy,
          sz: p.sz,
          sr: el.r * p.scale,
          colorType: el.colorType,
          alpha
        }
      })

      // Painter's Algorithm: Sort by depth sz
      projected.sort((a, b) => a.sz - b.sz)

      // Rasterize sorted elements with enhanced rendering
      projected.forEach(el => {
        drawSphere(el.sx, el.sy, el.sr, el.colorType, el.alpha, el.sz)
      })

      // Subtle ambient glow around the entire model center for premium depth feel
      const glowGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 180 * zoom)
      glowGrad.addColorStop(0, `rgba(139, 26, 74, 0.04)`)
      glowGrad.addColorStop(0.5, `rgba(29, 78, 216, 0.02)`)
      glowGrad.addColorStop(1, `rgba(0, 0, 0, 0)`)
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(cx, cy, 180 * zoom, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
      animationId = requestAnimationFrame(render)
    }

    animationId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  // Empty dependency array: animation loop runs once and never resets
  }, [])

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 200
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 200
    targetMouseRef.current = { x, y }
  }

  const handleMouseLeave = () => {
    isHoveredRef.current = false
    targetMouseRef.current = { x: 0, y: 0 }
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { isHoveredRef.current = true }}
      onMouseLeave={handleMouseLeave}
      className={className || "absolute -right-[12%] sm:-right-[5%] lg:right-[0%] top-[10%] w-[580px] sm:w-[700px] lg:w-[880px] h-[580px] sm:h-[700px] lg:h-[880px] z-0 select-none cursor-grab active:cursor-grabbing"}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-[0.38] transition-opacity duration-500 hover:opacity-[0.48]" 
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────

// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────
export function DoctorsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialSpecialty = searchParams.get('specialty') || 'all'
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState(initialSpecialty)
  const [activeBranch, setActiveBranch] = useState('all')
  const tabsRef = useRef(null)
  const branchTabsRef = useRef(null)

  // Sync if query param changes
  useEffect(() => {
    const specialty = searchParams.get('specialty')
    if (specialty) {
      setActiveFilter(specialty)
    }
  }, [searchParams])



  const branches = ['all', ...new Set(ALL_DOCTORS.map(d => d.branch))]
  const specialties = getSpecialties(activeBranch === 'all' ? null : activeBranch)

  const filtered = ALL_DOCTORS.filter(doc => {
    const matchSearch = search === '' ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.label.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'all' || doc.specialtyId === activeFilter
    const matchBranch = activeBranch === 'all' || doc.branch === activeBranch
    return matchSearch && matchFilter && matchBranch
  })

  // Remove duplicates for the 'All' view to avoid showing the same doctor multiple times
  const displayDoctors = activeBranch === 'all'
    ? filtered.filter((doc, index, self) => index === self.findIndex(t => t.slug === doc.slug))
    : filtered

  // Find the Chairman's profile (Dr. Akhil Dadi)
  const chairman = ALL_DOCTORS.find(d => d.id === 203) || ALL_DOCTORS.find(d => d.name.includes("Akhil Dadi"))

  const scrollTabs = (dir) => {
    if (tabsRef.current) tabsRef.current.scrollLeft += dir * 180
  }

  const scrollBranchTabs = (dir) => {
    if (branchTabsRef.current) branchTabsRef.current.scrollLeft += dir * 180
  }

  return (
    <>
      <Helmet><title>Meet Our World-Class Medical Team | Srikara Hospitals</title></Helmet>
      
      <div className="min-h-screen bg-[#FAFCFF] font-body text-slate-800 antialiased selection:bg-[#8B1A4A] selection:text-white">
        <StickyNavbar currentBranch={{ branchLogo: 'https://i.ibb.co/CK9bqmXK/sri-logo.jpg' }} />
        <BranchSideNav currentSlug={null} />

        <div className="xl:pl-16">
          
          {/* ── 1. CINEMATIC HERO SECTION ── */}
          <section className="relative pt-32 pb-24 px-8 overflow-hidden bg-[#0A1628] text-white">
            {/* Ambient luxury light effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#8B1A4A]/25 via-transparent to-transparent rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2D3A4A]/20 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-2 bg-[#8B1A4A]/10 border border-[#8B1A4A]/30 text-[#E8B4C8] text-[10px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-full mb-8"
              >
                <Sparkles size={12} className="animate-pulse" />
                Srikara Centers of Excellence
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-tight max-w-4xl mb-6 text-white"
              >
                Where Healing Meets <span className="hero-gradient-text">Precision</span> and Robotic Innovation
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light"
              >
                Consult with our board-certified specialists and medical leaders pushing the boundaries of technology to restore your active lifestyle.
              </motion.p>
            </div>
          </section>

          {/* ── 2. CHAIRMAN SPOTLIGHT (100% Flat Minimalist Fluid Showcase) ── */}
          {chairman && (
            <section 
              className="relative w-full overflow-hidden text-slate-800 border-b border-slate-100 py-16 lg:py-24 bg-white"
            >
              {/* Giant Organic Wave Backdrops (matches the soft framing wave of the second image) */}
              <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-[45%_55%_30%_70%_/_50%_60%_40%_50%] bg-[#F0F7FF] opacity-90 blur-2xl pointer-events-none z-0" />
              {/* Actual 3D Real-Time Rotating Volumetric Knee Musculoskeletal Model Render */}
              <VolumetricKnee3D />


              <div className="max-w-7xl mx-auto relative z-10 w-full px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Fluid Organic Portrait (kept on the left, enlarged, interactive motion) */}
                  <motion.div 
                    whileHover="hover"
                    className="col-span-1 lg:col-span-7 flex items-center justify-center relative select-none"
                  >
                    
                    {/* Layered Organic Backdrop (exactly matching the sky-blue & navy layered circles of the second image, enlarged & interactive) */}
                    <div className="relative w-full max-w-[500px] aspect-[4/5] sm:aspect-[3/4] flex items-end justify-center z-10">
                      
                      {/* Sky Blue Main Blob Backdrop with Infinite Morphing Liquification */}
                      <motion.div 
                        animate={{
                          borderRadius: [
                            "42% 58% 70% 30% / 45% 45% 55% 55%",
                            "70% 30% 52% 48% / 60% 40% 60% 40%",
                            "50% 50% 30% 70% / 50% 60% 40% 50%",
                            "42% 58% 70% 30% / 45% 45% 55% 55%"
                          ],
                          rotate: [0, 90, 180, 360]
                        }}
                        variants={{
                          hover: { scale: 1.06, backgroundColor: "#D0E7FF" }
                        }}
                        transition={{
                          borderRadius: { duration: 15, repeat: Infinity, ease: "easeInOut" },
                          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                          scale: { duration: 0.5, ease: "easeOut" }
                        }}
                        className="absolute inset-0 bg-[#E0F2FE]/75 pointer-events-none z-0 shadow-inner"
                      />
                      
                      {/* Deep Navy/Burgundy Accent Ring/Blob behind it with infinite floating */}
                      <motion.div 
                        animate={{
                          y: [0, -12, 12, 0],
                          x: [0, 8, -8, 0],
                          rotate: [0, -45, 45, 0]
                        }}
                        transition={{
                          duration: 14,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -right-6 top-8 w-72 h-72 rounded-[50%_50%_30%_70%_/_50%_60%_40%_50%] bg-[#2D3A4A]/5 border-2 border-dashed border-[#2D3A4A]/10 pointer-events-none z-0"
                      />
                      
                      {/* Soft Pink Floating Accent Blob */}
                      <motion.div 
                        animate={{
                          y: [0, 15, -15, 0],
                          x: [0, -10, 10, 0]
                        }}
                        transition={{
                          duration: 18,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -left-6 bottom-6 w-56 h-56 rounded-full bg-[#8B1A4A]/5 pointer-events-none z-0" 
                      />

                      {/* Clean Doctor Portrait overlaying the organic shapes (Enlarged & Slides up/glows on hover) */}
                      <motion.img 
                        src={chairman.image}
                        alt={chairman.name}
                        variants={{
                          hover: { 
                            scale: 1.03, 
                            y: -8, 
                            filter: "drop-shadow(0 25px 45px rgba(139,26,74,0.18))" 
                          }
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative z-10 h-[96%] w-auto object-contain object-bottom filter drop-shadow-[0_15px_35px_rgba(45,58,74,0.14)] pointer-events-none"
                      />

                      {/* Status Tag Removed at User Request */}
                    </div>

                  </motion.div>

                  {/* Right Column: Clean Premium Editorial Biography overlapping the Left Column (Animated entrance) */}
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.12
                        }
                      }
                    }}
                    className="col-span-1 lg:col-span-5 flex flex-col items-start text-left gap-6 lg:-ml-28 xl:-ml-36 z-20 relative pointer-events-auto"
                  >
                    
                    {/* Small Subtitle Category Label */}
                    <motion.span 
                      variants={{
                        hidden: { opacity: 0, x: 30 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
                      }}
                      className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8B1A4A]"
                    >
                      Founding Chairman & Chief Joint Surgeon
                    </motion.span>

                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, x: 30 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
                      }}
                      className="flex flex-col gap-2"
                    >
                      <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-[#2D3A4A] tracking-tight uppercase leading-none">
                        {chairman.name}
                      </h2>
                      <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                        MBBS, MS (Orthopedics) • Spine & Joint Replacement Fellowship (Germany)
                      </span>
                    </motion.div>

                    <motion.blockquote 
                      variants={{
                        hidden: { opacity: 0, x: 30 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
                      }}
                      className="text-sm lg:text-base font-display font-medium text-slate-700 leading-relaxed italic pl-4 border-l-2 border-[#8B1A4A]"
                    >
                      "Precision is not an option; it's the foundation of a successful recovery and a lifetime of movement."
                    </motion.blockquote>

                    <motion.p 
                      variants={{
                        hidden: { opacity: 0, x: 30 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
                      }}
                      className="text-slate-600 text-xs lg:text-sm leading-relaxed font-medium"
                    >
                      Dr. Akhil Dadi pioneered robotic joint replacement in South India by installing the revolutionary NAVIO robotic suite. With over 30,000 completed surgeries and 15+ years of leadership, his commitment to surgical excellence has set standard recovery benchmarks nationally.
                    </motion.p>

                    {/* Flat, Clean CTAs */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, x: 30 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
                      }}
                      className="flex items-center gap-4 w-full pt-2"
                    >
                      <motion.button 
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/book/${chairman.slug}`)}
                        className="px-6 py-3.5 bg-[#8B1A4A] hover:bg-[#72113A] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
                      >
                        Book Consultation <ArrowUpRight size={14} />
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/doctors/${chairman.slug}`)}
                        className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                      >
                        View Biography
                      </motion.button>
                    </motion.div>

                  </motion.div>

                </div>
              </div>

            </section>
          )}



          {/* ── 2.5 SEARCH & FILTER SECTION (BELOW CHAIRMAN SPOTLIGHT) ── */}
          <section className="relative py-12 px-8 bg-white border-b border-slate-100 overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
              {/* Cinematic Search */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full max-w-xl relative shadow-md rounded-2xl overflow-hidden border border-slate-200 mb-8 bg-white"
              >
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search specialists by name, specialty, or condition..."
                  className="w-full pl-12 pr-6 py-4 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8B1A4A]/10 focus:border-[#8B1A4A] transition-all duration-300 text-sm"
                />
              </motion.div>

              {/* ── VERTICALLY STACKED FILTER SYSTEM (BELOW THE SEARCH BAR) ── */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full flex flex-col gap-6 items-center z-20"
              >
                {/* 1. Branches Row (Uses logo themed Slate #2D3A4A) */}
                <div className="flex flex-col gap-2.5 w-full items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#2D3A4A] shrink-0">Filter Branch</span>
                  <div className="flex items-center gap-2 w-full">
                    <button 
                      onClick={() => scrollBranchTabs(-1)} 
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    
                    <div 
                      ref={branchTabsRef} 
                      className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-1"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {branches.map(b => (
                        <button 
                          key={b} 
                          onClick={() => { setActiveBranch(b); setActiveFilter('all') }}
                          className={`relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border hover:-translate-y-0.5 active:scale-95 ${
                            activeBranch === b 
                              ? 'text-white border-[#2D3A4A] bg-[#2D3A4A] shadow-sm hover:shadow-md' 
                              : 'text-slate-700 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {b === 'all' ? 'All Locations' : b}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => scrollBranchTabs(1)} 
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* 2. Specialties Row (Uses logo themed Burgundy #8B1A4A) */}
                <div className="flex flex-col gap-2.5 w-full items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8B1A4A] shrink-0">Filter Specialty</span>
                  <div className="flex items-center gap-2 w-full">
                    <button 
                      onClick={() => scrollTabs(-1)} 
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    
                    <div 
                      ref={tabsRef} 
                      className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-1"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      <button 
                        onClick={() => setActiveFilter('all')}
                        className={`relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border hover:-translate-y-0.5 active:scale-95 ${
                          activeFilter === 'all' 
                            ? 'text-white border-[#8B1A4A] bg-[#8B1A4A] shadow-sm hover:shadow-md' 
                            : 'text-slate-700 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        All Specialties
                      </button>

                      {specialties.map(s => (
                        <button 
                          key={s.id} 
                          onClick={() => setActiveFilter(s.id)}
                          className={`relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border hover:-translate-y-0.5 active:scale-95 ${
                            activeFilter === s.id 
                              ? 'text-white border-[#8B1A4A] bg-[#8B1A4A] shadow-sm hover:shadow-md' 
                              : 'text-slate-700 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => scrollTabs(1)} 
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* ── 3. DOCTORS GRID (Filter strip is now placed below Chairman) ── */}
          <section className="py-20 px-8 bg-[#F8FAFC]">

            <div className="max-w-7xl mx-auto">
              {/* Sleek mockup-styled header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-100 pb-8">
                <div className="flex flex-col items-start max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B1A4A]/80 mb-2 block">
                    Doctors
                  </span>
                  <h2 className="editorial-title text-3xl md:text-[44px] font-black tracking-tight leading-[1.1] mb-4">
                    <span className="block text-[#2D3A4A]">Meet Our Specialized</span>
                    <span className="block text-[#8B1A4A] mt-2">Medical Team</span>
                  </h2>
                  <div className="w-16 h-[2px] bg-[#8B1A4A]/25 mb-6" />
                </div>
                <div className="max-w-md text-slate-500 text-sm md:text-right font-medium leading-relaxed">
                  From General Practitioners To Top Specialists, Our Doctors Are Dedicated To Your Health.
                  {search && (
                    <div className="mt-3">
                      <button 
                        onClick={() => setSearch('')}
                        className="text-xs font-bold text-[#8B1A4A] hover:underline"
                      >
                        Clear Search ({displayDoctors.length} found)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {displayDoctors.length > 0 ? (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.04 }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {displayDoctors.map(doc => (
                    <DoctorCard 
                      key={doc.id} 
                      doctor={doc} 
                      onView={d => navigate(`/doctors/${d.slug}`)} 
                      onBook={d => navigate(`/book/${d.slug}`)} 
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto"
                >
                  <Search size={40} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="text-slate-800 font-bold text-lg mb-2">No doctors match your query</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    We couldn't find any medical team members fitting your current combination of keyword, location, and specialty filters.
                  </p>
                </motion.div>
              )}
            </div>
          </section>

        </div>

        <Footer />
        <MobileBottomNav />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        .neumorphic-svg-shadow-dark {
          fill: #000;
          opacity: 0.12;
          filter: blur(4px);
          transform: translate(3px, 3px);
        }
        .neumorphic-svg-shadow-light {
          fill: #fff;
          opacity: 0.8;
          filter: blur(2px);
          transform: translate(-2px, -2px);
        }
        .neumorphic-svg-text-base {
          fill: #0B1120;
          font-weight: 900;
        }
        .neumorphic-svg-text-base-pink {
          fill: #150F1C;
          font-weight: 800;
        }
        
        @keyframes surgicalPulse {
          0% {
            stroke-dashoffset: 1500;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .surgical-pulse-animation {
          stroke-dasharray: 180 300;
          animation: surgicalPulse 4.5s linear infinite;
        }
      `}</style>
    </>
  )
}
