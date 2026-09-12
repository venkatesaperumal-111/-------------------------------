import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Target, TrendingUp, CheckCircle2, Clock, AlertCircle, BarChart3, LogOut } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const attempts = await prisma.attempt.findMany({
    where: { userId, status: "completed" },
    include: {
      answers: true,
      user: false,
    },
    orderBy: { endTime: "desc" },
    take: 10,
  });

  const totalAttempts = attempts.length;
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
  const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQs, 0);
  const avgScore = totalAttempts > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => Math.round((a.score / a.totalQs) * 100))) : 0;

  const recentAttempts = attempts.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-blue-600" />
            <span className="font-bold text-lg text-slate-800 hidden sm:block">ஆத்திச்சூடி கல்வி பயிற்சி மையம்</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="text-blue-600 font-bold">முகப்பு</Link>
            <Link href="/practice" className="hover:text-blue-600">பயிற்சி</Link>
            <Link href="/mock-test" className="hover:text-blue-600">மாதிரி தேர்வு</Link>
            <Link href="/progress" className="hover:text-blue-600">முன்னேற்றம்</Link>
            <Link href="/syllabus" className="hover:text-blue-600">பாடத்திட்டம்</Link>
          </nav>
          <Link href="/api/auth/signout?callbackUrl=/" className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-600 transition">
            <LogOut className="h-4 w-4" /> வெளியேறு
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">வணக்கம், {session.user.name}! 👋</h1>
          <p className="text-slate-500 mt-1">இன்றும் பயிற்சி செய்து வெற்றி நடைபோடுங்கள்.</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Target className="h-6 w-6 text-blue-500" />, label: "மொத்த தேர்வுகள்", value: totalAttempts, color: "blue" },
            { icon: <CheckCircle2 className="h-6 w-6 text-green-500" />, label: "சராசரி மதிப்பெண்", value: `${avgScore}%`, color: "green" },
            { icon: <TrendingUp className="h-6 w-6 text-purple-500" />, label: "சிறந்த மதிப்பெண்", value: `${bestScore}%`, color: "purple" },
            { icon: <BarChart3 className="h-6 w-6 text-orange-500" />, label: "மொத்த கேள்விகள்", value: totalQuestions, color: "orange" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">{stat.label}</span>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">விரைவு செயல்கள்</h2>
            <Link href="/practice" className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm">
              <BookOpen className="h-6 w-6 flex-shrink-0" />
              <div>
                <p className="font-bold">பயிற்சி தொடங்குக</p>
                <p className="text-blue-200 text-xs">தலைப்பு வாரியான பயிற்சி</p>
              </div>
            </Link>
            <Link href="/mock-test" className="flex items-center gap-3 p-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition shadow-sm">
              <Clock className="h-6 w-6 text-slate-400 flex-shrink-0" />
              <div>
                <p className="font-bold">மாதிரி தேர்வு</p>
                <p className="text-slate-400 text-xs">நேரக்கட்டுப்பாடு கொண்ட தேர்வு</p>
              </div>
            </Link>
            <Link href="/syllabus" className="flex items-center gap-3 p-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition shadow-sm">
              <BarChart3 className="h-6 w-6 text-slate-400 flex-shrink-0" />
              <div>
                <p className="font-bold">பாடத்திட்டம்</p>
                <p className="text-slate-400 text-xs">அனைத்து தலைப்புகளும்</p>
              </div>
            </Link>
          </div>

          {/* Recent attempts */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4">சமீபத்திய தேர்வுகள்</h2>
            {recentAttempts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                <AlertCircle className="h-10 w-10 text-slate-300" />
                <p className="font-medium">நீங்கள் இன்னும் எந்த தேர்வையும் எழுதவில்லை.</p>
                <p className="text-sm">தேர்வு எழுதத் தொடங்குங்கள். உங்கள் முன்னேற்றம் இங்கே காணப்படும்.</p>
                <Link href="/practice" className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                  பயிற்சி தொடங்குக
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((attempt) => {
                  const pct = Math.round((attempt.score / attempt.totalQs) * 100);
                  const color = pct >= 75 ? "green" : pct >= 50 ? "yellow" : "red";
                  return (
                    <div key={attempt.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-700 capitalize">{attempt.testType} தேர்வு</p>
                        <p className="text-xs text-slate-400">{attempt.endTime ? new Date(attempt.endTime).toLocaleDateString("ta-IN") : "–"}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${color === "green" ? "text-green-600" : color === "yellow" ? "text-yellow-600" : "text-red-600"}`}>
                          {pct}%
                        </span>
                        <p className="text-xs text-slate-400">{attempt.score}/{attempt.totalQs}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
