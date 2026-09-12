import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if ((pathname.startsWith("/dashboard") || pathname.startsWith("/practice") || pathname.startsWith("/mock-test") || pathname.startsWith("/progress")) && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/practice/:path*", "/mock-test/:path*", "/progress/:path*"],
};
