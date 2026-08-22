import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SADIA — development nemovitostí";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #12142e 0%, #1a1d45 55%, #4A90C0 100%)",
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            opacity: 0.72,
          }}
        >
          SADIA
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Development nemovitostí s respektem k místu
          </div>
          <div style={{ fontSize: 30, opacity: 0.82 }}>sadiaestate.cz</div>
        </div>
      </div>
    ),
    size,
  );
}
