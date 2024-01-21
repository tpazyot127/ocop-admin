import axios from "axios";
import { getSession } from "next-auth/react";

const isServer = typeof window === "undefined";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(async (config) => {
    if (isServer) {
        const session = await getSession();

        if (session) {
            config.headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
    }

    return config;
});

export default axiosClient;