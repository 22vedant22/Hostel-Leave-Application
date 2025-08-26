// src/pages/ProfileSettingsPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid as isValidDate } from "date-fns";
import { Calendar as CalendarIcon, LogOut } from "lucide-react";

// ui
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";

// ──────────────────────────────────────────────────────────────────────────────
// Config & helpers
// ──────────────────────────────────────────────────────────────────────────────

const API = getEnv("VITE_API_URL");
const ENDPOINTS = {
  me: `${API}/auth/me`,                    // returns current user { name, email, phone, avatarUrl? }
  profile: `${API}/profile/me`,            // GET/PUT profile { studentId, dob, state, city, altPhone, avatarUrl? }
  ensureStudentId: `${API}/students/ensure-id`, // POST { name, email, phone } -> { studentId }
  logout: `${API}/auth/logout`,
};

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter a valid number"),
  altPhone: z.string().optional().or(z.literal("")),
  dob: z
    .date({ required_error: "Select your date of birth" })
    .refine((d) => d <= new Date(), "DOB cannot be in the future"),
  state: z.string().min(1, "Select a state"),
  city: z.string().min(1, "Enter your city"),
});

const IN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh",
];

function toDateOrUndefined(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return isValidDate(d) ? d : undefined;
}

function initialsFromName(name) {
  if (!name) return "ST";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "ST";
}

// ──────────────────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────────────────
export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [studentId, setStudentId] = useState("-");
  const fileRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      altPhone: "",
      dob: undefined,
      state: "",
      city: "",
    },
    mode: "onTouched",
  });

  // Fetch logged-in user + profile, ensure studentId exists
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 1) who is logged in
        const meRes = await fetch(ENDPOINTS.me, { credentials: "include" });
        const meData = await meRes.json();
        if (!meRes.ok) throw new Error(meData?.message || "Failed to load user");

        // 2) their profile
        const profRes = await fetch(ENDPOINTS.profile, { credentials: "include" });
        const profData = await profRes.json();
        if (!profRes.ok) throw new Error(profData?.message || "Failed to load profile");

        // 3) ensure studentId exists on the server
        let sid = profData?.studentId;
        if (!sid) {
          const ensureRes = await fetch(ENDPOINTS.ensureStudentId, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: meData?.name,
              email: meData?.email,
              phone: meData?.phone,
            }),
          });
          const ensureData = await ensureRes.json();
          if (!ensureRes.ok) throw new Error(ensureData?.message || "Could not generate Student ID");
          sid = ensureData?.studentId;
        }
        setStudentId(sid || "-");

        // 4) avatar
        setAvatarPreview(meData?.avatarUrl || profData?.avatarUrl || "");

        // 5) prime the form with backend values
        form.reset({
          fullName: meData?.name || "",
          email: meData?.email || "",
          phone: meData?.phone || "",
          altPhone: profData?.altPhone === "NA" ? "" : (profData?.altPhone || ""),
          dob: toDateOrUndefined(profData?.dob),
          state: profData?.state || "",
          city: profData?.city || "",
        });
      } catch (err) {
        showToast("error", err.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUploadAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    // NOTE: this only previews locally. If you implement upload, send the file to your API and
    // store the returned URL, then setAvatarPreview(returnedUrl).
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        studentId,
        name: values.fullName, // server may prefer "name"
        email: values.email,
        phone: values.phone,
        altPhone: values.altPhone || "NA",
        dob: values.dob?.toISOString(),
        state: values.state,
        city: values.city,
        avatarUrl: avatarPreview || undefined,
      };

      const res = await fetch(ENDPOINTS.profile, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save profile");

      showToast("success", "Profile updated");
      // keep form values as-is; server is source of truth
    } catch (err) {
      showToast("error", err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(ENDPOINTS.logout, { method: "POST", credentials: "include" });
    } catch (_) {}
    window.location.href = "/login";
  };

  const watchedName = useMemo(() => form.watch("fullName"), [form]);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
        {/* Page heading */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-emerald-700">
            Profile Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and contact details
          </p>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarPreview} alt="Profile" />
                    <AvatarFallback>{initialsFromName(watchedName)}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {watchedName || "—"}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Student ID : {studentId || "—"}
                  </CardDescription>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-emerald-700 text-sm mt-2 hover:underline"
                  >
                    Change Profile Photo
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onUploadAvatar}
                  />
                </div>
              </div>

              <Button variant="outline" className="rounded-2xl" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading profile…</div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <section>
                    <h2 className="text-base font-medium">Personal Information</h2>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your full name" className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="you@example.com" className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="+91" className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="altPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alternate Mobile Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="NA" className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className={`w-full justify-between rounded-xl ${!field.value ? "text-muted-foreground" : ""}`}
                                  >
                                    {field.value ? format(field.value, "dd-MM-yyyy") : "Pick a date"}
                                    <CalendarIcon className="h-4 w-4 opacity-70" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-2" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {IN_STATES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your city" className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 border-t pt-4">
                    <Button type="submit" className="rounded-2xl" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
