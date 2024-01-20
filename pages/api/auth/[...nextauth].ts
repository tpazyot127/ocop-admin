import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosClient from "@lib/axios";

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

                    if (res.data && res.data.statusCode === 200) {
                        return res.data.data;
                    }

                    return null;
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
                account.access_token = user.access_token;
                account.refresh_token = user.refresh_token;
            }

            return true;
        },
        jwt: async ({ token, account }) => {
            if (account && account.type === "credentials") {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
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