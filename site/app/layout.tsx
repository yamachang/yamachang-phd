import type { Metadata } from "next";
import { jakarta, jetbrainsMono } from "@/lib/fonts";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ya-Wen (Yama) Chang",
    template: "%s | Yama Chang",
  },
  description:
    "PhD Student in Quantitative Biomedical Science at Dartmouth College. Research in digital mental health, AI-driven interventions, and wearable technology.",
  openGraph: {
    title: "Ya-Wen (Yama) Chang",
    description:
      "PhD Student in Quantitative Biomedical Science at Dartmouth College",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Nav />
          <main className="min-h-screen">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
