import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileMenuProvider } from "@/context/MobileMenuContext"

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
           <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
  <Sidebar />

  {/* Remove lg:pl-64 if the sidebar is lg:static */}
  <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-all duration-300">
    <Navbar />
    <main className="p-4 md:p-8 w-full max-w-[1600px] mx-auto min-h-screen">
      {children}
    </main>
  </div>
</div>
          </MobileMenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}