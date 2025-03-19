import React from "react";
import { Users, Rocket, Crown, Swords, Video, Shield, Flag, Zap, Clock, ShieldAlert, ShieldIcon, BookOpen} from "lucide-react"
import { motion } from "framer-motion"

const CourseHeader = ({ title, description, details }) => {

return(
<div>

  {/* Header */}     
  <motion.div
  initial={{ y: -20 }}
  animate={{ y: 0 }}
  className="relative rounded-xl overflow-hidden"
  >

{/* Animated Background*/}
<div className="absolute inset-0 bg-gradient-to-r from-purple-100/90 via-violet-200/90 to-sky-200/90 z-0">
  <motion.div
    className="absolute inset-0"
    animate={{
    background: [
        "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)",
      ],
    }}
    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
    />
</div>

  {/* Floating Sword */}
<motion.div 
  className="absolute right-0 top-0 w-72 h-72 opacity-10"
  animate={{ 
    rotate: 360,
    scale: [1, 1.2, 1]
  }}
  transition={{ 
    duration: 20,
    repeat: Infinity,
    ease: "linear"
  }}
>
  <Swords className="w-full h-full" />
</motion.div>

<div className="relative z-10 p-4 sm:p-8">
  <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-0">
    <div className="space-y-4 flex-1">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Rocket className="w-8 h-8 text-purple-500" />
        </motion.div>
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="h-0.5 bg-purple-400/30 mt-1"
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>
      </motion.div>

      {/* Card details */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-2 flex-1 lg:w-3/4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {Object.entries(details).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="col-span-1 flex px-3 py-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/20"
          >
            <p className="text-xs capitalize flex items-center gap-2">
              {key === 'language' && <Zap className="w-4 h-4 flex" />}
              {key === 'students' && <Users className="w-4 h-4" />}
              {key === 'program' && <BookOpen className="w-4 h-4" />}
              {key === 'schedule' && <Clock className="w-4 h-4" />}
              {key === 'code' && <ShieldAlert className="w-4 h-4" />}
              {key === 'section' && <Flag className="w-4 h-4" />}
            {`${key} : ${value}`} {/* Space after colon */}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* Meet and Code battle buttons */}
    <motion.div
      className="flex flex-row lg:flex-col gap-3 justify-center lg:ml-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-purple-500/30"
      >
        <Video className="w-5 h-5" />
        Meet
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-sky-500/30"
        >
      <ShieldIcon className="w-5 h-5" />
        Code Battle
        <motion.span
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -right-1 -top-1"
        >
          <Shield className="w-4 h-4 text-yellow-300" />
        </motion.span>
      </motion.button>
    </motion.div>
  </div>
</div>
</motion.div>
</div>
      );
    };

export default CourseHeader;
