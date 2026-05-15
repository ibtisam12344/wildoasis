import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getGuest, createGuest } from "./data-service";
import connectDB from "./db";

const authConfig = {
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
        // connectDB() is safe to call repeatedly — it checks readyState
        // internally and no-ops if already connected. The try/catch here
        // ensures a transient DB hiccup never wipes out the whole session.
        await connectDB();
        const guest = await getGuest(session.user.email);
        if (guest?._id) {
          session.user.guestId = guest._id.toString();
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        // Return the session as-is so the user stays logged in
        // even if guestId couldn't be attached this cycle.
        return session;
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
