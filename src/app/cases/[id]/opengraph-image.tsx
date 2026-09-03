import { ImageResponse } from "next/og";
import { getCaseStudies, getCaseStudy, getProfile } from "@/repositories/content-repository";

/**
 * A share card per case study.
 *
 * These links get pasted into LinkedIn and messages one at a time, and the
 * site-wide card made every one of them look identical — the same name and
 * headline whether the link was about a Kafka migration or a production
 * outage. The card is the first thing the reader sees, so it should say which
 * case they are about to open.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Case study — ${getProfile().name}`;

/** Same rule as the page: an unknown slug is a 404, not a rendered card. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((study) => ({ id: study.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const study = getCaseStudy(id);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b0d10",
          color: "#f2f1ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#5b8def",
            }}
          >
            Case study
          </div>
          <div
            style={{
              fontSize: study && study.title.length > 58 ? 48 : 58,
              fontWeight: 600,
              marginTop: 26,
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {study?.title ?? "Case study"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {study && (
            <div style={{ display: "flex", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
              {study.technologies.slice(0, 5).map((technology) => (
                <div
                  key={technology}
                  style={{
                    fontSize: 20,
                    color: "#a8a6a0",
                    border: "1px solid #2b2e38",
                    borderRadius: 999,
                    padding: "6px 18px",
                  }}
                >
                  {technology}
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              color: "#a8a6a0",
            }}
          >
            <span>{getProfile().name}</span>
            {study && <span>{study.period}</span>}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
