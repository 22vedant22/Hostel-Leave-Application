// src/pages/SignupForm.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import GoogleLogin from "./GoogleLogin";

const SignupForm = () => {
  const navigate = useNavigate();

  const formSchema = z.object({
    name: z.string().min(3, "Full Name is required"),
    email: z.string().email(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values){
    try {
      const response = await fetch(`${getEnv("VITE_API_URL")}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok){
        return showToast("error", data.message);
      } 

      showToast("success", data.message);
      navigate("/login");
    } catch (err) {
      showToast("error", err.message || "Server error");
    }
  };

  return (
    <div>
      <div className="w-96 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-gray-800 mb-6 text-2xl font-semibold text-center">
          Welcome, Student
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 0000000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full py-3 bg-[#006d77] text-white font-bold rounded-lg hover:bg-[#005962] transition mb-4">
              Sign up
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-800 mb-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

        <div className="flex items-center justify-center text-xs text-gray-600 mb-4">
          <span>OR</span>
        </div>

        <GoogleLogin />
      </div>
    </div>
  );
};

export default SignupForm;
