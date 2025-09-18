'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminReports() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [stewards, setStewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningReport, setAssigningReport] = useState(null);
  const [selectedSteward, setSelectedSteward] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchReports();
    fetchStewards();
  }, [router]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        console.error('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStewards = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/stewards', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStewards(data.stewards || []);
      }
    } catch (error) {
      console.error('Error fetching stewards:', error);
    }
  };

  const handleAssignReport = async (reportId) => {
    if (!selectedSteward) {
      alert('Please select a steward to assign the report to.');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/reports/${reportId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stewardId: selectedSteward
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update the reports list
        setReports(prevReports => 
          prevReports.map(report => 
            report._id === reportId 
              ? { ...report, status: 'in-progress', assignedTo: data.assignedSteward }
              : report
          )
        );

        // Reset assignment state
        setAssigningReport(null);
        setSelectedSteward('');
        
        alert('Report assigned successfully! Notifications have been sent.');
      } else {
        const errorData = await response.json();
        alert(`Failed to assign report: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error assigning report:', error);
      alert('Failed to assign report. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and search reports
  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <Image
                src="/mmiri-logo.png"
                alt="Mmiri Anyi Logo"
                width={40}
                height={40}
                className="mr-3"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Issue Reports Management
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Reports
              </label>
              <input
                type="text"
                placeholder="Search by location, issue type, or reporter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing {currentReports.length} of {filteredReports.length} reports
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {currentReports.length === 0 ? (
            <div className="text-center py-12">
              <Image
                src="/droplet.png"
                alt="No reports"
                width={64}
                height={64}
                className="mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-500">No reports found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.issueType}
                          </div>
                          <div className="text-sm text-gray-600">
                            📍 {report.location}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(report.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {report.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {report.assignedTo ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {report.assignedTo.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {report.assignedTo.employeeId}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {report.status === 'pending' && (
                          <button
                            onClick={() => setAssigningReport(report._id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Assign
                          </button>
                        )}
                        <button
                          onClick={() => {
                            alert(`Report Details:\n\nIssue: ${report.issueType}\nLocation: ${report.location}\nDescription: ${report.description}\nReporter: ${report.name}\nContact: ${report.phone}\nDate: ${formatDate(report.createdAt)}`);
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstReport + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastReport, filteredReports.length)}</span> of{' '}
                    <span className="font-medium">{filteredReports.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Assignment Modal */}
      {assigningReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Assign Report to Steward
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Steward
                </label>
                <select
                  value={selectedSteward}
                  onChange={(e) => setSelectedSteward(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a steward...</option>
                  {stewards
                    .filter(steward => steward.status === 'active')
                    .map((steward) => (
                    <option key={steward._id} value={steward._id}>
                      {steward.name} (ID: {steward.employeeId}) - {steward.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setAssigningReport(null);
                    setSelectedSteward('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAssignReport(assigningReport)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Assign Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}