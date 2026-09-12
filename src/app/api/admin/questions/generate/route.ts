import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { topicId, context } = await req.json();
    if (!topicId) return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { unit: { include: { section: true } } }
    });
    if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY environment variable is missing" }, { status: 500 });

    const prompt = `Generate 1 multiple choice question in Tamil for TNPSC Group-4 exam.
Section: ${topic.unit.section.name}
Unit: ${topic.unit.name}
Topic: ${topic.name}
Additional Context: ${context || "None"}

The question MUST have exactly 4 choices and exactly 1 correct answer.
Return the output ONLY as a valid JSON object matching this schema (no markdown, no backticks, no extra text):
{
  "text": "The question text in Tamil",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0, // Integer 0 to 3 corresponding to the correct option index
  "explanation": "Explanation for the correct answer in Tamil"
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      })
    });

    if (!res.ok) {
      throw new Error("Failed to fetch from Gemini API");
    }

    const data = await res.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) throw new Error("Invalid response from Gemini API");

    const parsed = JSON.parse(generatedText);

    // Validate structure
    if (!parsed.text || !Array.isArray(parsed.options) || parsed.options.length !== 4 || 
        typeof parsed.correctAnswer !== "number" || parsed.correctAnswer < 0 || parsed.correctAnswer > 3) {
      throw new Error("AI returned invalid question format");
    }

    return NextResponse.json(parsed, { status: 200 });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate question" }, { status: 500 });
  }
}
