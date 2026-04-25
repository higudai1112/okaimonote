import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { FlashProvider } from "@/contexts/FlashContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { FlashMessage } from "@/components/ui/FlashMessage";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.okaimonote.com";

export const metadata: Metadata = {
  title: {
    default: "おかいもノート | okaimonote",
    template: "%s | おかいもノート",
  },
  description:
    "日用品や食材の価格を記録して、最安値・平均・高値をかんたんにチェック。節約をもっと身近に。",
  openGraph: {
    siteName: "おかいもノート | okaimonote",
    title: "おかいもノート | okaimonote",
    description:
      "日用品や食材の価格を記録して、最安値・平均・高値をかんたんにチェック。節約をもっと身近に。",
    url: SITE_URL,
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: `${SITE_URL}/images/ogp.png`,
        width: 1200,
        height: 630,
        alt: "おかいもノート",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "おかいもノート | okaimonote",
    description:
      "日用品や食材の価格を記録して、最安値・平均・高値をかんたんにチェック。節約をもっと身近に。",
    images: [`${SITE_URL}/images/ogp.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FlashProvider>
          <AuthProvider>{children}</AuthProvider>
          <BottomNav />
          <FlashMessage />
        </FlashProvider>
      </body>
    </html>
  );
}
