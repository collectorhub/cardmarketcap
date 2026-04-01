import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileMenuProvider } from "@/context/MobileMenuContext";
import LayoutWrapper from "@/components/LayoutWrapper"; // We'll create this below

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CardMarketCap | Professional Card Analytics",
  description: "Real-time view of the Pokémon card market",
  icons: {
    icon: "/logo.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MobileMenuProvider>
            {/* We use a Wrapper here because metadata requires a Server Component, 
               but checking the URL (pathname) requires a Client Component.
            */}
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </MobileMenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}