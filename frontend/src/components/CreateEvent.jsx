import React, { useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";

export default function CreateEvent({ onCreated, initialOpen = false }) {
  const [open, setOpen] = useState(initialOpen);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", date: "", time: "", location: ""
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/events/create", form);
      toast.success("Event created");
      setForm({ title: "", description: "", category: "", date: "", time: "", location: "" });
      setOpen(false);
      if (onCreated) onCreated();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-green-600 text-white px-3 py-2 rounded shadow">+ Create Event</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded max-w-lg w-full p-5 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Create Event</h3>
              <button onClick={() => setOpen(false)} className="text-gray-600">✕</button>
            </div>

            <form onSubmit={submit} className="grid gap-2">
              <input name="title" value={form.title} onChange={change} placeholder="Title" className="border p-2 rounded" required />
              <input name="category" value={form.category} onChange={change} placeholder="Category" className="border p-2 rounded" />
              <textarea name="description" value={form.description} onChange={change} placeholder="Description" rows={3} className="border p-2 rounded" />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" name="date" value={form.date} onChange={change} className="border p-2 rounded" required />
                <input type="time" name="time" value={form.time} onChange={change} className="border p-2 rounded" required />
              </div>
              <input name="location" value={form.location} onChange={change} placeholder="Location" className="border p-2 rounded" />
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
