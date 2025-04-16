import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, MoreHorizontal, Rocket, Edit, Trash2, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import pic from "@/assets/picture/courses/header.png"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from 'react-router-dom'

const CodeBattleTab = () => {
  const [activeBattles, setActiveBattles] = useState([])
  const [scheduledBattles, setScheduledBattles] = useState([])
  const navigate = useNavigate()
    
  useEffect(() => {
    const fetchData = async () => {
      const activeBattlesData = [
        {
          id: 1,
          challenge: "Challenge : Array Manipulation",
          description: "Programming Languages | BSCS 3B | 45 minutes",
          challengers: [
            { name: "Irheil Mae S. Antang", progress: 80 },
            { name: "Rusell Kelvin Anthony B. Loreto", progress: 40 },
          ],
        },
        {
          id: 2,
          challenge: "Challenge : Sorted Arrays",
          description: "Programming Languages | BSCS 3A | 20 minutes",
          challengers: [
            { name: "Irish Mae C. Blanko", progress: 30 },
            { name: "Belle M. Sinag", progress: 40 },
          ],
        },
      ]

      const scheduledBattlesData = [
        { id: 1, title: "Data Structures Challenge", time: "Tomorrow, 10:00 AM" },
        { id: 2, title: "Algorithm Optimization", time: "Friday, 2:00 PM" },
        { id: 3, title: "Binary Search", time: "Saturday, 1:00 PM" },
        { id: 4, title: "String Compression", time: "Saturday, 3:00 PM" },
      ]

      setActiveBattles(activeBattlesData)
      setScheduledBattles(scheduledBattlesData)
    }

    fetchData()
  }, [])

  const handleCreateBattle = () => {
    navigate("/professor/code-battle/create")
  }
  const handleEditBattle = (id) => {
    console.log(`Edit battle with id: ${id}`)
    // Implement edit functionality
  }

  const handleDeleteBattle = (id) => {
    console.log(`Delete battle with id: ${id}`)
    // Implement delete functionality
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl bg-gradient-to-r from-[#f5f0ff] to-[#e9dfff] overflow-hidden relative shadow-md"
      >
        <div className="items-end justify-between p-8 md:p-16">
           {/* Astronaut illustrations */}

           <div className="absolute left-0 bottom-0 w-full h-full pointer-events-none">
            <div>
              <motion.img 
                src={pic} 
                className='w-64 lg:w-96'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4">
          <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-mono text-base lg:text-3xl font-bold text-gray-800 text-center md:text-left ml-56 lg:ml-80"
            >
              Time to guide the Challengers!
            </motion.h1>
          </div>
         
          <motion.div
            whileTap={{ scale: 0.95 }}
            className='justify-end flex'
          >
            <Button 
              className="bg-[#7c3aed] hover:bg-[#6d28d9] transition-all duration-300 lg:text-base text-xs"
              onClick={handleCreateBattle}
            >
              <Play className="lg:mr-2 h-4 w-4" />
              CREATE BATTLE
            </Button>
          </motion.div>
        </div>
        
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Battles Section */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
              className="h-2 w-2 rounded-full bg-green-500" 
            />
            <h2 className="font-semibold text-green-500 flex items-center">
              Active Battles
            </h2>
          </div>

          <div className="space-y-4">
              <AnimatePresence>
                {activeBattles.map((battle, index) => (
                  <motion.div
                    key={battle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="transition-all duration-300"
                  >
                    <Card className="overflow-hidden bg-white border shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-[120px] w-full sm:w-[160px] bg-gradient-to-br from-gray-500 to-black flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:bg-gray-800/50 hover:text-white flex items-center gap-2"
                            >
                              <Play className="h-4 w-4" />
                              Watch Live
                            </Button>
                          </motion.div>
                        </div>
                        <div className="flex-1 p-4">
                          <h3 className="text-lg font-semibold">{battle.challenge}</h3>
                          <p className="mb-4 text-sm text-gray-500">{battle.description}</p>
                          <div className="space-y-4">
                            {battle.challengers.map((challenger, idx) => (
                              <div key={idx}>
                                <div className="mb-1.5 flex items-center justify-between text-sm">
                                  <span className="font-medium">{challenger.name}</span>
                                  <span className="flex items-center gap-1 text-purple-600">
                                    <Rocket className="h-4 w-4" />
                                    {challenger.progress}%
                                  </span>
                                </div>
                                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${challenger.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 + idx * 0.2 }}
                                  ></motion.div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
          </div>
        </div>


        {/* Scheduled Battles Section */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
            />
            <h2 className="font-semibold text-[#7c3aed] flex text-lg ">
            <Calendar className="mr-2 h-4 w-4 mt-1" />
              Scheduled Battles</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-4 border shadow-sm bg-gradient-to-b from-white to-[#fcfaff]">
              <div className="space-y-2">
                  <AnimatePresence>
                    {scheduledBattles.map((battle, index) => (
                      <motion.div 
                        key={battle.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ backgroundColor: "#f9f5ff" }}
                        className="flex items-center justify-between p-3 rounded-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-1 bg-purple-600 rounded-full h-6"
                          ></div>
                          <div>
                            <h3 className="font-medium">{battle.title}</h3>
                            <p className="text-sm text-gray-500">{battle.time}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditBattle(battle.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteBattle(battle.id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    ))}
                  </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  )
}

export default CodeBattleTab
