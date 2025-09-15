import { Avatar, AvatarImage } from "@/components/ui/avatar"
import React, { useEffect, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getEnv } from "@/helpers/getEnv"
import { showToast } from "@/helpers/showToast"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFetch } from "@/hooks/useFetch"
import { FaCamera } from "react-icons/fa"
import Dropzone from "react-dropzone"
import { setUser } from "@/redux/user/user.slice"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const [filePreview, setPreview] = useState()
  const [file, setFile] = useState()
  const user = useSelector((state) => state.user)
   const navigate = useNavigate();
  const { data: userData, loading } = useFetch(
    `${getEnv("VITE_API_URL")}/user/get-user/${user?.user?._id}`,
    { method: "get", credentials: "include" }
  )
  // console.log(userData)
  const dispatch = useDispatch()

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    altPhone: z.string().optional(),
    dob: z.string(),
    state: z.string(),
    city: z.string(),
    emergencyContactName: z.string(),
    emergencyContactNumber: z.string().min(10, "Invalid number"),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      altPhone: "",
      dob: "",
      state: "",
      city: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
    },
  })

  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name: userData.user.name,
        email: userData.user.email,
        phone: userData.user.phone,
        altPhone: userData.user.altPhone,
        dob: userData.user.dob,
        state: userData.user.state,
        city: userData.user.city,
        emergencyContactName: userData.user.emergencyContactName,
        emergencyContactNumber: userData.user.emergencyContactNumber,
      })
    }
  }, [userData])

  async function onSubmit(values) {
    try {
      const formData = new FormData()
      if (file) formData.append("file", file)
      formData.append("data", JSON.stringify(values))
      const response = await fetch(
        `${getEnv("VITE_API_URL")}/user/update-user/${userData?.user?._id}`,
        { method: "put", credentials: "include", body: formData }
      )
      const data = await response.json()
      if (!response.ok) return showToast("error", data.message)
      dispatch(setUser(data.user))
    navigate("/dashboard");
      showToast("success", data.message)
    } catch (error) {
      showToast("error", error.message)
    }
  }

  const handleFileSelection = (files) => {
    const file = files[0]
    const preview = URL.createObjectURL(file)
    setFile(file)
    setPreview(preview)
  }

  return (
    <Card className="max-w-3xl mx-auto my-10 shadow-md rounded-2xl">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center">
          <Dropzone onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar className="w-28 h-28 relative group cursor-pointer border-4 border-purple-500 rounded-full">
                  <AvatarImage src={filePreview ? filePreview : userData?.user?.avatar} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <FaCamera color="#fff" />
                  </div>
                </Avatar>
              </div>
            )}
          </Dropzone>
          <h2 className="text-xl font-semibold mt-4">{userData?.user?.name}</h2>
          <p className="text-gray-500 text-sm">Student ID : {userData?.user?._id}</p>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Personal Information */}
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Alternate Phone */}
                <FormField
                  control={form.control}
                  name="altPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Mobile Number</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DOB */}
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="font-semibold mb-2">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Number</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default Profile
