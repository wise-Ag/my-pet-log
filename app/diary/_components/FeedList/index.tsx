"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "@/app/_api/diary";
import { FEED_PAGE_SIZE } from "../../(diary)/constant";
import { getFeedResponse } from "@/app/_types/diary/type";
import { Feed } from "../Feed";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";

const FeedList = () => {
  const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => getFeed({ page: pageParam, size: FEED_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => (lastPage?.last ? undefined : lastPageParam + 1),
  });

  const fetchMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const { targetRef } = useInfiniteScroll({
    callbackFunc: fetchMore,
  });

  const feedsPages = data?.pages ?? [];

  return (
    <>
      {feedsPages?.map((feeds, pageIndex) => feeds.map((feed: getFeedResponse, feedIndex: number) => <Feed key={`${pageIndex}-${feedIndex}`} feed={feed} />))}
      <div ref={targetRef} />
    </>
  );
};

export default FeedList;
