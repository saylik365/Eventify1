import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">Eventify</Link>
        <div className="space-x-4">
          {!user ? (
            <>
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard/user" className="hover:underline">Dashboard</Link>
              <button onClick={logout} className="text-red-500 hover:underline">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
