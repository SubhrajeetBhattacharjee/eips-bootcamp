import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

import { ThemeProvider } from "./components/ThemeProvider";
import { Web3Provider } from "./components/Web3Provider";

export const metadata: Metadata = {
  title: {
    default: "EthShala | Master Ethereum Improvement Proposals",
    template: "%s | EthShala",
  },
  description: "Learn, contribute, and master the core of Ethereum. EthShala provides a gamified path to mastering EIPs through structured modules and community engagement.",
  keywords: ["Ethereum", "EIP", "Blockchain", "Web3", "Learning", "Smart Contracts", "Governance"],
  authors: [{ name: "EthShala Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ethshala.com",
    title: "EthShala | Master Ethereum Improvement Proposals",
    description: "Learn, contribute, and master the core of Ethereum through our gamified EIP learning platform.",
    siteName: "EthShala",
    images: [
      {
        url: "/brand/ethshala_logo.svg",
        width: 1200,
        height: 630,
        alt: "EthShala Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EthShala | Master Ethereum Improvement Proposals",
    description: "Master the core of Ethereum with EthShala's gamified learning platform.",
    images: ["/brand/ethshala_logo.svg"],
    creator: "@EthShala",
  },
  icons: {
    icon: "/brand/ethshala_logo.svg",
    apple: "/brand/ethshala_logo.svg",
  },
};

import { Chatbot } from "./components/Chatbot";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 font-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Web3Provider>
            {children}
            <Chatbot />
            <Toaster position="bottom-right" richColors closeButton />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
