import React, { useState, useEffect } from 'react'
import { Calendar, GamepadIcon as GameController, Shield, Swords, ScrollText, Trophy, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from '@/components/LoadingSpinner'

const CreateBattle = () => {
  // State for form values
  const [battleData, setBattleData] = useState({
    title: "",
    description: "",
    duration: "",
    commencement: "",
    course: "",
    section: "",
    player1: "",
    player2: "",
    problemTitle: "",
    problemDescription: "",
    inputConstraints: "",
    expectedOutput: "",
    rules: "",
  })

  // State for dynamic options
  const [courses, setCourses] = useState([])
  const [sections, setSections] = useState([])
  const [players, setPlayers] = useState([])
  const [isOptionsLoading, setIsOptionsLoading] = useState(true)

  // Fetch dynamic options when component mounts.
  useEffect(() => {
    const fetchOptions = async () => {
      // Simulate an API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      // These values would be fetched from your API
      const fetchedCourses = [
        { id: "programming", name: "Programming Languages" },
        { id: "web", name: "Web Development" },
        { id: "data", name: "Data Structures" },
      ]
      const fetchedSections = [
        { id: "cs3a", name: "CS3A" },
        { id: "cs3b", name: "CS3B" },
        { id: "cs3c", name: "CS3C" },
      ]
      const fetchedPlayers = [
        { id: "antang", name: "Antang, Irheil Mae" },
        { id: "bae", name: "Bae, Catherine" },
        { id: "doe", name: "Doe, John" },
      ]

      setCourses(fetchedCourses)
      setSections(fetchedSections)
      setPlayers(fetchedPlayers)
      setIsOptionsLoading(false)
    }
    fetchOptions()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(battleData)
    // Here you can call your API to submit the battleData
  }

  return (
    <div className=" bg-gray-50 p-4 md:p-8 w-full">
      <div>
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Trophy className="h-12 w-12 text-[#7C3AED]" />
          <div>
            <h1 className="text-2xl font-bold">Create Your Epic Code Battle Arena</h1>
            <p className="text-gray-600">
              Design an exciting coding challenge and let your students compete for glory!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Battle Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7C3AED]">
                <GameController className="h-5 w-5" />
                Battle Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Battle Title</label>
                <Input
                  placeholder="Enter an epic battle title"
                  value={battleData.title}
                  onChange={(e) => setBattleData({ ...battleData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Battle Description</label>
                <Input
                  placeholder="Describe the battle objectives and goals"
                  value={battleData.description}
                  onChange={(e) => setBattleData({ ...battleData, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Battle Duration (minutes)
                  </label>
                  <Input
                    placeholder="Enter duration"
                    value={battleData.duration}
                    onChange={(e) => setBattleData({ ...battleData, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Battle Commencement
                  </label>
                  <Input
                    type="date"
                    placeholder="DD/MM/YYYY"
                    value={battleData.commencement}
                    onChange={(e) => setBattleData({ ...battleData, commencement: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Champions & Challengers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7C3AED]">
                <Shield className="h-5 w-5" />
                Champions & Challengers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Course</label>
                  {isOptionsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <Select
                      onValueChange={(value) => setBattleData({ ...battleData, course: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Section</label>
                  {isOptionsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <Select
                      onValueChange={(value) => setBattleData({ ...battleData, section: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Player 1</label>
                  {isOptionsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <Select
                      onValueChange={(value) => setBattleData({ ...battleData, player1: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Player 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Player 2</label>
                  {isOptionsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <Select
                      onValueChange={(value) => setBattleData({ ...battleData, player2: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Player 2" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Battle Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-[#7C3AED]">
                <div className="flex items-center gap-2">
                  <Swords className="h-5 w-5" />
                  Battle Challenges
                </div>
                <Button variant="ghost" size="icon">
                  <Plus className="h-5 w-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Problem Title</label>
                <Input
                  value={battleData.problemTitle}
                  onChange={(e) =>
                    setBattleData({ ...battleData, problemTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  className="min-h-[100px]"
                  value={battleData.problemDescription}
                  onChange={(e) =>
                    setBattleData({ ...battleData, problemDescription: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Input Constraints</label>
                  <Textarea
                    className="min-h-[100px]"
                    value={battleData.inputConstraints}
                    onChange={(e) =>
                      setBattleData({ ...battleData, inputConstraints: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expected Output</label>
                  <Textarea
                    className="min-h-[100px]"
                    value={battleData.expectedOutput}
                    onChange={(e) =>
                      setBattleData({ ...battleData, expectedOutput: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Battle Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7C3AED]">
                <ScrollText className="h-5 w-5" />
                Battle Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add additional rules"
                className="min-h-[100px]"
                value={battleData.rules}
                onChange={(e) =>
                  setBattleData({ ...battleData, rules: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Need help mastering the art of battle?{" "}
              <a href="#" className="text-[#7C3AED] hover:underline">
                Consult the Battle Manual
              </a>
            </p>
            <div className="flex gap-3">
              <Button variant="outline" type="button">
                Save
              </Button>
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]" type="submit">
                Commence Now
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBattle
