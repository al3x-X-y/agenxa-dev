import type { Metadata } from "next";
import { DM_Sans, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/providers/theme-provider"
import ModalProvider from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const font = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgenXa",
  description: "All in one Agency Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ theme: dark }} afterSignOutUrl="/">
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "h-full",
          "antialiased",
          geistSans.variable,
          geistMono.variable,
          "font-sans",
          font.variable
        )}
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>
              {children}
              <Toaster />
              <SonnerToaster />
            </ModalProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>

  );
}