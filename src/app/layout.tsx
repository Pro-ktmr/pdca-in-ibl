import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotesProvider } from "@/contexts/NotesContext";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "探究ノート記録システム",
  description: "探究ノート記録システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <NotesProvider>
          <header className="bg-blue-600 text-white px-6 py-4 shadow">
            <h1 className="text-xl font-bold">
              <Link href="/">探究ノート記録システム</Link>
            </h1>
          </header>
          <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
            {children}
          </main>
        </NotesProvider>
      </body>
    </html>
  );
}
