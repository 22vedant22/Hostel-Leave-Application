"use client"
import { Bell, Search } from "lucide-react"
import { FaBars } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { useSidebar } from "./ui/sidebar"
import { SiGooglehome } from "react-icons/si"

const Topbar = () => {
  const {toggleSidebar} = useSidebar()
  return (
    <header className="w-full h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6 shadow-sm fixed top-0 left-0 z-50">
      {/* Left section: Mobile menu button + Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle */}
        <button onClick={toggleSidebar} className="md:hidden"
        type="button">
          <FaBars />
        </button>
        {/* Logo + Text */}
        <div className="flex items-center gap-2">
           <SiGooglehome className="w-6 h-6 sm:w-7 sm:h-7" />
          <h1 className="text-base sm:text-lg font-bold text-[#1b4d5e] truncate">
            Hostel Leave Management
          </h1>
        </div>
      </div>

      {/* Search Bar (hidden on mobile) */}
      <div className="hidden md:flex relative w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
        />
      </div>

      {/* Right section: Notification + Avatar */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Link to="/admin/adminnotify" className="relative">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-teal-600" />
          <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
        </Link>
        <Avatar className="cursor-pointer w-8 h-8 sm:w-9 sm:h-9">
          <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

export default Topbar
