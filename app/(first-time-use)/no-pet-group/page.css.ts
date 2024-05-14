import { style } from "@vanilla-extract/css";

export const container = style({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
});

export const title = style({
  marginBottom: "3rem",
  fontSize: "2.7rem",
  fontWeight: "700",
  color: "var(--Black)",
  "@media": {
    "screen and (min-width: 744px)": {
      fontSize: "3rem",
    },
    " (min-width:1024px)": {
      fontSize: "2.4rem",
    },
  },
});

export const subTitle = style({
  marginBottom: "4.5rem",
  fontSize: "1.6rem",
  fontWeight: "400",
  color: "var(--Black)",
  "@media": {
    "screen and (min-width: 744px)": {
      fontSize: "2rem",
    },
    " (min-width:1024px)": {
      fontSize: "1.6rem",
      marginBottom: "2.5rem",
    },
  },
});

export const mockUpImage = style({
  width: "18rem",
  height: "22rem",
  marginBottom: "4.4rem",
  "@media": {
    "screen and (min-width: 744px)": {
      width: "20rem",
      height: "25rem",
      marginBottom: "3rem",
    },
    " (min-width:1024px)": {
      width: "18rem",
      height: "22rem",
      marginBottom: "2rem",
    },
  },
});

export const linkBase = style({
  display: "inline-block",
  width: "100%",
  maxWidth: "40rem",
  padding: "0.9rem 0",
  borderRadius: "30px",
  fontSize: "1.6rem",
  fontWeight: "600",
  "@media": {
    "screen and (min-width: 744px)": {
      fontSize: "2rem",
      padding: "1.1rem 0 1rem 0",
    },
    " (min-width:1024px)": {
      fontSize: "1.6rem",
      padding: "0.9rem 0",
    },
  },
});

export const linkCreate = style([
  linkBase,
  {
    marginBottom: "1.6rem",
    backgroundColor: "var(--MainOrange)",
    color: "var(--White)",
  },
]);

export const linkParticipate = style([
  linkBase,
  {
    backgroundColor: "var(--LightOrange)",
    color: "var(--MainOrange)",
  },
]);
