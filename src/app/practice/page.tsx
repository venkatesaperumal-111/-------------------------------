import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default async function PracticePage() {
  const sections = await prisma.section.findMany({
    include: {
      units: {
        include: {
          topics: {
            include: {
              _count: {
                select: { questions: true }
              }
            }
          }
        }
      }
    },
    orderBy: { order: "asc" }
  });

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">பயிற்சி தலைப்புகள் (Practice Topics)</h1>
        
        {sections.map(section => (
          <div key={section.id} className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2 border-b pb-2">
              <BookOpen className="h-6 w-6" /> {section.name}
            </h2>
            
            <div className="space-y-8">
              {section.units.map(unit => (
                <div key={unit.id}>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 ml-2 border-l-4 border-blue-500 pl-3">
                    {unit.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-4">
                    {unit.topics.map(topic => (
                      <div key={topic.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                        <h4 className="text-lg font-bold text-slate-800 mb-2">{topic.name}</h4>
                        <div className="text-sm text-slate-500 mb-4 space-y-1">
                          <p>மொத்த கேள்விகள்: <span className="font-semibold text-slate-700">{topic._count.questions} / 50</span></p>
                        </div>
                        <Link 
                          href={`/practice/${topic.id}`} 
                          className="block w-full text-center bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition px-4 py-2 rounded-lg font-medium"
                        >
                          பயிற்சி தொடங்கு
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {sections.length === 0 && (
          <div className="text-center p-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
            பாடத்திட்டம் இன்னும் சேர்க்கப்படவில்லை.
          </div>
        )}
      </main>
    </>
  );
}
