import { prisma } from "@/lib/prisma";
import ExamEngine from "@/components/ExamEngine";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

// Full Mock Test: 200 random published questions following TNPSC Group 4 structure
// Part C - Tamil: 100 Questions
// Part A - GK: 75 Questions
// Part B - Aptitude: 25 Questions
export default async function FullMockTestPage() {
  const [tamilQuestions, gkQuestions, aptitudeQuestions] = await Promise.all([
    prisma.question.findMany({
      where: { status: "published", topic: { unit: { sectionId: "sec_tamil" } } },
      take: 100,
    }),
    prisma.question.findMany({
      where: { status: "published", topic: { unit: { sectionId: "sec_genk" } } },
      take: 75,
    }),
    prisma.question.findMany({
      where: { status: "published", topic: { unit: { sectionId: "sec_aptitude" } } },
      take: 25,
    }),
  ]);

  const allQuestions = [...tamilQuestions, ...gkQuestions, ...aptitudeQuestions];

  if (allQuestions.length === 0) {
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

  const isShortfall = tamilQuestions.length < 100 || gkQuestions.length < 75 || aptitudeQuestions.length < 25;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {isShortfall && (
          <div className="bg-amber-50 text-amber-800 p-3 text-center border-b border-amber-200 text-sm flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            தரவுத்தளத்தில் போதுமான கேள்விகள் இல்லை (100 தமிழ், 75 பொது அறிவு, 25 திறனறிவு). இருக்கும் கேள்விகளைக் கொண்டு மாதிரி தேர்வு தொடங்குகிறது.
          </div>
        )}
        <ExamEngine
          topicId="full-mock"
          topicName="முழு மாதிரி தேர்வு (200 கேள்விகள்)"
          questions={allQuestions}
          durationMinutes={180}
        />
      </main>
    </div>
  );
}
