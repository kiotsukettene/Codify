import React from 'react'
import { Card } from "@/components/ui/card"
import { Medal } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Dog from '@/assets/picture/Avatar/Dog.png'
import { motion } from "framer-motion"


const ScoreTab = ({ metrics, students }) => {
  return (
    <div className="p-2 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            key={metric.title}
          >
            <Card className="p-6 bg-purple-50 transition-colors hover:bg-purple-100">
              <h3 className="font-medium text-gray-700">{metric.title}</h3>
              <p className="text-4xl font-bold text-gray-900 my-2">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.subtitle}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <div className="rounded-md border min-w-[600px]">
          <div className="grid grid-cols-12 gap-2 sm:gap-4 bg-purple-50 p-2 sm:p-4">
            <div className="col-span-4 font-medium text-sm sm:text-base">Student Name</div>
            <div className="col-span-3 text-center font-medium text-sm sm:text-base">Activities</div>
            <div className="col-span-3 text-center font-medium text-sm sm:text-base">Incomplete</div>
            <div className="col-span-2 text-right font-medium text-sm sm:text-base">Total Score</div>
          </div>

          {students.map((student, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ backgroundColor: '#faf5ff' }}
              key={student.name}
              className="grid grid-cols-12 gap-2 sm:gap-4 p-2 sm:p-4 items-center border-t transition-all duration-200"
            >
              <div className="col-span-4 flex items-center gap-2 sm:gap-4">
                {student.hasMedal && (
                  <motion.div className="hidden sm:block">
                    <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={Dog} alt={student.name} />
                    <AvatarFallback className="text-xs sm:text-sm">{student.initials}</AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-sm sm:text-base truncate">{student.name}</span>
                  {student.rank <= 3 && (
                    <span className="hidden sm:inline-block px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                      Rank {student.rank}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-3 text-center text-sm sm:text-base">{student.activities}</div>
              <div className="col-span-3 text-center text-sm sm:text-base">{student.incomplete}</div>
              <div className="col-span-2 text-right text-sm sm:text-base">{student.totalScore}</div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default ScoreTab
