import type { MetadataRoute } from "next";
import { siteConfig } from "@/config";

/**
 * The wildcard rule already permits every crawler, AI ones included. The named
 * rules below change no behaviour today — they exist so the intent survives a
 * future in which one of these agents starts requiring an explicit opt-in
 * (`Google-Extended` and `Applebot-Extended` are opt-out tokens for exactly
 * that kind of policy shift).
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
