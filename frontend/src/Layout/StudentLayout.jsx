import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/student-view/Sidebar';
import StudentHeader from '@/components/student-view/Header';
import { Separator } from '@radix-ui/react-context-menu';

function StudentLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col ">
          {/* Header */}
         
          <header className="flex h-20 shrink-0 items-center gap-2 p-4">
        <SidebarTrigger className="-ml-1 items-center" />
        <Separator orientation="vertical" className="mr-2 h-4" />
     
        <StudentHeader />
      </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default StudentLayout;