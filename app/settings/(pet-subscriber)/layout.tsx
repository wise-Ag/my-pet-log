"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import * as styles from "./layout.css";
import TitleHeader from "@/app/_components/TitleHeader";
import { useQuery } from "@tanstack/react-query";
import { SubscriberListType } from "@/app/_types/subscriptions/types";
import { getSubscriberList } from "@/app/_api/subscription";
import { useCookies } from "react-cookie";

export default function PetSubscriberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cookies] = useCookies(["petId"]);

  const petId = Number(cookies.petId);
  //모든 구독자 목록
  const { data: accountsData } = useQuery<SubscriberListType[]>({ queryKey: ["petSubscriber", petId], queryFn: () => getSubscriberList(petId) });

  //차단한 유저 목록
  const blockedUserData = accountsData?.filter((member) => member.isBlocked) || [];

  //구독자 목록
  const subscriberlength = accountsData ? (accountsData.length === 1 ? 0 : accountsData.length - (blockedUserData?.length || 0)) : 0;

  return (
    <section>
      <nav>
        <TitleHeader title="구독자 관리" />
        <ul className={styles.navList}>
          <li className={`${pathname === "/settings/subscriber" ? styles.active : styles.noActive}`}>
            <Link href="/settings/subscriber" replace>
              {`구독자 목록  (${subscriberlength})`}
            </Link>
          </li>
          <li className={`${pathname === "/settings/blocked-user" ? styles.active : styles.noActive}`}>
            <Link href="/settings/blocked-user" replace>
              {`차단한 유저 목록  (${blockedUserData ? blockedUserData.length : 0})`}
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </section>
  );
}
