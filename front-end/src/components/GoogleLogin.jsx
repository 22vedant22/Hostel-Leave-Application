// src/pages/GoogleLogin.jsx
import React from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user
      const bodyData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      }

      const response = await fetch(`${getEnv("VITE_API_URL")}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok){
        return showToast("error", data.message);
      } 

      dispatch(setUser(data.user));
      navigate("/dashboard");
      showToast("success", data.message);
    } catch (err) {
      showToast("error", err.message || "Google login failed");
    }
  };

  return (
    <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleLogin}>
      <FcGoogle />
      Continue with Google
    </Button>
  );
};

export default GoogleLogin;
