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
import { Link, useLocation } from "react-router-dom";

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
  const location = useLocation(); // Get current URL

  return (
    <Sidebar className="w-72 h-screen border-r flex flex-col mt-2">
      <SidebarHeader className="border-b border-gray-200 pl-6">
        <Link to="/admin/dashboard">
          <img src={Logo} className="w-26 h-auto" alt="Logo" />
        </Link>
      </SidebarHeader>

      <SidebarMenu className="mt-4">
        {/* Map over the menu items */}
        {data.menuItems.map((item) => {
          // Determine if the current item or any sub-item is active
          const isActive =
            item.to === location.pathname ||
            (item.items &&
              item.items.some((subItem) => subItem.to === location.pathname));

          return (
            <SidebarMenuItem
              className="py-2 px-4"
              key={item.label}
              style={{ color: "#7648C8" }}
            >
              <SidebarMenuButton asChild>
                <Link
                  to={item.to}
                  className={`flex items-center font-medium transition-all ${
                    isActive
                      ? "bg-violet-200 text-purple-800 font-semibold" // Darker background, darker text
                      : "hover:bg-violet-100 text-[#7648C8]"
                  } ${item.cursorNotAllowed ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <item.icon className="mr-2" />
                  {item.label}
                </Link>
              </SidebarMenuButton>

              {item.items?.length ? (
                <SidebarMenuSub>
                  {item.items.map((subItem) => {
                    const isSubItemActive = subItem.to === location.pathname;
                    return (
                      <SidebarMenuSubItem key={subItem.label}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to={subItem.to}
                            className={`flex items-center font-medium transition-all ${
                              isSubItemActive
                                ? "bg-violet-200 text-purple-800 font-semibold"
                                : "hover:bg-violet-100 text-[#7648C8]"
                            }`}
                          >
                            <subItem.icon className="mr-2" />
                            {subItem.label}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              ) : null}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      <SidebarFooter className="mt-auto"></SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;