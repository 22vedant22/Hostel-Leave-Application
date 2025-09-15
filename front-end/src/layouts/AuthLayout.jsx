// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { MdOutlineMapsHomeWork } from "react-icons/md";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat">
      <header className="absolute top-0 left-0 w-full bg-white shadow px-6 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-[#1b4d5e] font-semibold">
          <MdOutlineMapsHomeWork/>
          <span>Hostel Leave Management</span>
        </div>
        <div className="flex items-center gap-2 text-[#1b4d5e] font-semibold">
          <img
            src="https://cdn-icons-png.flaticon.com/512/219/219986.png"
            alt="Student Icon"
            className="w-6 h-6 object-contain"
          />
          <span>Student Portal</span>
        </div>
      </header>

      {/* center content, add top padding so header doesn't overlap */}
      <main className="min-h-screen w-full flex items-center justify-center pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
