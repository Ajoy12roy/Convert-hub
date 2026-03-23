import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    
    // 2. Apple Provider
    AppleProvider({
      clientId: process.env.APPLE_ID as string,
      clientSecret: process.env.APPLE_SECRET as string,
    }),

    // 3. Your existing Email/Password Credentials
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // NOTE: Replace this block with your actual database checking logic
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Example validation (আপনার MongoDB ভেরিফিকেশন এখানে বসবে)
        if (credentials.email && credentials.password) {
          return { id: "1", name: "User", email: credentials.email };
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth", // আপনার কাস্টম লগইন পেইজ
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // @ts-expect-error - id exists on token but not typed by default
        session.user.id = token.id;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };