"use client";

import * as styles from "@/app/access-expired/style.css";
import { useRouter } from "next/navigation";
const LogoutButton = () => {
  const router = useRouter();

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <p className={styles.text}>문제가 발생했습니다.</p>
        <button className={styles.button} onClick={() => router.refresh()}>
          새로고침하기
        </button>
      </div>
    </div>
  );
};
export default LogoutButton;
