"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

type Q = {
  id: string;
  text: string;
  status: string;
  difficulty: string;
  topic: { name: string; unit: { section: { name: string } } };
};

export default function AdminQuestionsClient({ initialQuestions }: { initialQuestions: Q[] }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Q[]>(initialQuestions);
  const [filter, setFilter] = useState("all");
  const [msg, setMsg] = useState("");

  const filtered = filter === "all" ? questions : questions.filter(q => q.status === filter);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/questions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) {
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, status } : q));
      setMsg(`Question ${status}.`);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const deleteQ = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      setMsg("Question deleted.");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <>
      {msg && <div className="mb-4 p-3 bg-green-900/50 border border-green-700 text-green-300 rounded-lg text-sm">{msg}</div>}
      
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "published", "draft", "rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${filter === f ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
            {f} ({f === "all" ? questions.length : questions.filter(q => q.status === f).length})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">Question</th>
              <th className="px-4 py-3 text-left">Topic</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filtered.map(q => (
              <tr key={q.id} className="hover:bg-slate-800">
                <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{q.text}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{q.topic.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    q.status === "published" ? "bg-green-900/50 text-green-300" :
                    q.status === "draft" ? "bg-amber-900/50 text-amber-300" :
                    "bg-red-900/50 text-red-300"
                  }`}>{q.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {q.status !== "published" && (
                      <button onClick={() => updateStatus(q.id, "published")} title="Publish" className="text-green-400 hover:text-green-300">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    {q.status === "published" && (
                      <button onClick={() => updateStatus(q.id, "draft")} title="Unpublish" className="text-amber-400 hover:text-amber-300">
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => router.push(`/admin/questions/${q.id}/edit`)} title="Edit" className="text-blue-400 hover:text-blue-300">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteQ(q.id)} title="Delete" className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No questions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
