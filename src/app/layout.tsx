import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

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
        {/* Sidebar (desktop only) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 lg:ml-60 min-h-full overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>

        {/* Bottom nav (mobile only) */}
        <BottomNav />
      </body>
    </html>
  );
}
