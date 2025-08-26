// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupForm from "@/components/SignupForm";
import Login from "@/components/Login";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave"; // import ApplyLeave page
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LeaveHistoryTimeline from "./pages/LeaveHistoryTimeline"; // import LeaveHistoryTable page
import LeaveHistoryTable from "./pages/LeaveHistoryTable";
import NotificationsPage from "./pages/NotificationsPage";
import Profile from "./pages/Profile";
// import ProfileSettingsPage from "./pages/ProfileSettingsPage";


export default function App() {
  return (
    <Routes>
      {/* Pages WITH header + bg */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Pages WITHOUT header + bg */}
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="applyleave" element={<ApplyLeave />} /> {/* nested route */}
        <Route path="timeline" element={<LeaveHistoryTimeline />} /> {/* nested route */}
        <Route path="leavehistory" element={<LeaveHistoryTable />} /> {/* nested route */}
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<Profile />} />
        {/* <Route path="profile" element={<ProfileSettingsPage />} /> */}
      </Route>
    </Routes>
  );
}
