import { prisma } from "@/lib/prisma";
import ExamEngine from "@/components/ExamEngine";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default async function SectionMockTestPage({ searchParams }: { searchParams: { s?: string } }) {
  const sectionId = searchParams.s;

  if (!sectionId) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">பிரிவு மாதிரி தேர்வு</h1>
          <p className="text-slate-500 mb-8">நீங்கள் பயிற்சி செய்ய விரும்பும் பகுதியை தேர்ந்தெடுக்கவும் (25 கேள்விகள், 25 நிமிடம்)</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/mock-test/section?s=sec_tamil" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition group">
              <BookOpen className="h-8 w-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">பகுதி இ - தமிழ்</h2>
              <p className="text-sm text-slate-500">தமிழ் தகுதி மற்றும் மதிப்பீட்டுத் தேர்வு</p>
            </Link>
            <Link href="/mock-test/section?s=sec_genk" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition group">
              <BookOpen className="h-8 w-8 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">பகுதி அ - பொது அறிவு</h2>
              <p className="text-sm text-slate-500">வரலாறு, புவியியல், அறிவியல், அரசியல்</p>
            </Link>
            <Link href="/mock-test/section?s=sec_aptitude" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition group">
              <BookOpen className="h-8 w-8 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">பகுதி ஆ - திறனறிவு</h2>
              <p className="text-sm text-slate-500">கணிதம் மற்றும் மனக்கணக்கு நுண்ணறிவு</p>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const questions = await prisma.question.findMany({
    where: { status: "published", topic: { unit: { sectionId: sectionId } } },
    take: 25,
  });

  if (questions.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-slate-500">
          <p className="text-xl mb-4">இந்த பிரிவில் போதுமான கேள்விகள் இல்லை.</p>
          <Link href="/mock-test/section" className="text-blue-600 hover:underline">திரும்பிச் செல்லவும்</Link>
        </div>
      </>
    );
  }

  const sectionName = sectionId === 'sec_tamil' ? 'தமிழ்' : sectionId === 'sec_genk' ? 'பொது அறிவு' : 'திறனறிவு';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <ExamEngine
          topicId={`section-mock-${sectionId}`}
          topicName={`பிரிவு மாதிரி தேர்வு: ${sectionName}`}
          questions={questions}
          durationMinutes={25}
        />
      </main>
    </div>
  );
}
