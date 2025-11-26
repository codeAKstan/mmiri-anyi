"use client";

import { useState } from "react";

export default function AIReportAssistant({ onApply, onAutoSubmit }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (data.success) {
        setExtracted(data.data || null);
        const summary = summarise(data.data);
        setMessages([...next, { role: "assistant", content: summary }]);
      } else {
        setMessages([...next, { role: "assistant", content: "I couldn't process that. Please provide your issue details: what happened, where, severity, and your contact." }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const summarise = (d) => {
    const s = d || {};
    return `I prepared your report:\nCategory: ${s.category || "water"}\nIssue: ${s.issueType || ""}\nLocation: ${s.location || ""}${s.ward ? `, Ward: ${s.ward}` : ""}${s.landmark ? `, Landmark: ${s.landmark}` : ""}\nSeverity: ${s.severity || ""}\nName: ${s.reporterName || ""}\nPhone: ${s.phoneNumber || ""}\nEmail: ${s.email || ""}`;
  };

  const applyToForm = () => {
    if (!extracted) return;
    const mapped = {
      category: (extracted.category || "water").toLowerCase(),
      issueType: extracted.issueType || "",
      location: extracted.location || "",
      ward: extracted.ward || "",
      landmark: extracted.landmark || "",
      description: extracted.description || "",
      severity: (extracted.severity || "").toLowerCase(),
      reporterName: extracted.reporterName || "",
      phoneNumber: extracted.phoneNumber || "",
      email: extracted.email || "",
      anonymous: false,
      image: null,
    };
    onApply && onApply(mapped);
  };

  const autoSubmit = async () => {
    if (!extracted) return;
    const mapped = {
      category: (extracted.category || "water").toLowerCase(),
      issueType: extracted.issueType || "",
      location: extracted.location || "",
      ward: extracted.ward || "",
      landmark: extracted.landmark || "",
      description: extracted.description || "",
      severity: (extracted.severity || "").toLowerCase(),
      reporterName: extracted.reporterName || "",
      phoneNumber: extracted.phoneNumber || "",
      email: extracted.email || "",
      anonymous: false,
      image: null,
    };
    if (onAutoSubmit) {
      onAutoSubmit(mapped);
      return;
    }
    try {
      const fd = new FormData();
      Object.keys(mapped).forEach((k) => {
        if (mapped[k] !== null && mapped[k] !== "") fd.append(k, mapped[k]);
      });
      const res = await fetch("/api/reports", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Submitted successfully. Tracking Number: ${json.trackingNumber}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Submission failed: ${json.error || "Please provide email, location and issue details."}` },
        ]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error during submission." }]);
    }
  };

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
          <div className="px-4 py-3 border-b font-semibold">Report Assistant</div>
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
              className="w-full border rounded-md px-3 py-2"
            />
            <div className="flex gap-2">
              <button onClick={send} className="flex-1 bg-blue-600 text-white rounded-md px-3 py-2">Send</button>
              <button onClick={applyToForm} className="flex-1 bg-gray-100 text-gray-900 rounded-md px-3 py-2">Fill Form</button>
              <button onClick={autoSubmit} className="flex-1 bg-green-600 text-white rounded-md px-3 py-2">Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
