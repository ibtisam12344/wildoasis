// app/_lib/auth.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getGuest, createGuest } from "./data-service";
import connectDB from "./db";

// Full auth config — only used in Node.js runtime (server components, API routes)
// mongoose is safe here because this file never touches the Edge Runtime
export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();
        let guest = await getGuest(user.email);
        if (!guest) {
          guest = await createGuest({
            email: user.email.toLowerCase(),
            fullName: user.name,
          });
        }
        return true;
      } catch (err) {
        console.error("SignIn error:", err);
        return false;
      }
    },

    async session({ session }) {
      try {
        await connectDB();
        const guest = await getGuest(session.user.email);
        if (guest?._id) {
          session.user.guestId = guest._id.toString();
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});
