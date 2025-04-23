import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Star, Code, Trophy, Shield, Target, Users, Heart, Zap, BookOpen, Award, Sparkles } from 'lucide-react';
import Galaxy from "@/assets/picture/random-background/Galaxy.png";
import PinkStar from "@/assets/picture/random-background/PinkStar.png";
import VioletStar from "@/assets/picture/random-background/VioletStar.png";
import About from "@/assets/picture/random-background/About.png";
import Mission from "@/assets/picture/random-background/Mission.png";
import Vision from "@/assets/picture/random-background/Vision.png";
import Bae from "@/assets/picture/about-us/Bae.png";
import Antang from "@/assets/picture/about-us/Antang.png";
import Loreto from "@/assets/picture/about-us/Loreto.png";
import Jerez from "@/assets/picture/about-us/Jerez.png";


const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('mission');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const tabContentVariants = {
    enter: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3 }
    },
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 }
    }
  };

  const teamMembers = [
    {
      name: 'Loreto, Russell Kelvin Anthony',
      role: 'Project Manager',
      src: Loreto,
    },
    {
      name: 'Antang, Irheil Mae S.',
      role: 'Backend Developer',
      src: Antang
    },
    {
      name: 'Bae, Ma. Catherine H.',
      role: 'Frontend Developer',
      src: Bae,
    },
    {
      name: 'Jerez, Marianne Celest',
      role: 'Frontend Developer',
      src: Jerez,
    },
  ];

  const waveVariants = {
    animate: {
      d: [
        "M0,400 C300,200 600,500 900,300 1200,100 1440,400 1440,400 L1440,600 L0,600 Z",
        "M0,400 C300,300 600,400 900,200 1200,300 1440,400 1440,400 L1440,600 L0,600 Z",
        "M0,400 C300,250 600,450 900,350 1200,150 1440,400 1440,400 L1440,600 L0,600 Z",
      ],
      fill: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.8)'],
      scale: [1, 1.02, 1],
      transition: {
        repeat: Infinity,
        duration: 8,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-indigo-800 to-violet-300">
          <motion.img
            src={Galaxy}
            alt="Galaxy background"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 1, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Floating Elements */}
        <motion.img
          src={PinkStar}
          alt="Pink Star"
          className="absolute top-1/4 left-1/4 w-16 h-16"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src={VioletStar}
          alt="Violet Star"
          className="absolute bottom-1/4 right-1/4 w-20 h-20"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            className="text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About <span className="text-purple-400">Us</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Where coding becomes an epic adventure! Level up your skills through challenges, battles, and achievements.
          </motion.p>
        </div>
      </section>

      {/* About Section with Wave Effect */}
      <section className="relative py-20 bg-white">
        <div className="absolute top-0 left-0 w-full h-32">
          <motion.svg
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 w-full h-full"
            variants={waveVariants}
            animate="animate"
          >
          </motion.svg>
        </div>

        <motion.div
          className="max-w-6xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-justify" variants={itemVariants}>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                Who Are <span className="text-purple-600">We</span>?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We are Codify, learning platform that transforms coding education into an exciting journey. Our goal is to make coding accessible, engaging, and fun for everyone.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Through our innovative approach, we combine gamification with real-world programming challenges to create an immersive learning experience that keeps you motivated and excited about coding.
              </p>
              <div className="flex gap-4">
                <div className="bg-purple-100 p-4 rounded-lg">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <div className="bg-indigo-100 p-4 rounded-lg">
                  <Rocket className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <motion.div 
                initial={{ opacity: 1, y: 0, scale: 1 }} 
                animate={{
                  y: [0, -5, 0],        
                  scale: [1, 1.01, 1],  
                }}
                transition={{
                  duration: 4,         
                  repeat: Infinity,    
                  ease: "easeInOut",   
                }}
            variants={itemVariants}>
              <img
                src={About}
                alt="About Codify"  
                className="rounded-2xl  transform transition-transform duration-300"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission/Vision Section with Enhanced Animation */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="flex justify-center gap-4 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.button
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                activeTab === 'mission'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
              onClick={() => setActiveTab('mission')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Our Mission
            </motion.button>
            <motion.button
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                activeTab === 'vision'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
              onClick={() => setActiveTab('vision')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Our Vision
            </motion.button>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="enter"
              animate="center"
              exit="exit"
              variants={tabContentVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-justify"
            >
              {activeTab === 'mission' ? (
                <>
                  <motion.div variants={itemVariants}>
                    <img
                      src={Mission}
                      alt="Mission"
                      className="rounded-2xl shadow-md transform hover:scale-95 transition-transform duration-300"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-3xl font-bold mb-6 text-gray-800">
                      Our <span className="text-purple-600">Mission</span>
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      To enhance coding education by creating an engaging, interactive platform where learners can develop their skills through challenges, battles, and real-world projects.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      We believe in learning by doing, and our platform provides the perfect environment for hands-on coding experience while having fun.
                    </p>
                    <div className="flex gap-4">
                      <div className="bg-purple-100 p-4 rounded-lg">
                        <Trophy className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="bg-indigo-100 p-4 rounded-lg">
                        <Shield className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={itemVariants} className="space-y-6 text-justify">
                    <h3 className="text-3xl font-bold mb-6 text-gray-800">
                      Our <span className="text-purple-600">Vision</span>
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      To become the leading platform for coding education, inspiring a new generation of developers who are not just skilled but passionate about creating innovative solutions.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      We envision a world where coding knowledge is accessible to everyone, breaking down barriers and fostering a global community of creative problem-solvers.
                    </p>
                    <div className="flex gap-4">
                      <div className="bg-purple-100 p-4 rounded-lg">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="bg-indigo-100 p-4 rounded-lg">
                        <Star className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <img
                      src={Vision}
                      alt="Vision"
                      className="rounded-2xl shadow-md transform hover:scale-95 transition-transform duration-300"
                    />
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* New Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Our <span className="text-purple-600">Values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              The core principles that guide us in creating the best learning experience for our community.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-justify"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            {[
              {
                icon: <Heart className="w-8 h-8 text-purple-600" />,
                title: 'Passion for Learning',
                description: 'We believe in fostering a genuine love for coding and continuous learning.'
              },
              {
                icon: <Users className="w-8 h-8 text-purple-600" />,
                title: 'Community First',
                description: 'Building a supportive community where everyone can grow and learn together.'
              },
              {
                icon: <Zap className="w-8 h-8 text-purple-600" />,
                title: 'Innovation',
                description: 'Constantly evolving our platform with cutting-edge technology and teaching methods.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* New Features Section */}
     
      {/* Existing Team Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Meet Our <span className="text-purple-600">Team</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The brilliant minds behind Codify, dedicated to making coding education fun and accessible.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="relative">
                <img
                  src={member.src}
                  alt={member.name}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white w-full">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm">{member.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <h2 className="text-4xl font-bold mb-6 text-purple-600">
              Acknowledgement
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We extend our sincere gratitude to the following individuals provided valuable support and guidance throughout this project. </p>

</motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            {[
              {
                title: 'University of Caloocan City',
                description: 'For providing the academic environment and resources that made this project possible.'
              },
              {
                title: 'Prof. Joemen G. Barrios, MIT',
                description: 'For guidance, mentorship, and shared expertise, which contributed to the successful completion of this project.'
              },
              {
                title: 'Computer Studies Department',
                description: 'For the support and motivation, extend our deepest appreciation to those behind our academic progress.'
              },
              {
                title: 'Peers',
                description: 'For the collaboration, encouragement, and teamwork, which helped make learning fun and meaningful.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -5 }}
              >
               
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm text-justify">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* New Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.1, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: `url(${Galaxy})`,
            backgroundSize: 'cover',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of learners who are already transforming their lives through code.
            </p>
           
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;