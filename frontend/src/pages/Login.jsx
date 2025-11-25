import React, { useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", form);
      // store token & user
      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Logged in");
      // pick first role as landing (if you want to direct to role-specific route)
      const role = data.user?.roles?.[0] || "user";
      nav(`/dashboard/${role}`);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input name="email" value={form.email} onChange={handleChange}
          required type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <input name="password" value={form.password} onChange={handleChange}
          required type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-3 text-sm text-gray-500">Don't have account? <a href="/register" className="text-blue-600">Register</a></p>
    </div>
  );
}
