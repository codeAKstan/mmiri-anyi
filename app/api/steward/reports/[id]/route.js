import { put } from '@vercel/blob'
import { connectDB } from '../../../../../lib/mongodb'
import Report from '../../../../../models/Report'
import { withStewardAuth } from '../../../../../middleware/stewardAuth'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'

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
    const prevStatus = report.status
    if (newStatus) {
      report.status = newStatus
    }
    if (noteMessage || imageUrl) {
      report.notes.push({ message: noteMessage, createdBy: steward.name || steward.employeeId || 'Steward', imageUrl })
    }
    await report.save()
    const populated = await Report.findById(reportId).lean()

    if (newStatus && newStatus !== prevStatus && populated.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        })
        const statusLabel = newStatus === 'in-progress' ? 'In Progress' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
              <h1>Communifi - Report Update</h1>
            </div>
            <div style="padding: 20px; background-color: #f9fafb;">
              <h2>Your report status has changed</h2>
              <p>Tracking Number: <strong>${populated.trackingNumber}</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Issue Type:</strong> ${populated.issueType}</p>
                <p><strong>Location:</strong> ${populated.location}</p>
                <p><strong>New Status:</strong> <span style="color: #059669; font-weight: bold;">${statusLabel}</span></p>
              </div>
              ${noteMessage ? `<div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;"><h3 style="margin:0 0 10px 0;">Steward Note</h3><p>${noteMessage}</p></div>` : ''}
              ${imageUrl ? `<div style="margin: 20px 0;"><a href="${imageUrl}" style="color:#2563eb;">View evidence photo</a></div>` : ''}
              <p>Thank you for your patience while we work to resolve this issue.</p>
            </div>
            <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px;">
              <p style="margin: 0;">© 2024 Communifi</p>
            </div>
          </div>
        `
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: populated.email,
          subject: `Report Update: Status changed to ${statusLabel}`,
          html
        })
      } catch (e) {}
    }
    return new Response(JSON.stringify({ success: true, report: populated }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Failed to update report' }), { status: 500 })
  }
}

export const GET = withStewardAuth(getReport)
export const PATCH = withStewardAuth(updateReport)