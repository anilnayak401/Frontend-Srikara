import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────
// 1. ANATOMICAL GEOMETRIES (Procedurally modeled)
// ─────────────────────────────────────────────────────────────

// Cardiology (Heart Shape beveled and extruded)
function HeartModel({ color = '#e11d48' }) {
  const meshRef = useRef()

  const heartShape = useMemo(() => {
    const x = 0, y = 0
    const s = new THREE.Shape()
    s.moveTo(x + 0.25, y + 0.25)
    s.bezierCurveTo(x + 0.25, y + 0.25, x + 0.20, y + 0.40, x, y + 0.40)
    s.bezierCurveTo(x - 0.35, y + 0.40, x - 0.35, y - 0.10, x - 0.35, y - 0.10)
    s.bezierCurveTo(x - 0.35, y - 0.35, x - 0.15, y - 0.55, x, y - 0.75)
    s.bezierCurveTo(x + 0.40, y - 0.35, x + 0.60, y - 0.10, x + 0.60, y - 0.10)
    s.bezierCurveTo(x + 0.60, y + 0.25, x + 0.40, y + 0.40, x + 0.25, y + 0.25)
    return s
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: 0.3,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 2,
    bevelSize: 0.12,
    bevelThickness: 0.12
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      // Natural organic heart pulse animation
      const scale = 1.6 + Math.sin(t * 3.5) * 0.08
      meshRef.current.scale.set(scale, scale, scale)
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <group position={[0, 0.2, 0]}>
      {/* Dynamic light inside the heart */}
      <pointLight color={color} intensity={8} distance={3} />
      
      <mesh ref={meshRef} rotation={[0, 0, Math.PI]}>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.88}
          roughness={0.12}
          thickness={1.8}
          ior={1.55}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          emissive={color}
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Arterial Tubing at the top of the Heart */}
      <mesh position={[-0.1, 0.8, -0.1]} rotation={[0.2, 0, 0.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshPhysicalMaterial color="#3b82f6" transmission={0.9} roughness={0.1} thickness={1} />
      </mesh>
      <mesh position={[0.1, 0.85, 0]} rotation={[-0.2, 0, -0.2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
        <meshPhysicalMaterial color={color} transmission={0.9} roughness={0.1} thickness={1} />
      </mesh>
    </group>
  )
}

// Neurology / Neurosurgery (Frosted brain using TorusKnot & synapsing particles)
function BrainModel({ color = '#7c3aed' }) {
  const meshRef = useRef()
  const particlesRef = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.15
    }
    // Synaptic spark particles movement
    particlesRef.current.forEach((p, idx) => {
      if (p) {
        p.position.y += Math.sin(t + idx) * 0.003
        p.scale.setScalar(0.8 + Math.sin(t * 3 + idx) * 0.4)
      }
    })
  })

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 0.85 + Math.random() * 0.45
      temp.push({
        pos: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 1.2,
          Math.sin(angle) * radius
        ],
        id: i
      })
    }
    return temp
  }, [])

  return (
    <group>
      <pointLight color={color} intensity={10} distance={4} />
      
      {/* High-complexity TorusKnot simulating cerebral convolutions */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.65, 0.28, 140, 18, 3, 4]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.9}
          roughness={0.16}
          thickness={2.2}
          ior={1.48}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating Synapse Particles */}
      {particles.map((p, idx) => (
        <mesh 
          key={p.id} 
          position={p.pos} 
          ref={el => particlesRef.current[idx] = el}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// Orthopedics (Vertebral Spine Column + Glowing Discs)
function SpineModel({ color = '#d97706' }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5
      groupRef.current.rotation.z = Math.sin(t) * 0.05
    }
  })

  return (
    <group ref={groupRef} scale={1.2}>
      <pointLight color={color} intensity={6} distance={3} />
      
      {/* A stack of 5 vertebrae cylinders & joints */}
      {[0, 1, 2, 3, 4].map((i) => {
        const yPos = (i - 2) * 0.42
        return (
          <group key={i} position={[0, yPos, 0]}>
            {/* Vertebral Bone structure */}
            <mesh>
              <cylinderGeometry args={[0.38, 0.42, 0.24, 16]} />
              <meshPhysicalMaterial
                color={color}
                transmission={0.85}
                roughness={0.15}
                thickness={2.0}
                ior={1.5}
                clearcoat={0.8}
                emissive={color}
                emissiveIntensity={0.15}
              />
            </mesh>

            {/* Glowing articular process wings on back of vertebrae */}
            <mesh position={[0, 0, -0.2]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.55, 0.1, 0.25]} />
              <meshPhysicalMaterial color={color} transmission={0.9} roughness={0.15} thickness={1.5} />
            </mesh>

            {/* Glowing Intervertebral Disc */}
            {i < 4 && (
              <mesh position={[0, 0.21, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.08, 16]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

// Nephrology & Urology (Twin Kidney Lobes in glass)
function KidneyModel({ color = '#0891b2' }) {
  const groupRef = useRef()

  const kidneyShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.6)
    s.bezierCurveTo(0.45, 0.6, 0.6, 0.3, 0.6, 0)
    s.bezierCurveTo(0.6, -0.3, 0.4, -0.6, 0, -0.6)
    s.bezierCurveTo(-0.3, -0.6, -0.4, -0.3, -0.15, 0) // Squeezed hilum
    s.bezierCurveTo(-0.4, 0.3, -0.3, 0.6, 0, 0.6)
    return s
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: 0.24,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.4
      groupRef.current.position.y = Math.sin(t * 2) * 0.06
    }
  })

  return (
    <group ref={groupRef} scale={1.2}>
      <pointLight color={color} intensity={8} distance={4} />

      {/* Left Kidney */}
      <mesh position={[-0.4, 0, -0.1]} rotation={[0, 0, 0.15]}>
        <extrudeGeometry args={[kidneyShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.9}
          roughness={0.1}
          thickness={1.6}
          ior={1.5}
          clearcoat={0.9}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Right Kidney */}
      <mesh position={[0.4, 0, 0.1]} rotation={[0, Math.PI, -0.15]}>
        <extrudeGeometry args={[kidneyShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.9}
          roughness={0.1}
          thickness={1.6}
          ior={1.5}
          clearcoat={0.9}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Renal Vessels */}
      <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
    </group>
  )
}

// Pulmonology (Double mirrored lung lobes & central trachea)
function LungsModel({ color = '#0d9488' }) {
  const groupRef = useRef()

  const lungShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.6)
    s.bezierCurveTo(0.4, 0.6, 0.65, 0.25, 0.55, -0.4)
    s.bezierCurveTo(0.45, -0.7, -0.1, -0.5, -0.1, -0.1) // Medial indentation
    s.bezierCurveTo(-0.1, 0.2, -0.25, 0.6, 0, 0.6)
    return s
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.4
      // Dynamic breathing expand-contract simulation
      const breath = 1.1 + Math.sin(t * 1.8) * 0.04
      groupRef.current.scale.set(breath, breath, breath)
    }
  })

  return (
    <group ref={groupRef}>
      <pointLight color={color} intensity={8} distance={4} />

      {/* Left Lobe */}
      <mesh position={[-0.32, 0.1, -0.1]} rotation={[0, 0, 0.12]}>
        <extrudeGeometry args={[lungShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.88}
          roughness={0.14}
          thickness={1.5}
          ior={1.52}
          clearcoat={0.9}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Right Lobe */}
      <mesh position={[0.32, 0.1, 0.1]} rotation={[0, Math.PI, -0.12]}>
        <extrudeGeometry args={[lungShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.88}
          roughness={0.14}
          thickness={1.5}
          ior={1.52}
          clearcoat={0.9}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Trachea tube */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} thickness={1} />
      </mesh>
    </group>
  )
}

