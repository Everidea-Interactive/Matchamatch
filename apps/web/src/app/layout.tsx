import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Matchamatch",
  description: "ASMR sorting puzzle with scanner mode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="min-h-screen bg-[#E2ECD5] text-[#3A432E] antialiased">
        {children}
      </body>
    </html>
  );
}
