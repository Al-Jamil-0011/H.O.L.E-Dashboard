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

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
