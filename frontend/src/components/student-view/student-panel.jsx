"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Play,
  Send,
  Compass,
  FileText,
  Award,
  Video,
  MessageSquare,
  BookOpen,
  Lock,
  Zap,
  Users,
  Monitor,
  Code,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

export default function SupportPanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("faq")



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-xl z-50 overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >


            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Need Help?
                </h2>
                <p className="text-violet-100 text-sm">Your learning assistant is here!</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>


            {/* Tabs */}
            <Tabs defaultValue="faq" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="w-full h-auto p-0 bg-transparent flex">
                  <TabsTrigger
                    value="faq"
                    className={`flex-1 py-3 rounded-none border-b-2 ${
                      activeTab === "faq" ? "border-violet-500 text-violet-700" : "border-transparent text-gray-500"
                    }`}
                  >
                    Quick Help
                  </TabsTrigger>
                  <TabsTrigger
                    value="tutorials"
                    className={`flex-1 py-3 rounded-none border-b-2 ${
                      activeTab === "tutorials"
                        ? "border-violet-500 text-violet-700"
                        : "border-transparent text-gray-500"
                    }`}
                  >
                    Tutorials
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    className={`flex-1 py-3 rounded-none border-b-2 ${
                      activeTab === "contact" ? "border-violet-500 text-violet-700" : "border-transparent text-gray-500"
                    }`}
                  >
                    Contact
                  </TabsTrigger>
                  <TabsTrigger
                    value="navigation"
                    className={`flex-1 py-3 rounded-none border-b-2 ${
                      activeTab === "navigation"
                        ? "border-violet-500 text-violet-700"
                        : "border-transparent text-gray-500"
                    }`}
                  >
                    Navigation
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                {/* FAQ Tab */}
                <TabsContent value="faq" className="p-4 mt-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="hover:bg-violet-50 px-3 rounded-lg">
                        <div className="flex items-center gap-2 text-left">
                          <Lock className="h-4 w-4 text-violet-500" />
                          <span>How do I reset my password?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        <div className="bg-violet-50 p-3 rounded-lg text-sm">
                          Click on "Forgot Password" on the login page. Enter your email address and follow the
                          instructions sent to your inbox.
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="hover:bg-violet-50 px-3 rounded-lg">
                        <div className="flex items-center gap-2 text-left">
                          <Award className="h-4 w-4 text-violet-500" />
                          <span>How does XP work?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        <div className="bg-violet-50 p-3 rounded-lg text-sm">
                          XP (Experience Points) are earned by completing activities, quizzes, and assignments. Reach
                          certain XP thresholds to level up and unlock new badges and features.
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="hover:bg-violet-50 px-3 rounded-lg">
                        <div className="flex items-center gap-2 text-left">
                          <Users className="h-4 w-4 text-violet-500" />
                          <span>How to join or enroll to a course?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        <div className="bg-violet-50 p-3 rounded-lg text-sm">
                          Go to the Courses page, browse available courses, and click "Enroll" on the course you want to
                          join. Some courses may require an enrollment key from your instructor.
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="hover:bg-violet-50 px-3 rounded-lg">
                        <div className="flex items-center gap-2 text-left">
                          <Monitor className="h-4 w-4 text-violet-500" />
                          <span>How does video conference work?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        <div className="bg-violet-50 p-3 rounded-lg text-sm">
                          Click on the "Join Meeting" button in your course. Allow camera and microphone permissions
                          when prompted. Use the controls at the bottom of the screen to manage your audio, video, and
                          screen sharing.
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="hover:bg-violet-50 px-3 rounded-lg">
                        <div className="flex items-center gap-2 text-left">
                          <Code className="h-4 w-4 text-violet-500" />
                          <span>How to participate in code battle?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        <div className="bg-violet-50 p-3 rounded-lg text-sm">
                          Navigate to the Code Battle section, join an open battle or create your own. You'll be given
                          coding challenges to solve within a time limit. Submit your solutions and see how you rank
                          against other participants.
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger className="hover:bg-violet-50 px-3 rounded-lg">
                        <div className="flex items-center gap-2 text-left">
                          <Upload className="h-4 w-4 text-violet-500" />
                          <span>How to submit my activity?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        <div className="bg-violet-50 p-3 rounded-lg text-sm">
                          Go to the activity page, click "Submit Assignment," upload your files or enter your text
                          submission, and click "Submit." You can edit your submission until the due date.
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                      <AccordionTrigger className="hover:bg-violet-50 px-3 rounded-lg">
                        <div className="flex items-center gap-2 text-left">
                          <Zap className="h-4 w-4 text-violet-500" />
                          <span>How do challenges work?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        <div className="bg-violet-50 p-3 rounded-lg text-sm">
                          Challenges are timed activities that test your knowledge and skills. Complete them to earn XP
                          and badges. Some challenges unlock progressively as you level up in the course.
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                {/* Tutorials Tab */}
                <TabsContent value="tutorials" className="p-4 mt-0">


                  <div className="space-y-3">
                    {/* Tutorial 1 */}
                    <Card className="overflow-hidden border-violet-200 hover:border-violet-300 transition-colors">
                      <div className="relative">
                        <div className="bg-indigo-200 aspect-video flex items-center justify-center">
                          <Play className="h-10 w-10 text-white opacity-80" />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">Watched</Badge>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Video className="h-4 w-4 text-violet-500" />
                          Getting Started Guide
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">Learn the basics of navigating the platform</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">2:45</span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-violet-600">
                            Rewatch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tutorial 2 */}
                    <Card className="overflow-hidden border-violet-200 hover:border-violet-300 transition-colors">
                      <div className="relative">
                        <div className="bg-blue-400 aspect-video flex items-center justify-center">
                          <Play className="h-10 w-10 text-white opacity-80" />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">Watched</Badge>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Zap className="h-4 w-4 text-violet-500" />👾 Quick Guide: Earn XP Faster
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">Tips and tricks to level up quickly</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">3:12</span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-violet-600">
                            Rewatch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tutorial 3 */}
                    <Card className="overflow-hidden border-violet-200 hover:border-violet-300 transition-colors">
                      <div className="relative">
                        <div className="bg-pink-300 aspect-video flex items-center justify-center">
                          <Play className="h-10 w-10 text-white opacity-80" />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">Watched</Badge>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Code className="h-4 w-4 text-violet-500" />
                          Code Battle Tutorial
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">Learn how to compete in coding challenges</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">4:30</span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-violet-600">
                            Rewatch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tutorial 4 */}
                    <Card className="overflow-hidden border-violet-200 hover:border-violet-300 transition-colors">
                      <div className="relative">
                        <div className="bg-orange-200 aspect-video flex items-center justify-center">
                          <Play className="h-10 w-10 text-white opacity-80" />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Award className="h-4 w-4 text-violet-500" />
                          Unlocking Special Badges
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">Discover hidden achievements and how to earn them</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">5:15</span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-violet-600">
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tutorial 5 */}
                    <Card className="overflow-hidden border-violet-200 hover:border-violet-300 transition-colors">
                      <div className="relative">
                        <div className="bg-green-200 aspect-video flex items-center justify-center">
                          <Play className="h-10 w-10 text-white opacity-80" />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Users className="h-4 w-4 text-violet-500" />
                          Collaborating with Classmates
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">How to use group features effectively</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">3:45</span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-violet-600">
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="p-4 mt-0">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <Input
                        placeholder="What do you need help with?"
                        className="border-violet-200 focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <Textarea
                        placeholder="Please describe your issue in detail..."
                        className="min-h-[120px] border-violet-200 focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (optional)</label>
                      <div className="border-2 border-dashed border-violet-200 rounded-lg p-4 text-center hover:bg-violet-50 transition-colors cursor-pointer">
                        <Upload className="h-6 w-6 text-violet-400 mx-auto mb-2" />
                        <p className="text-sm text-violet-600">Drop files here or click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </Button>
                  </div>
                </TabsContent>

                {/* Navigation Tab */}
                <TabsContent value="navigation" className="p-4 mt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="border-violet-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-3 flex flex-col items-center text-center">
                        <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mb-2">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium text-sm">Modules</h4>
                        <p className="text-xs text-gray-500 mt-1">View course content</p>
                      </CardContent>
                    </Card>

                    <Card className="border-violet-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-3 flex flex-col items-center text-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                          <FileText className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium text-sm">Assignments</h4>
                        <p className="text-xs text-gray-500 mt-1">Check your tasks</p>
                      </CardContent>
                    </Card>

                    <Card className="border-violet-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-3 flex flex-col items-center text-center">
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
                          <Award className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium text-sm">XP Progress</h4>
                        <p className="text-xs text-gray-500 mt-1">Track your levels</p>
                      </CardContent>
                    </Card>

                    <Card className="border-violet-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-3 flex flex-col items-center text-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                          <Code className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium text-sm">Code Battle</h4>
                        <p className="text-xs text-gray-500 mt-1">Join coding challenges</p>
                      </CardContent>
                    </Card>

                    <Card className="border-violet-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-3 flex flex-col items-center text-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
                          <Users className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium text-sm">Classmates</h4>
                        <p className="text-xs text-gray-500 mt-1">Connect with peers</p>
                      </CardContent>
                    </Card>

                    <Card className="border-violet-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-3 flex flex-col items-center text-center">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                          <Video className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium text-sm">Live Sessions</h4>
                        <p className="text-xs text-gray-500 mt-1">Join video conferences</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium text-violet-800 text-sm">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-start border-violet-200 text-violet-700">
                        <Compass className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start border-violet-200 text-violet-700">
                        <Award className="h-4 w-4 mr-2" />
                        Achievements
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start border-violet-200 text-violet-700">
                        <FileText className="h-4 w-4 mr-2" />
                        Grades
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start border-violet-200 text-violet-700">
                        <Users className="h-4 w-4 mr-2" />
                        Groups
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}