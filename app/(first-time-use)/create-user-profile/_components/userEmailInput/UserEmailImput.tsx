"use client";

import * as styles from "../../page.css";

import { UserType } from "@/app/_types/user/types";
import { getMe } from "@/app/_api/users";
import { useQuery } from "@tanstack/react-query";

export const UserEmailInput = () => {
  const { data: user } = useQuery<UserType>({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

  return <input className={styles.idInput} type="text" placeholder={user?.email} readOnly />;
};
