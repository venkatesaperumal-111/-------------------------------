"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const registered = params.get("registered");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவை.");
      return;
    }
    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("மின்னஞ்சல் அல்லது கடவுச்சொல் தவறாக உள்ளது.");
    } else {
      router.push("/dashboard");
      router.refresh();
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">உள்நுழைக</h2>
          <p className="text-slate-500 mb-6 text-sm">உங்கள் கணக்கில் நுழையவும்</p>

          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
              ✓ கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! இப்போது உள்நுழையவும்.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="கடவுச்சொல்"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-slate-400">
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> உள்நுழைகிறோம்...</> : "உள்நுழைக"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            கணக்கு இல்லையா?{" "}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">புதிய கணக்கு உருவாக்குக</Link>
          </p>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-400 text-center">
            Demo Admin: admin@aathichudi.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
