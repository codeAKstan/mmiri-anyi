"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Bell,
  Sun,
  Menu,
  FileText,
  Users,
  User,
  BarChart3,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Trash2,
} from "lucide-react"
import AdminSidebar from "../../../components/AdminSidebar"

export default function HydroGuardDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    totalReports: 0,
    activeIssues: 0,
    resolvedThisWeek: 0,
    highRiskZones: 0,
    avgResponseTime: '0h 0m',
    reportsByStatus: {},
    recentReports: [],
    adminProfile: null
  })
  const [loading, setLoading] = useState(true)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewLoading, setViewLoading] = useState(false)
  const [viewError, setViewError] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [stewards, setStewards] = useState([])
  const [assignSteward, setAssignSteward] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        console.error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openReportModal = async (tracking) => {
    try {
      setViewOpen(true)
      setViewLoading(true)
      setViewError('')
      const res = await fetch(`/api/reports?tracking=${tracking}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load report')
      setSelectedReport(data.report)
    } catch (e) {
      setViewError(e.message || 'Failed to load report')
    } finally {
      setViewLoading(false)
    }
    try {
      const sRes = await fetch('/api/admin/stewards')
      if (sRes.ok) {
        const sData = await sRes.json()
        setStewards(sData.stewards || [])
      }
    } catch {}
  }

  const closeReportModal = () => {
    setViewOpen(false)
    setSelectedReport(null)
    setAssignSteward('')
    setViewError('')
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        // Redirect to login page after successful logout
        window.location.href = '/admin/login'
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} adminProfile={dashboardData.adminProfile} onLogout={handleLogout} />

      {/* Main content */}
      <div className="flex-1 lg:ml-0 overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="hidden lg:flex items-center space-x-8 ml-4">
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Dashboards
                  </button>
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 border-b-2 border-blue-600">
                    Overview
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative hidden sm:block">
                  <input
                    type="text"
                    placeholder="Search Report ID / Location"
                    className="w-64 lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-500 sm:hidden">
                  <Search className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Sun className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-balance">
              Saving Communities, Building Sustainable Water Systems.
            </h2>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Active Issues */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Issues</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : dashboardData.activeIssues}
                </p>
                <p className="text-sm text-gray-500 mt-1">Open Reports</p>
              </div>
            </div>

            {/* Resolved This Week */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Resolved This Week</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : dashboardData.resolvedThisWeek}
                </p>
                <p className="text-sm text-gray-500 mt-1">Fixed</p>
              </div>
            </div>

            {/* Avg Response Time */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : dashboardData.avgResponseTime}
                </p>
                <p className="text-sm text-gray-500 mt-1">Response Time</p>
              </div>
            </div>

            {/* High Risk Zones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">High Risk Zones</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {loading ? '...' : dashboardData.highRiskZones}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : dashboardData.highRiskZones}
                </p>
                <p className="text-sm text-gray-500 mt-1">Zones</p>
              </div>
            </div>
          </div>

          {/* Map and Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-80 bg-gray-100 rounded-lg overflow-hidden relative">
                <img
                  src="/nigeria-map.png"
                  alt="Eastern Nigeria Map showing water system locations"
                  className="w-full h-full object-cover"
                />
                
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-6">Map Overview</h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  {/* Donut Chart */}
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="#ef4444"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="65.97 131.95"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="43.98 131.95"
                      strokeDashoffset="-65.97"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="#10b981"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="87.96 131.95"
                      strokeDashoffset="-109.95"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-sm mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {loading ? '...' : (dashboardData.reportsByStatus?.pending || 0)} Urgent
                    </p>
                    <p className="text-xs text-gray-500">Issues</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {loading ? '...' : (dashboardData.reportsByStatus?.['in-progress'] || 0)} Pending
                    </p>
                    <p className="text-xs text-gray-500">Verifications</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-sm mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {loading ? '...' : (dashboardData.reportsByStatus?.resolved || 0)} Resolved
                    </p>
                    <p className="text-xs text-gray-500">Issues</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Today</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned by
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        Loading reports...
                      </td>
                    </tr>
                  ) : dashboardData.recentReports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    dashboardData.recentReports.map((report, index) => (
                      <tr key={report.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{report.id}</span>
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(report.status)}`}>
                              • {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{report.taskName}</div>
                            <div className="text-sm text-gray-500">
                              {report.assignedTo !== 'Unassigned' ? `Assigned to ${report.assignedTo}` : 'Unassigned'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-medium">
                                {report.assignedBy.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm text-gray-900">{report.assignedBy}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openReportModal(report.id)}
                              className="inline-flex items-center px-4 py-2 bg-[#4F8FEA] hover:bg-[#3E7AD0] text-white rounded-2xl shadow-sm"
                            >
                              View
                            </button>
                            <button
                              className="inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-gray-800 rounded-2xl hover:bg-gray-50"
                              aria-label="Delete report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {viewOpen && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/40" onClick={closeReportModal}></div>
              <div className="absolute inset-y-12 left-1/2 -translate-x-1/2 w-[95%] max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="flex items-center text-black justify-between px-6 py-4 border-b">
                  <div className="font-semibold">{selectedReport ? `Report Details - ${selectedReport.trackingNumber}` : 'Report Details'}</div>
                  <button onClick={closeReportModal} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="p-6 overflow-y-auto">
                  {viewLoading && (
                    <div className="text-center text-gray-600">Loading...</div>
                  )}
                  {viewError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{viewError}</div>
                  )}
                  {selectedReport && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        {selectedReport.category && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">{selectedReport.category}</span>
                        )}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedReport.status)}`}>{selectedReport.status}</span>
                      </div>
                      <div className="text-sm text-gray-700 flex items-center gap-2">
                        <span>📍</span>
                        <span>{selectedReport.location}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Description</div>
                        <p className="text-sm text-gray-700">{selectedReport.description}</p>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-3">Photo Evidence</div>
                        {selectedReport.imageUrl ? (
                          <div className="flex gap-3">
                            <img src={selectedReport.imageUrl} alt="evidence" className="w-40 h-28 object-cover rounded-md" />
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No image</div>
                        )}
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-700">
                          <div><div className="text-gray-500">Reported by</div><div className="font-medium">{selectedReport.name}</div></div>
                          <div><div className="text-gray-500">Reported Date</div><div className="font-medium">{new Date(selectedReport.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-3">Status Timeline</div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">✓</div>
                            <div>
                              <div className="font-medium">Reported</div>
                              <div className="text-xs text-gray-500">{new Date(selectedReport.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">✓</div>
                            <div>
                              <div className="font-medium capitalize">{selectedReport.status.replace('-', ' ')}</div>
                              <div className="text-xs text-gray-500">{new Date(selectedReport.updatedAt).toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">Assign to Steward</div>
                        <div className="flex gap-3">
                          <select value={assignSteward} onChange={(e) => setAssignSteward(e.target.value)} className="flex-1 px-3 py-2 border text-black rounded-md text-sm">
                            <option value="">Select a steward</option>
                            {stewards.map(s => (
                              <option key={s._id} value={s._id}>{s.name} ({s.employeeId})</option>
                            ))}
                          </select>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50" disabled={!assignSteward}>Assign</button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md">Update Status</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Send Notification</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Export Report</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
