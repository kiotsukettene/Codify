import React, { useState, useEffect } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { motion } from "framer-motion"
import bear from "@/assets/picture/Avatar/Bear.png"
import dog from "@/assets/picture/Avatar/Dog.png"

// Sample data for the leaderboard
const leaderboardData = [
  { id: 1, name: "Irheil Mae S. Antang", section: "BSCS 3B", xp: 2000, avatar: dog},
  { id: 2, name: "Marianne ", section: "BSCS 3A", xp: 1900, avatar: bear },
  { id: 3, name: "Ma. Catherine H. Bae", section: "BSCS 3B", xp: 1898, avatar: dog },
  { id: 4, name: "Russell Kelvin Anthony B. Loreto", section: "BSCS 3A", xp: 1718, avatar: bear},
  { id: 5, name: "Imee sue B. likhana", section: "BSCS 2A", xp: 1600, avatar: bear },
  { id: 6, name: "Junmar L. Sanay", section: "BSCS 3B", xp: 1550, avatar: dog },
  { id: 7, name: "Belle M. Sinag", section: "BSCS 3A", xp: 1520, avatar: bear },
  { id: 8, name: "Mariz K. Bitaw", section: "BSCS 3B", xp: 1480, avatar: dog },
  { id: 9, name: "Elle B. Caps", section: "BSCS 3A", xp: 1450, avatar: dog },
  { id: 10, name: "Aikeen K. Galang", section: "BSCS 2A", xp: 1400, avatar: dog },
]

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const itemsPerPage = 5
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage)

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = leaderboardData.slice(indexOfFirstItem, indexOfLastItem)

  // Get top 3 students
  const topThreeStudents = leaderboardData.slice(0, 3)

  // Animation effect when component mounts
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleImageError = (id) => {
    setImageError(prev => ({...prev, [id]: true}));
  };

  return (
    <div className="w-full h-auto overflow-hidden">
    <div className="mx-auto flex flex-col items-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#4B2D83] text-white font-bold text-xl sm:text-2xl py-2 sm:py-3 px-6 sm:px-12 rounded-full mb-4 sm:mb-8 md:mb-12"
      >
        Leaderboards
      </motion.div>

      {/* Top 3 Students */}
      {currentPage === 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col md:flex-row justify-center items-center md:items-end gap-4 md:gap-4 lg:gap-16 mb-6 sm:mb-8 md:mb-10 lg:mb-12"
        >


          {/* 2nd Place */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center order-1 md:order-1 w-full md:w-1/3 max-w-[200px]"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-[#B088E0] text-2xl sm:text-3xl font-bold mb-1"
            >
              2<sup>nd</sup>
            </motion.div>
            <div className="relative">
              <motion.div
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] relative"
              >
                <div className="absolute inset-0 bg-[#B088E0] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 140 140" className="absolute">
                    <path d="M70,10 C110,10 130,60 130,70 C130,110 110,130 70,130 C30,130 10,110 10,70 C10,30 30,10 70,10 Z" fill="#B088E0" />
                    <path d="M70,20 C105,20 120,60 120,70 C120,105 105,120 70,120 C35,120 20,105 20,70 C20,35 35,20 70,20 Z" fill="#C9AEE9" />
                  </svg>
                  <div className="w-[70%] h-[70%] rounded-full overflow-hidden border-4 border-white z-10">
                    <img 
                      src={topThreeStudents[1]?.avatar} 
                      alt={topThreeStudents[1]?.name} 
                      className="w-full h-full object-cover" 
                      onError={() => handleImageError(2)}
                    />
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="absolute -top-3 sm:-top-4 md:-top-5 -right-1 sm:-right-2 z-20"
                >
                  <svg width="30" height="30" sm:width="35" sm:height="35" md:width="40" md:height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#B088E0" stroke="#8A4FFF" strokeWidth="1" />
                  </svg>
                </motion.div>
                <div className="absolute -bottom-2 right-0 bg-white rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium shadow-md z-20">
                {topThreeStudents[1]?.xp}
                    </div>
              </motion.div>
            </div>
            <h3 className="text-[#B088E0] font-semibold text-sm sm:text-base md:text-lg mt-2 sm:mt-3 text-center truncate w-full">{topThreeStudents[1]?.name} </h3>
            <p className="text-gray-600 text-xs sm:text-sm">{topThreeStudents[1]?.section}</p>
          </motion.div>



          {/* 1st Place */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center order-0 md:order-0 md:-mt-8 w-full md:w-1/3 max-w-[240px]"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-[#F7C948] text-3xl sm:text-4xl font-bold mb-1"
            >
              1<sup>st</sup>
              
            </motion.div>
            <div className="relative">
              <motion.div
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] relative"
              >
                <div className="absolute inset-0 bg-[#F7C948] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 180 180" className="absolute">
                    <path d="M90,10 C140,10 170,60 170,90 C170,140 140,170 90,170 C40,170 10,140 10,90 C10,40 40,10 90,10 Z" fill="#F7C948" />
                    <path d="M90,20 C135,20 160,60 160,90 C160,135 135,160 90,160 C45,160 20,135 20,90 C20,45 45,20 90,20 Z" fill="#FADA80" />
                  </svg>
                  <div className="w-[70%] h-[70%] rounded-full overflow-hidden border-4 border-white z-10">
                    <img 
                      src={topThreeStudents[0]?.avatar} 
                      alt={topThreeStudents[0]?.name} 
                      className="w-full h-full object-cover" 
                      onError={() => handleImageError(1)}
                    />
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -top-8 sm:-top-10 md:-top-12 left-2/3 transform -translate-x-1/2 z-20"
                >
                  <svg width="40" height="40" sm:width="50" sm:height="50" md:width="60" md:height="60" viewBox="0 0 24 24" fill="none" ml="28">
                    <path d="M5,16 L3,5 L8,10 L12,4 L16,10 L21,5 L19,16 L5,16 Z M19,19 C19,19.6 18.6,20 18,20 L6,20 C5.4,20 5,19.6 5,19 L5,18 L19,18 L19,19 Z" fill="#F7C948" stroke="#F5A623" strokeWidth="1" />
                  </svg>
                </motion.div>
                <div className="absolute -bottom-2 right-0 bg-white rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium shadow-md z-20">
                {topThreeStudents[0]?.xp}
                                </div>
              </motion.div>
            </div>
            <h3 className="text-[#F7C948] font-semibold text-base sm:text-lg md:text-xl mt-2 sm:mt-3 text-center truncate w-full">{topThreeStudents[0]?.name}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{topThreeStudents[0]?.section}</p>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col items-center order-2 md:order-2 w-full md:w-1/3 max-w-[200px]"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-gray-400 text-2xl sm:text-3xl font-bold mb-1"
            >
              3<sup>rd</sup>
            </motion.div>
            <div className="relative">
              <motion.div
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] relative"
              >
                <div className="absolute inset-0 bg-gray-300 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 140 140" className="absolute">
                    <path d="M70,10 C110,10 130,60 130,70 C130,110 110,130 70,130 C30,130 10,110 10,70 C10,30 30,10 70,10 Z" fill="#A0A0A0" />
                    <path d="M70,20 C105,20 120,60 120,70 C120,105 105,120 70,120 C35,120 20,105 20,70 C20,35 35,20 70,20 Z" fill="#D0D0D0" />
                  </svg>
                  <div className="w-[70%] h-[70%] rounded-full overflow-hidden border-4 border-white z-10">
                    <img 
                      src={topThreeStudents[2]?.avatar} 
                      alt={topThreeStudents[2]?.name} 
                      className="w-full h-full object-cover" 
                      onError={() => handleImageError(3)}
                    />
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-3 sm:-top-4 md:-top-5 -right-1 sm:-right-2 z-20"
                >
                  <svg width="30" height="30" sm:width="35" sm:height="35" md:width="40" md:height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12,8 L13.5,11 L17,11.5 L14.5,14 L15,17.5 L12,16 L9,17.5 L9.5,14 L7,11.5 L10.5,11 L12,8 Z" fill="#A0A0A0" stroke="#808080" strokeWidth="1" />
                  </svg>
                </motion.div>
                <div className="absolute -bottom-2 right-0 bg-white rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium shadow-md z-20">
                {topThreeStudents[12]?.xp}
                                </div>
              </motion.div>
            </div>
            <h3 className="text-gray-500 font-semibold text-sm sm:text-base md:text-lg mt-2 sm:mt-3 text-center truncate w-full">{topThreeStudents[2]?.name}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{topThreeStudents[2]?.section}</p>
          </motion.div>
        </motion.div>
      )}

      {/* List of students */}
      <div className="w-full space-y-2 sm:space-y-3 md:space-y-4">
        {currentItems.map((student, index) => {
          // Skip the top 3 students on the first page
          if (currentPage === 1 && student.id <= 3) return null;
          
          return (
            <motion.div
              key={student.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Card className="flex items-center p-2 sm:p-3 md:p-4 rounded-full bg-white transition-shadow duration-300">
                <div className="text-[#8A4FFF] font-bold text-base sm:text-lg md:text-xl w-10 sm:w-12 md:w-16 text-center">
                  # {student.id}
                </div>
                <div className="relative">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-2 border-[#8A4FFF]">
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="h-full w-full rounded-full" 
                      onError={() => handleImageError(student.id)}
                    />
                  </Avatar>
                </div>
                <div className="ml-2 sm:ml-3 md:ml-4 flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate">{student.name}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">{student.section}</p>
                </div>
                <div className="bg-[#E6E1F9] text-[#8A4FFF] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full font-medium flex items-center text-xs sm:text-sm md:text-base ml-2">
                  <motion.span
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="mr-1"
                  >
                    ✨
                  </motion.span>
                  {student.xp} XP
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      <motion.div 
        className="mt-4 sm:mt-6 md:mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Pagination className="scale-75 sm:scale-90 md:scale-100">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  paginate(currentPage - 1);
                }} 
                className={cn(
                  "transition-all duration-300",
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                )} 
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    paginate(index + 1);
                  }} 
                  className={cn(
                    "transition-all duration-300 hover:scale-110",
                    currentPage === index + 1 ? "bg-[#8A4FFF] text-white" : ""
                  )}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  paginate(currentPage + 1);
                }} 
                className={cn(
                  "transition-all duration-300",
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                )} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </motion.div>
           
    </div>
    </div>
  )
}

export default Leaderboard
