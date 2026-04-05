"use client";

import { useState } from "react";

export default function PrepPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!name.trim()) return;
    setLoading(true);
    setBriefing(null);
    try {
      const res = await fetch("/api/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, context }),
      });
      const data = await res.json();
      setBriefing(data.briefing);
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!briefing) return;
    navigator.clipboard.writeText(briefing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">📋 הכנה לפגישה</h1>
      <p className="text-gray-500 mb-6">קבל בריפינג מותאם לפני פגישה עם CFO</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם ה-CFO *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: דוד לוי"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">חברה</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="לדוגמה: טבע, מלאנוקס, חברת הייטק..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">הקשר נוסף (אופציונלי)</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="מה אתה יודע על האדם? הגיע מפגישה קודמת? שמעת עליו ממישהו? חברה בשינוי?"
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={generate}
          disabled={loading || !name.trim()}
          className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "מכין בריפינג..." : "🔍 צור בריפינג"}
        </button>
      </div>

      {briefing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">
              בריפינג: פגישה עם {name}{company && ` (${company})`}
            </h2>
            <button onClick={copy} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              {copied ? "✓ הועתק!" : "העתק הכל"}
            </button>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {briefing}
          </div>
        </div>
      )}
    </div>
  );
}
