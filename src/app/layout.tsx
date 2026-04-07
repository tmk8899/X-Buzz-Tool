import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "X Buzz Post Tool",
  description: "AIを活用したXバズ投稿ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full flex" style={{ background: "#080810" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 ml-60 min-h-full overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
