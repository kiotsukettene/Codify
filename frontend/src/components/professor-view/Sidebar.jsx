import {  Layers,  Sword, User2, Video } from "lucide-react"
import {  LayoutDashboard,  } from 'lucide-react'
import Logo from "../../assets/picture/logos/Logo.png";

import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
  } from "@/components/ui/sidebar"

  const data = [
    { to: "/professor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/professor/course", icon: Layers, label: "Course" },
    { to: "/professor/codeBattle", icon: Sword, label: "Code Battle" },
    { to: "/professor/account", icon: User2, label: "My Account" },
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
    
          <SidebarRail />
        </Sidebar>
      );
}

export default AppSidebar

