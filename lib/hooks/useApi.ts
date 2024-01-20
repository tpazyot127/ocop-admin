import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axiosClient from "../axios";

const useApi = () => {
    const { data: session } = useSession();
    // const refreshToken = useRefreshToken();

    useEffect(() => {
        const requestIntercept = axiosClient.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        const responseIntercept = axiosClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;

                // Refresh token soon
                // if (error?.response?.status === 401 && !prevRequest?.sent) {
                //     prevRequest.sent = true;
                //     await refreshToken();
                //     prevRequest.headers["Authorization"] = `Bearer ${session?.user.accessToken}`;
                //     return axiosAuth(prevRequest);
                // }

                return Promise.reject(error);
            },
        );

        return () => {
            axiosClient.interceptors.request.eject(requestIntercept);
            axiosClient.interceptors.response.eject(responseIntercept);
        };
    }, [session]);

    return axiosClient;
};

export default useApi;
