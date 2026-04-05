"use client";

import { useState, useEffect } from "react";

interface Post {
  id: string;
  topic: string;
  tone: string;
  content: string;
  createdAt: string;
}

const tones = [
  { value: "thought_leader", label: "מנהיגות חשיבה" },
  { value: "storytelling", label: "סיפורי" },
  { value: "question", label: "שאלתי" },
];

export default function LinkedInPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("thought_leader");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/linkedin")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []));
  }, []);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone }),
      });
      const data = await res.json();
      setResult(data.post.content);
      setPosts((prev) => [data.post, ...prev]);
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">✍️ מחולל פוסטים ל-LinkedIn</h1>
      <p className="text-gray-500 mb-6">כתוב פוסטים ממוקדים לקהל ה-CFO שלך</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">נושא הפוסט</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="לדוגמה: למה CFOs צריכים להוביל שינוי דיגיטלי, לא רק לתמוך בו"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">סגנון</label>
          <div className="flex gap-3">
            {tones.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tone === t.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "מייצר פוסט..." : "✨ צור פוסט"}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">הפוסט שלך</h2>
            <button
              onClick={() => copy(result)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {copied ? "✓ הועתק!" : "העתק"}
            </button>
          </div>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result}</p>
        </div>
      )}

      {posts.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-4">פוסטים קודמים</h2>
          <div className="space-y-4">
            {posts.slice(0, 10).map((p) => (
              <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">{p.topic}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("he-IL")}
                    </span>
                    <button
                      onClick={() => copy(p.content)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      העתק
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap line-clamp-3">
                  {p.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
