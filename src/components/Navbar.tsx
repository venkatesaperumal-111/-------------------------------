"use client";

import Link from "next/link";
import { BookOpen, LogOut, User, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "முகப்பு" },
    { href: "/practice", label: "பயிற்சி" },
    { href: "/mock-test", label: "மாதிரி தேர்வு" },
    { href: "/progress", label: "என் முன்னேற்றம்" },
    { href: "/syllabus", label: "பாடத்திட்டம்" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2 min-w-0">
            <BookOpen className="h-7 w-7 text-blue-600 shrink-0" />
            <span className="font-bold text-base md:text-lg text-slate-800 truncate">ஆத்திச்சூடி கல்வி பயிற்சி மையம்</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-5">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-slate-600 hover:text-blue-600 text-sm font-medium transition">
                {link.label}
              </Link>
            ))}
            {session ? (
              <div className="flex items-center gap-3 ml-2">
                <Link href="/dashboard" className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-100 transition">
                  <User className="h-4 w-4" />
                  {session.user?.name?.split(" ")[0]}
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-1 text-slate-400 hover:text-red-500 text-sm transition">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">
                உள்நுழைக
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-slate-600 hover:text-blue-600">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition">
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 mt-2">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 text-blue-600 font-semibold text-sm">
                    👤 {session.user?.name}
                  </Link>
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                    className="block w-full text-left py-2.5 px-3 text-red-500 text-sm hover:bg-red-50 rounded-lg">
                    வெளியேறு
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-center bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition">
                  உள்நுழைக
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
