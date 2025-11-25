import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleTabs() {
  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const roles = user?.roles || ["user"];

  const go = (role) => nav(`/dashboard/${role}`);

  return (
    <div className="flex space-x-3 border-b pb-2 mb-4 overflow-x-auto">
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => go(role)}
          className={`px-3 py-1 rounded ${
            pathname.includes(role)
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {role.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
