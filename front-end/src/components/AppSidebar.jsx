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
import { Link, useNavigate } from "react-router-dom"
import { FaHome, FaUsers } from "react-icons/fa"
import { BiSolidCategory } from "react-icons/bi"
import { FaComments } from "react-icons/fa6"
import { useDispatch, useSelector } from "react-redux"
import { removeUser } from "@/redux/user/user.slice"
import { showToast } from "@/helpers/showToast"
import { getEnv } from "@/helpers/getEnv"


const AppSidebar = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async() => {
      try {
          const response = await fetch(`${getEnv("VITE_API_URL")}/auth/logout`, {
            method: "get",
            credentials: "include", // important for cookie-based auth
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            return showToast("error", data.message);
          }
    
          // ✅ Save user in Redux
          dispatch(removeUser());
          navigate("/login");
          // ✅ Show success message
          showToast("success", data.message);
        } catch (err) {
          showToast("error", err.message || "Server error");
        }
  }

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
            <button onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-full font-medium transition-colors duration-200">
              Log out
            </button>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  )
}

export default AppSidebar
