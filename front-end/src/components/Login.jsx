import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back, Student</h2>
        <label>Email Address</label>
        <div className="input-group">
          <img
            src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
            alt="mail"
          />
          <input type="email" placeholder="you@gmail.com" />
        </div>
        <label>Password</label>
        <div className="input-group">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png"
            alt="lock"
          />
          <input type="password" placeholder="********" />
        </div>
        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot your password?</a>
        </div>
        <button className="sign-in-btn">Sign in</button>
        <div className="links">
          <a href="#">Forgot your password?</a>
          <p>
            New to DormDash? <Link to="/">Create an account</Link>{" "}
            {/* ✅ Navigates to Signup */}
          </p>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>
        <button className="google-btn">
          <img
            src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
            alt="google"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
