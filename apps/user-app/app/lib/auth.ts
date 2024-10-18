import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions, User } from "next-auth";

type Credentials = {
  email: string;
  password: string;
};

interface AuthUser extends User {
  id: string;
  profileImg: string; // Add profileImg here
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      profileImg: string; // Add profileImg here
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: AuthUser;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<string, string> | undefined
      ): Promise<AuthUser | null> {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { email, password } = credentials as Credentials;

        try {
          const existingUser = await db.user.findFirst({
            where: { email },
          });

          if (!existingUser) {
            return null;
          }

          const passwordValidation = await bcrypt.compare(
            password,
            existingUser.password
          );

          if (!passwordValidation) {
            return null;
          }

          console.log("User authenticated successfully");

          // Include profileImg in the returned user
          return {
            id: existingUser.id.toString(),
            name: existingUser.name,
            email: existingUser.email,
            profileImg: existingUser.profileImg, // Include profileImg here
          };
        } catch (error) {
          console.error("Error during authentication", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/Signin",
  },
  secret: process.env.JWT_SECRET || "secret",

  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account) token.account = account;
      if (profile) token.profile = profile;
      if (user) token.user = user as AuthUser;
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          id: token.user.id,
          name: token.user.name as any,
          email: token.user.email as any,
          profileImg: token.user.profileImg, // Include profileImg in session
        };
      }
      return session;
    },
  },
};

export default authOptions;
