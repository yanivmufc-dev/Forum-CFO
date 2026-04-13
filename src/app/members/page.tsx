"use client";

import { useState, useEffect } from "react";

interface Member {
  id: string;
  name: string;
  company: string;
  status: "prospect" | "member" | "inactive";
  lastContact: string;
  notes: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  prospect: { label: "פרוספקט", color: "bg-yellow-100 text-yellow-800" },
  member: { label: "חבר פעיל", color: "bg-green-100 text-green-800" },
  inactive: { label: "לא פעיל", color: "bg-gray-100 text-gray-600" },
};

function daysSince(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

type FormData = { name: string; company: string; status: Member["status"]; lastContact: string; notes: string };
const emptyForm: FormData = { name: "", company: "", status: "prospect", lastContact: new Date().toISOString().split("T")[0], notes: "" };

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/members").then((r) => r.json()).then((d) => setMembers(d.members || []));
  }, []);

  async function save() {
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch("/api/members", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...form }) });
        const data = await res.json();
        setMembers((prev) => prev.map((m) => (m.id === editId ? data.member : m)));
      } else {
        const res = await fetch("/api/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const data = await res.json();
        setMembers((prev) => [data.member, ...prev]);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/members?id=${id}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function startEdit(m: Member) {
    setForm({ name: m.name, company: m.company, status: m.status, lastContact: m.lastContact, notes: m.notes });
    setEditId(m.id);
    setShowForm(true);
  }

  const filtered = filter === "all" ? members : members.filter((m) => m.status === filter);
  const needsFollowup = members.filter((m) => daysSince(m.lastContact) >= 30 && m.status !== "inactive");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">👥 מעקב חברים</h1>
      <p className="text-gray-500 mb-6">נהל את רשימת ה-CFO שלך</p>

      {needsFollowup.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-amber-800 mb-1">⚠️ מחכים לפולואפ ({needsFollowup.length})</h3>
          <p className="text-amber-700 text-sm">
            {needsFollowup.map((m) => m.name).join(", ")} — לא יצרת קשר מעל 30 יום
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {["all", "prospect", "member", "inactive"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"}`}>
              {s === "all" ? "הכל" : statusLabels[s].label} {s !== "all" && `(${members.filter((m) => m.status === s).length})`}
            </button>
          ))}
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + הוסף CFO
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">{editId ? "עריכת" : "הוספת"} CFO</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">חברה</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Member["status"] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="prospect">פרוספקט</option>
                <option value="member">חבר פעיל</option>
                <option value="inactive">לא פעיל</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תאריך קשר אחרון</label>
              <input type="date" value={form.lastContact} onChange={(e) => setForm({ ...form, lastContact: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.name.trim()}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? "שומר..." : "שמור"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-sm px-4 py-2">ביטול</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-12">אין חברים עדיין. הוסף CFO ראשון!</div>
        )}
        {filtered.map((m) => {
          const days = daysSince(m.lastContact);
          const { label, color } = statusLabels[m.status];
          return (
            <div key={m.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-gray-900">{m.name}</span>
                  {m.company && <span className="text-sm text-gray-500">{m.company}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
                  {days >= 30 && m.status !== "inactive" && (
                    <span className="text-xs text-amber-600 font-medium">⚠️ {days} ימים</span>
                  )}
                </div>
                {m.notes && <p className="text-sm text-gray-500 truncate max-w-xl">{m.notes}</p>}
              </div>
              <div className="flex items-center gap-3 mr-4">
                <span className="text-xs text-gray-400">קשר אחרון: {new Date(m.lastContact).toLocaleDateString("he-IL")}</span>
                <button onClick={() => startEdit(m)} className="text-sm text-blue-600 hover:text-blue-800">ערוך</button>
                <button onClick={() => remove(m.id)} className="text-sm text-red-500 hover:text-red-700">מחק</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
