"use client";

import * as styles from "./style.css";
const LogoutButton = ({ deleteExpiredCookie }: { deleteExpiredCookie: () => void }) => {
  const handleLogout = () => {
    deleteExpiredCookie();
  };

  return (
    <div className={styles.modal}>
      <p className={styles.text}>
        인증이 만료되어 로그아웃 되었습니다.
        <br />
        로그인 화면으로 이동합니다.
      </p>
      <button className={styles.button} onClick={handleLogout}>
        로그인 하러가기
      </button>
    </div>
  );
};
export default LogoutButton;
