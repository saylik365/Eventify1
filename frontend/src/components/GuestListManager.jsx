import React, { useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";

export default function GuestListManager({ event, onUpdated }) {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const addGuest = async () => {
    if (!email && !userId) return toast.error("Provide email or userId");
    try {
      await API.post(`/events/${event._id}/add-guest`, { email, userId });
      toast.success("Guest added");
      setEmail(""); setUserId("");
      if (onUpdated) onUpdated();
    } catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  const addCohost = async () => {
    if (!userId) return toast.error("Provide userId for cohost");
    try {
      await API.post(`/events/${event._id}/add-cohost`, { userId });
      toast.success("Cohost added");
      setUserId("");
      if (onUpdated) onUpdated();
    } catch (err) { toast.error("Failed to add cohost"); }
  };

  const toggleVip = async (guestId) => {
    try {
      await API.post(`/events/${event._id}/guest/${guestId}/vip`);
      toast.success("VIP toggled");
      if (onUpdated) onUpdated();
    } catch { toast.error("Toggle VIP failed"); }
  };

  return (
    <div className="bg-white p-3 rounded shadow">
      <h4 className="font-semibold mb-2">Manage Guests / Cohosts</h4>

      <div className="grid gap-2">
        <div className="flex gap-2">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Guest email" className="flex-1 border p-2 rounded"/>
          <button onClick={addGuest} className="px-3 py-2 bg-blue-600 text-white rounded">Add Guest</button>
        </div>

        <div className="flex gap-2">
          <input value={userId} onChange={e=>setUserId(e.target.value)} placeholder="User ID (for cohost or guest)" className="flex-1 border p-2 rounded"/>
          <button onClick={addCohost} className="px-3 py-2 bg-indigo-600 text-white rounded">Add Cohost</button>
        </div>

        <div>
          <div className="text-sm font-medium mb-1">Guest list</div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {event.guests?.length ? event.guests.map(g => (
              <div key={g._id || g.email} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <div className="text-sm">{g.email || g.user}</div>
                  <div className="text-xs text-gray-500">RSVP: {g.rsvp} {g.isVIP && <span className="ml-2 text-xs text-yellow-600">VIP</span>}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>toggleVip(g._id)} className="px-2 py-1 border rounded text-sm">Toggle VIP</button>
                </div>
              </div>
            )) : <div className="text-sm text-gray-500">No guests yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
