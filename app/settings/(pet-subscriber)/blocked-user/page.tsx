"use server";

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import BlockedUserList from "@/app/settings/_components/Blocked-User-List";
import { getSubscriberList } from "@/app/_api/subscription";
import { cookies } from "next/headers";

const Page = async () => {
  const queryClient = new QueryClient();
  const petId = Number(cookies().get("petId")?.value);
  await queryClient.prefetchQuery({ queryKey: ["petSubscriber", petId], queryFn: () => getSubscriberList(petId) });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BlockedUserList petId={petId} />
    </HydrationBoundary>
  );
};

export default Page;
