import { style } from "@vanilla-extract/css";

export const root = style({
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "var(--GrayF2)",
});

export const modal = style({
  width: "30rem",
  padding: "3rem",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2rem",

  borderRadius: "10px",

  backgroundColor: "white",
});

export const button = style({
  width: "100%",

  padding: "0.9rem 0",

  color: "var(--GrayF2)",
  textAlign: "center",
  fontSize: "1.6rem",
  fontWeight: "600",
  backgroundColor: "var(--MainOrange)",
  borderRadius: "10px",
  "@media": {
    "screen and (min-width: 744px)": {
      fontSize: "2rem",
    },
  },
});

export const text = style({
  color: "var(--GrayA4)",
  textAlign: "center",
  fontSize: "1.6rem",
  fontWeight: "500",
});
