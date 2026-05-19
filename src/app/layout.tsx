import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata:Metadata = {
  title: "H.O.L.E App | Finance & Sales Management Dashboard",
  description:
    "H.O.L.E App is a modern finance and sales management dashboard for tracking sales, commissions, vendor payments, and financial reports with seamless QuickBooks integration.",

  keywords: [
    "finance dashboard",
    "sales management",
    "commission tracking",
    "vendor payments",
    "financial reports",
    "QuickBooks integration",
    "business analytics",
    "expense tracking",
    "rep accounts",
  ],

  authors: [{ name: "H.O.L.E Team" }],
  creator: "H.O.L.E App",

  metadataBase: new URL("https://yourdomain.com"),

  openGraph: {
    title: "H.O.L.E App | Smart Finance Dashboard",
    description:
      "Track sales, commissions, vendor payments, and sync with QuickBooks in one powerful dashboard.",
    url: "https://yourdomain.com",
    siteName: "H.O.L.E App",
    images: [
      {
        url: "/og-image.png", // put your image in public folder
        width: 1200,
        height: 630,
        alt: "H.O.L.E App Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "H.O.L.E App | Finance Dashboard",
    description:
      "All-in-one finance dashboard for sales, commissions, and vendor tracking.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
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
