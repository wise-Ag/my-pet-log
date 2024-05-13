"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import * as styles from "@/app/settings/(account)/layout.css";
import TitleHeader from "@/app/_components/TitleHeader";
import { getMe } from "@/app/_api/users";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "@/app/_types/user/types";
import { showToast } from "@/app/_components/Toast";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: user } = useQuery<UserType>({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

  const isEmailLogin = user?.loginType === "EMAIL";

  const handleUnauthorized = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    showToast("이메일로 가입한 회원만 접근할 수 있습니다.", false);
  };

  return (
    <section>
      <nav>
        <TitleHeader title="나의 프로필" />
        <ul className={styles.navList}>
          <li className={`${pathname === "/settings/profile" ? styles.active : styles.noActive}`}>
            <Link href="/settings/profile" replace>
              프로필 설정
            </Link>
          </li>
          <li className={`${isEmailLogin && pathname === "/settings/password" ? styles.active : styles.noActive}`}>
            {isEmailLogin ? (
              <Link href="/settings/password" replace>
                <a>비밀번호 변경</a>
              </Link>
            ) : (
              <Link href="#" onClick={handleUnauthorized}>
                비밀번호 변경
              </Link>
            )}
          </li>
        </ul>
      </nav>
      {children}
    </section>
  );
}
