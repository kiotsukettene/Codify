import React, { useState } from 'react'
import AppSidebar from '../../components/professor-view/Sidebar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Rocket, Star, MoreVertical, Eye, FileText, Trophy, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/Components/ui/separator';
import { Button } from "@/components/ui/button"
import { Video, Code } from "lucide-react"

const LessonOverview = () => {
  const lessons = [
    {
      id: 6,
      title: "Quest 6: Conditionals",
      description: "Understand what programming is, how it is used to solve problems, and learn the basics of writing code.",
      date: "Dec 20",
      content: [
        "What is programming?",
        "Basic programming constructs",
        "Variables and Data types",
        "Mission 6: Write your first code!"
      ]
    },
    {
      id: 5,
      title: "Quest 5: Error and Exception Handling",
      description: "Every language has unique syntax, typing, and execution styles, which influence how code is written and run.",
      date: "Dec 20",
      content: []
    },
    // Add more lessons as needed
  ]
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'activities', label: 'Activities', icon: <FileText className="w-4 h-4" /> },
    { id: 'scores', label: 'Scores', icon: <Trophy className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1">
        <SidebarInset className="flex-1 !p-0">
          <header className="flex h-16 items-center px-4">
            <SidebarTrigger 
              className="-ml-1"   
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Separator orientation="vertical" className="mx-2 h-4" />
          </header>

          <div className="p-12 pt-6 space-y-6"> 
            <div className="bg-violet-50 rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold mb-2">Programming Languages</h1>
              <p className="text-gray-600">Programming languages are the foundation of software development.</p>   

              <div className='justify-between flex'>     
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <img src="/path-to-java-icon.png" alt="Java" className="w-4 h-4" />
                  Java
                </span>
                <span>40 Students Enrolled</span>
                <span>un1c0d3city</span>
                <span>Wed, 5:30pm</span>
                <span>CS110</span>
                <span>BSCS 3B</span>
              </div>

              <div className="flex gap-2 mb-4">
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Video className="mr-2 h-4 w-4" />
                Meet
              </Button>
              <Button variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-50">
                <Code className="mr-2 h-4 w-4" />
                Code Battle
              </Button>
            </div>
            </div>
            </div>   



            <div className="w-full">
              <div className="border-b mb-6">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors
                        ${activeTab === tab.id 
                          ? 'border-b-2 border-violet-600 text-violet-600' 
                          : 'text-gray-500 hover:text-violet-600'
                        }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Lessons</h2>
                    <Accordion type="single" collapsible className="space-y-2">
                      {lessons.map((lesson) => (
                        <AccordionItem 
                          key={lesson.id} 
                          value={`lesson-${lesson.id}`}
                          className="border rounded-lg bg-white"
                        >
                          <div className="flex items-center justify-between p-4">
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-4">
                                <div className="bg-violet-100 p-2 rounded">
                                  <Rocket className="text-violet-600" size={20} />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-medium">{lesson.title}</h3>
                                  <p className="text-sm text-gray-500">{lesson.description}</p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{lesson.date}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreVertical className="h-5 w-5 text-gray-500" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-2">
                              {lesson.content.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-gray-600">
                                  <Star className="h-4 w-4 text-violet-600" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
                {activeTab === 'activities' && (
                  <div className="text-gray-500">Activities content here</div>
                )}
                {activeTab === 'scores' && (
                  <div className="text-gray-500">Scores content here</div>
                )}
                {activeTab === 'students' && (
                  <div className="text-gray-500">Students content here</div>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default LessonOverview
