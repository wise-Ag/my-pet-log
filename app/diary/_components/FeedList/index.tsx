"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "@/app/_api/diary";
import { FEED_PAGE_SIZE } from "../../(diary)/constant";
import { getFeedResponse } from "@/app/_types/diary/type";
import { Feed } from "../Feed";

const FeedList = () => {
  const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => getFeed({ page: pageParam, size: FEED_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => (lastPage?.last ? undefined : lastPageParam + 1),
  });

  const handleFetchNextPage = () => {
    fetchNextPage();
  };

  const feedsPages = data?.pages ?? [];

  return (
    <>
      {feedsPages.map((feeds) => feeds.map((feed: getFeedResponse) => <Feed key={feed.diaryId} feed={feed} />))}
      {!isLoading && hasNextPage && <button onClick={handleFetchNextPage}>더 불러오기</button>}
    </>
  );
};

export default FeedList;
