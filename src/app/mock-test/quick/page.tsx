import { prisma } from "@/lib/prisma";
import ExamEngine from "@/components/ExamEngine";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// Quick Mock Test: 10 random published questions
export default async function QuickMockTestPage() {
  const questions = await prisma.question.findMany({
    where: { status: "published" },
    take: 10,
    orderBy: { id: "asc" }, // will randomize in ExamEngine
  });

  if (questions.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-slate-500">
          <p className="text-xl mb-4">கேள்விகள் இன்னும் சேர்க்கப்படவில்லை.</p>
          <Link href="/practice" className="text-blue-600 hover:underline">பயிற்சிக்கு செல்லவும்</Link>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <ExamEngine
          topicId="quick-mock"
          topicName="விரைவு மாதிரி தேர்வு"
          questions={questions}
          durationMinutes={10}
        />
      </main>
    </div>
  );
}
