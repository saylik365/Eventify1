import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import GuestListManager from "../components/GuestListManager";
import { toast } from "react-toastify";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const { user } = useContext(AuthContext);

  const load = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
    } catch (err) { toast.error("Failed to load event"); }
  };

  useEffect(() => { load(); }, [id]);

  const rsvp = async (r) => {
    try {
      await API.post(`/events/${id}/rsvp`, { rsvp: r });
      toast.success(`RSVP: ${r}`);
      load();
    } catch { toast.error("RSVP failed"); }
  };

  if (!event) return <div className="p-6">Loading...</div>;

  // user id fields: backend returns _id for user model; AuthContext uses that
  const amOwner = user && event.owner && (event.owner._id === user._id || event.owner === user._id);
  const myId = user?._id || user?.id;
  const amCohost = user && event.cohosts && event.cohosts.some(c => c._id === myId || c === myId);

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold">{event.title}</h2>
        <p className="text-sm text-gray-500">{event.category} • {new Date(event.date).toDateString()} • {event.time}</p>
        <p className="mt-3">{event.description}</p>
        <p className="mt-3 text-sm">Location: {event.location}</p>

        <div className="mt-4 flex gap-2">
          <button onClick={() => rsvp("going")} className="px-3 py-2 bg-green-600 text-white rounded">Going</button>
          <button onClick={() => rsvp("maybe")} className="px-3 py-2 bg-yellow-400 text-white rounded">Maybe</button>
          <button onClick={() => rsvp("not-going")} className="px-3 py-2 bg-red-500 text-white rounded">Not Going</button>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold">Guests</h4>
          <div className="mt-2 space-y-2">
            {event.guests?.length ? event.guests.map(g => (
              <div key={g._id || g.email} className="flex items-center justify-between border rounded p-2">
                <div>
                  <div className="text-sm">{g.email}</div>
                  <div className="text-xs text-gray-500">RSVP: {g.rsvp} {g.isVIP && <span className="text-yellow-600">• VIP</span>}</div>
                </div>
              </div>
            )) : <div className="text-sm text-gray-500">No guests added</div>}
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="bg-white p-3 rounded shadow">
          <div className="text-sm text-gray-600">Owner</div>
          <div className="font-medium">{event.owner?.name || event.owner}</div>
        </div>

        {(amOwner || amCohost) && (
          <GuestListManager event={event} onUpdated={load} />
        )}

        <div className="bg-white p-3 rounded shadow">
          <h4 className="font-medium">Stats</h4>
          <div className="text-sm text-gray-600 mt-2">
            Total guests: {event.guests?.length || 0} <br />
            VIPs: {(event.guests || []).filter(g => g.isVIP).length} <br />
            Going: {(event.guests || []).filter(g => g.rsvp === "going").length}
          </div>
        </div>
      </aside>
    </div>
  );
}
