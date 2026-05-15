// middleware.js
import { auth } from "@/app/_lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth?.user) {
    console.log("Middleware: Unauthenticated, redirecting...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*"], // applies only to /account and its subpaths
};
