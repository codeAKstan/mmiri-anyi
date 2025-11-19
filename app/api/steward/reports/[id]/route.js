import { put } from '@vercel/blob'
import { connectDB } from '../../../../../lib/mongodb'
import Report from '../../../../../models/Report'
import { withStewardAuth } from '../../../../../middleware/stewardAuth'
import mongoose from 'mongoose'

async function getReport(request, { params }) {
  try {
    await connectDB()
    const stewardId = request.stewardId
    const reportId = params.id
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid report id' }), { status: 400 })
    }
    const report = await Report.findById(reportId).lean()
    if (!report) {
      return new Response(JSON.stringify({ success: false, message: 'Report not found' }), { status: 404 })
    }
    const isAuthorized = (report.assignedTo && report.assignedTo.toString() === stewardId.toString()) || (report.createdBy && report.createdBy.toString() === stewardId.toString())
    if (!isAuthorized) {
      return new Response(JSON.stringify({ success: false, message: 'Forbidden' }), { status: 403 })
    }
    return new Response(JSON.stringify({ success: true, report }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Failed to fetch report' }), { status: 500 })
  }
}

async function updateReport(request, { params }) {
  try {
    await connectDB()
    const stewardId = request.stewardId
    const steward = request.steward
    const reportId = params.id
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid report id' }), { status: 400 })
    }
    const report = await Report.findById(reportId)
    if (!report) {
      return new Response(JSON.stringify({ success: false, message: 'Report not found' }), { status: 404 })
    }
    const isAuthorized = (report.assignedTo && report.assignedTo.toString() === stewardId.toString()) || (report.createdBy && report.createdBy.toString() === stewardId.toString())
    if (!isAuthorized) {
      return new Response(JSON.stringify({ success: false, message: 'Forbidden' }), { status: 403 })
    }
    const form = await request.formData()
    const newStatus = form.get('status')
    const noteMessage = form.get('note') || ''
    const file = form.get('image')
    let imageUrl = null
    if (file && file.size > 0) {
      const blob = await put(`evidence/${Date.now()}-${file.name}`, file, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN })
      imageUrl = blob.url
    }
    if (newStatus) {
      report.status = newStatus
    }
    if (noteMessage || imageUrl) {
      report.notes.push({ message: noteMessage, createdBy: steward.name || steward.employeeId || 'Steward', imageUrl })
    }
    await report.save()
    const populated = await Report.findById(reportId).lean()
    return new Response(JSON.stringify({ success: true, report: populated }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Failed to update report' }), { status: 500 })
  }
}

export const GET = withStewardAuth(getReport)
export const PATCH = withStewardAuth(updateReport)