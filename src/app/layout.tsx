import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { App } from "antd";
import AntdGlobal from "@/components/AntGlobal";
import { Suspense } from "react";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "石溪思亲楼缴费系统",
  description: "石溪思亲楼缴费系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <App>
          <AntdGlobal></AntdGlobal>
          <AntdRegistry>
            <Suspense>
              <Layout>{children}</Layout>
            </Suspense>
          </AntdRegistry>
        </App>
      </body>
    </html>
  );
}
