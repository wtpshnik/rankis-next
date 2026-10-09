import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBar } from "@/components/layout/MobileBar";
import { getNavRootsShallow } from "@/lib/nav";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700", "800", "900"], variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  title: { default: "RANKIS.LT – įrankiai ir sodo technika", template: "%s | RANKIS.LT" },
  description: "Įrankiai, sodo technika, akumuliatorinės sistemos. Husqvarna, Makita, Stiga, Festool.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const roots = getNavRootsShallow();
  return (
    <html lang="lt" className={`${inter.variable} ${archivo.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header roots={roots} />
          <div className="flex-1">{children}</div>
          <Footer />
          <MobileBar roots={roots} />
        </CartProvider>
      </body>
    </html>
  );
}
