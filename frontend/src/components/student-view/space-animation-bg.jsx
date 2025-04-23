"use client"

import { useEffect, useRef } from "react"

export function SpaceBackground({ children }) {
  const canvasRef = useRef(null)

  // Space animation effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Create space objects
    const stars = []
    const planets = []
    const asteroids = []
    const shootingStars = []

    // Create stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
      })
    }

    // Create planets
    const planetColors = ["#FF9D7A", "#A3CFFF", "#FFE07A", "#C9A3FF", "#7AFFB9"]
    for (let i = 0; i < 5; i++) {
      planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 15 + 5,
        speed: Math.random() * 0.2,
        color: planetColors[i % planetColors.length],
        direction: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.01,
        rotation: 0,
      })
    }

    // Create asteroids
    for (let i = 0; i < 15; i++) {
      asteroids.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        color: "#A0A0A0",
        direction: Math.random() * Math.PI * 2,
      })
    }

    // Function to create a shooting star
    const createShootingStar = () => {
      const startX = Math.random() * canvas.width
      const startY = Math.random() * (canvas.height / 3)

      return {
        x: startX,
        y: startY,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 5 + 10,
        angle: Math.PI / 4 + (Math.random() * Math.PI) / 4,
        opacity: 1,
        active: true,
      }
    }

    // Periodically create shooting stars
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        shootingStars.push(createShootingStar())
      }
    }, 1000)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create a space gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0a0a1a")
      gradient.addColorStop(0.4, "#1a0a2e")
      gradient.addColorStop(0.8, "#0a0a1a")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and update stars
      stars.forEach((star) => {
        // Make stars twinkle
        star.opacity += star.twinkleSpeed * star.twinkleDirection
        if (star.opacity > 1) {
          star.opacity = 1
          star.twinkleDirection = -1
        } else if (star.opacity < 0.2) {
          star.opacity = 0.2
          star.twinkleDirection = 1
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Move stars
        star.y += star.speed

        // Reset position if off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      // Draw and update planets
      planets.forEach((planet) => {
        // Update rotation
        planet.rotation += planet.rotationSpeed

        // Draw planet
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2)
        ctx.fillStyle = planet.color
        ctx.fill()

        // Add a glow effect
        const gradient = ctx.createRadialGradient(
          planet.x,
          planet.y,
          planet.radius * 0.8,
          planet.x,
          planet.y,
          planet.radius * 1.5,
        )
        gradient.addColorStop(0, `${planet.color}40`)
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.radius * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw planet features (simple rings or craters)
        ctx.save()
        ctx.translate(planet.x, planet.y)
        ctx.rotate(planet.rotation)

        // Draw a ring for some planets
        if (planet.radius > 12) {
          ctx.beginPath()
          ctx.ellipse(0, 0, planet.radius * 1.5, planet.radius * 0.5, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `${planet.color}80`
          ctx.lineWidth = 2
          ctx.stroke()
        }
        // Or draw craters for smaller planets
        else {
          for (let i = 0; i < 3; i++) {
            const craterX = (Math.random() - 0.5) * planet.radius * 0.8
            const craterY = (Math.random() - 0.5) * planet.radius * 0.8
            const craterSize = planet.radius * 0.2

            ctx.beginPath()
            ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2)
            ctx.fillStyle = `${planet.color}80`
            ctx.fill()
          }
        }

        ctx.restore()

        // Move planets in their direction
        planet.x += Math.cos(planet.direction) * planet.speed
        planet.y += Math.sin(planet.direction) * planet.speed

        // Bounce off edges
        if (planet.x < -planet.radius || planet.x > canvas.width + planet.radius) {
          planet.direction = Math.PI - planet.direction
        }
        if (planet.y < -planet.radius || planet.y > canvas.height + planet.radius) {
          planet.direction = -planet.direction
        }
      })

      // Draw and update asteroids
      asteroids.forEach((asteroid) => {
        ctx.beginPath()
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2)
        ctx.fillStyle = asteroid.color
        ctx.fill()

        // Move asteroids in their direction
        asteroid.x += Math.cos(asteroid.direction) * asteroid.speed
        asteroid.y += Math.sin(asteroid.direction) * asteroid.speed

        // Reset position if off screen
        if (
          asteroid.x < -asteroid.radius ||
          asteroid.x > canvas.width + asteroid.radius ||
          asteroid.y < -asteroid.radius ||
          asteroid.y > canvas.height + asteroid.radius
        ) {
          asteroid.x = Math.random() * canvas.width
          asteroid.y = Math.random() * canvas.height
          asteroid.direction = Math.random() * Math.PI * 2
        }
      })

      // Draw and update shooting stars
      shootingStars.forEach((star, index) => {
        if (!star.active) return

        ctx.save()
        ctx.beginPath()

        // Create gradient for the shooting star trail
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length,
        )

        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(0.6, `rgba(200, 200, 255, ${star.opacity * 0.6})`)
        gradient.addColorStop(1, "transparent")

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - Math.cos(star.angle) * star.length, star.y - Math.sin(star.angle) * star.length)
        ctx.stroke()
        ctx.restore()

        // Move shooting star
        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed

        // Fade out as it moves
        star.opacity -= 0.01

        // Remove if off screen or faded out
        if (star.x < 0 || star.x > canvas.width || star.y < 0 || star.y > canvas.height || star.opacity <= 0) {
          star.active = false
          shootingStars.splice(index, 1)
        }
      })

      // Add a subtle nebula effect
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 100 + 50

        const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        const hue = Math.random() * 60 + 240 // Blue to purple hues
        nebulaGradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.03)`)
        nebulaGradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = nebulaGradient
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(shootingStarInterval)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Space animation canvas */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
