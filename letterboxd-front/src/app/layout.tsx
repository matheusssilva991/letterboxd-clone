import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider"; // Crie esse arquivo
import { cn } from "@/lib/utils"; // Utilitário padrão do Shadcn

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Letterboxd Clone', // O %s é substituído pelo título das outras páginas
    default: 'Letterboxd Clone', // Título da Home
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
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Letterboxd é nativamente dark
          enableSystem
          disableTransitionOnChange
        >
          {/* DICA: Aqui é o lugar ideal para colocar sua <Navbar />
            assim ela aparece em todas as páginas.
          */}

          <main className="flex flex-col min-h-screen">
             {children}
          </main>

          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}