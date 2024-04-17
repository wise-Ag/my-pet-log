"use client";

import * as styles from "./style.css";
import HeartIcon from "@/public/icons/heart-icon.svg";
import HeartFillIcon from "@/public/icons/heart-fill.svg";
import ChatIcon from "@/public/icons/chat-icon.svg";
import { useState } from "react";
import { useModal } from "@/app/_hooks/useModal";
import CommentModalContainer from "@/app/diary/_components/CommentModalContainer";
import { getFeedResponse } from "@/app/_types/diary/type";
import { postDiaryLike, getComments } from "@/app/_api/diary";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";
import { COMMENT_PAGE_SIZE } from "@/app/diary/(diary)/constant";
import { Comment } from "@/app/diary/_components/Feed/Comment";

export const NoMedia = ({ feed }: { feed: getFeedResponse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = feed.content.split("\n");
  const [isLiked, setIsLiked] = useState(feed.isCurrentUserLiked);
  const [likeCount, setLikeCount] = useState(feed.likeCount);
  const firstLine = lines[0];
  const additionalLines = lines.slice(1).join("\n");
  const { isModalOpen, openModalFunc, closeModalFunc } = useModal();
  const queryClient = useQueryClient();

  //댓글 조회
  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["comments", { petId: feed.pet.id, diaryId: feed.diaryId }],
    queryFn: ({ pageParam }) => getComments({ petId: feed.pet.id, diaryId: feed.diaryId, page: pageParam, size: COMMENT_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => (lastPage?.last ? undefined : lastPageParam + 1),
  });

  const { targetRef, setTargetActive } = useInfiniteScroll({ callbackFunc: fetchNextPage });

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    postDiaryLikeMutation.mutate();
  };

  const postDiaryLikeMutation = useMutation({
    mutationFn: () => postDiaryLike({ diaryId: feed.diaryId }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["feed", feed.diaryId],
      });

      const previousFeed = queryClient.getQueryData<getFeedResponse>(["feed", feed.diaryId]);
      if (previousFeed) {
        queryClient.setQueryData(["feed", feed.diaryId], {
          ...previousFeed,
          isCurrentUserLiked: !previousFeed.isCurrentUserLiked,
          likeCount: previousFeed.isCurrentUserLiked ? previousFeed.likeCount - 1 : previousFeed.likeCount + 1,
        });
      }
      return { previousFeed };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["feed", feed.diaryId], context.previousFeed);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["feed", feed.diaryId],
      });
    },
  });

  return (
    <>
      <section className={styles.greatChat}>
        <div className={styles.nameTitle}>
          <span className={styles.title}>{feed.title}</span>
        </div>
        <section className={styles.description}>
          <span>
            {firstLine}
            {lines.length > 1 && !isExpanded && (
              <span onClick={() => setIsExpanded(true)}>
                ... <button className={styles.seeMore}>더 보기</button>
              </span>
            )}
          </span>
          <div className={`${styles.additionalContent} ${isExpanded ? styles.showAdditionalContent : ""}`}>
            {additionalLines.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </section>
      </section>
      <span onClick={handleLikeClick} style={{ cursor: "pointer" }}>
        {isLiked ? <HeartFillIcon className={`${styles.icon} ${styles.LikeIcon}`} /> : <HeartIcon className={styles.icon} style={{ fill: "var(--Gray33)" }} />}
      </span>
      <ChatIcon className={styles.icon} onClick={openModalFunc} />
      <div className={styles.likeComment}>
        {likeCount > 0 && <div className={styles.greatText}>좋아요 {likeCount}개</div>}
        {feed.commentCount > 0 && (
          <div className={styles.comment} onClick={openModalFunc}>
            댓글 {feed.commentCount}개 모두 보기
          </div>
        )}
      </div>
      <div className={styles.date}>{feed.createdAt}</div>
      {isModalOpen && (
        <CommentModalContainer onClose={closeModalFunc}>
          <div className={styles.commentContainer}>
            <div className={styles.commentTitle}>댓글</div>
            {comments?.pages.map((page, pageNum) =>
              page?.content.map((comment, contentNum) => (
                <Comment
                  comment={comment}
                  diaryId={feed.diaryId}
                  pageNum={pageNum}
                  contentNum={contentNum}
                  petId={feed.pet.id}
                  commentId={comment.commentId}
                  key={comment.commentId}
                />
              )),
            )}
            {!isLoading && hasNextPage && <div ref={targetRef} />}
          </div>
        </CommentModalContainer>
      )}
    </>
  );
};
