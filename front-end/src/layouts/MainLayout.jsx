import React from "react";
import Topbar from "@/components/Topbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <main className="p-6">
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout;
