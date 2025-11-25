import React, { useState, useEffect, useContext } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import RoleTabs from "../../components/RoleTabs";
import EventCard from "../../components/EventCard";
import { toast } from "react-toastify";

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "", description: "", category: "", date: "", time: "", location: ""
  });

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

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      await API.post("/events/create", form);
      toast.success("Event created");
      setForm({ title:"", description:"", category:"", date:"", time:"", location:"" });
      getEvents();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <RoleTabs />
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>

      {/* Create event form */}
      <form onSubmit={createEvent} className="bg-white shadow p-4 rounded mb-6 grid gap-2 md:grid-cols-2">
        {["title","description","category","location"].map((f)=>(
          <input key={f} name={f} placeholder={f}
            value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}
            className="border p-2 rounded" required />
        ))}
        <input type="date" name="date" value={form.date}
          onChange={e=>setForm({...form,date:e.target.value})}
          className="border p-2 rounded" required />
        <input type="time" name="time" value={form.time}
          onChange={e=>setForm({...form,time:e.target.value})}
          className="border p-2 rounded" required />
        <button type="submit" className="col-span-full bg-blue-600 text-white p-2 rounded">Create Event</button>
      </form>

      {/* Events list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(e => <EventCard key={e._id} event={e} />)}
      </div>
    </div>
  );
}
