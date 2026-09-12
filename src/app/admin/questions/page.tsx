import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Plus, Users, HelpCircle, TrendingUp } from "lucide-react";
import AdminQuestionsClient from "./AdminQuestionsClient";

export default async function AdminQuestionsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/admin/login");

  const questions = await prisma.question.findMany({
    include: { topic: { include: { unit: { include: { section: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-blue-400" />
          <span className="font-bold text-xl">Question Management</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/questions/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-semibold transition">
            <Plus className="h-4 w-4" /> Add Question
          </Link>
          <Link href="/api/auth/signout?callbackUrl=/admin/login" className="text-sm text-red-400 hover:text-red-300">Logout</Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
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
        <main className="flex-1 p-6 overflow-auto">
          <AdminQuestionsClient initialQuestions={questions} />
        </main>
      </div>
    </div>
  );
}
