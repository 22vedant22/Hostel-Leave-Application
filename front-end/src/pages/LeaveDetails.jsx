import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEnv } from "@/helpers/getEnv";

export default function LeaveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchLeave = async () => {
      try {
        const res = await fetch(`${getEnv("VITE_API_URL")}/leaves/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setLeave(data);
        }
      } catch (err) {
        console.error("Error fetching leave:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeave();
  }, [id]);

  // ✅ Fix: properly define status update function
  const handleStatusUpdate = async (status) => {
    try {
      const res = await fetch(`${getEnv("VITE_API_URL")}/leaves/${id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminComment: comment }),
      });
      const data = await res.json();

      if (res.ok) {
        // ✅ Update UI immediately
        setLeave((prev) => ({ ...prev, status, adminComment: comment }));
        navigate("/admin/leaverequests");
        alert(`Leave ${status}`);
      } else {
        alert(data.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!leave) return <p className="p-6">Leave not found</p>;

  return (
    <div className="w-full min-h-screen p-10 ">
      {/* Page header */}
      <h2 className="text-xl font-semibold text-gray-800">Leave Details</h2>
      <p className="text-sm text-gray-500 mb-6">
        Your student&apos;s leave details at a glance...
      </p>

      {/* Student card */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-md border p-5 mb-6 ">
        <div>
          <p className="text-lg font-semibold text-indigo-800">{leave.name}</p>
          <p className="text-xs text-gray-500">{leave.studentId}</p>
          <p className="text-sm text-gray-600">
            {new Date(leave.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            –{" "}
            {new Date(leave.endDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">
          {leave.name?.charAt(0)}
        </div>
      </div>

      {/* Description section */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 w-full">
        <h3 className="text-base font-semibold text-gray-700 mb-4">
          Description
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">Type:</span> {leave.leaveType}
          </p>
          <p>
            <span className="font-medium">Reason:</span> {leave.reason}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                leave.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : leave.status === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {leave.status}
            </span>
          </p>
          <p>
            <span className="font-medium">Submitted on:</span>{" "}
            {new Date(leave.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleStatusUpdate("Approved")}
            className="flex-1 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium transition"
          >
            Approve
          </button>
          <button
            onClick={() => handleStatusUpdate("Rejected")}
            className="flex-1 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition"
          >
            Reject
          </button>
        </div>

        {/* Comment box */}
        <textarea
          placeholder="Reason of rejection..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full mt-4 p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          rows={3}
        />
      </div>
    </div>
  );
}
