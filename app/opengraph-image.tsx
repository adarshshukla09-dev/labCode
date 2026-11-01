import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 88, background: "#111827", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 34, color: "#93c5fd", fontWeight: 700 }}>Labs</div>
      <div style={{ marginTop: 22, fontSize: 68, fontWeight: 700, letterSpacing: -2 }}>SQL + MongoDB. Learn by doing.</div>
      <div style={{ marginTop: 22, fontSize: 30, color: "#d1d5db" }}>Interactive SQL and MongoDB practice for students</div>
    </div>,
    size,
  );
}
