import React, { useEffect, useState } from "react"
import Terms from '@/assets/picture/random-background/Terms.png'
import PinkStar from '@/assets/picture/random-background/PinkStar.png'
import FourStar from '@/assets/picture/random-background/FourStar.png'
import PurpleFlower from '@/assets/picture/random-background/Purple-flower.png'
import VioletStar from '@/assets/picture/random-background/VioletStar.png'
import Galaxy from '@/assets/picture/random-background/Galaxy.png'
import { motion } from 'framer-motion'

const TermsAndCondition = () => {

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls down > 30px, we consider it "scrolled"
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


      return (
        <motion.div 
        initial={{ opacity: 0, x: 10 }}   // hidden, slightly below
        animate={{ opacity: 1, x: 0 }}    // visible, final position
        transition={{ duration: 0.8, ease: "easeInOut" }}
        
        className="min-h-screen flex flex-col">
          {/* Header with purple background and wave */}
          <header className="bg-gradient-to-b from-purple-200 via-purple-200 to-pink-300 relative overflow-hidden">
            {/* Navigation */}
          
    
            {/* Header content with title */}
            <div className="container mx-auto px-4 py-28 md:py-48 text-center text-purple-500 relative z-10">
              <h1 className="text-3xl text-header md:text-7xl font-bold mb-4">
                Terms & <br />
                Conditions
              </h1>
            </div>
    
            {/* Decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-[#a99be0] rounded-full opacity-50"></div>
            <div className="absolute top-1/3 left-1/3 w-8 h-8 bg-[#a99be0] rounded-full opacity-50"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 h-full">
              <div className="w-full h-full bg-[#a99be0] rounded-tl-full opacity-30"></div>
            </div>
            <div className="absolute left-0 bottom-0 w-1/3 h-1/2">
              <div className="w-full h-full bg-[#a99be0] rounded-tr-full opacity-30"></div>
            </div>
    
            {/* Wave shape at bottom */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 0L48 8.875C96 17.75 192 35.5 288 53.25C384 71 480 88.75 576 88.75C672 88.75 768 71 864 62.125C960 53.25 1056 53.25 1152 62.125C1248 71 1344 88.75 1392 97.625L1440 106.5V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
                  fill="white"
                />
              </svg>
            </div>
          </header>
    
          {/* Main content */}
          <main className="flex-grow bg-white text-justify">
            <div className="mx-auto px-4 py-0 relative ">


            <motion.div
              initial={{ opacity: 0, y: 50 }}   // hidden, slightly below
              animate={{ opacity: 1, y: 0 }}    // visible, final position
              transition={{ duration: 0.8, ease: "easeOut" }}
            className={`bg-white rounded-3xl p-6 md:p-8 -mt-28 relative z-10 max-w-4xl mx-auto
                        transition-shadow duration-500
                        ${scrolled ? "shadow-none" : "shadow-2xl"}`}
          >
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Welcome to Codify!</h2>
                  <p className="mb-4">
                    These Terms and Conditions outline the rules and guidelines for using our platform. By accessing or
                    using Codify, you agree to follow these terms.
                  </p>
                  <p className="mb-4">
                    Codify is an online learning platform designed to help professors and students engage in coding lessons,
                    activities, and coding battles. To ensure a safe, fair, and effective learning environment, all
                    users—including students, professors, and institutions— must comply with the policies outlined below.
                  </p>
                  <p className="mb-4">If you do not agree with these terms, please refrain from using the platform.</p>
                </section>
    
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">USE OF SERVICES</h2>
                  <p className="mb-4">
                    You agree that by using our Services, you have accepted these Terms and understand your obligations
                    herein and under the Privacy Policies. You further agree that you are authorized to use our Services for
                    your sole benefit. We reserve the right, at our sole discretion, to terminate any transactions or
                    activities where we believe that the activities violate these Terms, Privacy Policies, or any laws.
                  </p>
                </section>
    
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">USER RESPONSIBILITIES</h2>
                  <h3 className="text-xl font-bold mb-2">2.1 Professors</h3>
                  <ul className="list-disc pl-8 mb-4 space-y-2">
                    <li>
                      Professors are responsible for managing and overseeing courses, lessons, and coding
                      battles.
                    </li>
                    <li>Professors must ensure all learning materials comply with intellectual property laws.</li>
                    <li>Professors must monitor student engagement and uphold academic integrity.</li>
                  </ul>
    
                  <h3 className="text-xl font-bold mb-2">2.2 Students</h3>
                  <ul className="list-disc pl-8 mb-4 space-y-2">
                    <li>
                      Students must complete coding activities and code battles without cheating or using unauthorized
                      assistance.
                    </li>
                    <li>
                      Any form of plagiarism, including copying code from external sources without citation, is prohibited.
                    </li>
                    <li>Students are responsible for maintaining a respectful learning environment.</li>
                  </ul>
                </section>
    
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">DATA PRIVACY & SECURITY</h2>
                  <ul className="list-disc pl-8 mb-4 space-y-2">
                    <li>
                      Codify collects user data such as login credentials, progress reports, and coding activity for
                      educational purposes only.
                    </li>
                    <li>User data is protected and not shared with third parties except as required by law.</li>
                    <li>
                      Professors and students should not share personal login credentials or sensitive information with
                      others.
                    </li>
                    <li>Passwords are securely stored and inaccessible to anyone, including administrators.</li>
                  </ul>
                </section>
    
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">CODE OF CONDUCT</h2>
                  <ul className="list-disc pl-8 mb-4 space-y-2">
                    <li>
                      Users must maintain a respectful and professional attitude in discussions, virtual meetings, and code
                      submissions.
                    </li>
                    <li>
                      Cyberbullying, harassment, or any form of discrimination will result in suspension or permanent ban.
                    </li>
                    <li>
                      Professors reserve the right to disqualify students in a Coding Battle if cheating or misconduct is
                      detected.
                    </li>
                  </ul>
                </section>
    
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">LIMITATION OF LIABILITY</h2>
                  <ul className="list-disc pl-8 mb-4 space-y-2">
                    <li>
                      The platform is not responsible for any loss of data, technical issues, or interruptions due to
                      external factors such as internet failures.
                    </li>
                    <li>Users are responsible for backing up their code and academic work.</li>
                  </ul>
                </section>
    
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">PAYMENT POLICIES</h2>
                  <ul className="list-disc pl-8 mb-4 space-y-2">
                    <li>Fees will be charged based on the agreed pricing structure.</li>
                    <li>All fees paid or accrued in connection with any Services are non-refundable</li>
                  </ul>
                </section>
    
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">INTELLECTUAL PROPERTY</h2>
                  <ul className="list-disc pl-8 mb-4 space-y-2">
                    <li>
                      All content, including lessons, coding challenges, and system architecture, is the property of Codify
                      and its creators.
                    </li>
                    <li>Users cannot share or change Codify's content without permission.</li>
                  </ul>
                </section>
    
                {/* <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">TERMINATION OF ACCESS</h2>
                  <ul className="list-disc pl-8 mb-4 space-y-2">
                    <li>Violation of these terms may result in temporary suspension or permanent termination of access.</li>
                    <li>Codify reserves the right to remove or restrict accounts that misuse the platform.</li>
                  </ul>
                </section> */}
    
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">MODIFICATIONS TO TERMS</h2>
                  <ul className="list-disc pl-8 mb-4 space-y-2">
                    <li>Codify may update these terms at any time, and users will be notified of significant changes.</li>
                    <li>Continued use of the platform after changes indicates acceptance of the new terms.</li>
                  </ul>
                </section>
    
                <section className="mb-4">
                  <h2 className="text-2xl font-bold mb-4">CONTACT INFORMATION</h2>
                  <p className="mb-2">For any questions regarding these Terms and Conditions, users may contact:</p>
                  <p className="mb-2">📧 Email: Codify.dev2025@gmail.com</p>
                </section>
              </motion.div>
    
              {/* Decorative astronaut images */}


              
              <motion.div
              
              initial={{ y: 0 }}
              animate={{ y: -10 }} 
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
                // 'reverse' flips the animation back and forth
                repeatType: "reverse"
              }}
              
              className="hidden md:block absolute right-9 top-5 w-60 h-60">
                <img
                  src={Terms}
                  alt="Astronaut illustration"
                  className="object-contain"
                />
              </motion.div>

              <div className="hidden md:block absolute left-20 top-1/3 w-28 h-28">
                <img
                  src={PinkStar}
                  alt="Astronaut illustration"
                  className="h-96 w-96"
                />
              </div>

              <div className="hidden md:block absolute left-16 top-20 w-40 h-40">
                <img
                  src={FourStar}
                  alt="Astronaut illustration"
                  className="object-contain"
                />
              </div>

              <div className="hidden md:block absolute right-9 bottom-1/3 w-52 h-52">
                <img
                  src={Galaxy}
                  alt="Astronaut illustration"
                  className="object-contain"
                />
              </div>
    
              
              <motion.div
              
              initial={{ y: 0 }}
              animate={{ y: -10 }} 
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
                // 'reverse' flips the animation back and forth
                repeatType: "reverse"
              }}
              
              className="hidden md:block absolute left-16 bottom-0 w-60 h-60">
                <img
                  src={PurpleFlower}
                  alt="Planet illustration"
                  className="object-contain"
                />
              </motion.div>


            </div>
          </main>

        </motion.div>
      )
    }
    
    

export default TermsAndCondition
