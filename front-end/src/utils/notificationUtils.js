// src/utils/notificationUtils.js

import { CheckCircle2, XCircle, Clock3, Bell } from "lucide-react";

export const fmtDate = (iso) => {
  try {
    const d = new Date(iso);
    const dd = d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const tt = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${dd} ${tt}`;
  } catch {
    return iso;
  }
};

export const fmtRange = (startIso, endIso) => {
  const fmt = (x) =>
    new Date(x).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  if (startIso && endIso) return `${fmt(startIso)} to ${fmt(endIso)}`;
  if (startIso) return fmt(startIso);
  if (endIso) return fmt(endIso);
  return "";
};

export const withinRange = (iso, rangeKey) => {
  if (rangeKey === "all") return true;
  const now = new Date();
  const t = new Date(iso);
  const days = { today: 1, "7d": 7, "30d": 30, "365d": 365 }[rangeKey];
  if (!days) return true;
  if (rangeKey === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return t >= start && t < end;
  }
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return t >= since && t <= now;
};

export const statusMeta = {
  Approved: { icon: CheckCircle2, iconWrap: "bg-emerald-50 text-emerald-600", chip: "text-emerald-700 bg-emerald-50" },
  Pending: { icon: Clock3, iconWrap: "bg-amber-50 text-amber-600", chip: "text-amber-700 bg-amber-50" },
  Rejected: { icon: XCircle, iconWrap: "bg-rose-50 text-rose-600", chip: "text-rose-700 bg-rose-50" },
  Reminder: { icon: Bell, iconWrap: "bg-blue-50 text-blue-600", chip: "text-blue-700 bg-blue-50" },
};

export const statusTabs = ["All", "Approved", "Pending", "Rejected", "Reminder"];
export const typeOptions = ["All", "Leave", "HR", "System", "Policy"];
export const dateOptions = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "365d", label: "Last 12 months" },
];
