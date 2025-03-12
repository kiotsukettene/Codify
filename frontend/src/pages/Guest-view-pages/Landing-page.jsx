import GalaxyButton from "@/components/ui/galaxyButton";
import React, { useRef } from "react";
import sampleImg from "../../assets/picture/random-background/sampleImg.png";
import sampleImg2 from '../../assets/picture/random-background/sampleImg2.png';
import VariableFontHoverByRandomLetter from "@/fancy/components/text/variable-font-hover-by-random-letter";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import BrandsComponent from "@/components/ui/brands";
import { PricingCard } from "@/components/pricing-card";
import { useNavigate } from "react-router-dom";
import {
  BentoGrid,
  CodeBattlesCard,
  CodingEnvironmentCard,
  GamifiedLearningCard,
  PersonalizedLearningCard,
  VideoSessionsCard,
} from "@/components/ui/bento-grid";
import { Testimonials } from "@/components/ui/testimonials";
import FloatingElements from "@/components/ui/floating-elements";
import ProgressBadge from "@/components/ui/progress-badge";
import { motion, useScroll, useTransform } from "framer-motion"
import astronautImg from '../../assets/picture/random-background/white-astronaut.png'
import astronautImg2 from '../../assets/picture/random-background/Astro.png'
import Footer from "@/components/ui/footer";
import { Award, Computer, Gamepad2, Gift, Sparkles, Star, Swords, Trophy, Video } from "lucide-react"
import { useEffect } from "react";

// Particle animation component
const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 100

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />
}

