import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, Zap, BookOpen } from "lucide-react";

export default async function MockTestPage() {
  const sections = await prisma.section.findMany({
    include: {
      units: {
        include: {
          topics: {
            include: { _count: { select: { questions: { where: { status: "published" } } } } }
          }
        }
      }
    },
    orderBy: { order: "asc" }
  });

  const totalPublishedQ = await prisma.question.count({ where: { status: "published" } });

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">மாதிரி தேர்வு</h1>
        <p className="text-slate-500 mb-8">உண்மையான TNPSC தேர்வு போன்ற மாதிரி தேர்வுகள்</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Link href="/mock-test/quick" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition group">
            <Zap className="h-10 w-10 text-yellow-500 mb-4 group-hover:scale-110 transition" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">விரைவு தேர்வு</h2>
            <p className="text-slate-500 text-sm mb-4">10 கேள்விகள் — 10 நிமிடம்</p>
            <span className="inline-block bg-yellow-50 text-yellow-700 text-sm px-3 py-1 rounded-full font-medium">தொடங்குக →</span>
          </Link>

          <Link href="/mock-test/section" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition group">
            <BookOpen className="h-10 w-10 text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">பிரிவு தேர்வு</h2>
            <p className="text-slate-500 text-sm mb-4">ஒரு பிரிவிலிருந்து 25 கேள்விகள்</p>
            <span className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">தொடங்குக →</span>
          </Link>

          <Link href="/mock-test/full" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition group">
            <Clock className="h-10 w-10 text-purple-500 mb-4 group-hover:scale-110 transition" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">முழு மாதிரி தேர்வு</h2>
            <p className="text-slate-500 text-sm mb-4">100 கேள்விகள் — 90 நிமிடம்</p>
            <span className="inline-block bg-purple-50 text-purple-700 text-sm px-3 py-1 rounded-full font-medium">தொடங்குக →</span>
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h3 className="font-bold text-blue-800 mb-2">📊 தற்போதைய கேள்வி வங்கி நிலை</h3>
          <p className="text-blue-600">மொத்தம் <strong>{totalPublishedQ}</strong> கேள்விகள் கிடைக்கின்றன.</p>
          <p className="text-blue-500 text-sm mt-1">அதிக கேள்விகள் சேர்க்கப்படும் போது, முழு மாதிரி தேர்வுகள் கிடைக்கும்.</p>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">பிரிவு வாரியான பயிற்சி</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {sections.map(section => {
              const totalQ = section.units.reduce((sum, u) => sum + u.topics.reduce((s, t) => s + t._count.questions, 0), 0);
              return (
                <Link key={section.id} href={`/practice?section=${section.id}`} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50 transition shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-1">{section.name}</h4>
                  <p className="text-sm text-slate-400">{totalQ} கேள்விகள் கிடைக்கின்றன</p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
