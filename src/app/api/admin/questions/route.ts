import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { topicId, text, options, correctAnswer, explanation, difficulty, status } = await req.json();

    // Validation
    if (!text?.trim()) return NextResponse.json({ error: "Question text is required." }, { status: 400 });
    if (!Array.isArray(options) || options.length !== 4) return NextResponse.json({ error: "Exactly 4 options required." }, { status: 400 });
    if (new Set(options).size !== 4) return NextResponse.json({ error: "All options must be unique." }, { status: 400 });
    if (correctAnswer < 0 || correctAnswer > 3) return NextResponse.json({ error: "correctAnswer must be 0–3." }, { status: 400 });
    if (!topicId) return NextResponse.json({ error: "Topic is required." }, { status: 400 });

    const topic = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) return NextResponse.json({ error: "Topic not found." }, { status: 404 });

    const q = await prisma.question.create({
      data: { text: text.trim(), options: JSON.stringify(options), correctAnswer, explanation: explanation?.trim() || null, difficulty: difficulty || "medium", status: status || "draft", topicId },
    });

    return NextResponse.json(q, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
