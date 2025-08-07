import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/app/components/ConditionalLayout";
import { ThemeProvider } from '@/app/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Analytics } from "@vercel/analytics/next"

const robotoCondensed = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});


export const metadata: Metadata = {
  title: "FitChumm",
  description: "Gym Tracker app for a healthier lifestyle with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${robotoCondensed.className} antialiased max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={true}
        >
          <AuthProvider >
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
