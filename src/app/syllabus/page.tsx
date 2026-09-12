import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

export default async function SyllabusPage() {
  const sections = await prisma.section.findMany({
    include: {
      units: {
        include: {
          topics: {
            include: { _count: { select: { questions: { where: { status: "published" } } } } },
            orderBy: { order: "asc" }
          }
        },
        orderBy: { order: "asc" }
      }
    },
    orderBy: { order: "asc" }
  });

  const sectionColors: Record<number, string> = {
    0: "blue",
    1: "emerald",
    2: "violet",
  };

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">பாடத்திட்டம்</h1>
          <p className="text-slate-500 mt-1">TNPSC Group-4 தேர்வு பாடத்திட்டம் — முழு விவரம்</p>
        </div>

        <div className="space-y-8">
          {sections.map((section, sIdx) => {
            const color = sectionColors[sIdx % 3];
            const borderColor = color === "blue" ? "border-blue-500" : color === "emerald" ? "border-emerald-500" : "border-violet-500";
            const bgColor = color === "blue" ? "bg-blue-50" : color === "emerald" ? "bg-emerald-50" : "bg-violet-50";
            const textColor = color === "blue" ? "text-blue-700" : color === "emerald" ? "text-emerald-700" : "text-violet-700";

            return (
              <div key={section.id} className={`border-l-4 ${borderColor} bg-white rounded-xl shadow-sm overflow-hidden`}>
                <div className={`${bgColor} px-6 py-4 flex items-center gap-3`}>
                  <BookOpen className={`h-6 w-6 ${textColor}`} />
                  <h2 className={`text-xl font-bold ${textColor}`}>{section.name}</h2>
                  <span className="ml-auto text-sm text-slate-400">{section.units.length} பிரிவுகள்</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {section.units.map((unit) => (
                    <div key={unit.id} className="px-6 py-4">
                      <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                        {unit.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                        {unit.topics.map((topic) => (
                          <Link
                            key={topic.id}
                            href={`/practice/${topic.id}`}
                            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm text-slate-600 transition group border border-transparent hover:border-blue-200"
                          >
                            <span>{topic.name}</span>
                            <span className="text-xs text-slate-400 group-hover:text-blue-500">
                              {topic._count.questions} கேள்விகள்
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {sections.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              பாடத்திட்டம் இன்னும் சேர்க்கப்படவில்லை.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
