import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt", // ডাটাবেস সেশন ব্যবহার না করে JWT ব্যবহার করছি (Fast)
    maxAge: 30 * 24 * 60 * 60, // ৩০ দিন সেশন থাকবে
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials) {
        // ১. ডাটাবেস কানেকশন
        await connect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // ২. ইউজার খোঁজা (পাসওয়ার্ড সহ)
        const user = await User.findOne({ email: credentials.email }).select("+password");
        
        if (!user) {
          throw new Error("No user found with this email");
        }

        // ৩. রোল ভ্যালিডেশন (আপনার লজিক)
        if (credentials.loginType === "student" && user.role !== "student") {
          throw new Error("This is a Partner account. Please login from Partner portal.");
        }
        
        if (credentials.loginType === "partner" && user.role !== "partner") {
          throw new Error("This is a Student account. Please login from Student portal.");
        }

        // ৪. পাসওয়ার্ড চেক
        const isValid = await bcrypt.compare(credentials.password, user.password as string);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // ৫. সফল লগইন - এখানে সব ডাটা রিটার্ন করতে হবে
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          // image: user.image, // ✅ এখন ছবি পাস করা হচ্ছে
        };
      },
    }),
  ],
  callbacks: {
    // ১. JWT কলব্যাক: এখানে ইউজারের ডাটা টোকেনে সেভ করা হয়
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      // প্রথমবার লগইন করার সময়
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.picture = user.image; // ইউজারের ছবি টোকেনে রাখা হলো
        token.name = user.name;
      }

      // প্রোফাইল আপডেট করার সময় (Profile Settings Page থেকে যখন update() কল হবে)
      if (trigger === "update" && session) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.image) token.picture = session.user.image; // ✅ ছবিও আপডেট হবে
      }
      return token;
    },

    // ২. সেশন কলব্যাক: টোকেন থেকে ডাটা নিয়ে ফ্রন্টএন্ডে পাঠানো হয়
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;     // টোকেন থেকে নাম
        // session.user.image = token.picture; // টোকেন থেকে ছবি
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/userAuth", 
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };