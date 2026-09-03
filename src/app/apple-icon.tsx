import { ImageResponse } from "next/og";

/** Home-screen icon for iOS bookmarks. Generated rather than shipped as an
 *  asset so it stays in step with the Open Graph image's palette. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0d10",
          color: "#f2f1ec",
          fontSize: 84,
          fontWeight: 600,
          fontFamily: "sans-serif",
          letterSpacing: -2,
        }}
      >
        IA
      </div>
    ),
    { ...size },
  );
}
