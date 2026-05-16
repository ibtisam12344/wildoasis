// app/_lib/auth.config.js
import GoogleProvider from "next-auth/providers/google";

// ⚠️ NO mongoose imports here — this file runs in Edge Runtime (middleware)
const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

export default authConfig;
