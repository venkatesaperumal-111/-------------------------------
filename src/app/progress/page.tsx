import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Get all completed attempts with topic info
  const attempts = await prisma.attempt.findMany({
    where: { userId: session.user.id, status: "completed" },
    include: {
      answers: { include: { question: { include: { topic: { include: { unit: { include: { section: true } } } } } } } }
    },
    orderBy: { endTime: "desc" }
  });

  // Calculate topic-wise performance
  const topicStats: Record<string, { name: string; section: string; correct: number; total: number }> = {};

  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      const topic = answer.question?.topic;
      if (!topic) continue;
      if (!topicStats[topic.id]) {
        topicStats[topic.id] = {
          name: topic.name,
          section: topic.unit.section.name,
          correct: 0,
          total: 0
        };
      }
      topicStats[topic.id].total++;
      if (answer.isCorrect) topicStats[topic.id].correct++;
    }
  }

  const topicList = Object.values(topicStats).map(t => ({
    ...t,
    pct: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0
  }));

  const weakTopics = topicList.filter(t => t.pct < 60 && t.total >= 3).sort((a, b) => a.pct - b.pct);
  const strongTopics = topicList.filter(t => t.pct >= 75 && t.total >= 3).sort((a, b) => b.pct - a.pct);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-blue-600" />
            <span className="font-bold text-lg text-slate-800">ஆத்திச்சூடி</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-blue-600">முகப்பு</Link>
            <Link href="/practice" className="hover:text-blue-600">பயிற்சி</Link>
            <Link href="/progress" className="text-blue-600 font-bold">முன்னேற்றம்</Link>
            <Link href="/syllabus" className="hover:text-blue-600">பாடத்திட்டம்</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">என் முன்னேற்றம்</h1>
        <p className="text-slate-500 mb-8">உங்கள் பயிற்சி பகுப்பாய்வு</p>

        {attempts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center flex flex-col items-center gap-4">
            <TrendingUp className="h-14 w-14 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-600">தேர்வு எழுதத் தொடங்குங்கள்</h2>
            <p className="text-slate-400 max-w-md">உங்கள் முன்னேற்றம் இங்கே காணப்படும். பயிற்சி தொடங்கியதும் தலைப்பு வாரியான செயல்திறன் இங்கே காட்டப்படும்.</p>
            <Link href="/practice" className="mt-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              பயிற்சி தொடங்குக
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Weak Topics */}
            {weakTopics.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" /> கூடுதல் பயிற்சி தேவையான தலைப்புகள்
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {weakTopics.map(t => (
                    <div key={t.name} className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-slate-700">{t.name}</span>
                        <span className="text-amber-600 font-bold">{t.pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full"><div style={{ width: `${t.pct}%` }} className="h-2 bg-amber-400 rounded-full" /></div>
                      <p className="text-xs text-slate-400 mt-1">{t.correct}/{t.total} சரியான விடைகள்</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strong Topics */}
            {strongTopics.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" /> சிறப்பாக செயல்படும் தலைப்புகள்
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {strongTopics.map(t => (
                    <div key={t.name} className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-slate-700">{t.name}</span>
                        <span className="text-green-600 font-bold">{t.pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full"><div style={{ width: `${t.pct}%` }} className="h-2 bg-green-400 rounded-full" /></div>
                      <p className="text-xs text-slate-400 mt-1">{t.correct}/{t.total} சரியான விடைகள்</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All topics */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">அனைத்து தலைப்புகளும்</h2>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-left">
                    <tr>
                      <th className="px-5 py-3">தலைப்பு</th>
                      <th className="px-5 py-3">பிரிவு</th>
                      <th className="px-5 py-3">கேள்விகள்</th>
                      <th className="px-5 py-3">சதவீதம்</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {topicList.sort((a, b) => b.pct - a.pct).map(t => (
                      <tr key={t.name} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-700">{t.name}</td>
                        <td className="px-5 py-3 text-slate-400">{t.section}</td>
                        <td className="px-5 py-3 text-slate-500">{t.correct}/{t.total}</td>
                        <td className="px-5 py-3">
                          <span className={`font-bold ${t.pct >= 75 ? "text-green-600" : t.pct >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                            {t.pct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
