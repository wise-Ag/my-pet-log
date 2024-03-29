"use client";

import SubscriptionList from "../_components/SubscriptionList";
import TitleHeader from "@/app/_components/TitleHeader";
import { getSubscribedPet } from "@/app/_api/subscription";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SubscribedPetType } from "@/app/_types/subscriptions/types";

const Page = () => {
  const queryClient = useQueryClient();
  const { data: accountsData } = useQuery<SubscribedPetType[]>({
    queryKey: ["subscribedPet"],
    queryFn: () => getSubscribedPet(),
  });

  return (
    <div>
      <TitleHeader title={`구독중인 펫 계정 (${accountsData ? accountsData.length : 0})`} />
      <SubscriptionList />
    </div>
  );
};

export default Page;
