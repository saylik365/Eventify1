import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";

export default function RecommendationsSidebar() {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/events/recommendations");
        setRecs(data || []);
      } catch (err) {
        // ignore silently
      }
    })();
  }, []);

  return (
    <aside className="w-full md:w-72 space-y-3">
      <div className="bg-white p-3 rounded shadow">
        <h4 className="font-semibold mb-2">Recommended for you</h4>
        {recs.length === 0 ? (
          <p className="text-sm text-gray-500">No recommendations yet</p>
        ) : (
          recs.map(e => (
            <Link key={e._id} to={`/events/${e._id}`} className="block p-2 border-b last:border-b-0 hover:bg-gray-50">
              <div className="text-sm font-medium">{e.title}</div>
              <div className="text-xs text-gray-500">{e.category} • {new Date(e.date).toDateString()}</div>
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}
