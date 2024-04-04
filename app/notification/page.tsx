import { NextPage } from "next";
import { HydrationBoundary, QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getNotifications } from "../_api/notifications";
import NotificationArea from "./_components/NotificationArea/NotificationArea";

export const NOTIFICATION_PAGE_SIZE = 20;

const NotificationPage: NextPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => getNotifications({ page: pageParam, size: NOTIFICATION_PAGE_SIZE }),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationArea />
    </HydrationBoundary>
  );
};
export default NotificationPage;
