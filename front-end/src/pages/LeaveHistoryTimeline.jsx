import React, { useEffect, useState } from 'react';
import { FaUser, FaCalendarCheck, FaExclamationTriangle, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';

const LeaveHistoryTimeline = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const res = await fetch(`${getEnv('VITE_API_URL')}/leaves/my-leaves`, {
                    credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok) return showToast('error', data.message || 'Failed to fetch leaves');
                setLeaves(data.leaves || []);
            } catch (err) {
                showToast('error', err.message || 'Server error');
            }
        };

        fetchLeaves();
    }, []);

    const statusColors = {
        Approved: 'bg-green-500 text-white',
        Pending: 'bg-yellow-400 text-black',
        Rejected: 'bg-red-500 text-white',
    };

    const getIcon = (status) => {
        if (status === 'Approved') return <FaUser />;
        if (status === 'Pending') return <FaCalendarCheck />;
        if (status === 'Rejected') return <FaExclamationTriangle />;
        return <FaUser />;
    };

    return (
        <div className="px-6 py-10">
            {/* Header and Buttons in one row */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-800">Leave History</h1>
                    <p className="text-gray-400">View your past and current requests</p>
                </div>
                <div className="flex gap-2">
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

            {/* Timeline Data */}
            <div className="flex flex-col relative ml-6 before:content-[''] before:absolute before:left-5 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-300">
                {leaves.map((leave, index) => (
                    <div key={index} className="relative mb-8 pl-10">
                        <div className="absolute left-[-0.5rem] top-2 bg-white rounded-full border border-gray-300 p-2 text-blue-600">
                            {getIcon(leave.status)}
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">{leave.leaveType}</h4>
                                <p className="text-sm text-gray-500">
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Reason: {leave.reason}</p>
                                {leave.status === "Rejected" && leave.adminComment && (
                                    <p className="text-sm text-red-600 font-medium mt-1">
                                        Admin comment: {leave.adminComment}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusColors[leave.status]}`}
                                >
                                    {leave.status}
                                </span>
                                <FaChevronRight className="text-gray-400 text-sm" />
                            </div>
                        </div>
                    </div>
                ))}
                {leaves.length === 0 && (
                    <p className="text-center text-gray-500">No leave history yet.</p>
                )}
            </div>
        </div>
    );
};

export default LeaveHistoryTimeline;
