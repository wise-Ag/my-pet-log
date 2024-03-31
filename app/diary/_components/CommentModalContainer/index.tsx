import ReactDOM from "react-dom";
import React, { useState } from "react";
import * as styles from "./style.css";

interface CommentModalContainerProps {
  children: React.ReactNode;
  onClose: () => void;
}
const CommentModalContainer = ({ children, onClose }: CommentModalContainerProps) => {
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartY(e.touches[0].clientY);
    setIsSliding(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchY = e.touches[0].clientY;
    const movement = touchY - startY;
    setTranslateY(movement);
  };

  const handleTouchEnd = () => {
    setIsSliding(true);
    if (translateY > window.innerHeight * 0.3) {
      setTranslateY(window.innerHeight);
      setTimeout(onClose, 200);
    } else {
      setTranslateY(0);
    }
  };

  const dynamicStyles = isSliding
    ? {
        transform: `translateX(-50%) translateY(${translateY}px)`,
        transition: "transform 0.2s ease-out",
      }
    : {
        transform: `translateX(-50%) translateY(0)`,
        animation: `${styles.slideUp} 0.2s ease-out forwards`,
      };

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.wrapper} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onClick={(e) => e.stopPropagation()}>
        <div className={styles.container} style={dynamicStyles}>
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("portal") as HTMLElement,
  );
};

export default CommentModalContainer;
