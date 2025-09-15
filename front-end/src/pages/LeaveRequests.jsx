import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { getEnv } from "@/helpers/getEnv";
import { Navigate, useNavigate } from "react-router-dom";

// ✅ utility: relative time formatter
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const diffInHours = Math.floor(diffInSeconds / 3600);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInSeconds / 86400);
  return `${diffInDays}d ago`;
};

export default function LeaveRequests() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_URL")}/leaves/admin-summary`,
        { credentials: "include" }
      );

      if (response.status === 401 || response.status === 403) {
        setLeaveRequests([]);
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setLeaveRequests(data.recent || []);
      }
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // ✅ approve / reject API call
  const handleStatusUpdate = async (leaveId, status) => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_URL")}/leaves/${leaveId}/status`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // ✅ Update UI instantly
        setLeaveRequests((prev) =>
          prev.map((leave) =>
            leave._id === leaveId ? { ...leave, status } : leave
          )
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Approve All / Reject All
  const bulkUpdate = async (status) => {
    await Promise.all(
      leaveRequests
        .filter((req) => filter === "All" || req.status === filter)
        .map((req) => handleStatusUpdate(req._id, status))
    );
  };

  // ✅ filter logic (special case for Pending = show ALL students' leaves)
  const filteredRequests =
    filter === "All"
      ? leaveRequests
      : filter === "Pending"
      ? leaveRequests
      : leaveRequests.filter((req) => req.status === filter);

  return (
    <div className="p-6 pt-10">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Leave Requests</h2>
        <p className="text-sm text-gray-500">
          Your student&apos;s leave requests at a glance...
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["All", "Approved", "Pending", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${
              filter === tab
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => bulkUpdate("Approved")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            <CheckCircle size={16} /> Approve All
          </button>
          <button
            onClick={() => bulkUpdate("Rejected")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            <XCircle size={16} /> Reject All
          </button>
        </div>
      </div>

      {/* Table - Hidden on small screens */}
      <div className="hidden md:block border rounded-xl p-4 bg-white shadow-sm">
        <div className="grid grid-cols-4 text-sm font-semibold text-gray-600 border-b pb-2 mb-3">
          <span>Student</span>
          <span>Date Range</span>
          <span>Status / Action</span>
          <span className="text-right"> </span>
        </div>
        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading...</p>
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="grid grid-cols-4 items-center text-sm border-b last:border-b-0 pb-3"
              >
                {/* Student */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-semibold text-teal-700">
                    {req.studentName?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {req.studentName}
                    </p>
                    <p className="text-xs text-gray-500">{req.leaveType}</p>
                  </div>
                </div>

                {/* Date */}
                <span className="text-gray-700">
                  {req.startDate} - {req.endDate}
                </span>

                {/* Status + Actions */}
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      req.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : req.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status}
                  </span>
                  {req.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "Approved")}
                        className="px-3 py-1 rounded-full text-white bg-green-600 hover:bg-green-700 text-xs font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "Rejected")}
                        className="px-3 py-1 rounded-full text-white bg-red-500 hover:bg-red-600 text-xs font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>

                {/* View + time */}
                <div className="text-right">
                  <button
                    className="text-teal-600 font-medium hover:underline text-sm mr-3"
                    onClick={() => navigate(`/admin/leave/${req._id}`)}
                  >
                    View
                  </button>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(req.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No leave requests found.
          </p>
        )}
      </div>

      {/* Mobile Card Layout - Hidden on larger screens */}
      <div className="block md:hidden border rounded-xl p-4 bg-white shadow-sm">
        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading...</p>
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="p-4 border rounded-lg bg-gray-50"
              >
                {/* Student and Date */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-semibold text-teal-700">
                    {req.studentName?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{req.studentName}</p>
                    <p className="text-sm text-gray-500">
                      {req.startDate} - {req.endDate}
                    </p>
                  </div>
                </div>

                {/* Leave Type and Time */}
                <div className="mb-2">
                  <p className="text-sm text-gray-600 font-semibold">{req.leaveType}</p>
                  <p className="text-xs text-gray-400">
                    {formatRelativeTime(req.createdAt)}
                  </p>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      req.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : req.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status}
                  </span>
                  {req.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "Approved")}
                        className="px-3 py-1 rounded-full text-white bg-green-600 hover:bg-green-700 text-xs font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "Rejected")}
                        className="px-3 py-1 rounded-full text-white bg-red-500 hover:bg-red-600 text-xs font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className="text-teal-600 font-medium hover:underline text-sm ml-auto"
                    onClick={() => navigate(`/admin/leave/${req._id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No leave requests found.
          </p>
        )}
      </div>
    </div>
  );
}