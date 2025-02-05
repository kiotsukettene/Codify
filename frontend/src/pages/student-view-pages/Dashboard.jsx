import AppSidebar from '@/components/student-view/Sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from '@radix-ui/react-context-menu'
import Typewriter from '@/components/fancy/typewriter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartNoAxesColumnIncreasing, LibraryBig, NotebookTabs, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dashboardImage from "../../assets/picture/random background/dashboard-img.png";
import StudentHeader from '@/components/student-view/Header'
import spaceShip from "../../assets/picture/random background/dashboard-spaceShip.png";

function StudentDashboard() {
  const classes = [
    {
      initials: "SE",
      name: "Software Engineering",
      date: "October 10, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      initials: "WTS",
      name: "Web System and Technologies",
      date: "October 15, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
    },
    {
      initials: "NAC",
      name: "Networks and Communication",
      date: "October 30, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      initials: "SF",
      name: "System Fundamentals",
      date: "November 10, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-red-400",
      bgColor: "bg-red-50",
    },
    {
      initials: "DB",
      name: "Database Systems",
      date: "November 15, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      initials: "AI",
      name: "Artificial Intelligence",
      date: "November 20, 2024",
      time: "8 A.M - 9 A.M",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
  ]
  return (
    <SidebarProvider>
  <AppSidebar/>
  <div className="flex mx-7">
  <SidebarInset className="flex-1">
      <header className="flex h-20 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
     
        <StudentHeader />
      </header>
      <div className="lg:text-2xl sm:text-3xl text-2xl flex flex-row items-start justify-starttext-foreground dark:text-muted font-normal overflow-hidden p-6 ">
          <p className="whitespace-pre-wrap">
            <span>{"Hi Momo 🌞 "}</span>
            <br />
            <Typewriter
              text={[
                "Welcome to Codify",
                "Good to see you!",
                "Ready to create something awesome?",
                "Keep shining 🌟",
                "Fuel your creativity today!",
              ]}
              speed={70}
              className="text-primary font-semibold"
              waitTime={1500}
              deleteSpeed={40}
              cursorChar={"_"}
            />
          </p>
        </div>

      <div className="flex flex-col lg:flex-row gap-3">
        {/*=================== LEFT SIDE ==================== */}
        <div className="w-full lg:w-[65%] p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 auto-rows-min">
              <Card className="w-full h-56 rounded-xl bg-white border-0 shadow-none px-4">
                <CardHeader className="pt-7">
                  <CardTitle
                    className="text-lg font-medium"
                    style={{ color: "#908E96" }}
                  >
                    Total Course
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <div>
                      <p
                        className="text-base font-medium"
                        style={{ color: "#FF62A4" }}
                      >
                        All
                      </p>
                      <h1 className="pt-1 text-5xl text-neutral-900 font-semibold">
                        12
                      </h1>
                    </div>
                    <div>
                      <LibraryBig color="#FF62A4" className="w-20 h-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full h-56 rounded-xl bg-white border-0 shadow-none">
                <CardHeader className="pt-7">
                  <CardTitle
                    className="text-lg font-medium"
                    style={{ color: "#908E96" }}
                  >
                    Total Course
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-base font-medium text-primary">All</p>
                      <h1 className="pt-1 text-5xl text-neutral-950 font-semibold">
                        12
                      </h1>
                    </div>
                    <div>
                      <ChartNoAxesColumnIncreasing
                        color="#FF859A"
                        className="w-20 h-20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="col-span-1 md:col-span-2 h-85 w-full rounded-xl bg-violet-200 relative">
                <div className="flex flex-col md:flex-row px-10 gap-4 items-center justify-between">
          <div className="pt-5">
            <h1 style={{color: '#1B2559'}} className="leading-normal text-4xl font-semibold">
              Check up your current  <br />
              and upcoming task here
            </h1>
            <Button className="bg-primary rounded-full flex items-center font-normal gap-2 px-20 py-6 text-sm text-white mt-5">
              <span>View Task</span>
            </Button>
          </div>
          <div className="hidden lg:block">
            <img src={dashboardImage} className="w-full h-auto lg:w-80 lg:h-80" alt="" />
          </div>
        </div>

                {/* <div
                  className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 shadow-lg bg-violet-200"
                  ref={containerRef}
                >
                  <div className="relative h-full w-full cursor-pointer overflow-hidden  justify-start items-start shadow-lg flex bg-primaryBlue text-white">
                    <div className="flex flex-col justify-center uppercase leading-none pt-4 pl-6">
                      <TextCursorProximity
                        label="DIGITAL"
                        className=" text-3xl will-change-transform sm:text-6xl md:text-6xl lg:text-7xl font-overusedGrotesk"
                        styles={{
                          transform: {
                            from: "scale(1)",
                            to: "scale(1.4)",
                          },
                          color: { from: "#ffffff", to: "#ff87c1" },
                        }}
                        falloff="gaussian"
                        radius={100}
                        containerRef={containerRef}
                      />
                      <TextCursorProximity
                        label="WORKSHOP"
                        className="leading-none text-3xl will-change-transform sm:text-6xl md:text-6xl lg:text-7xl font-overusedGrotesk"
                        styles={{
                          transform: {
                            from: "scale(1)",
                            to: "scale(1.4)",
                          },
                          color: { from: "#ffffff", to: "#ff87c1" },
                        }}
                        falloff="gaussian"
                        radius={100}
                        containerRef={containerRef}
                      />
                    </div>

                    <div className="absolute bottom-2 flex w-full justify-between px-6">
                      {ASCII.map((hand, i) => (
                        <span key={i} className="text-2xl opacity-80">
                          {hand}
                        </span>
                      ))}
                    </div>

                    <TextCursorProximity
                      className="absolute top-6 right-6 hidden sm:block text-xs "
                      label="15/01/2025"
                      styles={{
                        transform: {
                          from: "scale(1)",
                          to: "scale(1.4)",
                        },
                        color: { from: "#ffffff", to: "#ff87c1" },
                      }}
                      falloff="linear"
                      radius={10}
                      containerRef={containerRef}
                    />
                  </div>
                </div> */}
              </div>
            </div>

 {/*============================ MY COURSES ============================== */}
            <div className="pt-8">
              <div className="flex justify-between w-full  mx-auto">
                <h1 style={{color: '#1B2559'}}  className="text-3xl font-semibold">My Courses</h1>
                <Button variant='link' className='text-primary font-medium'>View All</Button>
              </div>

              <div className=" grid grid:col-1 gap-4 pt-2">


              <div className="rounded-lg w-auto h-32 bg-white flex justify-start items-center gap-4 px-8">
                <h1 style={{color: '#1B2559'}} className="w-24 h-24 bg-violet-100 rounded-lg font-medium text-4xl flex justify-center items-center">SE</h1>
                <div className=" space-y-3">
                  <h1 className="font-semibold">Software Engineering</h1>
                  <div className="flex justify-between space-x-8">
                    <div className="flex justify-center items-center gap-2">
                    <NotebookTabs color="#C2A6DE"/> 
                    <p className="text-sm font-normal text-neutral-800">12 Lessons</p>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                    
                    <Trophy color="#C2A6DE" />
                    <p className="text-sm font-normal text-neutral-800">Average</p>
                    </div>
                 
                  </div>
                </div>
              </div>

              <div className="rounded-lg w-auto h-32 bg-white flex justify-start items-center gap-4 px-8">
                <h1 style={{color: '#1B2559'}} className="w-24 h-24 bg-violet-100 rounded-lg font-medium text-4xl flex justify-center items-center">SF</h1>
                <div className=" space-y-3">
                  <h1 className="font-semibold">System Fundamentals</h1>
                  <div className="flex justify-between space-x-8">
                    <div className="flex justify-center items-center gap-2">
                    <NotebookTabs color="#C2A6DE"/> 
                    <p className="text-sm font-normal text-neutral-800">12 Lessons</p>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                    
                    <Trophy color="#C2A6DE" />
                    <p className="text-sm font-normal text-neutral-800">Average</p>
                    </div>
                 
                  </div>
                </div>
              </div>
              </div>
            </div>

          </div>


        {/*=================== RIGHT SIDE ==================== */}
        <div className="w-full lg:w-[35%] p-4">
          <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 px-6">
{/* 
            <div className="flex w-full mx-auto justify-between items-center">
              <h1 className="font-medium" style={{color: '#1B2559'}}>Upcoming Class</h1>
              <Button variant='link' className='text-primary font-medium'>View All</Button>
            </div> */}
              

                  {/*=================== Upcoming class card ==================== */}
              {/* <Card className="w-full h-28 rounded-xl bg-blue-100 border-0 shadow-none">
              <CardContent>
                
              </CardContent>
                </Card> */}
                <div className="w-full max-w-md mx-auto p-6">
    <div className="mb-4 flex justify-between items-center">
      <h2 style={{color: '#1B2559'}} className="text-xl font-semibold ">Upcoming Class</h2>
      <Button variant="link" className="text-primary font-normal">See All</Button>
    </div>

    <div className="h-[500px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {classes.map((classItem, index) => (
        <div
          key={index}
          className={`${classItem.bgColor} rounded-xl p-4 transition-transform hover:translate-x-1 cursor-pointer`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`${classItem.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold`}
              >
                {classItem.initials}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{classItem.name}</h3>
                <div className="text-sm text-gray-500 flex items-center">
                  <span>{classItem.date}</span>
                  <span className="mx-2">•</span>
                  <span>{classItem.time}</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 text-xl">›</button>
          </div>
        </div>
      ))}
    </div>

  </div>




          </div>



          <div className="bg-white rounded-lg p-4 px-6">
            <div className="flex">
              <img src={spaceShip} className="w-56 h-52" alt="" />
              <div className="flex flex-col justify-center items-start gap-4 p-4">
                <h1 style={{color: '#1B2559'}} className="text-2xl font-semibold">Ready to take off?</h1>
                <p className="text-sm font-normal">Explore the galaxy of coding and take your skills to the next level</p>
                <Button className="bg-primary rounded-full flex items-center font-normal gap-2 px-5 py-1 text-sm text-white">Get Started</Button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  </div>
  </SidebarProvider>
  )
}

export default StudentDashboard
