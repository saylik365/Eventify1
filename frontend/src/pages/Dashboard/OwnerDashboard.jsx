import React, { useEffect, useState, useContext } from "react";
import API from "../../utils/api";
import RoleTabs from "../../components/RoleTabs";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function OwnerDashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  const fetchOwned = async () => {
    try {
      const { data } = await API.get("/events");
      const owned = data.filter(e => (e.owner && (e.owner._id === user._id || e.owner === user._id)));
      setEvents(owned);
    } catch (err) { toast.error("Failed to fetch owned events"); }
  };
  useEffect(() => { fetchOwned(); }, []);

  const deleteEvent = async (id) => {
    try { await API.delete(`/events/${id}`); toast.success("Deleted"); fetchOwned(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <RoleTabs />
      <h2 className="text-2xl font-bold mb-4">My Owned Events</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {events.map(e => (
          <div key={e._id} className="p-4 bg-white border rounded shadow">
            <h3 className="text-xl font-semibold">{e.title}</h3>
            <p className="text-gray-500">{e.description}</p>
            <div className="flex justify-between mt-3">
              <button onClick={() => deleteEvent(e._id)} className="text-red-600 text-sm border px-2 py-1 rounded">Delete</button>
              <Link to={`/events/${e._id}`} className="text-blue-600 text-sm border px-2 py-1 rounded">Manage</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
