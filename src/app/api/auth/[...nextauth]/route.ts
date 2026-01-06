import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" }, 
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        await connect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Role Validation based on Portal
        if (credentials.loginType === "student" && user.role !== "student") {
          throw new Error("This is a Partner account. Please login from Partner portal.");
        }
        
        if (credentials.loginType === "partner" && user.role !== "partner") {
          throw new Error("This is a Student account. Please login from Student portal.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password as string);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user object (NextAuth will match this with the User type in d.ts)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image, // ✅ ১. ইমেজটি এখানে পাস করা হলো
        };
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      // প্রথমবার লগিন করার সময়
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.image = user.image; // ✅ ইমেজ টোকেনে রাখা হলো
      }

      // ✅ ২. যখন ক্লায়েন্ট সাইড থেকে update() কল করা হবে
      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.image = session.user.image;
      }

      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.image = token.image; // ✅ ৩. টোকেন থেকে ইমেজ সেশনে দেওয়া হলো
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/userAuth", 
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };