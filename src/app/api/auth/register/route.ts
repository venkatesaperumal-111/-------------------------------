import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "அனைத்து தகவல்களும் தேவை." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: "STUDENT" },
    });

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "சர்வர் சிக்கல். மீண்டும் முயற்சிக்கவும்." }, { status: 500 });
  }
}
