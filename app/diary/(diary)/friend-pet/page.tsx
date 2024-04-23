"use server";

import { getFeed } from "@/app/_api/diary";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { FEED_PAGE_SIZE } from "@/app/diary/(diary)/constant";
import { container, root } from "./style.css";
import dynamic from "next/dynamic";

const FeedList = dynamic(() => import("@/app/diary/_components/FeedList"), {
  ssr: false,
});

const FeedPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => getFeed({ page: pageParam, size: FEED_PAGE_SIZE }),
    initialPageParam: 0,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className={root}>
      <HydrationBoundary state={dehydratedState}>
        <div className={container}>
          <FeedList />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default FeedPage;
