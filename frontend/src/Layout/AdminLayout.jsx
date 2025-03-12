import AppSidebar from '@/components/admin-view/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminHeader from '@/components/admin-view/Admin-Header';
import { Separator } from '@radix-ui/react-context-menu';

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <SidebarInset className="flex flex-col flex-1 w-full">
            {/* Header */}
            <header className="flex h-20 items-center gap-2 px-4 border-b">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            <AdminHeader/>
            </header>

            {/* Page Content - Ensures Full Width & Height */}
            <div className="flex flex-1 w-full overflow-hidden bg-white">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
