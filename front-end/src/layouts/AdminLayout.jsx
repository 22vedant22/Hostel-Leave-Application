import React, { useState } from "react";
import AdminTopbar from "@/components/AdminTopbar";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#f1f5f9]">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-64 border-r bg-white shadow-sm">
          <AppSidebar />
        </aside>

        {/* Sidebar for mobile */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 md:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AppSidebar />
        </div>

        {/* Overlay when sidebar is open on mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Topbar with sidebar toggle button */}
          <AdminTopbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          <main className="p-6 flex-1 overflow-y-auto">
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </>
  );
};

export default AdminLayout;
