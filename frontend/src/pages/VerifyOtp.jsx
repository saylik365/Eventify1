import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

/*
  Behavior:
  - Receives optional `state.email` from navigation (pre-fill).
  - Has a 60s resend timer (disabled until timer expires).
  - Calls /auth/verify-otp and on success navigates to /login
*/

function useCountdown(secondsInit = 60) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let id;
    if (seconds > 0) {
      id = setTimeout(() => setSeconds(prev => prev - 1), 1000);
    }
    return () => clearTimeout(id);
  }, [seconds]);
  return { seconds, setSeconds };
}

export default function VerifyOtp() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { seconds, setSeconds } = useCountdown(0);

  useEffect(() => {
    // if navigated with email, start disabled timer so user can't spam resend immediately
    if (state?.email) setSeconds(60);
  }, [state, setSeconds]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/auth/verify-otp", { email, otp });
      toast.success("Verified! Please login.");
      nav("/login");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Verification failed";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    try {
      setSeconds(60);
      await API.post("/auth/register", { name: "temp", email, password: "temp12345" })
        .catch(e => {
          // backend returns error if email exists; we still want to trigger OTP send for existing users.
          // If your backend prevents resend this way, add a dedicated resend endpoint - else you can expose /auth/resend
        });
      toast.info("If the account exists, a fresh OTP was sent");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP");
      setSeconds(0);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Verify Email (OTP)</h2>
      <form onSubmit={handleVerify} className="space-y-3">
        <input value={email} onChange={e => setEmail(e.target.value)}
          required type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <input value={otp} onChange={e => setOtp(e.target.value)}
          required placeholder="Enter 6-digit OTP" className="w-full p-2 border rounded" />
        <div className="flex items-center justify-between">
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button type="button" disabled={seconds > 0} onClick={handleResend}
            className={`px-3 py-2 rounded border ${seconds>0 ? "text-gray-400 border-gray-200" : "text-blue-600 border-blue-200"}`}>
            {seconds > 0 ? `Resend in ${seconds}s` : "Resend OTP"}
          </button>
        </div>
      </form>
      <p className="text-sm text-gray-500 mt-3">If you didn't get the OTP, try using the resend button after the timer ends.</p>
    </div>
  );
}
