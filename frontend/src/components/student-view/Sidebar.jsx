import { Link, NavLink, useNavigate} from "react-router-dom";
import { Calendar, Gamepad2, Layers, Sword, Video, Code } from "lucide-react";
import { CircleCheckBig, LayoutDashboard } from "lucide-react";
import sidebarImage from "@/assets/picture/random-background/sidebar-image.png";
import Logo from "@/assets/picture/logos/Logo.png";
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
} from "@/components/ui/sidebar";
// Student Sidebar Menu Data
const studentMenu = [
  { to: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/student/course-list", icon: Layers, label: "Course" },
  { to: "/student/events", icon: Calendar, label: "Events" },
  { to: "/student/challenges", icon: Gamepad2, label: "Challenges" },
  { to: "/student/code-battle", icon: Sword, label: "Code Battles" },
  { to: "/student/task-list", icon: CircleCheckBig, label: "Task" },
];
function StudentSidebar() {
  const navigate = useNavigate();
  return (
    <Sidebar className="w-72 h-screen border-r flex flex-col">
      {/* Sidebar Header */}
     <SidebarHeader className="border-b border-gray-200 pl-6 mt-2">
           <Link to="/student/dashboard">
           <img src={Logo} className="w-26 h-auto" alt="Logo" />
           </Link>
          </SidebarHeader>
      {/* Sidebar Menu */}
      <SidebarMenu className="mt-4 py-2 px-4">
        {studentMenu.map((item) => (
           <NavLink
           key={item.label}
           
           to={item.to}
           className={({ isActive }) =>
             `flex font-semibold text-base rounded-lg hover:bg-violet-100 items-center px-6 py-3 text-[#633ea5] transition-all ${
               isActive ? "bg-[#F3F0FF]" : ""
             }`
           }
         >
           <item.icon className="mr-2 h-4 w-4" />
           <span>{item.label}</span>
         </NavLink>
        ))}
    
      </SidebarMenu>
      {/* Sidebar Footer */}
      <SidebarFooter className="mt-auto">
        <div className="relative flex justify-center items-center">
          <img className="w-60 h-auto items-center" src={sidebarImage} alt="" />
          <div className="absolute flex flex-col items-center px-4 py-4">
            <div className="text-center">
              <h4 className="text-base font-semibold text-neutral-950">
                Code Compiler
              </h4>
              <h4 className="text-xs flex flex-col text-neutral-950 mt-3">
                Ready to explore today's coding galaxy? Join the playground now!
              </h4>
            </div>
            <div className="mt-4 items-center text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button className="bg-violet-700 flex items-center font-normal gap-2 px-5 py-1 text-sm text-white"
                onClick={() => navigate("/code-editor")}>
                  <Code /> Playground
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
export default StudentSidebar;