// General Medicine & Others (Procedural double-helix DNA)
function DNAModel({ color = '#2563eb' }) {
  const groupRef = useRef()
  const spheresRef = useRef([])

  const numNodes = 22
  const nodes = useMemo(() => {
    const temp = []
    for (let i = 0; i < numNodes; i++) {
      const theta = (i / numNodes) * Math.PI * 3.5
      temp.push({
        theta,
        y: (i - numNodes / 2) * 0.11
      })
    }
    return temp
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.8
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.05
    }
  })

  return (
    <group ref={groupRef} scale={1.25}>
      <pointLight color={color} intensity={8} distance={4} />

      {nodes.map((n, i) => {
        const x1 = Math.cos(n.theta) * 0.45
        const z1 = Math.sin(n.theta) * 0.45
        const x2 = Math.cos(n.theta + Math.PI) * 0.45
        const z2 = Math.sin(n.theta + Math.PI) * 0.45

        return (
          <group key={i} position={[0, n.y, 0]}>
            {/* Strand 1 Node */}
            <mesh position={[x1, 0, z1]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshPhysicalMaterial
                color={color}
                transmission={0.9}
                roughness={0.1}
                thickness={1}
                clearcoat={1}
                emissive={color}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Strand 2 Node */}
            <mesh position={[x2, 0, z2]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshPhysicalMaterial
                color="#06b6d4"
                transmission={0.9}
                roughness={0.1}
                thickness={1}
                clearcoat={1}
                emissive="#06b6d4"
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Connector bar */}
            <mesh position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]} rotation={[0, 0, n.theta]}>
              <cylinderGeometry args={[0.015, 0.015, 0.88, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────
// 2. EXPORTED CANVAS CONTAINER
// ─────────────────────────────────────────────────────────────

export function Specialty3DModel({ specialtyId }) {
  // Resolve core color and 3D model node based on specialty ID
  const modelData = useMemo(() => {
    switch (specialtyId) {
      case 'cardio':
        return { component: <HeartModel color="#dc2626" />, title: 'Heart Activity' }
      case 'neuro':
      case 'neurosurg':
      case 'spine':
        return { component: <BrainModel color="#7c3aed" />, title: 'Neurological Sync' }
      case 'ortho':
        return { component: <SpineModel color="#cca830" />, title: 'Skeletal Alignment' }
      case 'nephro':
      case 'urology':
        return { component: <KidneyModel color="#0891b2" />, title: 'Renal Balance' }
      case 'pulmo':
        return { component: <LungsModel color="#0d9488" />, title: 'Pulmonary Rhythm' }
      default:
        return { component: <DNAModel color="#2563eb" />, title: 'DNA Sequencing' }
    }
  }, [specialtyId])

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 3, 2]} intensity={1.5} />
        <directionalLight position={[-2, -2, -1]} intensity={0.5} />
        
        {/* Soft floating dynamic environment */}
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          {modelData.component}
        </Float>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        <Stars radius={100} depth={50} count={30} factor={4} saturation={0.5} fade speed={1} />
      </Canvas>

      {/* Specialty Label HUD overlay */}
      <div className="absolute bottom-4 left-4 bg-white/70 backdrop-blur-md border border-white/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-sm pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
          WebGL Live: {modelData.title}
        </span>
      </div>
    </div>
  )
}
