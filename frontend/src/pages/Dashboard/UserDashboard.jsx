import React, { useEffect, useState, useContext } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import RoleTabs from "../../components/RoleTabs";
import EventCard from "../../components/EventCard";
import CreateEvent from "../../components/CreateEvent";
import RecommendationsSidebar from "../../components/RecommendationsSidebar";
import { toast } from "react-toastify";

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    try {
      const { data } = await API.get("/events");
      setEvents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => { getEvents(); }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/events/${id}`);
      toast.success("Event deleted");
      getEvents();
    } catch (err) { toast.error("Delete failed"); }
  };

  const handleRSVP = async (eventId, r) => {
    try {
      await API.post(`/events/${eventId}/rsvp`, { rsvp: r });
      toast.success(`RSVP: ${r}`);
      getEvents();
    } catch { toast.error("RSVP failed"); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <RoleTabs />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
        <CreateEvent onCreated={getEvents} />
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(e => (
              <EventCard
                key={e._id}
                event={e}
                onRSVP={(r)=>handleRSVP(e._id, r)}
                onDelete={handleDelete}
                showControls={e.owner === user._id || (e.owner && e.owner._id === user._id)}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-1">
          <RecommendationsSidebar />
        </div>
      </div>
    </div>
  );
}
