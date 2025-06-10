import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Junior Researcher",
  description: "An intelligent research assistant powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}
      >
        <div className="relative flex min-h-screen flex-col">
          {/* Optional header or navigation can go here */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>

          <footer className="w-full border-t border-border backdrop-blur-md bg-background/70 shadow-inner">
            <div className="container mx-auto flex flex-col items-center justify-center gap-2 py-6 text-center md:flex-row md:justify-between md:py-4">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Junior Researcher. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
