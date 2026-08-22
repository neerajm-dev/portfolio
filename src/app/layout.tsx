import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://neerajm.vercel.app"),
  title: "Neeraj M // Solo Systems Architect & Full-Stack Engineer",
  description:
    "Personal developer portfolio of Neeraj M (19yo Systems Architect & Full-Stack Builder). Creator of KTCC Platform, Next.js 15, Android Hybrid Engines, and $0 Cloud Infrastructure.",
  keywords: [
    "Neeraj M",
    "Systems Architect",
    "Full-Stack Developer",
    "Next.js 15",
    "Supabase",
    "Capacitor Android",
    "Cloudflare R2",
    "TokyoNight",
    "Portfolio",
    "Kerala Developer",
  ],
  authors: [{ name: "Neeraj M", url: "https://neerajm.vercel.app" }],
  creator: "Neeraj M",
  openGraph: {
    title: "Neeraj M // Systems Architect & Full-Stack Engineer",
    description:
      "Architecting Production Platforms from Scratch. Full-Stack Android & Cloud Platforms with $0 Infrastructure.",
    url: "https://neerajm.vercel.app",
    siteName: "Neeraj M Portfolio",
    images: [
      {
        url: "/avatar-neeraj.png",
        width: 800,
        height: 800,
        alt: "Neeraj M - ASCII Matrix Avatar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neeraj M // Systems Architect",
    description:
      "Architecting Production Platforms from Scratch. $0 Cloud Infrastructure Specialist.",
    creator: "@neerajm_dev",
    images: ["/avatar-neeraj.png"],
  },
  icons: {
    icon: "/avatar-neeraj.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} ${inter.variable} antialiased bg-[#05070a] text-white font-sans`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
