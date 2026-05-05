import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "H.O.L.E APP",
  description: "Next-Generation Finance Dashboard",
};

import { RootLayoutWrapper } from "@/components/layout/RootLayoutWrapper";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
