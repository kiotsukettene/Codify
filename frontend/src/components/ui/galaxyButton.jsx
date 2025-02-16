"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

const GalaxyButton = ({ children, onClick, className = "" }) => {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const animationFrameId = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = (canvas.width = 300)
    const height = (canvas.height = 60)

    // Create particles
    const createParticles = () => {
      for (let i = 0; i < 30; i++) {
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5,
          speedX: Math.random() * 0.3 - 0.15,
          speedY: Math.random() * 0.3 - 0.15,
          opacity: Math.random(),
        })
      }
    }

    // Animate particles
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      particles.current.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.opacity = Math.sin(Date.now() * 0.001) * 0.5 + 0.5

        // Reset particle position if it goes out of bounds
        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.5})`
        ctx.fill()
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    createParticles()
    animate()

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative group
        w-[200px] h-[60px]
        rounded-full
        overflow-hidden
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#7760ca] to-[#3d0dec]" />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Glowing border */}
      <div className="absolute inset-0 rounded-full border border-white/50" />
      <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 blur-sm" />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 text-white text-lg font-medium">
        <span>{children}</span>
        
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-blue-500 blur-xl transition-opacity duration-500" />
    </motion.button>
  )
}

export default GalaxyButton

