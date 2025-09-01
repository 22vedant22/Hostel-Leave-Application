// src/components/notifications/Toolbar.jsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";
import { dateOptions, typeOptions } from "@/utils/notificationUtils";

export default function Toolbar({ search, setSearch, dateKey, setDateKey, typeKey, setTypeKey, onMarkAllRead }) {
  const dateLabel = dateOptions.find((d) => d.key === dateKey)?.label ?? "Date Range";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
      <div className="text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">View your past and current notifications</p>
      </div>

      <div className="flex items-center gap-2 order-2 md:order-none">
        <Button variant="outline" onClick={onMarkAllRead} className="rounded-2xl shadow-sm w-full sm:w-auto">
          Mark all as read
        </Button>
      </div>

      <div className="w-full md:w-auto md:min-w-[420px] lg:min-w-[560px] flex flex-col sm:flex-row gap-2">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            className="pl-9 rounded-2xl w-full"
          />
        </div>

        {/* Date Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-2xl w-full sm:w-auto justify-between sm:justify-center">
              {dateLabel}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Date Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {dateOptions.map((opt) => (
              <DropdownMenuItem key={opt.key} onClick={() => setDateKey(opt.key)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-2xl w-full sm:w-auto justify-between sm:justify-center">
              Type
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {typeOptions.map((t) => (
              <DropdownMenuItem key={t} onClick={() => setTypeKey(t)}>
                {t}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
