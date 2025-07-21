// ROOT LAYOUT
// This is the main layout wrapper for the entire Tableside Mastery application.
// It provides global fonts, metadata, and the basic HTML structure.
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// FONT CONFIGURATION
// Geist Sans for body text and UI elements
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves font loading performance
});

// Geist Mono for code and numerical displays
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// APPLICATION METADATA
// SEO and browser metadata for Tableside Mastery
export const metadata = {
  title: {
    default: "Tableside Mastery - Restaurant Server Analytics",
    template: "%s | Tableside Mastery"
  },
  description: "Track your restaurant shifts, analyze sales patterns, monitor tip percentages, and maximize your earnings with comprehensive analytics.",
  keywords: ["restaurant", "server", "tips", "analytics", "shift tracking", "earnings"],
  authors: [{ name: "Tableside Mastery" }],
  creator: "Tableside Mastery",
  publisher: "Tableside Mastery",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tableside-mastery.com'), // TODO: Update with actual domain
  openGraph: {
    title: "Tableside Mastery - Restaurant Server Analytics",
    description: "Track your restaurant shifts, analyze sales patterns, monitor tip percentages, and maximize your earnings.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tableside Mastery - Restaurant Server Analytics",
    description: "Track your restaurant shifts, analyze sales patterns, monitor tip percentages, and maximize your earnings.",
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
};

// ROOT LAYOUT COMPONENT
// Wraps all pages with global fonts, metadata, and basic HTML structure
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* VIEWPORT CONFIGURATION */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* FAVICON AND APP ICONS */}
        {/* TODO: Add favicon.ico and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* THEME COLOR */}
        <meta name="theme-color" content="var(--color-primary)" />
      </head>
      <body>
        {/* MAIN CONTENT */}
        <main>
          {children}
        </main>
        
        {/* TODO: Add global error boundary */}
        {/* TODO: Add global loading indicator */}
        {/* TODO: Add analytics tracking */}
      </body>
    </html>
  );
}