function LandingPage({title}) {
  const navigate = useNavigate();
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
  
       
    <main className="bg-neutral-50">
      {/*====================== Hero Section ==========================*/}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 bg-gradient-to-b from-indigo-700 via-purple-400 to-pink-200 relative overflow-hidden"
      >
        {/* Animated Particle Background */}
        <ParticleBackground />


        {/* Main Content */}
        <div className="container mx-auto relative z-10">
          {/* XP Level Indicator */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
          >
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 flex items-center gap-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-xs">
                  3
                </div>
                <div className="ml-2">
                  <p className="text-xs text-white/80">LEVEL</p>
                  <p className="text-sm font-semibold text-white">Coder</p>
                </div>
              </div>
              <div className="h-6 w-px bg-white/30"></div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>500 XP  / </span>
                  <span>1000 XP</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full w-full">
                  <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ y, opacity }}
            className="text-5xl md:text-7xl font-bold max-w-3xl mx-auto text-white font-hero tracking-wide [text-shadow:0px_0px_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-transform duration-300"
          >
            The platform where every aspiring coder can thrive
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-white/80 max-w-2xl mx-auto mt-4"
          >
            Where challenges transform into achievements.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            <button className="group relative px-8 py-4 text-lg font-medium bg-white text-gray-900 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                Get Started
                <Sparkles className="ml-2 w-5 h-5 text-yellow-500 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

           
          </motion.div>

          {/* Hero Image Mockup */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="relative mt-16 mx-auto max-w-4xl w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl" />
            <div className="relative p-4 rounded-3xl border border-white/40 bg-white/40 shadow-lg group hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src={sampleImg || "/placeholder.svg"}
                alt="Mockup"
                className="relative w-full rounded-2xl shadow-md"
              />

              {/* Interactive UI Elements */}
              <div className="absolute top-1/8 right-1/7 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Achievement Unlocked!</p>
                    <p className="text-sm font-medium">First Code Challenge</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1/4 left-1/4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Level Up!</p>
                    <p className="text-sm font-medium">+200 XP Earned</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <BrandsComponent />

      {/*========================= Why Choose Codify? ===============================*/}
      <section className="mt-[-10rem] pt-0 max-w-7xl mx-auto  px-6 bg-neutral-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6">
          {/* Left Text */}
          <div className="w-full md:w-1/2 p-6 lg:p-12">
            <h2 className="text-xl md:text-5xl font-bold">
              Why Choose <span className="italic text-purple-600">Codify?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <span className="text-primary text-xl"><Gamepad2/></span>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">Gamified Learning</h3>
                  <p className="text-gray-600 text-sm">
                    Earn XP, badges, and rankings as you progress through your
                    learning journey.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <span className="text-primary text-xl"><Computer/></span>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">
                    Built-in Coding Environment
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Practice real-time coding in our fully integrated editor.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <span className="text-purple-600 text-xl"><Video/></span>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">Live Video Sessions</h3>
                  <p className="text-gray-600 text-sm">
                    Learn from experts through interactive live sessions.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <span className="text-primary"><Swords/></span>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">
                    Code Battles & Challenges
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Compete with other learners and improve your coding skills.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2">
            <ContainerScroll>
              <img
                src={sampleImg2}
                alt="hero"
                className="w-full h-full object-cover object-left-top"
              />
            </ContainerScroll>
          </div>
        </div>
      </section>

      {/*========================= Features Section ===============================*/}
      <section className="max-w-7xl mx-auto mt-[-10rem] pb-16 px-6 bg-neutral-50">
       {/* Section Title & Subheading */}
        {/* Progress Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <ProgressBadge title={"Features"}/>
        </motion.div>
    <div className="max-w-2xl">
      <h2 className="text-3xl md:text-5xl font-bold text-left">
        Our <span className="italic text-purple-600">Interactive</span> Features
      </h2>
      <p className="text-lg text-gray-600 mt-2">
        Unlock a dynamic, gamified learning experience designed to boost your coding skills and keep you engaged.
      </p>
    </div>
        <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-6 mt-12">
          <GamifiedLearningCard />
          <CodingEnvironmentCard />
          <VideoSessionsCard />
          <CodeBattlesCard />
          <PersonalizedLearningCard className="md:col-span-2 lg:col-span-2" />
        </BentoGrid>
        
      </section>

      {/*========================= Pricing Section ===============================*/}
      <section className="max-w-7xl mx-auto py-16 px-6 bg-neutral-50">
      <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <ProgressBadge title={"Pricing"} />
        </motion.div>
      <div className="max-w-2xl">
      <h2 className="text-3xl md:text-5xl font-bold text-left">
        Our <span className="italic text-purple-600">Pricing</span> Plans
      </h2>
      <p className="text-lg text-gray-600 mt-2">
        Choose the perfect plan for your learning journey. No hidden fees, just unlimited access to Codify’s best features.
      </p>
    </div>

        {/* Centered Pricing Card */}
        <div className="flex justify-center">
          <PricingCard
            title="Ultimate Plan"
            description="Access everything you need to grow your business."
            price={"50,000"}
            originalPrice={"70,000"}
            features={[
              {
                title: "Features",
                items: [
                  "Interactive Learning Paths",
                  "Real-time Code Editor",
                  "Live Video Sessions",
                  "Code Battles",
                  "Code Challenges",
                ],
              },
              {
                title: "Perks",
                items: [
                  "24/7 Support",
                  "Customizable Avatars & Profiles",
                  "Personalized Learning Experience",
                ],
              },
            ]}
            buttonText="Get Started"
            onButtonClick={() => navigate("/admin/register")}
          />
        </div>
      </section>


       {/*========================= Testimonials Section ===============================*/}
       <section className="max-w-7xl mx-auto py-16 px-6 bg-neutral-50">
       <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <ProgressBadge title={"Testimonial"} />
        </motion.div>

       <div className="max-w-2xl">
      <h2 className="text-3xl md:text-5xl font-bold text-left">
        Success <span className="italic text-purple-600">Stories</span>
      </h2>
      <p className="text-lg text-gray-600 mt-2">
      Why Coders Choose Codify – Straight from the Community.
      </p>
    </div>
        <Testimonials/>
       </section>

       <Footer/>

       
      
    </main>
    
  );
}

export default LandingPage;
