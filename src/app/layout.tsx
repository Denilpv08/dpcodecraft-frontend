import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "DPCodeCraft — Aprende a programar jugando",
    template: "%s | DPCodeCraft",
  },
  description:
    "Plataforma gamificada para aprender Frontend y Backend de forma interactiva, divertida y efectiva.",
  keywords: [
    "programación",
    "aprender",
    "JavaScript",
    "Python",
    "gamificación",
  ],
  authors: [{ name: "Denilson Prescott" }],
  openGraph: {
    title: "DPCodeCraft",
    description: "Aprende a programar jugando",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans bg-game-bg text-white antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
