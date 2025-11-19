'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { BarChart3, FileText, Users, User, Bell, Search, Info, CheckCircle, Clock, ClipboardCheck, LogOut } from 'lucide-react';
import StewardSidebar from '../../../components/StewardSidebar';

export default function StewardDashboard() {
  const router = useRouter();
  const [stewardData, setStewardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState([]);
  const [assignedReports, setAssignedReports] = useState([]);
  const [createdReports, setCreatedReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    thisMonthReports: 0
  });
  const [stewardStats, setStewardStats] = useState({
    activeAssigned: 0,
    resolvedThisWeek: 0,
    avgResolutionTime: '4 days',
    pendingVerifications: 0
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('stewardToken');
    const userData = localStorage.getItem('stewardData');
    
    if (!token || !userData) {
      router.push('/steward/login');
      return;
    }

    try {
      const parsedUserData = JSON.parse(userData);
      setStewardData(parsedUserData);
      const tabParam = searchParams.get('tab');
      if (tabParam && ['overview','assigned','reports','profile'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/steward/login');
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('stewardToken');
      
      // Fetch reports
      const reportsResponse = await fetch('/api/steward/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        
        // Set all reports data
        setReports(reportsData.allReports || []);
        setAssignedReports(reportsData.assignedReports || []);
        setCreatedReports(reportsData.createdReports || []);
        
        // Calculate stats based on all reports
        const allReports = reportsData.allReports || [];
        const total = allReports.length;
        const pending = allReports.filter(r => r.status === 'pending').length;
        const resolved = allReports.filter(r => r.status === 'resolved').length;
        const thisMonth = allReports.filter(r => {
          const reportDate = new Date(r.createdAt);
          const now = new Date();
          return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
        }).length;
        
        setStats({
          totalReports: total,
          pendingReports: pending,
          resolvedReports: resolved,
          thisMonthReports: thisMonth
        });

        const assigned = reportsData.assignedReports || [];
        const activeAssigned = assigned.filter(r => r.status === 'pending' || r.status === 'in-progress').length;
        const pendingVerifications = assigned.filter(r => r.status === 'pending').length;
        const now = new Date();
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const resolvedThisWeek = assigned.filter(r => r.status === 'resolved' && new Date(r.createdAt) >= weekAgo).length;
        setStewardStats({
          activeAssigned,
          resolvedThisWeek,
          avgResolutionTime: '4 days',
          pendingVerifications
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('stewardToken');
    localStorage.removeItem('stewardData');
    router.push('/steward/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StewardSidebar steward={stewardData} activeKey={activeTab === 'assigned' ? 'assigned' : 'dashboard'} onLogout={handleLogout} />

      <div className="flex-1 lg:ml-0 overflow-hidden">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="hidden lg:flex items-center space-x-8 ml-4">
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Dashboards
                  </button>
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 border-b-2 border-blue-600">
                    Stewards
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input className="bg-transparent text-sm text-gray-700 px-2 w-48" placeholder="Search reports, stewards, or tracking IDs..." />
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <User className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Assigned Issues</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Info className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stewardStats.activeAssigned}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Issues Resolved This Week</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stewardStats.resolvedThisWeek}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Average Resolution Time</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stewardStats.avgResolutionTime}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <ClipboardCheck className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stewardStats.pendingVerifications}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Current Tasks</h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assignedReports.map((report) => (
                      <tr key={report._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 font-medium hover:underline" onClick={() => router.push(`/steward/reports/${report._id}`)}>{report.trackingNumber}</button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900 text-sm">{report.issueType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900 text-sm">{report.location}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            report.status === 'resolved' ? 'bg-green-100 text-green-800' : report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>{report.status === 'in-progress' ? 'In Progress' : report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            (report.severity || report.priority) === 'high' ? 'bg-orange-100 text-orange-800' : (report.severity || report.priority) === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>{report.severity || report.priority}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <button onClick={() => router.push(`/steward/update?id=${report._id}`)} className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl">Update</button>
                            <button onClick={() => router.push(`/steward/reports/${report._id}`)} className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-xl hover:bg-gray-50">View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {assignedReports.length === 0 && (
                  <div className="px-6 py-10 text-center text-gray-500">No current tasks</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}