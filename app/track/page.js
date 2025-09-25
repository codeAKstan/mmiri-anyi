'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TrackReport() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);
    
    try {
      const response = await fetch(`/api/reports?tracking=${trackingNumber.trim()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch report');
      }
      
      setReport(data.report);
      setSearched(true);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the report');
    } finally {
      setLoading(false);
    }
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Report</h1>
            <p className="text-lg text-gray-600">Enter your tracking number to check the status of your report</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="tracking" className="sr-only">Tracking Number</label>
                <input
                  type="text"
                  id="tracking"
                  name="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., WL1234567ABC)"
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track Report'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          {searched && !report && !loading && !error && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Image
                src="/droplet.png"
                alt="No report found"
                width={64}
                height={64}
                className="mx-auto mb-4 opacity-50"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Report Found</h2>
              <p className="text-gray-600">
                We couldn't find a report with the tracking number <span className="font-mono font-medium">{trackingNumber}</span>
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Please check the tracking number and try again, or contact support if you need assistance.
              </p>
            </div>
          )}
          
          {report && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Image src="/file.svg" alt="Report" width={24} height={24} className="mr-2" />
                  Report Details
                </h2>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="text-lg font-mono font-medium">{report.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Issue Type</p>
                    <p className="font-medium">{report.issueType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reported On</p>
                    <p className="font-medium">{formatDate(report.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{report.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Severity</p>
                    <p className="font-medium capitalize">{report.severity}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="bg-gray-50 p-4 rounded-md">{report.description}</p>
                </div>
                
                {report.notes && report.notes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Updates</h3>
                    <div className="space-y-3">
                      {report.notes.map((note, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500 mb-1">
                            {formatDate(note.createdAt)} by {note.createdBy}
                          </p>
                          <p>{note.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 p-4 bg-yellow-50 rounded-md">
                  <h3 className="text-md font-semibold text-yellow-800 mb-2">What happens next?</h3>
                  {report.status === 'pending' && (
                    <p className="text-sm text-yellow-700">
                      Your report is currently under review. Our team will assess the issue and assign it to a water steward soon.
                    </p>
                  )}
                  {report.status === 'in-progress' && (
                    <p className="text-sm text-yellow-700">
                      Your report has been assigned to a water steward who is currently working on resolving the issue.
                    </p>
                  )}
                  {report.status === 'resolved' && (
                    <p className="text-sm text-yellow-700">
                      Your reported issue has been resolved. If you're still experiencing problems, please contact us.
                    </p>
                  )}
                  {report.status === 'closed' && (
                    <p className="text-sm text-yellow-700">
                      This report has been closed. Thank you for helping us maintain water infrastructure.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you need assistance or have questions about your report, please contact our support team.
            </p>
            <div className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +234 813 1944 801
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}