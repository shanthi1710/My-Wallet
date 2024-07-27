
import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions,  User } from "next-auth";

type Credentials = {
    email: string;
    password: string;
};

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
                if (!credentials) {

                    throw new Error("Missing credentials");
                }

                const { email, password } = credentials as Credentials;

                try {
                    const existingUser = await db.user.findFirst({
                        where: {
                            email,
                        },
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
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.email,
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
            if (user) token.user = user;
            return token;
        },
        async session({ session, user }) {
            if (user) session.user = user;
            return session;
        },
    },
};


export default authOptions;
