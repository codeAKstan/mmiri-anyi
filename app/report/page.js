"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ReportLeak() {
  const [formData, setFormData] = useState({
    issueType: '',
    location: '',
    ward: '',
    landmark: '',
    description: '',
    severity: '',
    reporterName: '',
    phoneNumber: '',
    email: '',
    anonymous: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 2000);
  };

  if (submitSuccess) {
    return (
      <div className="font-sans min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for reporting this water issue. Your report has been received and assigned tracking ID: <strong>WR-{Math.random().toString(36).substr(2, 8).toUpperCase()}</strong>
            </p>
            <p className="text-gray-600 mb-8">
              Our water stewards have been notified and will respond within 24 hours. You'll receive Email updates on the progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Report Another Issue
              </button>
              <a 
                href="/"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 text-center"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12 pt-30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Report a Water Issue</h1>
          <p className="text-xl text-blue-100">
            Help us keep our community safe by reporting water leaks, pipe bursts, or water shortages
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Issue Details</h2>
            <p className="text-gray-600 text-sm mt-1">Please provide as much detail as possible to help us respond quickly</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Issue Type */}
            <div>
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Type of Water Issue *
              </label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleInputChange}
                required
                className="w-full bg-[#F3FBFF] text-[#000000] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select issue type</option>
                <option value="pipe-burst">Pipe Burst</option>
                <option value="water-leak">Water Leak</option>
                <option value="no-water-supply">No Water Supply</option>
                <option value="contaminated-water">Contaminated Water</option>
                <option value="low-water-pressure">Low Water Pressure</option>
                <option value="blocked-drainage">Blocked Drainage</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address/Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 15 Ogui Road, New Haven"
                  className="w-full bg-[#F3FBFF] text-[#000000] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward/Zone *
                </label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#F3FBFF] text-[#000000] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select ward</option>
                  <option value="abakpa-nike">Abakpa Nike</option>
                  <option value="new-haven">New Haven</option>
                  <option value="independence-layout">Independence Layout</option>
                  <option value="trans-ekulu">Trans Ekulu</option>
                  <option value="coal-camp">Coal Camp</option>
                  <option value="ogbete">Ogbete</option>
                  <option value="uwani">Uwani</option>
                  <option value="asata">Asata</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Landmark
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                placeholder="e.g., Near Polo Park Mall, Opposite First Bank"
                className="w-full bg-[#F3FBFF] text-[#000000] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Issue Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the Issue *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Please describe what you observed, when it started, and any other relevant details..."
                className="w-full bg-[#F3FBFF] text-[#000000] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'low', label: 'Low', desc: 'Minor issue, not urgent', color: 'green', borderClass: 'border-green-500', bgClass: 'bg-green-50', dotClass: 'bg-green-500' },
                  { value: 'medium', label: 'Medium', desc: 'Moderate issue, needs attention', color: 'yellow', borderClass: 'border-yellow-500', bgClass: 'bg-yellow-50', dotClass: 'bg-yellow-500' },
                  { value: 'high', label: 'High', desc: 'Urgent issue, immediate action needed', color: 'red', borderClass: 'border-red-500', bgClass: 'bg-red-50', dotClass: 'bg-red-500' }
                ].map((severity) => (
                  <label key={severity.value} className="relative">
                    <input
                      type="radio"
                      name="severity"
                      value={severity.value}
                      checked={formData.severity === severity.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.severity === severity.value 
                        ? `${severity.borderClass} ${severity.bgClass}` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full ${severity.dotClass} mr-2`}></div>
                        <span className="font-medium text-gray-900">{severity.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{severity.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="reporterName"
                    value={formData.reporterName}
                    onChange={handleInputChange}
                    required={!formData.anonymous}
                    disabled={formData.anonymous}
                    placeholder="e.g., John Doe"
                    className="w-full bg-[#F3FBFF] text-[#000000] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required={!formData.anonymous}
                    disabled={formData.anonymous}
                    placeholder="e.g., +234 803 123 4567"
                    className="w-full bg-[#F3FBFF] text-[#000000] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required={!formData.anonymous}
                  disabled={formData.anonymous}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#F3FBFF] text-[#000000] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Submit this report anonymously
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Anonymous reports will still be processed, but you won't receive updates
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Report...
                  </div>
                ) : (
                  'Submit Water Issue Report'
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                By submitting this report, you agree to our terms of service and privacy policy
              </p>
            </div>
          </form>
        </div>
        
        {/* Emergency Contact */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Emergency Situation?</h3>
              <p className="text-red-700 mt-1">
                If this is a life-threatening emergency or major pipe burst causing flooding, please call our emergency hotline immediately:
              </p>
              <p className="text-xl font-bold text-red-800 mt-2">+234 800 WATER (92837)</p>
              <p className="text-sm text-red-600 mt-1">Available 24/7 for emergency water issues</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}