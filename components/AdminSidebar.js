"use client";

import { BarChart3, FileText, Users, Settings, User, Droplets, LogOut } from "lucide-react";

export default function AdminSidebar({ open = false, adminProfile, onLogout }) {
  const initials = adminProfile?.initials || "AD";
  const name = adminProfile?.name || "Admin";

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0`}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Communifi</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="/admin/dashboard" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
            <BarChart3 className="text-gray-400 mr-3 h-5 w-5" />
            Overview
          </a>
          <a href="/admin/reports" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
            <FileText className="text-gray-400 mr-3 h-5 w-5" />
            Report
          </a>
          <a href="/admin/stewards" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
            <Users className="text-gray-400 mr-3 h-5 w-5" />
            Stewards
          </a>
          <a href="#" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
            <User className="text-gray-400 mr-3 h-5 w-5" />
            User Profile
          </a>
          <a href="#" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
            <BarChart3 className="text-gray-400 mr-3 h-5 w-5" />
            Analytics
          </a>
          <a href="#" className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg">
            <Settings className="text-gray-400 mr-3 h-5 w-5" />
            Settings
          </a>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{initials}</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center text-sm text-red-600 hover:text-red-800">
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}