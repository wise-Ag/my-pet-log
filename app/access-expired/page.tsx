import LogoutButton from "@/app/access-expired/logout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as styles from "./style.css";

const deleteExpiredCookie = async () => {
  "use server";
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
  cookies().delete("petId");
  cookies().delete("expire");

  redirect("/login");
};

const AccessExpiredPage = () => {
  return (
    <>
      <div className={styles.root}>
        <LogoutButton deleteExpiredCookie={deleteExpiredCookie} />
      </div>
    </>
  );
};
export default AccessExpiredPage;
