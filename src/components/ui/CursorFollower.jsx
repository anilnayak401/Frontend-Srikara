import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function CursorFollower() {
  const [isHovered, setIsHovered] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const checkHover = (e) => {
      const target = e.target
      const isInteractive = target.closest('button, a, input, select, .interactive-cursor')
      setIsHovered(!!isInteractive)
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', checkHover)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', checkHover)
    }
  }, [cursorX, cursorY])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden lg:block">
      {/* Outer Glow */}
      <motion.div
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          width: isHovered ? 80 : 40,
          height: isHovered ? 80 : 40,
          backgroundColor: isHovered ? 'rgba(255, 63, 129, 0.15)' : 'rgba(255, 63, 129, 0.05)',
          border: isHovered ? '2px solid rgba(255, 63, 129, 0.3)' : '1px solid rgba(255, 63, 129, 0.1)',
        }}
        className="rounded-full transition-colors duration-300 backdrop-blur-[2px]"
      />
      
      {/* Inner Dot */}
      <motion.div
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          backgroundColor: '#FF3F81', // Radiant Rose (Pink)
          boxShadow: isHovered 
            ? '0 0 20px rgba(255, 63, 129, 0.8), 0 0 40px rgba(255, 63, 129, 0.4)' 
            : '0 0 10px rgba(255, 63, 129, 0.5)',
        }}
        className="w-2.5 h-2.5 rounded-full absolute top-0 left-0"
      />

      {/* Trailing Particles (Optional/Extra Premium) */}
      <motion.div
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: '-50%',
          y: '-50%',
        }}
        className="w-1 h-1 bg-[#FF3F81] rounded-full absolute top-0 left-0 opacity-20 blur-[1px]"
      />
    </div>
  )
}
