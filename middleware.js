// middleware.js
import NextAuth from "next-auth";
import authConfig from "@/app/_lib/auth.config"; // ✅ No mongoose here
import { NextResponse } from "next/server";

// Use only the Edge-safe config for the middleware auth wrapper
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth?.user) {
    console.log("Middleware: Unauthenticated, redirecting...");
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*"],
};
