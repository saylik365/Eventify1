import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ event, onRSVP, onDelete, showControls=false }) {
  const dateStr = event.date ? new Date(event.date).toDateString() : "";
  return (
    <div className="border rounded p-4 shadow-sm bg-white hover:shadow-md transition">
      <Link to={`/events/${event._id}`}>
        <h3 className="text-xl font-semibold">{event.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{event.description}</p>
      </Link>

      <p className="text-gray-500 text-sm mt-2">{event.category} • {dateStr} • {event.time}</p>
      <p className="text-gray-700 text-sm mt-1">📍 {event.location}</p>

      <div className="mt-3 flex items-center gap-2">
        {onRSVP && (["going","maybe","not-going"].map(r => (
          <button key={r} onClick={()=>onRSVP(r)} className="px-2 py-1 border rounded text-sm">{r}</button>
        )))}

        {showControls && (
          <>
            {onDelete && <button onClick={()=>onDelete(event._id)} className="ml-auto text-red-600 text-sm border px-2 py-1 rounded">Delete</button>}
            <Link to={`/events/${event._id}`} className="text-blue-600 text-sm border px-2 py-1 rounded">Manage</Link>
          </>
        )}
      </div>
    </div>
  );
}
