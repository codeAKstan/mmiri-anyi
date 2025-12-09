import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body?.messages) ? body.messages : []
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'AI not configured' }, { status: 400 })
    }
    const mode = body?.mode || 'extract'

    const system = mode === 'qa'
      ? { role: 'system', content: 'You are a helpful assistant. Answer any user question concisely and clearly. If the question is vague or missing context, ask the user to clarify. Keep responses brief and useful.' }
      : { role: 'system', content: 'Extract a structured report as JSON with keys: category (one of water, roads, lighting, waste), issueType, location, ward, landmark, description, severity (low, medium, high), reporterName, phoneNumber, email. Infer missing values from context, default category=water. Respond with JSON only.' }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: mode === 'qa' ? 0.2 : 0,
        messages: [system, ...messages],
        ...(mode === 'extract' ? { response_format: { type: 'json_object' } } : {})
      })
    })

    if (!resp.ok) {
      if (mode === 'qa') {
        const joined = [system, ...messages].map(m => `${m.role}: ${m.content}`).join('\n')
        try {
          const r2 = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.2, input: joined })
          })
          if (r2.ok) {
            const j2 = await r2.json()
            const a2 = j2?.output_text || j2?.choices?.[0]?.message?.content || ''
            return NextResponse.json({ success: true, data: { answer: a2 } })
          }
        } catch {}
        return NextResponse.json({ success: true, data: { answer: 'I could not process that question right now. Could you clarify or try again?' } })
      } else {
        // Fallback for extraction mode
        const last = messages.filter(m => m.role === 'user').pop()?.content || ''
        const data = heuristicExtract(last)
        return NextResponse.json({ success: true, data })
      }
    }

    const data = await resp.json()
    const content = data?.choices?.[0]?.message?.content || (mode === 'qa' ? '' : '{}')
    if (mode === 'qa') {
      return NextResponse.json({ success: true, data: { answer: content } })
    }
    let parsed
    try { parsed = JSON.parse(content) } catch { parsed = {} }
    return NextResponse.json({ success: true, data: parsed })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

function heuristicExtract(text) {
  const t = (text || '').toLowerCase()
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  const phoneMatch = text.match(/(?:\+\d{1,3}[\s-]?)?\d{7,14}/)
  const wardOptions = ['abakpa-nike','new-haven','independence-layout','trans-ekulu','coal-camp','ogbete','uwani','asata']
  const ward = wardOptions.find(w => t.includes(w)) || ''
  let category = 'water'
  if (t.includes('pothole') || t.includes('road')) category = 'roads'
  else if (t.includes('streetlight') || t.includes('lighting') || t.includes('lamp')) category = 'lighting'
  else if (t.includes('waste') || t.includes('bin') || t.includes('garbage')) category = 'waste'
  let severity = ''
  if (t.includes('urgent') || t.includes('immediate') || t.includes('high')) severity = 'high'
  else if (t.includes('medium')) severity = 'medium'
  else if (t.includes('low') || t.includes('minor')) severity = 'low'
  let location = ''
  const locMatch = text.match(/(?:at|in|on)\s+([^.,\n]+)/i)
  if (locMatch) location = locMatch[1].trim()
  let issueType = ''
  if (t.includes('pipe')) issueType = 'pipe-burst'
  else if (t.includes('leak')) issueType = 'leakage'
  else if (t.includes('pothole')) issueType = 'pothole'
  else if (t.includes('streetlight')) issueType = 'streetlight-out'
  else if (t.includes('waste')) issueType = 'waste-overflow'
  const nameMatch = text.match(/my name is\s+([A-Za-z\s]+)/i)
  const landmarkMatch = text.match(/near\s+([^.,\n]+)/i)
  return {
    category,
    issueType,
    location,
    ward,
    landmark: landmarkMatch ? landmarkMatch[1].trim() : '',
    description: text || '',
    severity,
    reporterName: nameMatch ? nameMatch[1].trim() : '',
    phoneNumber: phoneMatch ? phoneMatch[0] : '',
    email: emailMatch ? emailMatch[0] : ''
  }
}
