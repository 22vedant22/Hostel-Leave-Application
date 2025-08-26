import React, { useState } from "react";
import { SiGooglehome } from "react-icons/si";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow border-b px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">

        <div className="text-2xl font-bold text-teal-700 flex items-center gap-2">
          <SiGooglehome className="w-6 h-6" />
          DormDash
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-teal-700"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium items-center">
          <Link to="/dashboard">
            <li className="hover:text-teal-600 cursor-pointer">Dashboard</li>
          </Link>
          <Link to="/dashboard/applyleave">
            <li className="hover:text-teal-600 cursor-pointer">Apply Leave</li>
          </Link>
          <Link to="/dashboard/timeline">
            <li className="hover:text-teal-600 cursor-pointer">History</li>
          </Link>
          <Link to="/dashboard/notifications">
            <li className="hover:text-teal-600 cursor-pointer">Notifications</li>
          </Link>
          <Link to="/dashboard/profile">
            <li className="hover:text-teal-600 cursor-pointer">Profile</li>
          </Link>
          <li>
            <FaUserCircle className="text-2xl text-orange-500 cursor-pointer" />
          </li>
        </ul>
      </div>

      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col space-y-3 text-gray-700 font-medium">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600">Dashboard</li>
          </Link>
          <Link to="/dashboard/applyleave" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600">Apply Leave</li>
          </Link>
          <Link to="/dashboard/timeline" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600">History</li>
          </Link>
          <Link to="/dashboard/notifications" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600">Notifications</li>
          </Link>
          <Link to="/dashboard/profile" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600">Profile</li>
          </Link>
          <li>
            <FaUserCircle className="text-2xl text-orange-500 cursor-pointer" />
          </li>
        </ul>
      )}
    </header>
  );
};

export default Topbar;
