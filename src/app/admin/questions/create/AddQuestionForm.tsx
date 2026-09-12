"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

type Topic = { id: string; name: string; unit: { name: string; section: { name: string } } };

export default function AddQuestionForm({ topics }: { topics: Topic[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    topicId: "",
    text: "",
    optionA: "", optionB: "", optionC: "", optionD: "",
    correctAnswer: "0",
    explanation: "",
    difficulty: "medium",
    status: "draft",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const opts = [form.optionA, form.optionB, form.optionC, form.optionD];
    if (new Set(opts).size !== 4) { setError("All 4 options must be unique."); return; }
    if (!form.text.trim()) { setError("Question text cannot be empty."); return; }
    if (!form.topicId) { setError("Please select a topic."); return; }

    setLoading(true);
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId: form.topicId,
        text: form.text,
        options: opts,
        correctAnswer: parseInt(form.correctAnswer),
        explanation: form.explanation,
        difficulty: form.difficulty,
        status: form.status,
      }),
    });
    setLoading(false);

    if (res.ok) {
      setSuccess("Question saved successfully!");
      setForm({ topicId: form.topicId, text: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "0", explanation: "", difficulty: "medium", status: "draft" });
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save question.");
    }
  };


  const handleGenerateAI = async () => {
    if (!form.topicId) { setError("Please select a topic before generating."); return; }
    setError(""); setSuccess(""); setGenerating(true);
    try {
      const res = await fetch("/api/admin/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: form.topicId }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Generation failed");
      const data = await res.json();
      setForm(prev => ({
        ...prev,
        text: data.text,
        optionA: data.options[0],
        optionB: data.options[1],
        optionC: data.options[2],
        optionD: data.options[3],
        correctAnswer: data.correctAnswer.toString(),
        explanation: data.explanation || "",
      }));
      setSuccess("Question generated successfully! Please review before saving.");
    } catch (err: any) {
      setError(err.message || "AI Generation error");
    } finally {
      setGenerating(false);
    }
  };

  const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 text-sm";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Add New Question</h2>
        <button type="button" onClick={handleGenerateAI} disabled={generating || !form.topicId}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition">
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Auto-Generate with AI
        </button>
      </div>
      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-3 mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-900/50 border border-green-700 text-green-300 rounded-lg p-3 mb-4 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Topic</label>
          <select value={form.topicId} onChange={e => setForm({ ...form, topicId: e.target.value })}
            className={inputClass + " appearance-none"} required>
            <option value="">-- Select Topic --</option>
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.unit.section.name} → {t.unit.name} → {t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Question Text (Tamil)</label>
          <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })}
            className={inputClass} rows={3} placeholder="கேள்வி இங்கே எழுதவும்..." required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((letter, idx) => (
            <div key={letter}>
              <label className={labelClass}>Option {letter}</label>
              <input type="text" value={form[`option${letter}` as keyof typeof form]}
                onChange={e => setForm({ ...form, [`option${letter}`]: e.target.value })}
                className={inputClass} placeholder={`விருப்பம் ${letter}`} required />
            </div>
          ))}
        </div>

        <div>
          <label className={labelClass}>Correct Answer</label>
          <select value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })} className={inputClass + " appearance-none"}>
            <option value="0">Option A</option>
            <option value="1">Option B</option>
            <option value="2">Option C</option>
            <option value="3">Option D</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Explanation (Optional)</label>
          <textarea value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })}
            className={inputClass} rows={2} placeholder="விளக்கம் (விரும்பினால்)" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Difficulty</label>
            <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className={inputClass + " appearance-none"}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputClass + " appearance-none"}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</> : "Save Question"}
          </button>
          <button type="button" onClick={() => router.push("/admin/questions")}
            className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-600 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
