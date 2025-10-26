import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  // You can also add specific weights if needed:
  // weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Signalist",
  description:
    "Track real-time stock prices, get personalized alerts and explore detailed company insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${nunito.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
