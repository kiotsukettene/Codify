import { Layers, Sword, User2, Video, LayoutDashboard } from "lucide-react";
import Logo from "../../assets/picture/logos/Logo.png";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom"; // Import useLocation from React Router

const data = [
  { to: "/professor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/professor/course", icon: Layers, label: "Course" },
  { to: "/professor/codeBattle", icon: Sword, label: "Code Battle" },
  { to: "/professor/account", icon: User2, label: "My Account" },
];

function AppSidebar() {
  const location = useLocation(); // Get the current URL location

  return (
    <Sidebar className="mx-2 py-4 item">
      <SidebarHeader className="border-b pl-6">
        <div className="">
          <img src={Logo} className="w-26 h-auto" alt="Logo" />
        </div>
      </SidebarHeader>

      <SidebarMenu className="mt-4">
        {data.map((item) => {
          // Check if the current path matches the item's route
          const isActive = location.pathname === item.to;

          return (
            <SidebarMenuItem
              className="py-2 px-4"
              key={item.label}
              style={{ color: "#7648C8" }}
            >
              <SidebarMenuButton asChild>
                <a
                  href={item.to}
                  className={`flex items-center font-medium transition-all ${
                    isActive
                      ? "bg-violet-200 text-violet-900" // Active styles
                      : "hover:bg-violet-100" // Inactive hover styles
                  }`}
                >
                  <item.icon className="mr-2" />
                  {item.label}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
