import type { AppProps } from "next/app";
import type { Page } from "../types/types";
import React from "react";
import { LayoutProvider } from "../layout/context/layoutcontext";
import Layout from "../layout/layout";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../styles/layout/layout.scss";
import "../styles/demo/Demos.scss";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import axiosClient from "@lib/axios";

type Props = AppProps & {
    Component: Page;
};

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: Props) {
    return (
        <SWRConfig
            value={{
                fetcher: (url) => axiosClient.get(url).then((res) => res.data),
            }}
        >
            <SessionProvider session={session}>
                <LayoutProvider>
                    {Component.getLayout ? (
                        Component.getLayout(<Component {...pageProps} />)
                    ) : (
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    )}
                </LayoutProvider>
            </SessionProvider>
        </SWRConfig>
    );
}