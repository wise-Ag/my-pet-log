"use client";

import * as styles from "./HasNotification.css";
import Image from "next/image";
import scrollUpIcon from "@/public/icons/arrow-up.svg?url";
import Modal from "@/app/_components/Modal";
import { useModal } from "@/app/_hooks/useModal";
import Notification from "../Notification/Notification";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotifications, getNotifications, postNotifications } from "@/app/_api/notifications";
import { useEffect } from "react";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";
import { NOTIFICATION_PAGE_SIZE } from "../../_constants/constants";
import NoNotification from "../NoNotification/NoNotification";

const HasNotification = () => {
  const { isModalOpen, openModalFunc, closeModalFunc } = useModal();

  const queryClient = useQueryClient();

  const postNotificationsMutation = useMutation({
    mutationFn: () => postNotifications(),
  });

  const deleteNotificationsMutation = useMutation({
    // mutationKey: ["deleteNotificationsMutationKey"],
    mutationFn: () => deleteNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      closeModalFunc();
    },
  });

  const {
    data: notificationsResponse,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => getNotifications({ page: pageParam, size: NOTIFICATION_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => (lastPage?.last ? undefined : lastPageParam + 1),
  });

  const notificationList = notificationsResponse?.pages?.flatMap((item) => item?.content ?? []) ?? [];
  const newList = notificationList.filter((item) => !item.checked) ?? [];
  const pastList = notificationList.filter((item) => item.checked) ?? [];

  const { targetRef } = useInfiniteScroll({
    callbackFunc: () => {
      if (hasNextPage) {
        fetchNextPage();
      }
    },
  });

  useEffect(() => {
    postNotificationsMutation.mutate();
    /**
     * TODO
     * 페이지 진입 시 1회만 실행되도록 성능 최적화
     */
  }, []);

  return notificationList.length > 0 ? (
    <section className={styles.notificationPageContainer}>
      <div className={styles.notificationScrollArea}>
        <div className={styles.notificationContainer}>
          <div className={styles.newNotificationTitleArea}>
            <h2 className={styles.title}>새 알림</h2>
            <button className={styles.deleteButton} onClick={openModalFunc}>
              전체 삭제
            </button>
          </div>
          {newList.length > 0 ? (
            <ul className={styles.newNotificationList}>
              {newList.map((item) => (
                <Notification key={item.id} type={"new"} item={item} />
              ))}
            </ul>
          ) : (
            <p className={styles.noNewNotification}>새 알림이 없습니다.</p>
          )}
        </div>

        {pastList.length > 0 && (
          <div className={styles.notificationContainer}>
            <h2 className={styles.title}>이전 알림</h2>
            <ul className={styles.pastNotificationList}>
              {pastList.map((item) => (
                <Notification key={item.id} type={"past"} item={item} />
              ))}
            </ul>
          </div>
        )}

        <p className={styles.days}>최근 30일 동안의 알림만 확인할 수 있습니다.</p>
        <button
          className={styles.scrollButton}
          onClick={() =>
            window.scroll({
              top: 0,
              left: 0,
              behavior: "smooth",
            })
          }
        >
          <Image src={scrollUpIcon} alt="스크롤 버튼 화살표 아이콘" width={19} height={19} />
        </button>
        {isModalOpen && (
          <Modal
            text="이전 알림을 모두 삭제하시겠습니까?"
            buttonText="확인"
            onClick={() => {
              deleteNotificationsMutation.mutate();
            }}
            onClose={closeModalFunc}
          />
        )}
      </div>

      <div ref={targetRef} />
    </section>
  ) : (
    <NoNotification />
  );
};

export default HasNotification;
