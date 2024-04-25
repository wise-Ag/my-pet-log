import { keyframes, style } from "@vanilla-extract/css";
import { Z_INDEX } from "@/styles/zindex.css";

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const slideUp = keyframes({
  "0%": { transform: "translateX(-50%) translateY(100%)" },
  "100%": { transform: "translateX(-50%) translateY(0)" },
});

export const overlay = style({
  animation: `${fadeIn} 0.2s ease-out forwards`,
  width: "100%",
  height: "100%",

  position: "fixed",
  top: "0",
  left: "0",

  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: Z_INDEX.Modal,
});

export const container = style({
  width: "100%",
  height: "90%",
  maxWidth: "74.4rem",

  borderTopLeftRadius: "20px",
  borderTopRightRadius: "20px",

  backgroundColor: "var(--White)",

  position: "fixed",
  left: "50%",
  bottom: "0",
  overflowY: "scroll",
});

export const commentTitle = style({
  fontSize: "1.6rem",
  fontWeight: "500",
});

export const header = style({
  padding: "1.8rem",

  display: "flex",
  justifyContent: "space-between",

  position: "sticky",
  top: "0",

  backgroundColor: "var(--White)",
  borderBottom: "1px solid var(--GrayE8)",
  zIndex: Z_INDEX.CommentModalContainer_header,
});

export const commentInputContainer = style({
  maxWidth: "74.4rem",
  display: "flex",
  alignItems: "center",
  gap: "0.9rem",
  width: "100%",

  position: "fixed",
  bottom: "0",
  left: "50%",
  transform: "translateX(-50%)",

  padding: "2rem 1.6rem",

  backgroundColor: "var(--White)",
  zIndex: "1000",
});

export const profileImage = style({
  minWidth: "3rem",
  minHeight: "3rem",

  border: "1px solid var(--MainOrange)",
  borderRadius: "50%",

  backgroundSize: "cover",
  backgroundPosition: "center",
});

export const commentInput = style({
  width: "100%",
  height: "4rem",

  padding: "1.2rem 1.5rem",

  borderRadius: "20px",
  border: "none",

  backgroundColor: " var(--GrayF4)",

  ":focus": {
    outline: "none",
  },
});

export const sendIcon = style({
  position: "absolute",
  right: "0.7rem",
  top: "50%",

  transform: "translate(-50%,-50%)",

  cursor: "pointer",
});
