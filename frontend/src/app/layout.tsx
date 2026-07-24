import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/auth-hook";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Letterboxd",
    default: "Letterboxd - Social film discovery",
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
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />

            <main className="flex min-h-screen flex-col bg-letterboxd-background pt-6">
              {children}
            </main>

            <Footer />
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
