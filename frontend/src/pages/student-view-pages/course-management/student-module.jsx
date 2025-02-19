"use client"
import { Card, CardTitle } from "@/components/ui/card"
import StudentLessonContent from "@/components/student-view/student-lesson-content"
import totalXpImg from "@/assets/picture/courses/totalXp.png"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, PlayCircle } from "lucide-react"
import XPChallengeCard from "@/components/student-view/XPChallengeCard"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"

function StudentModulePage() {
  const [activeTopicId, setActiveTopicId] = useState(1)
  const topicRefs = useRef({})

  const topics = [
    {
      id: 1,
      title: "Learn The Protocols",
      icon: CheckCircle,
      isActive: true,
      isCompleted: true,
      content: `
      In today's digital world, networking plays a crucial role in connecting devices, people, and services. 
      Networking allows computers, smartphones, and other devices to communicate, share data, and access resources efficiently.
    
      ### What is Networking?
      Networking refers to the practice of connecting multiple computing devices together to share resources and communicate. 
      It enables seamless data transfer between devices, whether within a small office, a large corporation, or even across the globe.
      
      ### Importance of Networking:
      - **Communication**: Enables email, messaging, and video conferencing.
      - **Resource Sharing**: Printers, storage devices, and internet connections can be shared.
      - **Data Transfer**: Allows file sharing between users and applications.
      - **Remote Access**: Employees can work from different locations securely.
      `,
    },
    {
      id: 2,
      title: "What is Lan?",
      icon: PlayCircle,
      xp: 10,
      content: `
       ### Types of Networks:
    - **Local Area Network (LAN)** - Covers a small area like a home or office.
    - **Wide Area Network (WAN)** - Covers larger areas, like cities or countries.
    - **Metropolitan Area Network (MAN)** - Connects multiple LANs in a city.
    - **Personal Area Network (PAN)** - A small network for personal devices (e.g., Bluetooth).
  
    ### Role of the Internet in Networking:
    The internet is the largest global network, interconnecting millions of devices worldwide. It uses various **protocols** such as:
    - **TCP/IP (Transmission Control Protocol/Internet Protocol)** - The foundation of internet communication.
    - **HTTP/HTTPS (HyperText Transfer Protocol/Secure)** - Used for browsing websites.
    - **FTP (File Transfer Protocol)** - Used to transfer files between devices.
     The internet is the largest global network, interconnecting millions of devices worldwide. It uses various **protocols** such as:
    - **TCP/IP (Transmission Control Protocol/Internet Protocol)** - The foundation of internet communication.
    - **HTTP/HTTPS (HyperText Transfer Protocol/Secure)** - Used for browsing websites.
    - **FTP (File Transfer Protocol)** - Used to transfer files between devices.
     The internet is the largest global network, interconnecting millions of devices worldwide. It uses various **protocols** such as:
    - **TCP/IP (Transmission Control Protocol/Internet Protocol)** - The foundation of internet communication.
    - **HTTP/HTTPS (HyperText Transfer Protocol/Secure)** - Used for browsing websites.
    - **FTP (File Transfer Protocol)** - Used to transfer files between devices.
  
      `,
    },
    {
      id: 3,
      title: "Practice, Practice, Practice",
      icon: PlayCircle,
      xp: 10,
      content: `
      In today's digital world, networking plays a crucial role in connecting devices, people, and services. 
      Networking allows computers, smartphones, and other devices to communicate, share data, and access resources efficiently.
    
      ### What is Networking?
      Networking refers to the practice of connecting multiple computing devices together to share resources and communicate. 
      It enables seamless data transfer between devices, whether within a small office, a large corporation, or even across the globe.
      
      ### Importance of Networking:
      - **Communication**: Enables email, messaging, and video conferencing.
      - **Resource Sharing**: Printers, storage devices, and internet connections can be shared.
      - **Data Transfer**: Allows file sharing between users and applications.
      - **Remote Access**: Employees can work from different locations securely.
       The internet is the largest global network, interconnecting millions of devices worldwide. It uses various **protocols** such as:
    - **TCP/IP (Transmission Control Protocol/Internet Protocol)** - The foundation of internet communication.
    - **HTTP/HTTPS (HyperText Transfer Protocol/Secure)** - Used for browsing websites.
    - **FTP (File Transfer Protocol)** - Used to transfer files between devices.
  
      `,
    },
    {
      id: 4,
      title: "Make a diagram",
      icon: PlayCircle,
      xp: 10,
      content: `
      In today's digital world, networking plays a crucial role in connecting devices, people, and services. 
      Networking allows computers, smartphones, and other devices to communicate, share data, and access resources efficiently.
    
      ### What is Networking?
      Networking refers to the practice of connecting multiple computing devices together to share resources and communicate. 
      It enables seamless data transfer between devices, whether within a small office, a large corporation, or even across the globe.
      
      ### Importance of Networking:
      - **Communication**: Enables email, messaging, and video conferencing.
      - **Resource Sharing**: Printers, storage devices, and internet connections can be shared.
      - **Data Transfer**: Allows file sharing between users and applications.
      - **Remote Access**: Employees can work from different locations securely.
       The internet is the largest global network, interconnecting millions of devices worldwide. It uses various **protocols** such as:
    - **TCP/IP (Transmission Control Protocol/Internet Protocol)** - The foundation of internet communication.
    - **HTTP/HTTPS (HyperText Transfer Protocol/Secure)** - Used for browsing websites.
    - **FTP (File Transfer Protocol)** - Used to transfer files between devices.
  
      `,
    },
  ]

  const scrollToTopic = useCallback((topicId) => {
    topicRefs.current[topicId]?.scrollIntoView({ behavior: "smooth" })
  }, [])

  

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const topicId = Number.parseInt(entry.target.getAttribute("data-topic-id"))
            setActiveTopicId(topicId)
          }
        })
      },
      {
        rootMargin: "-50% 0px -50% 0px", //============== Trigger when topic is in center of viewport
        threshold: 0,
      },
    )

    //================ Observe all topic sections==================
    topics.forEach((topic) => {
      if (topicRefs.current[topic.id]) {
        observer.observe(topicRefs.current[topic.id])
      }
    })

    return () => observer.disconnect()
  }, [topics])





  return (
    <div className="flex flex-row mt-5">
      <div className="w-full lg:w-3/4">
        <Card className="shadow-none border-none bg-white p-6">
          <CardTitle className='bg-pink-50 p-5 rounded-lg'>Module 1: Introduction to Networking</CardTitle>

          <div className="mt-5 max-h-[calc(100vh-200px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {topics.map((topic) => (
              <div
                key={topic.id}
                ref={(el) => (topicRefs.current[topic.id] = el)}
                data-topic-id={topic.id}
                className="mb-8"
              >
                <StudentLessonContent title={topic.title} content={topic.content} />
                {topic.id !== topics.length && <hr className="my-8 border-t-2 border-gray-100" />}
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 flex justify-end">
            <Button className="bg-primary text-white hover:bg-purple-700 px-6 py-2 rounded-md">
              🚀 Complete Module
            </Button>
          </div>
        </Card>
      </div>

      <div className="w-full lg:w-1/4 px-5">



        {/*=========================== XP========================== Card */}
        <Card
          className="relative flex items-center justify-between mb-5 p-4 md:p-6 border-none shadow-none h-16 md:h-20 rounded-3xl max-w-[200px] md:max-w-md"
          style={{
            background: "linear-gradient(90deg, rgb(243, 232, 255) 0%, rgb(224, 242, 254) 100%)",
          }}
        >
          <div className="z-10">
            <CardTitle className="text-xs md:text-sm lg:text-lg text-[#8268AE] font-medium">Total XP Earned</CardTitle>
            <h2 className="text-lg md:text-2xl lg:text-3xl text-[#7548C1] font-bold">40 XP</h2>
          </div>
          <div className="hidden md:block absolute right-0 bottom-0 w-20 md:w-24 lg:w-28">
            <img
              src={totalXpImg}
              className="w-full h-auto object-cover"
              alt="Astronaut XP Icon"
            />
          </div>
        </Card>

        <Accordion
          type="single"
          collapsible
          defaultValue="topics"
          className="w-full bg-white rounded-lg shadow-none border-none p-4 sticky top-4"
        >
          <AccordionItem value="topics">
            <AccordionTrigger className="flex justify-between items-center p-4 hover:bg-gray-50">
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold text-gray-900">Topics Covered</h2>
                <span className="text-sm text-gray-400">Progress: 20% Completed</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToTopic(topic.id)}
                    className={`relative flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 rounded-lg ${
                      activeTopicId === topic.id
                        ? "bg-purple-50 border-l-4 border-purple-500"
                        : topic.isCompleted
                          ? "bg-green-50 border-l-4 border-green-500"
                          : ""
                    }`}
                  >
                    <div className="pl-4">
                      <h3 className="font-medium text-gray-900">
                        {topic.id}: {topic.title}
                      </h3>
                    </div>
                    {topic.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500 animate-bounce" />
                    ) : (
                      <PlayCircle className="h-5 w-5 text-gray-500" />
                    )}
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-5">
          <XPChallengeCard />
        </div>
      </div>
    </div>
  )
}

export default StudentModulePage

