import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body?.messages) ? body.messages : []
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'AI not configured' }, { status: 400 })
    }

    const system = {
      role: 'system',
      content:
        'Extract a structured report as JSON with keys: category (one of water, roads, lighting, waste), issueType, location, ward, landmark, description, severity (low, medium, high), reporterName, phoneNumber, email. Infer missing values from context, default category=water. Respond with JSON only.'
    }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        messages: [system, ...messages],
        response_format: { type: 'json_object' }
      })
    })

    if (!resp.ok) {
      const err = await resp.text()
      return NextResponse.json({ success: false, error: 'AI request failed', details: err }, { status: 500 })
    }

    const data = await resp.json()
    const content = data?.choices?.[0]?.message?.content || '{}'
    let parsed
    try { parsed = JSON.parse(content) } catch { parsed = {} }

    return NextResponse.json({ success: true, data: parsed })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
