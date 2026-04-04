import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

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
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <MobileMenuProvider>
            {/* No more LayoutWrapper! 
               If the route is in /(root), it uses /(root)/layout.tsx (Sidebar + Navbar).
               If the route is in /(auth), it uses only this layout (Clean Screen).
            */}
            {children}
          </MobileMenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}