import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
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
        await connect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const user = await User.findOne({ email: credentials.email }).select("+password");
        
        if (!user) {
          throw new Error("No user found with this email");
        }

        const requestedRole = credentials.loginType; 
        const actualRole = user.role;

        if (requestedRole && requestedRole !== actualRole) {
             if(actualRole !== 'admin') { 
                throw new Error(`Access Denied. This is a ${actualRole} account, not ${requestedRole}.`);
             }
        }

        const isValid = await bcrypt.compare(credentials.password, user.password as string);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        const isImageSafe = user.image && user.image.length < 500; 

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: isImageSafe ? user.image : "", 
        };
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.picture = user.image;
      }

      if (trigger === "update" && session) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.image && session.user.image.length < 500) {
            token.picture = session.user.image;
        }
      }
      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/userAuth", 
    error: "/userAuth",  
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };