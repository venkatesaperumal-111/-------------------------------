import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Users, BookOpen, HelpCircle, TrendingUp, Plus } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/admin/login");

  const [totalStudents, totalQuestions, totalAttempts, draftQuestions, sections] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.question.count({ where: { status: "published" } }),
    prisma.attempt.count({ where: { status: "completed" } }),
    prisma.question.count({ where: { status: "draft" } }),
    prisma.section.findMany({
      include: {
        units: {
          include: {
            topics: {
              include: { _count: { select: { questions: { where: { status: "published" } } } } }
            }
          }
        }
      }
    })
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-blue-400" />
          <span className="font-bold text-xl">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">{session.user.email}</span>
          <Link href="/api/auth/signout?callbackUrl=/admin/login" className="text-sm text-red-400 hover:text-red-300 transition">Logout</Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <nav className="w-56 bg-slate-800 border-r border-slate-700 p-4 hidden md:block shrink-0">
          <div className="space-y-1">
            {[
              { href: "/admin/dashboard", label: "Dashboard", icon: TrendingUp },
              { href: "/admin/questions", label: "Questions", icon: HelpCircle },
              { href: "/admin/questions/create", label: "Add Question", icon: Plus },
              { href: "/admin/students", label: "Students", icon: Users },
            ].map(item => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition text-sm">
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Overview</h1>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Students", val: totalStudents, icon: Users, color: "blue" },
              { label: "Published Questions", val: totalQuestions, icon: HelpCircle, color: "green" },
              { label: "Draft Questions", val: draftQuestions, icon: HelpCircle, color: "amber" },
              { label: "Completed Attempts", val: totalAttempts, icon: TrendingUp, color: "purple" },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.val}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4">Question Bank by Section</h2>
          <div className="space-y-4">
            {sections.map(section => (
              <div key={section.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="px-5 py-3 bg-slate-700 font-bold text-blue-300">{section.name}</div>
                <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.units.map(unit =>
                    unit.topics.map(topic => (
                      <div key={topic.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg text-sm">
                        <span className="text-slate-300 truncate">{topic.name}</span>
                        <span className="text-green-400 font-bold ml-2 shrink-0">{topic._count.questions}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
