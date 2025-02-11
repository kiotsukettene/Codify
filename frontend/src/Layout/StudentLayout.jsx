import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import StudentSidebar from "@/components/student-view/Sidebar";
import StudentHeader from "@/components/student-view/Header";
import { Outlet } from "react-router-dom";

function StudentLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* ✅ Sidebar */}
        <StudentSidebar />

        {/* ✅ Main Content */}
        <div className="flex flex-col flex-1 w-full">
          <SidebarInset className="flex flex-col flex-1 w-full">
            {/* ✅ Header */}
            <header className="flex h-20 items-center gap-2 px-4 border-b">
              <SidebarTrigger className="-ml-1" />
              <StudentHeader />
            </header>

            {/* ✅ Page Content */}
            <div className="flex flex-1 w-full overflow-auto bg-neutral-50 p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default StudentLayout;
