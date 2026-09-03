import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Newsreader, Work_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Sidebar } from "@/components/layout/Sidebar";
import { siteConfig } from "@/config";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

const SITE_NAME = "Engineering Record — Italo Rockenbach Amaral";
const SITE_DESCRIPTION =
  "Career evidence and technical notes for a backend and architecture reference.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: SITE_NAME,
    template: "%s — Italo Rockenbach Amaral",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  /** Proves ownership of the Google Search Console property. Removing it
   *  un-verifies the site, which stops sitemap submissions and indexing
   *  reports — it is not a leftover. */
  verification: {
    google: "B4XatJ8bt_pI8VeHn1hb_bCANpZP_Ew3M1Of7BmQ2mk",
  },
};

/** Matches the shell background, so mobile browser chrome doesn't frame the
 *  dark page in a light bar. */
export const viewport: Viewport = {
  themeColor: "#0b0d10",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        {/* Applies a stored light-mode preference before first paint. Inline and
            synchronous on purpose: anything deferred repaints the page, and the
            visitor sees a dark flash before their own choice takes effect. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="light"){document.documentElement.setAttribute("data-theme","light")}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <div className="shell">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
