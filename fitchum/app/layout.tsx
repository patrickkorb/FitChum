import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavigation from "./components/layout/ConditionalNavigation";
import { NavbarProvider } from "./contexts/NavbarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitChum - Coming Soon",
  description: "Join the waitlist for FitChum. Your fitness journey starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavbarProvider>
          <div className="flex min-h-screen">
            <ConditionalNavigation />
            <main className="flex-1 lg:pb-0 pb-20">
              {children}
            </main>
          </div>
        </NavbarProvider>
      </body>
    </html>
  );
}
