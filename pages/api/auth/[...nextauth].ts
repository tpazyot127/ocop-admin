import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosClient from "@lib/axios";

declare module "next-auth" {
    interface User {
        accessToken?: string;
    }
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials, req) {
                try {
                    const res = await axiosClient.post("/auth/login", {
                        email: credentials?.email,
                        password: credentials?.password,
                    });

                    const user = res.data;
                    if (user && res.status === 201) {
                        if (!user.isAdmin) {
                            throw new Error("User is not an administrator");
                        }

                        return user;
                    }
                } catch (e: any) {
                    if (e.name === "AxiosError") {
                        throw new Error(e.response.data.message);
                    }

                    throw e;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.type === "credentials") {
                account.accessToken = user.accessToken;
            }

            return true;
        },
        jwt: async ({ token, account }) => {
            if (account && account.type === "credentials") {
                token.accessToken = account.accessToken;
            }

            return token;
        },
        session({ session, token, user }) {
            session.accessToken = token.accessToken as string;
            return session;
        },
        async redirect({ baseUrl, url }) {
            return baseUrl;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
});