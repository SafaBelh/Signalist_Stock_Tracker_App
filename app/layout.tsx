
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${rajdhani.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}