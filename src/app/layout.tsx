import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/layout/providers";
import { LanguageProvider } from "@/components/layout/language-context";
import { CustomCursor } from "@/components/shared/custom-cursor";
import { PageProgress } from "@/components/shared/page-progress";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0c0c0c",
};

export const metadata: Metadata = {
  title: {
    default: "TOLO2TOLO — Minimal Streetwear",
    template: "%s | TOLO2TOLO",
  },
  description:
    "Constructed from silence. Worn with intention. Essentials redefined for those who understand restraint.",
  keywords: ["womenswear", "minimal", "fashion", "streetwear", "essentials"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${spaceMono.variable} antialiased`}
      style={{ "--font-mono": "var(--font-sans)" } as React.CSSProperties}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <CustomCursor />
        <PageProgress />
        <LanguageProvider>
          <Providers>{children}</Providers>
        </LanguageProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "1px",
              borderRadius: "0",
              border: "1px solid rgba(10,10,10,0.12)",
              background: "#f5f4f0",
              color: "#0c0c0c",
            },
          }}
        />
      </body>
    </html>
  );
}
