"use client";

import { getNotifications } from "@/app/_api/notifications";

import { NOTIFICATION_PAGE_SIZE } from "../../page";
import HasNotification from "../HasNotification/HasNotification";
import NoNotification from "../NoNotification/NoNotification";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";

const NotificationArea = () => {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => getNotifications({ page: 0, size: NOTIFICATION_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => (lastPage?.last ? undefined : lastPageParam + 1),
  });

  // const { targetRef, setTargetActive } = useInfiniteScroll({ callbackFunc: fetchNextPage });
  return data ? <HasNotification list={data.pages?.[0]?.content ?? []} /> : <NoNotification />;
};

export default NotificationArea;
