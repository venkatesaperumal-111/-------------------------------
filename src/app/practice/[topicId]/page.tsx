import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ExamEngine from "@/components/ExamEngine";
import Navbar from "@/components/Navbar";

export default async function TopicPracticePage({ 
  params 
}: { 
  params: Promise<{ topicId: string }> 
}) {
  const { topicId } = await params;

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      questions: {
        where: { status: "published" },
        take: 50,
      },
      unit: { include: { section: true } }
    }
  });

  if (!topic) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <ExamEngine
          topicId={topic.id}
          topicName={topic.name}
          questions={topic.questions}
          durationMinutes={30}
        />
      </main>
    </div>
  );
}
