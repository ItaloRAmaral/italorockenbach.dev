import { ImageResponse } from "next/og";
import { getProfile } from "@/repositories/content-repository";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const profile = getProfile();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0d10",
          color: "#f2f1ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#5b8def" }}>
          Engineering Record
        </div>
        <div style={{ fontSize: 64, fontWeight: 600, marginTop: 24, lineHeight: 1.15 }}>{profile.name}</div>
        <div style={{ fontSize: 28, marginTop: 28, color: "#a8a6a0", maxWidth: 900, lineHeight: 1.4 }}>
          {profile.headline}
        </div>
      </div>
    ),
    { ...size },
  );
}
