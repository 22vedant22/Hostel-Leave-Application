import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import Login from "./components/Login"; // make sure this file exists
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <div className="custom-header">
          <div className="left-section">
            <img src="" alt="icon" />
            <span>Hostel Leave Management</span>
          </div>

          <div className="right-section">
            <img
              src="https://cdn-icons-png.flaticon.com/512/219/219986.png"
              alt="Student Icon"
            />
            <span>Student Portal</span>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
