// middleware.js
import NextAuth from "next-auth";
import authConfig from "@/app/_lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth?.user) {
    console.log("Middleware: Unauthenticated, redirecting...");

    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*"],
};
