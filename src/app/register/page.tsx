"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("அனைத்து தகவல்களையும் நிரப்பவும்.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("கடவுச்சொற்கள் பொருந்தவில்லை.");
      return;
    }
    if (form.password.length < 6) {
      setError("கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "பதிவு செய்வதில் சிக்கல். மீண்டும் முயற்சிக்கவும்.");
      } else {
        router.push("/login?registered=1");
      }
    } catch {
      setError("சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <BookOpen className="h-12 w-12 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">ஆத்திச்சூடி கல்வி பயிற்சி மையம்</h1>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">புதிய கணக்கு உருவாக்குக</h2>
          <p className="text-slate-500 mb-6 text-sm">TNPSC தயாரிப்பை இன்றே தொடங்குங்கள்</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">பெயர்</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="உங்கள் பெயர்"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">மின்னஞ்சல்</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="yourname@email.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">கடவுச்சொல்</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="குறைந்தது 6 எழுத்துகள்"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-slate-400">
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">கடவுச்சொல் உறுதிப்படுத்தல்</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="கடவுச்சொல்லை மீண்டும் உள்ளிடவும்"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> பதிவு செய்கிறோம்...</> : "கணக்கு உருவாக்குக"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ஏற்கனவே கணக்கு உள்ளதா?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">உள்நுழைக</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
