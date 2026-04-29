import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FH Spices — Homemade Hyderabadi Pickles, Spices & Snacks",
  description:
    "Nostalgia with no preservatives, only memories. Hyderabadi homemade pickles, spice powders, and protein snacks — made the way our grandmothers made them.",
  openGraph: {
    title: "FH Spices",
    description: "Nostalgia with no preservatives, only memories.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
