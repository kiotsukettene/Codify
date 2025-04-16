import {
  Calendar,
  Gamepad2,
  Layers,
  Sword,
  UserPen,
  UserRoundPlus,
  Settings,
  Video,
} from "lucide-react";
import { CircleCheckBig, LayoutDashboard } from "lucide-react";
import sidebarImage from "@/assets/picture/random-background/sidebar-image.png";
import Logo from "@/assets/picture/logos/Logo.png";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

//   const data = [
//     { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
//     { to: "/admin/Professors", icon: UserPen, label: "Professors" },
//     { to: "/admin/Students", icon: UserPen, label: "Professors" },

//   ];

const data = {
  menuItems: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/admin/dashboard",
    },
    {
      label: "Users",
      icon: UserPen,
      cursorNotAllowed: true,
      items: [
        {
          label: "Professors",
          icon: UserRoundPlus,
          to: "/admin/professors",
        },
        {
          label: "Students",
          icon: UserRoundPlus,
          to: "/admin/students",
        },
      ],
    },
    {
      label: "Courses",
      icon: Layers,
      to: "/admin/courses",
    },
    {
      label: "Settings",
      icon: Settings,
      to: "/admin/course-settings",
    },
  ],
};

function AppSidebar() {
  return (
    <Sidebar className="w-64 h-screen border-r mt-2  flex flex-col">
      <SidebarHeader className="border-b border-gray-200 pl-6">
        <Link to="/admin/dashboard">
          <img src={Logo} className="w-26 h-auto" alt="Logo" />
        </Link>
      </SidebarHeader>

      <SidebarMenu className="mt-4">
        {/* Map over the menu items */}
        {data.menuItems.map((item) => (
          <SidebarMenuItem
            className="py-2 px-4"
            key={item.label}
            style={{ color: "#7648C8" }}
          >
            <SidebarMenuButton asChild>
              <a
                href={item.to}
                className="flex items-center font-medium transition-all hover:bg-violet-100"
              >
                <item.icon className="mr-2" />
                {item.label}
              </a>
            </SidebarMenuButton>

            {item.items?.length ? (
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.label}>
                    <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                      <a href={subItem.to}>{subItem.label}</a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarFooter className="mt-auto"></SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
