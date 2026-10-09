import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "RANKIS.LT – įrankiai ir sodo technika", template: "%s | RANKIS.LT" },
  description: "Įrankiai, sodo technika, akumuliatorinės sistemos. Husqvarna, Makita, Stiga, Festool.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" className={inter.variable}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
