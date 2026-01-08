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
        // ১. লগইন শুরু
        console.log("🟢 Login Attempt for:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        try {
          // ২. ডাটাবেস কানেকশন
          console.log("⏳ Connecting to DB...");
          await connect();
          console.log("✅ DB Connected!");

          // ৩. ইউজার খোঁজা
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            console.log("❌ User not found in DB");
            throw new Error("No user found with this email");
          }
          console.log("✅ User found:", user.email);

          // ৪. রোল ভ্যালিডেশন
          if (credentials.loginType === "student" && user.role !== "student") {
            throw new Error("This is a Partner account. Please login from Partner portal.");
          }
          
          if (credentials.loginType === "partner" && user.role !== "partner") {
            throw new Error("This is a Student account. Please login from Student portal.");
          }

          // ৫. পাসওয়ার্ড চেক
          console.log("⏳ Verifying password...");
          const isValid = await bcrypt.compare(credentials.password, user.password as string);

          if (!isValid) {
            console.log("❌ Invalid Password");
            throw new Error("Invalid password");
          }

          console.log("🎉 Login Successful!");

          // Return user object
          // ❌ Note: এখানে image রিটার্ন করছি না, কারণ এটা কুকি সাইজ বাড়িয়ে দেয়
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("🛑 Authorization Error:", error.message);
          throw new Error(error.message || "Internal Server Error");
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      // ১. প্রথমবার লগইন করার সময়
      if (user) {
        token.role = user.role;
        token.id = user.id;
        // token.image = user.image; // ❌ এই লাইনটি বাদ দিয়েছি (Cookie overflow ফিক্স)
      }

      // ২. প্রোফাইল আপডেট করার সময় (trigger === "update")
      if (trigger === "update" && session) {
        // ✅ শুধু নাম আপডেট হবে, ইমেজ নয়
        if (session.user.name) {
          token.name = session.user.name;
        }
        
        // ❌ আগে এই লাইনটি ছিল যা এরর দিচ্ছিল:
        // token.image = session.user.image;  <--- (REMOVED)
      }
      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        // session.user.image = token.image; // ❌ সেশনেও ইমেজ দরকার নেই
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
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };