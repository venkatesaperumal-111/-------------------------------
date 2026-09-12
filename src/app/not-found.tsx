import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-6" />
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">பக்கம் கிடைக்கவில்லை</h2>
        <p className="text-slate-500 mb-8">நீங்கள் தேடும் பக்கம் இல்லை அல்லது முகவரி மாற்றப்பட்டிருக்கலாம்.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            முகப்புக்குச் செல்ல
          </Link>
          <Link href="/dashboard" className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition">
            மாணவர் முகப்பு
          </Link>
        </div>
      </div>
    </div>
  );
}
