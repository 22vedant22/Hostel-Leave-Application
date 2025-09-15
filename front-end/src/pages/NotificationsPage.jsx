// src/pages/NotificationsPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";

import Toolbar from "@/components/notifications/Toolbar";
import NotificationItem from "@/components/notifications/NotificationItem";
import { statusTabs, withinRange, fmtRange } from "@/utils/notificationUtils";

export default function NotificationsPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateKey, setDateKey] = useState("all");
  const [typeKey, setTypeKey] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchAndMap = async () => {
      try {
        const res = await fetch(`${getEnv("VITE_API_URL")}/leaves/my-leaves`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) return showToast("error", data.message || "Failed to fetch notifications");

        const leaves = Array.isArray(data.leaves) ? data.leaves : [];
        const mapped = leaves.flatMap((lv) => {
          const id = lv._id || `${lv.leaveType}-${lv.startDate}-${lv.endDate}-${Math.random()}`;
          const status = (lv.status || "Pending").trim();
          const range = fmtRange(lv.startDate, lv.endDate);

          const base = {
            id,
            status,
            title: `Leave ${status}`,
            message:
              status === "Rejected" && lv.adminComment
                ? `Your ${lv.leaveType || "leave"} (${range}) was rejected. Admin comment: ${lv.adminComment}`
                : `Your ${lv.leaveType || "leave"} (${range}) is ${status.toLowerCase()}.`,
            category: "Leave",
            createdAt: lv.updatedAt || lv.createdAt || lv.startDate || new Date().toISOString(),
            read: false,
          };

          const out = [base];

          if (status === "Approved" && lv.startDate) {
            const now = new Date();
            const start = new Date(lv.startDate);
            const diffDays = (start.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
            if (diffDays >= 0 && diffDays <= 3) {
              out.push({
                id: `${id}-rem`,
                status: "Reminder",
                title: "Leave Reminder",
                message: `Your approved ${lv.leaveType || "leave"} starting ${fmtRange(lv.startDate)} is approaching.`,
                category: "Leave",
                createdAt: new Date(Math.min(start.getTime() - 1, now.getTime())).toISOString(),
                read: false,
              });
            }
          }

          return out;
        });

        mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(mapped);
      } catch (err) {
        showToast("error", err.message || "Server error");
      }
    };

    fetchAndMap();
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter((n) => (tab === "All" ? true : n.status === tab))
      .filter((n) => (typeKey === "All" ? true : n.category === typeKey))
      .filter((n) => withinRange(n.createdAt, dateKey))
      .filter((n) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q) || n.status.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tab, search, dateKey, typeKey, items]);

  const handleMarkAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const handleView = (n) => {
    setItems((prev) => prev.map((it) => (it.id === n.id ? { ...it, read: true } : it)));
    alert(`${n.title}\n\n${n.message}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 p-2 sm:p-4 lg:p-6">
        <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm flex flex-col h-full">
          <Toolbar
            search={search}
            setSearch={setSearch}
            dateKey={dateKey}
            setDateKey={setDateKey}
            typeKey={typeKey}
            setTypeKey={setTypeKey}
            onMarkAllRead={handleMarkAllRead}
          />

          <div className="mt-5 flex-1 overflow-y-auto ">
            <Tabs value={tab} onValueChange={setTab} className="flex flex-col h-full w-full ">
              {/* === APPLIED RESPONSIVE CHANGE HERE === */}
              <TabsList className="flex justify-around overflow-x-auto p-1 md:w-full md:mx-auto md:overflow-visible rounded-2xl gap-2">
                {statusTabs.map((s) => (
                  <TabsTrigger key={s} value={s} className="rounded-xl data-[state=active]:shadow text-sm sm:text-base">{s}</TabsTrigger>
                ))}
              </TabsList>

              {statusTabs.map((s) => (
                <TabsContent key={s} value={s} className="mt-4 space-y-3">
                  {filtered.length === 0 ? (
                    <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">No notifications found.</div>
                  ) : (
                    filtered.map((n) => <NotificationItem key={n.id} n={n} onView={handleView} />)
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}