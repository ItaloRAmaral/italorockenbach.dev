import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Newsreader, Work_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CommandPalette } from "@/components/search/CommandPalette";
import { getCompanies, getProfile } from "@/repositories/content-repository";
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

const profile = getProfile();
const currentRole = getCompanies()[0]?.role ?? "Software Engineer";

/**
 * The name leads, because the name is what people search for. "Engineering
 * Record" is what this site is called, not what anyone types into Google —
 * as the browser-tab title it pushed the only searchable term to the end.
 *
 * Both halves come from the knowledge base so the tab, the search result and
 * the structured data can never disagree about the name or the job title.
 */
const SITE_NAME = `${profile.name} — ${currentRole}`;
/** The site's own name, for og:site_name — a label, not a search term. */
const SITE_LABEL = "Engineering Record";
const SITE_DESCRIPTION =
  "Career evidence and technical notes for a backend and architecture reference.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s — ${profile.name}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_LABEL,
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

/** Evaluated when the page is built, and every page here is prerendered — so
 *  this is the date the published content was generated. */
function buildRevision(): string {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
}

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
        {/* First focusable element on the page. Without it, reaching the
            content by keyboard means tabbing past twelve navigation links on
            every single page. */}
        <a href="#main" className="skipLink">
          Skip to content
        </a>
        <MobileNav name={profile.name} />
        <div className="shell">
          <Sidebar name={profile.name} revision={buildRevision()} />
          <main id="main" className="main" tabIndex={-1}>
            {children}
          </main>
        </div>
        <CommandPalette />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
