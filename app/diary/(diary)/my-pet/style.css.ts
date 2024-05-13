import { style } from "@vanilla-extract/css";

export const root = style({
  width: "100%",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

export const container = style({
  width: "100%",

  paddingBottom: "6.6rem",
  "@media": {
    "(min-width: 744px)": {
      maxWidth: "45rem",
    },
  },
});
