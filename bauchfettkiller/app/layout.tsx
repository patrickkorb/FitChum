import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bauchfettkiller 40+",
  description: "Entdecke wie du effektiv Bauchfett verlierst - speziell für Menschen über 40",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="dfid_iQESQkjjP6vmvgQejMTDS"
          data-domain="fitchumm.com"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
