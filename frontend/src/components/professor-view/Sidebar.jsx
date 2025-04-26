import { Layers, Sword, User2, LayoutDashboard } from "lucide-react";
import Logo from "@/assets/picture/logos/Logo.png";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";

  const data = [
    { to: "/professor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/professor/course", icon: Layers, label: "Course" },
    { to: "/professor/code-battle", icon: Sword, label: "Code Battle" },
    { to: "/professor/account", icon: User2, label: "My Account" },
  ];

function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="w-72 h-screen border-r flex flex-col">
      <SidebarHeader className="border-b border-gray-200 pl-6 mt-2">
      <Link to="/professor/dashboard">
           <img src={Logo} className="w-26 h-auto" alt="Logo" />
           </Link>
        
      </SidebarHeader>

      <SidebarMenu className="mt-4">
        {data.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <SidebarMenuItem
              className="py-2 px-4"
              key={item.label}
              style={{ color: "#7648C8" }} // Default color for inactive items
            >
              <SidebarMenuButton asChild>
                <a
                  href={item.to}
                  className={`flex items-center font-medium transition-all ${
                    isActive
                      ? "bg-violet-100 text-purple-600 font-semibold" // Darker highlight, white text
                      : "hover:bg-violet-100 text-[#7648C8]" // Inactive styles with hover
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
