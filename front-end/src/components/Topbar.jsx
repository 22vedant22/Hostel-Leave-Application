import React, { useState } from "react";
import { SiGooglehome } from "react-icons/si";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow border-b px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl sm:text-2xl font-bold text-teal-700 flex items-center gap-2">
          <SiGooglehome className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="hidden sm:inline">Hostel Leave Application</span>
          <span className="sm:hidden">HLA</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-teal-700 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium items-center">
          <Link to="/dashboard">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              Dashboard
            </li>
          </Link>
          <Link to="/dashboard/applyleave">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              Apply Leave
            </li>
          </Link>
          <Link to="/dashboard/timeline">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              History
            </li>
          </Link>
          <Link to="/dashboard/notifications">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              Notifications
            </li>
          </Link>
          <Link to="/dashboard/profile">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              Profile
            </li>
          </Link>
          <li>
            <FaUserCircle className="text-2xl text-orange-500 cursor-pointer hover:opacity-80 transition" />
          </li>
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col space-y-3 text-gray-700 font-medium bg-white border rounded-lg shadow-md p-4">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">Dashboard</li>
          </Link>
          <Link to="/dashboard/applyleave" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">Apply Leave</li>
          </Link>
          <Link to="/dashboard/timeline" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">History</li>
          </Link>
          <Link to="/dashboard/notifications" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">Notifications</li>
          </Link>
          <Link to="/dashboard/profile" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">Profile</li>
          </Link>
          <li>
            <FaUserCircle className="text-2xl text-orange-500 cursor-pointer hover:opacity-80 transition" />
          </li>
        </ul>
      )}
    </header>
  );
};

export default Topbar;
