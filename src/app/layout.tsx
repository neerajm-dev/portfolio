import type { Metadata, Viewport } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#05070a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Neeraj M — Solo Architect & Systems Engineer",
  description:
    "19yo Full-Stack Android & Cloud Platforms architect. $0 cloud infrastructure specialist, builder of KTCC tournament platform, and high-velocity systems engineer.",
  keywords: [
    "Neeraj M",
    "Systems Engineer",
    "Full-Stack Android",
    "Cloud Architecture",
    "Zero Dollar Infrastructure",
    "KTCC",
    "Next.js 15",
    "Supabase",
    "Cloudflare R2",
    "Kerala Developer",
    "Portfolio",
  ],
  authors: [{ name: "Neeraj M", url: "https://neerajm.vercel.app" }],
  creator: "Neeraj M",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neerajm.vercel.app",
    title: "Neeraj M | Solo Architect & Systems Engineer",
    description:
      "Engineering full-scale Android and cloud platforms at strictly $0.00/mo ongoing cloud budget. Flagship: KTCC Tournament Platform.",
    siteName: "Neeraj M Developer Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neeraj M — Solo Architect & Systems Engineer",
    description:
      "Engineering full-scale Android and cloud platforms at strictly $0.00/mo ongoing cloud budget.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#05070a] text-[#f0f6fc] font-sans antialiased selection:bg-[#00f0ff]/20 selection:text-[#00f0ff] flex flex-col">
        {children}
      </body>
    </html>
  );
}
