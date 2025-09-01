// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaHourglassHalf,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getEnv } from "@/helpers/getEnv"; // backend URL helper
import { IoIosArrowForward } from "react-icons/io";

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="flex items-center justify-between p-5 bg-white rounded-lg shadow-md">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-teal-700">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
    <IoIosArrowForward className="w-4 h-4 text-gray-400" />
  </div>
  
);

const InsightTile = ({ title, value, subtitle, colorClass }) => (

  <div className={`p-5 rounded-lg text-white ${colorClass} shadow-md`}>
    <p className="text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
    <p className="text-sm mt-1">{subtitle}</p>
  </div>
);

const ActivityItem = ({ title, date, status }) => {
  const statusColors = {
    Approved: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Rejected: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-md">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}
      >
        {status}
      </span>
      <IoIosArrowForward className="w-4 h-4 text-gray-400" />
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch(
          `${getEnv("VITE_API_URL")}/leaves/my-leaves`,
          { credentials: "include" }
        );
        if (response.status === 401 || response.status === 403) {
          return; // not logged in
        }
        const data = await response.json();
        if (response.ok) setLeaves(data.leaves || []);
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
      }
    };

    fetchLeaves();
  }, []);

  // ✅ stats from backend data
  const totalLeaves = leaves.length;
  const approvedLeaves = leaves.filter((l) => l.status === "Approved").length;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
  const rejectedLeaves = leaves.filter((l) => l.status === "Rejected").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-teal-700">Student Dashboard</h1>
      <p className="text-gray-500 mb-6">Your leave summary at a glance</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Dashboard Cards */}
          <div>
            <h2 className="text-lg font-bold text-teal-700 mb-3">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                icon={FaCalendarAlt}
                title="Total Leaves Applied"
                value={`${totalLeaves}`}
              />
              <StatCard
                icon={FaHourglassHalf}
                title="Pending Requests"
                value={`${pendingLeaves}`}
              />
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={() => navigate("applyleave")}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-lg font-semibold shadow-md transition"
          >
            Apply for Leave
          </button>

          {/* Quick Insights */}
          <div>
            <h2 className="text-lg font-bold text-teal-700 mb-3">
              Quick Insights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InsightTile
                title="Approved Leaves"
                value={approvedLeaves}
                subtitle="Request(s)"
                colorClass="bg-green-500"
              />
              <InsightTile
                title="Pending Leaves"
                value={pendingLeaves}
                subtitle="Request(s)"
                colorClass="bg-yellow-500"
              />
              <InsightTile
                title="Rejected Leaves"
                value={rejectedLeaves}
                subtitle="Request(s)"
                colorClass="bg-red-500"
              />
              <InsightTile
                title="Total Leaves"
                value={totalLeaves}
                subtitle="Applied"
                colorClass="bg-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-teal-700">
            Recent Leave Activity
          </h2>
          {leaves.slice(0, 5).map((leave) => (
            <ActivityItem
              key={leave._id}
              title={leave.leaveType}
              date={`${new Date(leave.startDate).toLocaleDateString()} - ${new Date(
                leave.endDate
              ).toLocaleDateString()}`}
              status={leave.status}
            />
          ))}
          {leaves.length === 0 && (
            <p className="text-gray-500">No leave activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
