import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Importando a Inter
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/auth-hook";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header/header";

// 2. Configurando a fonte
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Nome da variável que o Tailwind vai ler
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Letterboxd',
    default: 'Letterboxd - Social film discovery',
  },
  description: "A social network for film lovers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />

            <main className="flex flex-col min-h-screen bg-letterboxd-background pt-6">
              {children}
            </main>

            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}