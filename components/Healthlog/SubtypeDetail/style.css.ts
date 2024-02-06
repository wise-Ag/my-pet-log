import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100%",

  padding: "1.8rem",
  gap: "1rem",

  display: "flex",
  flexDirection: "column",

  borderRadius: "10px",
  backgroundColor: "var(--MainOrange)",
  color: "var(--White)",
});

export const inputWrapper = style({
  display: "flex",
  flexDirection: "column",

  gap: "1rem",
});

export const inputBox = style({
  width: "100%",
  height: "3rem",

  padding: "1rem",

  borderRadius: "10px",
  border: "1.5px solid var(--White)",

  ":focus": {
    outline: "none",
    border: "1.5px solid var(--MainOrange)",
  },
});

export const selectBox = style({
  width: "100%",
  height: "3rem",

  padding: "0 1rem",

  borderRadius: "10px",
  border: "1.5px solid var(--White)",
});

export const textBox = style({
  width: "100%",
  height: "6rem",

  padding: "1rem",

  borderRadius: "10px",
  border: "1.5px solid var(--White)",
});

export const checkBox = style({
  width: "2.4rem",
  height: "2.4rem",

  border: "1.5px solid var(--White)",
});
