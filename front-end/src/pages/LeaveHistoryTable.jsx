import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statusStyles = {
    Approved: "bg-green-500 text-white",
    Pending: "bg-yellow-400 text-black",
    Rejected: "bg-red-500 text-white",
};

const LeaveHistoryTable = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const res = await fetch(`${getEnv("VITE_API_URL")}/leaves/my-leaves`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) return showToast("error", data.message || "Failed to fetch leaves");
                setLeaves(data.leaves || []);
            } catch (err) {
                showToast("error", err.message || "Server error");
            }
        };

        fetchLeaves();
    }, []);

    return (
        <div className="bg-white rounded-xl border shadow-md overflow-hidden p-6">
            {/* Header Row with Title + Subtitle + Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-800">Leave History</h1>
                    <p className="text-gray-500 text-sm">
                        View your past and current requests
                    </p>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0">
                    <Link to="/dashboard/timeline">
                        <Button
                            variant="outline"
                            className="text-gray-800 border-gray-300 hover:bg-green-600 hover:text-white transition-colors"
                        >
                            Timeline
                        </Button>
                    </Link>
                    <Link to="/dashboard/leavehistory">
                        <Button
                            variant="outline"
                            className="text-gray-800 border-gray-300 hover:bg-green-600 hover:text-white transition-colors"
                        >
                            Table
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Divider Line */}
            <hr className="border-gray-300 mb-6" />

            {/* Table Section */}
            <Table>
                <TableHeader className="bg-slate-100 text-gray-700">
                    <TableRow>
                        <TableHead className="text-base">Date</TableHead>
                        <TableHead className="text-base">Type</TableHead>
                        <TableHead className="text-base">Status</TableHead>
                        <TableHead className="text-base">Reason</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaves.map((leave, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="text-sm font-medium text-gray-900">
                                {new Date(leave.startDate).toLocaleDateString()} -{" "}
                                {new Date(leave.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-sm text-gray-700">
                                {leave.leaveType}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`text-sm px-3 py-1 rounded-full font-medium ${statusStyles[leave.status]}`}
                                >
                                    {leave.status}
                                </span>
                            </TableCell>
                            <TableCell className="whitespace-pre-line text-sm text-gray-700">
                                {leave.status === "Rejected" && leave.adminComment ? (
                                    <>
                                        {leave.reason}
                                        <br />
                                        <span className="text-red-600 font-semibold">
                                            {leave.adminComment}
                                        </span>
                                    </>
                                ) : (
                                    leave.reason
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {leaves.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center text-gray-500 py-4"
                            >
                                No leave history yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default LeaveHistoryTable;
