import React from "react";

export default function EventCard({ event, onRSVP }) {
  const { title, description, category, date, time, location } = event;
  return (
    <div className="border rounded p-4 shadow-sm bg-white hover:shadow-md transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
      <p className="text-gray-500 text-sm mt-2">
        {category} • {new Date(date).toDateString()} • {time}
      </p>
      <p className="text-gray-700 text-sm mt-1">📍 {location}</p>
      {onRSVP && (
        <div className="mt-3 space-x-2">
          {["going", "maybe", "not-going"].map((r) => (
            <button
              key={r}
              onClick={() => onRSVP(r)}
              className="px-2 py-1 border rounded text-sm hover:bg-blue-50"
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
