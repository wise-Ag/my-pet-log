"use server";

import * as styles from "./page.css";
import HomePetProfile from "@/app/home/_components/HomePetProfile/HomePetProfile";
import HomeHealthLogPreview from "@/app/home/_components/HomeHealthLogPreview/HomeHealthLogPreview";
import { NextPage } from "next";
import { UserType } from "@/app/_types/users/types";
import { getMe } from "@/app/_api/users";
import { redirect } from "next/navigation";
import { getPets } from "@/app/_api/pets";
import { PetsType } from "@/app/_types/petGroup/types";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

const HomePage: NextPage = async () => {
  const queryClient = new QueryClient();
  const user = await queryClient.fetchQuery<UserType>({ queryKey: ["me"], queryFn: () => getMe() });
  const pets = await queryClient.fetchQuery<PetsType>({ queryKey: ["pets"], queryFn: () => getPets() });
  if (!user || !pets) return redirect("/error");

  // 유저 프로필이 없을 경우
  if (!user.nickname) redirect("/create-user-profile");

  // 동물이 하나도 없을 경우
  if (pets.count === 0) redirect("/no-pet-group");

  const currentPetGroupId = pets?.data?.find((petGroup: any) => petGroup.repStatus === "REPRESENTATIVE")?.petId ?? null;
  // 대표 동물이 없을 경우
  if (!currentPetGroupId) redirect("/home-select");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={styles.container}>
        <HomePetProfile />
        <HomeHealthLogPreview petId={Number(currentPetGroupId)} />
      </main>
    </HydrationBoundary>
  );
};
export default HomePage;
