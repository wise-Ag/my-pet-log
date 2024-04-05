import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  justifyContent: "space-between",
});

export const label = style({
  fontSize: "1.6rem",
  fontWeight: "600",
});

export const toggleContainer = style({
  position: "relative",
  width: "6rem",
  height: "3rem",
});

export const checkbox = style({
  appearance: "none",
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: "30px",
  backgroundColor: "var(--GrayE8)",
  ":checked": {
    backgroundColor: "var(--Green)",
    transition: "0.5s",
  },
});

export const circle = style({
  position: "absolute",
  top: "0.5rem",
  left: "0.5rem",
  width: "2rem",
  height: "2rem",
  borderRadius: "50%",
  backgroundColor: "rgb(255,254,255)",
  transition: "0.5s",
});

export const checkedCircle = style({
  left: "3.5rem",
});

export const p = style({
  color: "var(--Gray81)",
  fontSize: "1.2rem",
  fontWeight: "500",

  marginTop: "0.5rem",
});
