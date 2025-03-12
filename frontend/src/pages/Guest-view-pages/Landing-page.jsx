import GalaxyButton from "@/components/ui/galaxyButton";
import React from "react";
import sampleImg from "../../assets/picture/random background/sampleImg.png";
import sampleImg2 from '../../assets/picture/random background/sampleImg2.png';
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
import ContactForm from "@/components/guest-view/contact-us";
import FloatingElements from "@/components/ui/floating-elements";
import ProgressBadge from "@/components/ui/progress-badge";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import astronautImg from '../../assets/picture/random background/white-astronaut.png'
import astronautImg2 from '../../assets/picture/random background/Astro.png'
import { Footer2 } from "@/components/ui/shadcnblocks-com-footer2";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="bg-neutral-50">
      {/*====================== Hero Section ==========================*/}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 bg-gradient-to-b from-indigo-700 via-purple-400 to-pink-200 relative overflow-hidden">
      {/* Floating Elements */}
      <FloatingElements />

      {/* Main Content */}
      <div className="container mx-auto relative z-10">
        {/* Progress Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <ProgressBadge />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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

        {/* Astronaut Mascot */}
        <motion.img
          src={astronautImg}
          alt="Coding Astronaut"
          className="absolute right-[5%] top-1/2 -translate-y-1/2 w-48 md:w-64 hover:scale-110 transition-transform duration-300 cursor-pointer"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
          <motion.img
          src={astronautImg2}
          alt="Coding Astronaut"
          className="absolute left-[5%] top-1/2 -translate-y-1/2 w-48 md:w-64 hover:scale-110 transition-transform duration-300 cursor-pointer"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />


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
            <img src={sampleImg || "/placeholder.svg"} alt="Mockup" className="relative w-full rounded-2xl shadow-md" />
            {/* Glowing UI Highlights */}
            
          </div>
        </motion.div>
      </div>
    </section>

      <BrandsComponent />

      {/*========================= Why Choose Codify? ===============================*/}
      <section className="mt-[-8rem] pt-0 bg-neutral-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6">
          {/* Left Text */}
          <div className="w-full md:w-1/2 p-6 lg:p-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Choose <span className="italic text-purple-600">Codify?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <span className="text-purple-600 text-xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Gamified Learning</h3>
                  <p className="text-gray-600">
                    Earn XP, badges, and rankings as you progress through your
                    learning journey.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <span className="text-purple-600 text-xl">💻</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Built-in Coding Environment
                  </h3>
                  <p className="text-gray-600">
                    Practice real-time coding in our fully integrated editor.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <span className="text-purple-600 text-xl">📹</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Live Video Sessions</h3>
                  <p className="text-gray-600">
                    Learn from experts through interactive live sessions.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <span className="text-purple-600 text-xl">🔥</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Code Battles & Challenges
                  </h3>
                  <p className="text-gray-600">
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
                src={sampleImg}
                alt="hero"
                className="w-full h-full object-cover object-left-top"
              />
            </ContainerScroll>
          </div>
        </div>
      </section>

      {/*========================= Features Section ===============================*/}
      <section className="max-w-7xl mx-auto py-16 px-6 bg-neutral-50">
       {/* Section Title & Subheading */}
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
            price={70000}
            originalPrice={90000}
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

       <section className="max-w-7xl mx-auto py-16 px-6 bg-neutral-50">

       <div className="max-w-2xl">
      <h2 className="text-3xl md:text-5xl font-bold text-purple-600 text-left">
        Contact <span className="italic text-black">Us</span> 
      </h2>
      <p className="text-lg text-gray-600 mt-2">
        Choose the perfect plan for your learning journey. No hidden fees, just unlimited access to Codify’s best features.
      </p>
    </div>

        <ContactForm/>
       </section>
          
       <Footer2>

      </Footer2>
    </main>
  );
}

export default LandingPage;
