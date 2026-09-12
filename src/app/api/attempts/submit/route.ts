import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { topicId, questionCount, questions, answers } = await req.json();

    if (!topicId || !questions || !answers) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Calculate score
    let score = 0;
    const answerData: { questionId: string; selectedOption: number | null; isCorrect: boolean }[] = [];

    for (const q of questions) {
      const selected = answers[q.id] ?? null;
      const isCorrect = selected !== null && selected === q.correctAnswer;
      if (isCorrect) score++;
      answerData.push({ questionId: q.id, selectedOption: selected, isCorrect });
    }

    const attempt = await prisma.attempt.create({
      data: {
        userId: session.user.id,
        testType: "topic",
        topicId,
        score,
        totalQs: questions.length,
        status: "completed",
        endTime: new Date(),
        answers: {
          create: answerData
        }
      }
    });

    return NextResponse.json({ attemptId: attempt.id, score, total: questions.length });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "சர்வர் சிக்கல்" }, { status: 500 });
  }
}
