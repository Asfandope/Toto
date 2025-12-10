import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Toto - GitHub for Flashcards",
  description:
    "Turn any Wikipedia page into flashcards. Learn anything with spaced repetition.",
  openGraph: {
    title: "Toto - GitHub for Flashcards",
    description:
      "Turn any Wikipedia page into flashcards. Learn anything with spaced repetition.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toto - GitHub for Flashcards",
    description:
      "Turn any Wikipedia page into flashcards. Learn anything with spaced repetition.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
