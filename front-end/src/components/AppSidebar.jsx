"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { FaHome, FaUsers } from "react-icons/fa"
import { BiSolidCategory } from "react-icons/bi"
import { FaComments } from "react-icons/fa6"
import { useSelector } from "react-redux"


const AppSidebar = () => {
  const user = useSelector((state) => state.user)
  
  return (
    <>
    
    {/* Sidebar */}
      <Sidebar
        className="bg-white h-screen shadow-sm w-64 fixed top-16 left-0 z-40
          transform transition-transform duration-300"
      >
        <SidebarContent className="flex flex-col h-full justify-between">
          {/* Menu */}
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 transition-colors duration-200">
                  <FaHome className="text-teal-600 w-5 h-5" />
                  <Link to="">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 transition-colors duration-200">
                  <FaComments className="text-teal-600 w-5 h-5" />
                  <Link to="/admin/leaverequests">Review Requests</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 transition-colors duration-200">
                  <FaUsers className="text-teal-600 w-5 h-5" />
                  <Link to="/admin/adminnotify">Notifications</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 transition-colors duration-200">
                  <BiSolidCategory className="text-teal-600 w-5 h-5" />
                  <Link to="/admin/adminprofile">Profile</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 transition-colors duration-200">
                  <BiSolidCategory className="text-teal-600 w-5 h-5" />
                  <Link to="/admin/settings">Settings</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Logout */}
          <div className="pb-20 pt-20">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-full font-medium transition-colors duration-200">
              Log out
            </button>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  )
}

export default AppSidebar
