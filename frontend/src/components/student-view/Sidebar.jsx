import { Calendar, Gamepad2, Layers,  Sword, Video } from "lucide-react"
import {  CircleCheckBig, LayoutDashboard,  } from 'lucide-react'
import sidebarImage from "../../assets/picture/random background/sidebar-image.png";
import Logo from "../../assets/picture/logos/Logo.png";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
    Sidebar,
    SidebarFooter,
   
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
  } from "@/components/ui/sidebar"

  const data = [
    { to: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/student/course", icon: Layers, label: "Course" },
    { to: "/student/schedules", icon: Calendar, label: "Schedules" },
    { to: "/student/challenges", icon: Gamepad2, label: "Challenges" },
    { to: "/student/code-battles", icon: Sword, label: "Code Battles" },
    { to: "/student/task", icon: CircleCheckBig, label: "Task" },
  ];

function AppSidebar() {


    return (
        <Sidebar className="mx-2 py-4 item">
          <SidebarHeader className="border-b pl-6">
            <div className="">
              <img src={Logo} className="w-26 h-auto" alt="Logo" />
            </div>
          </SidebarHeader>
    
          <SidebarMenu className="mt-4">
            {/* Map over the data directly */}
            {data.map((item) => (
              <SidebarMenuItem
                className="py-2 px-4"
                key={item.label}
                style={{ color: "#7648C8" }}
              >
                <SidebarMenuButton asChild>
                  <a
                    href={item.to}
                    className="flex items-center font-medium  transition-all hover:bg-violet-100"
                  >
                    {/* Render the icon and label */}
                    <item.icon className="mr-2" />
                    {item.label}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
    
          <SidebarFooter className="mt-auto">
            <div className=" relative flex justify-center items-center">
              <img className="w-60 h-auto items-center" src={sidebarImage} alt="" />
    
              <div className="absolute flex flex-col items-center px-4 py-4 ">
                <div className="text-center">
                  <h4 className=" text-base font-semibold text-neutral-950">
                    Connect and Collaborate
                  </h4>
                  <h4 className=" text-xs flex flex-col text-neutral-950 mt-3">
                    Ready to explore today's coding galaxy? Join the live session
                    and level up your skills!
                  </h4>
                </div>
                <div className="mt-4 items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.95 }} 
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button className="bg-violet-700 flex items-center font-normal gap-2 px-5 py-1 text-sm text-white">
                      <Video /> Join Now
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </SidebarFooter>
    
          <SidebarRail />
        </Sidebar>
      );
}

export default AppSidebar
