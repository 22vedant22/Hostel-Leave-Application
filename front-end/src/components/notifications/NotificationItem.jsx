// src/components/notifications/NotificationItem.jsx

import React from "react";
import { motion } from "framer-motion";
import { statusMeta, fmtDate } from "@/utils/notificationUtils";
import { Button } from "@/components/ui/button";

export default function NotificationItem({ n, onView }) {
  const Meta = statusMeta[n.status] ?? statusMeta.Reminder;
  const Icon = Meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`relative rounded-2xl border bg-card shadow-sm p-4 sm:p-5 ${!n.read ? "ring-1 ring-primary/10" : ""}`}
    >
      {!n.read && <span className="absolute right-3 top-3 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />}

      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${Meta.iconWrap}`}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-2 min-w-0 max-w-full">
              <h3 className="font-semibold text-base truncate">{n.title}</h3>
              <span className={`hidden sm:inline-flex text-xs px-2 py-1 rounded-full ${Meta.chip}`}>{n.status}</span>
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap">{fmtDate(n.createdAt)}</div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-6 break-words">{n.message}</p>
        </div>

        <div className="self-start sm:self-center pl-0 sm:pl-2 mt-2 sm:mt-0">
          <Button variant="link" className="px-2" onClick={() => onView(n)}>
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
