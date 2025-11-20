'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import StewardSidebar from '../../../components/StewardSidebar'

export default function StewardUpdatePage() {
  const router = useRouter()
  const preselectId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') : null
  const [token, setToken] = useState('')
  const [steward, setSteward] = useState(null)
  const [assignedReports, setAssignedReports] = useState([])
  const [selectedId, setSelectedId] = useState(preselectId || '')
  const [form, setForm] = useState({ status: '', note: '', image: null })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('stewardToken')
    const s = localStorage.getItem('stewardData')
    if (!t || !s) {
      router.push('/steward/login')
      return
    }
    setToken(t)
    try { setSteward(JSON.parse(s)) } catch {}
    fetch('/api/steward/reports', { headers: { Authorization: `Bearer ${t}` } })
      .then(async (res) => {
        const data = await res.json()
        if (res.ok) {
          setAssignedReports(data.assignedReports || [])
          if (!selectedId && preselectId) setSelectedId(preselectId)
        } else {
          setError(data.message || 'Failed to load reports')
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [preselectId, router, selectedId])

  const selectedReport = useMemo(() => assignedReports.find(r => r._id === selectedId) || null, [assignedReports, selectedId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    if (!selectedId) { setError('Select an issue'); setSubmitting(false); return }
    try {
      const fd = new FormData()
      if (form.status) fd.append('status', form.status)
      if (form.note) fd.append('note', form.note)
      if (form.image) fd.append('image', form.image)
      const res = await fetch(`/api/steward/reports/${selectedId}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: fd })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Update submitted')
        setForm({ status: '', note: '', image: null })
        setAssignedReports(prev => prev.map(r => r._id === selectedId ? data.report : r))
      } else {
        setError(data.message || 'Failed to update')
      }
    } catch {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
    <div className="min-h-screen bg-gray-50 flex">
      <StewardSidebar steward={steward} activeKey="update" onLogout={() => { localStorage.removeItem('stewardToken'); localStorage.removeItem('stewardData'); router.push('/steward/login') }} />
      <div className="flex-1 lg:ml-0 overflow-hidden">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="ml-3 text-black font-semibold">Update Issue Status</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{steward?.name}</div>
            <div className="text-xs text-gray-500">Steward</div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg text-black font-semibold mb-4">Update Issue Status</h2>
          <p className="text-sm text-black mb-6">Select an assigned issue and update its status with details</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-black mb-2">Select Issue</label>
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="w-full text-black border border-gray-300 rounded-md px-3 py-2">
                <option value="">Search or select an issue</option>
                {assignedReports.map(r => (
                  <option key={r._id} value={r._id}>{r.trackingNumber} • {r.issueType}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-black mb-1">Issue ID</label>
                <input readOnly value={selectedReport?.trackingNumber || ''} className="w-full text-black bg-gray-50 border border-gray-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-black mb-1">Category</label>   
                <input readOnly value={(selectedReport?.category || 'water')} className="w-full text-black bg-gray-50 border border-gray-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-black mb-1">Location</label>
                <input readOnly value={selectedReport?.location || ''} className="w-full text-black bg-gray-50 border border-gray-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-black mb-1">Current Status</label>
                <input readOnly value={selectedReport ? (selectedReport.status === 'in-progress' ? 'In Progress' : selectedReport.status) : ''} className="w-full text-black bg-gray-50 border border-gray-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-black mb-2">Update Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full text-black border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Select new status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Upload Evidence Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input type="file" accept="image/png,image/jpeg" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Resolution Note</label>
              <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={4} className="w-full text-black border border-gray-300 rounded-md px-3 py-2" placeholder="Add details about the work done, materials used, or any observations..." />
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}
            {success && <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">{success}</div>}

            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-md text-black font-medium disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Update'}</button>
              <button type="button" onClick={() => router.push('/steward/dashboard')} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800">Cancel</button>
            </div>
          </form>
        </div>
      </main>
      </div>
    </div>
    </Suspense>
  )
}