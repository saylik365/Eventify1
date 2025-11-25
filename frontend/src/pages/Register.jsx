import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      toast.success("OTP sent to your email");
      // pass email to verify page so user doesn't have to retype
      nav("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" value={form.name} onChange={handleChange}
          required placeholder="Full name"
          className="w-full p-2 border rounded" />
        <input name="email" value={form.email} onChange={handleChange}
          required type="email" placeholder="Email"
          className="w-full p-2 border rounded" />
        <input name="password" value={form.password} onChange={handleChange}
          required type="password" placeholder="Password"
          className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded">
          {loading ? "Sending OTP..." : "Register & Send OTP"}
        </button>
      </form>
    </div>
  );
}
