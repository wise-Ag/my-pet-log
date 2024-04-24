import { NextPage } from "next";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getNotifications } from "@/app/_api/notifications";
import { NOTIFICATION_PAGE_SIZE } from "./_constants/constants";
import HasNotification from "./_components/HasNotification/HasNotification";
import NoNotification from "./_components/NoNotification/NoNotification";

const NotificationPage: NextPage = async () => {
  const queryClient = new QueryClient();

  const data = await queryClient.fetchInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => getNotifications({ page: pageParam, size: NOTIFICATION_PAGE_SIZE }),
    initialPageParam: 0,
  });

  const notificationList = data?.pages?.[0]?.content ?? [];

  return notificationList.length > 0 ? (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HasNotification />
    </HydrationBoundary>
  ) : (
    <NoNotification />
  );
};
export default NotificationPage;
