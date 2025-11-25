import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
// import UserDashboard from "./pages/Dashboard/UserDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import OwnerDashboard from "./pages/Dashboard/OwnerDashboard";
import GuestDashboard from "./pages/Dashboard/GuestDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";




function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/user" element={<PrivateRoute><UserDashboard/></PrivateRoute>} />
          <Route path="/dashboard/owner" element={<PrivateRoute><OwnerDashboard/></PrivateRoute>} />
          <Route path="/dashboard/guest" element={<PrivateRoute><GuestDashboard/></PrivateRoute>} />
          <Route path="/dashboard/admin" element={<PrivateRoute><AdminDashboard/></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
