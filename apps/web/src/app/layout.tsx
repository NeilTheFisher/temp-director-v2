import type { Metadata } from "next";
import "../index.css";
import { Suspense } from "react";
import Header from "@/components/header";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "director_v2",
  description: "director_v2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"antialiased"}>
        <Providers>
          <div className="grid h-svh grid-rows-[auto_1fr]">
            <Header />
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  Loading...
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
