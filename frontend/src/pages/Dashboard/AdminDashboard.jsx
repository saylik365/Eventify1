import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import RoleTabs from "../../components/RoleTabs";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  const loadData = async () => {
    try {
      const [u, e] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/events")
      ]);
      setUsers(u.data);
      setEvents(e.data);
    } catch { toast.error("Failed to fetch admin data"); }
  };
  useEffect(() => { loadData(); }, []);

  const promote = async (userId, role) => {
    try {
      await API.post("/admin/promote", { userId, role });
      toast.success("User promoted");
      loadData();
    } catch { toast.error("Promote failed"); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <RoleTabs />
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <h3 className="font-semibold mt-6 mb-2">Users</h3>
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-100">
            <th className="p-2">Name</th><th>Email</th><th>Roles</th><th>Action</th>
          </tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.roles.join(", ")}</td>
                <td>
                  <button onClick={()=>promote(u._id,"admin")}
                    className="text-blue-600 border px-2 py-1 rounded">Promote</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-semibold mt-8 mb-2">All Events</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(e=>(
          <div key={e._id} className="border p-3 rounded bg-white shadow-sm">
            <h4 className="font-semibold">{e.title}</h4>
            <p className="text-sm text-gray-500">{e.owner?.name}</p>
            <p className="text-sm">{new Date(e.date).toDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
