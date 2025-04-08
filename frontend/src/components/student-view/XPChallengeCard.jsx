import React from 'react'
import { Card } from '../ui/card'
import xpAstonaut from '@/assets/picture/courses/xp-astronaut.png'
import xpChest from '@/assets/picture/random-background/chest.png'
import { Gift, Sparkles, Star, Trophy } from 'lucide-react'
import {motion} from 'framer-motion'

function XPChallengeCard() {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
    <Card 
      className=" lg:flex lg:flex-row relative shadow-none border-none p-6 bg-gradient-to-br from-[#C9D6FF] to-[#E0E7FF] rounded-lg overflow-hidden "
    >
      
      {/* Floating Decorative Stars Inside the Card */}
      <Sparkles className="absolute top-4 left-4 w-5 h-5 text-white opacity-70 animate-pulse" />
      <Star className="absolute bottom-4 right-4 w-5 h-5 text-blue-500 opacity-50 animate-bounce" />
      <Star className="absolute bottom-4 left-10 w-4 h-4 text-purple-400 opacity-60 animate-spin-slow" />

      {/* Animated Light Beam Effect */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />

      {/* Astronaut + Text */}
      <div className="flex flex-row justify-between items-center gap-5 w-full">
        <motion.img 
          src={xpAstonaut} 
          className="w-32 md:w-40 h-auto"
          alt="XP Astronaut"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <div className="flex flex-col items-start">
          <h1 className="text-[#321C1C] font-semibold text-sm md:text-base">
            Participate in the code battle to earn XP!
          </h1>
          {/* Small XP Badge Below the Text */}
          <span className="mt-2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-lg">
            ✨Join Us!
          </span>
        </div>
      </div>
    </Card>
  </motion.div>
  )
}

export default XPChallengeCard
