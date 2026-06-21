import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeTeX",
  description: "Structured LaTeX resume builder MVP"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" type="image/svg+xml" href={`${basePath}/favicon.svg`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
