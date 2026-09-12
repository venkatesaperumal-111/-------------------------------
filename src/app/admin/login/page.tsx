"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("தவறான நற்சான்றுகள்.");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="h-14 w-14 text-blue-400 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 mt-1">ஆத்திச்சூடி கல்வி பயிற்சி மையம்</p>
        </div>
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
          {error && <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-3 mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                placeholder="admin@aathichudi.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                placeholder="Password" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Logging in...</> : "Admin Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
