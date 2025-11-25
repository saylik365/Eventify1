import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import RoleTabs from "../../components/RoleTabs";
import EventCard from "../../components/EventCard";
import { toast } from "react-toastify";

export default function GuestDashboard() {
  const [invites, setInvites] = useState([]);

  const loadInvites = async () => {
    try {
      const { data } = await API.get("/events");
      // simulate invites by events where current user is in guests array
      const token = localStorage.getItem("token");
      const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};
      const myId = payload.id;
      const invited = data.filter(e => e.guests.some(g => g.user === myId));
      setInvites(invited);
    } catch { toast.error("Failed to load invites"); }
  };

  useEffect(() => { loadInvites(); }, []);

  const sendRSVP = async (eventId, rsvp) => {
    try {
      await API.post(`/events/${eventId}/rsvp`, { rsvp });
      toast.success(`RSVP: ${rsvp}`);
      loadInvites();
    } catch { toast.error("RSVP failed"); }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <RoleTabs />
      <h2 className="text-2xl font-bold mb-4">My Invites</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invites.map(e => (
          <EventCard key={e._id} event={e} onRSVP={(r)=>sendRSVP(e._id, r)} />
        ))}
      </div>
    </div>
  );
}
