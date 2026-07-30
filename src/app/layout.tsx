import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "MedScope | Advanced Cardiovascular Care",
  description: "Experience premium heart care with MedScope. Our expert cardiologists provide personalized diagnostics and treatment using state-of-the-art technology.",
  icons: {
    icon: "/favicon.ico",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} font-jakarta antialiased bg-slate-50 text-slate-900`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

