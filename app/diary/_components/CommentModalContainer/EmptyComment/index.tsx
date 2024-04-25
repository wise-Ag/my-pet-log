import React from "react";
import * as styles from "./style.css";

export const NoComments = () => (
  <div className={styles.noCommentsContainer}>
    <p>아직 댓글이 없습니다.</p>
    <p className={styles.commentPrompt}>댓글을 남겨주세요.</p>
  </div>
);
