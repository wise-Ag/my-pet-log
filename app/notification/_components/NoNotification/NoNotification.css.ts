import { style } from "@vanilla-extract/css";

export const container = style({
  display: "grid",
  justifyItems: "center",
  alignContent: "center",
  height: "calc(100vh - 5.6rem)",
});

export const image = style({
  marginBottom: "1.6rem",
  width: "6rem",
  height: "6.4rem",
});

export const description = style({
  fontSize: "1.6rem",
  fontWeight: "500",
  color: "var(--GrayC2)",
});
