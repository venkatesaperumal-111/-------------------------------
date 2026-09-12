import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ஆத்திச்சூடி கல்வி பயிற்சி மையம்",
  description: "TNPSC Group-4 தேர்விற்கான முழுமையான ஆன்லைன் பயிற்சி தளம்",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta">
      <body
        className={`${inter.className} antialiased bg-slate-50 text-slate-900 min-h-screen`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
