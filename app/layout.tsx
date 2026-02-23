import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const wildWorld = localFont({
  src: "../public/fonts/WildWorld.otf",
  variable: "--font-wild-world",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frontend Engineer | Space Portfolio",
  description: "Personal portfolio — Frontend Engineer",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${wildWorld.variable} font-sans antialiased bg-[var(--space-black)] text-[var(--star-white)]`}
      >
        {children}
      </body>
    </html>
  );
}
