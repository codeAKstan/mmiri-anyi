"use client";

import { Home, ClipboardList, RefreshCw, Bell, User, LogOut } from "lucide-react";

export default function StewardSidebar({ open = false, steward, activeKey = "dashboard", onLogout }) {
  const initials = steward?.name ? steward.name.split(" ").map(n => n[0]).join("").toUpperCase() : "ST";
  const name = steward?.name || "Steward";

  const itemClass = (key) => `group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
    activeKey === key ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
  }`;

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0`}>
      <div className="flex flex-col w-full">
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">COMMUNIFI</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="/steward/dashboard" className={itemClass("dashboard")}>
            <Home className="text-gray-400 mr-3 h-5 w-5" />
            Dashboard
          </a>
          <a href="/steward/dashboard?tab=assigned" className={itemClass("assigned")}>
            <ClipboardList className="text-gray-400 mr-3 h-5 w-5" />
            My Assigned Issues
          </a>
          <a href="/steward/update" className={itemClass("update")}>
            <RefreshCw className="text-gray-400 mr-3 h-5 w-5" />
            Update Issue Status
          </a>
          <a href="#" className={itemClass("notifications")}>
            <Bell className="text-gray-400 mr-3 h-5 w-5" />
            Notifications
          </a>
          <a href="/steward/dashboard?tab=profile" className={itemClass("profile")}>
            <User className="text-gray-400 mr-3 h-5 w-5" />
            Profile
          </a>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">{initials}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{name}</p>
              <p className="text-xs text-gray-500">Steward</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center text-sm text-red-600 hover:text-red-800">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}