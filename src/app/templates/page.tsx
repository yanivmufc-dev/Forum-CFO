"use client";

import { useState } from "react";

const templateTypes = [
  { value: "first_outreach", label: "פנייה ראשונה", icon: "📨", fields: ["name", "company"] },
  { value: "followup", label: "פולואפ", icon: "🔁", fields: ["name"] },
  { value: "welcome", label: "קבלת פנים לחבר חדש", icon: "🎉", fields: ["name"] },
  { value: "reengagement", label: "חידוש קשר", icon: "♻️", fields: ["name"] },
  { value: "after_meeting", label: "אחרי פגישה", icon: "🤝", fields: ["name", "company", "meetingNotes"] },
];

const fieldLabels: Record<string, string> = {
  name: "שם",
  company: "חברה",
  meetingNotes: "נקודות עיקריות מהפגישה",
};

export default function TemplatesPage() {
  const [selected, setSelected] = useState(templateTypes[0].value);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentTemplate = templateTypes.find((t) => t.value === selected)!;

  async function generate() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selected, variables }),
      });
      const data = await res.json();
      setResult(data.message);
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">💬 ספריית תבניות</h1>
      <p className="text-gray-500 mb-6">הודעות מוכנות לכל שלב בתהליך</p>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {templateTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => { setSelected(t.value); setResult(null); }}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              selected === t.value
                ? "border-orange-400 bg-orange-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">{t.icon}</div>
            <div className="text-xs font-medium text-gray-700 leading-tight">{t.label}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          {currentTemplate.icon} {currentTemplate.label}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-5">
          {currentTemplate.fields.map((field) => (
            <div key={field} className={field === "meetingNotes" ? "col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {fieldLabels[field] || field}
              </label>
              {field === "meetingNotes" ? (
                <textarea
                  value={variables[field] || ""}
                  onChange={(e) => setVariables({ ...variables, [field]: e.target.value })}
                  rows={2}
                  placeholder="מה דיברתם? מה הסכמתם? מה הצעד הבא?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              ) : (
                <input
                  value={variables[field] || ""}
                  onChange={(e) => setVariables({ ...variables, [field]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "מייצר הודעה..." : "✨ צור הודעה"}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl border-2 border-orange-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">ההודעה שלך</h2>
            <button onClick={copy} className="text-sm text-orange-600 hover:text-orange-800 font-medium">
              {copied ? "✓ הועתק!" : "העתק"}
            </button>
          </div>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}
