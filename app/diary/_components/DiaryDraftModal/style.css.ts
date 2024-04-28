import { style } from "@vanilla-extract/css";

export const container = style({
  height: "100%",
  gap: "2rem",
});

export const title = style({
  color: "var(--Black)",
  textAlign: "center",
  fontSize: "2rem",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "normal",
});

export const text = style({
  color: "var(--Gray81)",
  fontSize: "1.6rem",
  textAlign: "center",

  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
});
