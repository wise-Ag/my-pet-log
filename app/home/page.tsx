"use client";

import * as styles from "./page.css";
import HomePetProfile from "@/app/home/_components/HomePetProfile/HomePetProfile";
import HomeHealthLogPreview from "@/app/home/_components/HomeHealthLogPreview/HomeHealthLogPreview";
import { NextPage } from "next";
import { UserType } from "@/app/_types/users/types";
import { getMe } from "@/app/_api/users";
import { redirect } from "next/navigation";
import { getPets } from "@/app/_api/pets";
import { PetsType } from "@/app/_types/petGroup/types";
import { HydrationBoundary, QueryClient, dehydrate, useQuery } from "@tanstack/react-query";

const HomePage: NextPage = () => {
  const queryClient = new QueryClient();

  const { data: user } = useQuery<UserType>({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

  const { data: pets } = useQuery<PetsType>({
    queryKey: ["pets"],
    queryFn: () => getPets(),
  });

  /**
   * @type {dropdownMenuItemType} 대표 동물
   */
  const currentPetGroup = pets?.data.find((petGroup) => petGroup.repStatus === "REPRESENTATIVE") ?? null;

  // 통신 완료 후 유저 프로필이 없을 경우
  if (user && !user.nickname) return redirect("/create-user-profile");
  // 통신 완료 후 동물이 하나도 없을 경우
  if (pets && pets.data.length === 0) return redirect("/no-pet-group");
  // 통신 완료 후 메인 동물이 없을 경우
  if (!currentPetGroup) return redirect("/home-select");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={styles.container}>
        <HomePetProfile />
        <HomeHealthLogPreview petId={Number(currentPetGroup)} />
      </main>
    </HydrationBoundary>
  );
};
export default HomePage;
