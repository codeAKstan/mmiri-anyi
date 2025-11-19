'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import StewardSidebar from '../../../../components/StewardSidebar'

export default function StewardReportView() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [report, setReport] = useState(null)
  const [steward, setSteward] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('stewardToken')
    const userData = localStorage.getItem('stewardData')
    if (!token || !userData) {
      router.push('/steward/login')
      return
    }
    try { setSteward(JSON.parse(userData)) } catch {}
    fetch(`/api/steward/reports/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json()
        if (res.ok) {
          setReport(data.report)
        } else {
          setError(data.message || 'Failed to load report')
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [id, router])

  const formatDate = (d) => new Date(d).toLocaleString()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StewardSidebar steward={steward} activeKey="assigned" onLogout={() => { localStorage.removeItem('stewardToken'); localStorage.removeItem('stewardData'); router.push('/steward/login') }} />
      <div className="flex-1 lg:ml-0 overflow-hidden">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="ml-3 font-semibold">Update Issue Status</span>
          </div>
          <button onClick={() => router.push('/steward/dashboard')} className="text-sm text-blue-600">Back to Dashboard</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Issue ID</p>
              <p className="text-gray-900 font-medium">{report.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-gray-900 font-medium capitalize">{report.category || 'water'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-gray-900 font-medium">{report.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Severity</p>
              <p className="text-gray-900 font-medium capitalize">{report.severity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Issue Type</p>
              <p className="text-gray-900 font-medium">{report.issueType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${report.status === 'resolved' ? 'bg-green-100 text-green-800' : report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : report.status === 'closed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>{report.status === 'in-progress' ? 'In Progress' : report.status}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-900">{report.description}</p>
          </div>

          {report.imageUrl && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">Attached Photo</p>
              <Image src={report.imageUrl} alt="Report image" width={600} height={400} className="rounded-md" />
            </div>
          )}

          {Array.isArray(report.notes) && report.notes.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Updates</p>
              <div className="space-y-3">
                {report.notes.map((note, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-1">{formatDate(note.createdAt)} by {note.createdBy}</p>
                    <p className="text-gray-900">{note.message}</p>
                    {note.imageUrl && (
                      <div className="mt-2">
                        <Image src={note.imageUrl} alt="Evidence" width={500} height={300} className="rounded" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  )
}