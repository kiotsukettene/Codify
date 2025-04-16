import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Sidebar from "@/components/professor-view/Sidebar";
import ProfessorHeader from "@/components/professor-view/Applayout-Header";
import { Outlet } from "react-router-dom";

function ProfessorLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* ✅ Sidebar */}
        <Sidebar />

        {/* ✅ Main Content */}
        <div className="flex flex-col flex-1 w-full">
          <SidebarInset className="flex flex-col flex-1 w-full">
            {/* ✅ Header */}
            <header className="flex h-20 items-center gap-2 px-4 border-b">
              <SidebarTrigger className="-ml-1" />
              <ProfessorHeader />
            </header>

            {/* ✅ Page Content */}
            <main className="flex-1 w-full bg-neutral-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto">
              <div className="p-4 h-full">
                <Outlet />
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ProfessorLayout;
