import React, { useState, useEffect } from 'react'
import { Calendar, GamepadIcon as GameController, Shield, Swords, ScrollText, Trophy, Plus, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

const CreateBattle = () => {
  // State for form values
  const [battleData, setBattleData] = useState({
    title: "",
    description: "",
    duration: "",
    commencement: "",
    course: "",
    section: "",
    program: "",
    player1: "",
    player2: "",
    challenges: [{
      problemTitle: "",
      problemDescription: "",
      inputConstraints: "",
      expectedOutput: "",
    }],
    rules: "",
  })

  // State for dynamic options
  const [courses, setCourses] = useState([])
  const [sections, setSections] = useState([])
  const [programs, setPrograms] = useState([])
  const [players, setPlayers] = useState([])
  const [isOptionsLoading, setIsOptionsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [courseValue, setCourseValue] = useState("")
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);

  // Add this mapping of courses to programs
  const courseToPrograms = {
    'web': ['bscs'], // Web Development only for BSCS
    'programming': ['bscs', 'it'], // Programming for BSCS and IT
    'data': ['bscs', 'it', 'emc'], // Data Structures for all
  };

  // Add this mapping of programs to sections
  const programToSections = {
    'bscs': ['A', 'B'],
    'it': ['it3a', 'it3b'],
    'emc': ['emc3a'],
  };

  const number = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
  }

  // Fetch dynamic options when component mounts.
  useEffect(() => {
    const fetchOptions = async () => {
      // Simulate an API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const fetchedCourses = [
        { id: "programming", name: "Programming Languages" },
        { id: "web", name: "Web Development" },
        { id: "data", name: "Data Structures" },
      ]
      const fetchedSections = [
        { id: "cs3a", name: "A" },
        { id: "cs3b", name: "B" },
      ]
      const fetchedPrograms = [
        { id: "bscs", name: "BSCS" },
        { id: "it", name: "IT" },
        { id: "emc", name: "EMC" },
      ]
      const fetchedPlayers = [
        { id: "antang", name: "Antang, Irheil Mae" },
        { id: "bae", name: "Bae, Catherine" },
        { id: "doe", name: "Doe, John" },
        { id: "loreto", name: "Loreto, Russell Kelvin Anthony" },
        { id: "jerez", name: "Jerez, Marianne Celest" },
        { id: "chok", name: "Chok, Nicole Anne" },
      ]

      setCourses(fetchedCourses)
      setSections(fetchedSections)
      setPrograms(fetchedPrograms)
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

  const handleAddChallenge = () => {
    setBattleData(prev => ({
      ...prev,
      challenges: [...prev.challenges, {
        problemTitle: "",
        problemDescription: "",
        inputConstraints: "",
        expectedOutput: "",
      }]
    }));
  };

  const handleChallengeChange = (index, field, value) => {
    setBattleData(prev => {
      const newChallenges = [...prev.challenges];
      newChallenges[index] = {
        ...newChallenges[index],
        [field]: value
      };
      return {
        ...prev,
        challenges: newChallenges
      };
    });
  };

  const getAvailablePlayers = (currentPlayerId) => {
    if (currentPlayerId === 'player1') {
      return players.filter(player => player.id !== battleData.player2);
    } else {
      return players.filter(player => player.id !== battleData.player1);
    }
  };

  const handleCourseSelect = (currentValue) => {
    setCourseValue(currentValue === courseValue ? "" : currentValue);
    setBattleData({ ...battleData, course: currentValue });
    
    // Filter programs based on selected course
    const availablePrograms = courseToPrograms[currentValue] || [];
    setFilteredPrograms(programs.filter(prog => availablePrograms.includes(prog.id)));
    
    // Reset program and section selections
    setBattleData(prev => ({ ...prev, program: '', section: '' }));
    setFilteredSections([]);
    setOpen(false);
  };

  const handleProgramSelect = (value) => {
    setBattleData(prev => ({ ...prev, program: value }));
    
    const availableSections = programToSections[value] || [];
    setFilteredSections(sections.filter(sect => availableSections.includes(sect.id)));
    
    setBattleData(prev => ({ ...prev, section: '' }));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div  className="flex gap-3 justify-between pt-4 pb-4 ">
        <div className='flex gap-4'>
          <Trophy className="h-8 w-8 text-[#7C3AED]" />
          <h1 className="text-2xl font-bold">Create Your Epic Code Battle Arena</h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full border-muted-foreground/30">
              <HelpCircle className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-purple-600">Code compiler Information</DialogTitle>
              <DialogDescription >
              Each section of the interface plays a specific role in the process of code development and testing. Below is a detailed description of each component:<br /><br />
              <b>Main</b> <br /> This is where users type their source code in the selected programming language. This section acts as the central workspace where the logic and structure of the program are written and edited.<br /><br />
              <b>Input</b> <br /> This section is designed to accept user-provided input values that the program will read during execution. When a piece of code requires data from the user, the input area serves as the simulated input environment. Any values typed into this section will be passed to the program when it runs. <br /><br />
              <b>Output</b> <br /> This displays the results once the code is executed. This section shows any output generated by the program, including printed text, return values, and error messages. <br /><br />
              <b>Language Selector</b> <br /> This dropdown menu allows the user to choose the programming language they want to use. Selecting a language updates the environment accordingly, ensuring the correct syntax and behavior are applied during code execution. <br /><br />
              <b>Run Code</b> <br /> This execute the code written in the main panel. When this button is clicked, the system compiles and runs the program based on the selected language and any input provided that displays in the output panel. <br /><br />
              
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
          <CardContent className="space-y-3">
            <div className='space-y-2'>
              <label className="text-sm font-medium">Battle Title</label>
              <Input
                placeholder="Enter an epic battle title"
                value={battleData.title}
                onChange={(e) => setBattleData({ ...battleData, title: e.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <label className="text-sm font-medium">Battle Description</label>
              <Input
                placeholder="Describe the battle objectives and goals"
                value={battleData.description}
                onChange={(e) => setBattleData({ ...battleData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className='space-y-2'>
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
              <div className='space-y-2'>
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
            <div className="grid gap-4 md:grid-cols-12">
              <div className='space-y-2 col-span-6'>
                <label className="text-sm font-medium">Course</label>
                {isOptionsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {courseValue
                          ? courses.find((course) => course.id === courseValue)?.name
                          : "Select course..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Search course..." />
                        <CommandEmpty>No course found.</CommandEmpty>
                        <CommandGroup>
                          {courses.map((course) => (
                            <CommandItem
                              key={course.id}
                              value={course.id}
                              onSelect={handleCourseSelect}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  courseValue === course.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {course.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <div className='space-y-2 col-span-4'>
                <label className="text-sm font-medium">Program</label>
                {isOptionsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Select
                    onValueChange={handleProgramSelect}
                    value={battleData.program}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPrograms.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className='space-y-2 col-span-2'>
                <label className="text-sm font-medium">Section</label>
                {isOptionsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Select
                    onValueChange={(value) => setBattleData({ ...battleData, section: value })}
                    value={battleData.section}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSections.map((section) => (
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
              <div className='space-y-2'>
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
                      {getAvailablePlayers('player1').map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className='space-y-2'>
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
                      {getAvailablePlayers('player2').map((player) => (
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
        <div className='justify-between flex text-2xl font-semibold'>
               <div className=" text-[#7C3AED] flex items-center gap-2">
                <Swords className="h-5 w-5" />
                Battle Challenges
                </div>
        </div>

        {battleData.challenges.map((challenge, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#7C3AED] text-base">
                Challenge No. {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className='space-y-2'>
                <label className="text-sm font-medium">Problem Title</label>
                <Input
                  value={challenge.problemTitle}
                  onChange={(e) => handleChallengeChange(index, 'problemTitle', e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  className="min-h-[100px]"
                  value={challenge.problemDescription}
                  onChange={(e) => handleChallengeChange(index, 'problemDescription', e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className='space-y-2'>
                  <label className="text-sm font-medium">Input Constraints</label>
                  <Textarea
                    className="min-h-[100px]"
                    value={challenge.inputConstraints}
                    onChange={(e) => handleChallengeChange(index, 'inputConstraints', e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <label className="text-sm font-medium">Expected Output</label>
                  <Textarea
                    className="min-h-[100px]"
                    value={challenge.expectedOutput}
                    onChange={(e) => handleChallengeChange(index, 'expectedOutput', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add the button AFTER the map */}
        <div className="flex justify-end mt-4"> 
          <Button variant="ghost" onClick={handleAddChallenge} className="flex items-center gap-1 text-white hover:bg-purple-500 hover:text-gray-100 bg-purple-600">
            <Plus className="h-4 w-4" /> Add Challenge
          </Button>
        </div>

        {/* Battle Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#7C3AED]">
              <ScrollText className="h-5 w-5" />
              Battle Rules <p className='text-sm text-gray-400'>(Optional)</p>
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
  )
}

export default CreateBattle
