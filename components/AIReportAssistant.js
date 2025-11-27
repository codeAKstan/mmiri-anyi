"use client";

import { useState } from "react";

export default function AIReportAssistant({ onApply, onAutoSubmit }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [guided, setGuided] = useState(false);
  const requiredOrder = [
    'issueType',
    'location',
    'description',
    'severity',
    'reporterName',
    'phoneNumber',
    'email'
  ];
  const [buffer, setBuffer] = useState({});
  const [currentKey, setCurrentKey] = useState(null);

  const askFor = (key) => {
    const prompts = {
      issueType: 'What is the type of issue? (e.g., pipe-burst, leakage, pothole, streetlight-out)',
      location: 'Where is the issue located? (street address, area)',
      description: 'Briefly describe the issue and when it started',
      severity: 'How severe is it? Choose: low, medium, or high',
      reporterName: 'What is your name?',
      phoneNumber: 'What is your phone number?',
      email: 'What is your email address?'
    };
    setMessages((prev) => [...prev, { role: 'assistant', content: prompts[key] }]);
    setCurrentKey(key);
  };

  const startGuided = () => {
    setGuided(true);
    const initial = extracted || {};
    setBuffer(initial);
    const missing = requiredOrder.find((k) => !initial[k] || String(initial[k]).trim() === '');
    if (missing) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Okay, let’s fill your report step by step.' }]);
      askFor(missing);
    } else {
      // All present; submit immediately
      guidedSubmit(initial);
    }
  };

  const guidedSubmit = async (data) => {
    const mapped = mapData(data);
    if (onAutoSubmit) {
      onAutoSubmit(mapped);
      return;
    }
    try {
      const fd = new FormData();
      Object.keys(mapped).forEach((k) => {
        if (mapped[k] !== null && mapped[k] !== '') fd.append(k, mapped[k]);
      });
      const res = await fetch('/api/reports', { method: 'POST', body: fd });
      const json = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: `Submitted successfully. Tracking Number: ${json.trackingNumber}` }]);
        setGuided(false);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: `Submission failed: ${json.error || 'Please ensure all fields are provided.'}` }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error during submission.' }]);
    }
  };

  const mapData = (data) => ({
    category: (data.category || 'water').toLowerCase(),
    issueType: data.issueType || '',
    location: data.location || '',
    ward: data.ward || '',
    landmark: data.landmark || '',
    description: data.description || '',
    severity: (data.severity || '').toLowerCase(),
    reporterName: data.reporterName || '',
    phoneNumber: data.phoneNumber || '',
    email: data.email || '',
    anonymous: false,
    image: null,
  });

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    if (guided && currentKey) {
      // Record answer for current field
      let val = text;
      if (currentKey === 'severity') {
        const v = val.trim().toLowerCase();
        const map = { meduim: 'medium', mid: 'medium', moderate: 'medium', normal: 'medium', hi: 'high', urgent: 'high', critical: 'high', severe: 'high', minor: 'low' };
        const norm = ['low','medium','high'].includes(v) ? v : (map[v] || '');
        if (!norm) {
          setMessages((prev) => [...prev, { role: 'assistant', content: 'Please choose severity: low, medium, or high.' }]);
          return;
        }
        val = norm;
      }
      const updated = { ...buffer, [currentKey]: val };
      setBuffer(updated);
      // Determine next missing
      const nextMissing = requiredOrder.find((k) => !updated[k] || String(updated[k]).trim() === '');
      if (nextMissing) {
        askFor(nextMissing);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Great, I have all details. Submitting now.' }]);
        await guidedSubmit(updated);
      }
      return;
    }

    // Normal chat
    setLoading(true);
    try {
      const isQuestion = /\b(what|how|why|about|explain|project|communifi)\b/i.test(text) || text.endsWith('?');
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: isQuestion ? 'qa' : 'extract', messages: next }),
      });
      const data = await res.json();
      if (isQuestion) {
        let answer;
        if (data.success) {
          if (data.data?.answer) {
            answer = data.data.answer;
          } else if (typeof data.data === 'string') {
            answer = data.data;
          } else {
            answer = 'I could not find an answer. Can you clarify?';
          }
        } else {
          answer = 'I could not understand that. Could you clarify your question?';
        }
        setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
      } else if (data.success) {
        setExtracted(data.data || null);
        const summary = summarise(data.data);
        setMessages((prev) => [...prev, { role: "assistant", content: summary }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "I couldn't process that. Please describe the issue, location, severity, and your contact." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const summarise = (d) => {
    const s = d || {};
    return `I prepared your report:\nCategory: ${s.category || "water"}\nIssue: ${s.issueType || ""}\nLocation: ${s.location || ""}${s.ward ? `, Ward: ${s.ward}` : ""}${s.landmark ? `, Landmark: ${s.landmark}` : ""}\nSeverity: ${s.severity || ""}\nName: ${s.reporterName || ""}\nPhone: ${s.phoneNumber || ""}\nEmail: ${s.email || ""}`;
  };

  const applyToForm = () => {
    // Start guided collection and submit at the end
    startGuided();
  };

  // Manual submit removed; assistant submits automatically after guided collection

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full px-4 py-3 shadow-lg"
      >
        {open ? "Close Assistant" : "AI Assistant"}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white border rounded-xl shadow-xl flex flex-col">
          <div className="px-4 py-3 text-black border-b font-semibold">Report Assistant</div>
          <div className="p-3 h-64 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-gray-900" : "text-gray-700"}>{m.content}</div>
            ))}
            {loading && <div className="text-sm text-gray-500">Processing...</div>}
          </div>
          <div className="p-3 border-t space-y-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your issue and contact"
              className="w-full border text-black rounded-md px-3 py-2"
            />
            <div className="flex gap-2">
              <button onClick={send} className="flex-1 bg-blue-600 text-white rounded-md px-3 py-2">Send</button>
              <button onClick={applyToForm} className="flex-1 bg-gray-100 text-gray-900 rounded-md px-3 py-2">Fill Form</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
