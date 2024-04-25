"use client";

import * as styles from "./style.css";
import HeartIcon from "@/public/icons/heart-icon.svg";
import HeartFillIcon from "@/public/icons/heart-fill.svg";
import ChatIcon from "@/public/icons/chat-icon.svg";
import { useState } from "react";
import { useModal } from "@/app/_hooks/useModal";
import CommentModalContainer from "@/app/diary/_components/CommentModalContainer";
import { getFeedResponse } from "@/app/_types/diary/type";
import { postDiaryLike } from "@/app/_api/diary";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LikeList } from "../LikeList";
import { useAtom } from "jotai";
import { commentCountAtom } from "@/app/_states/atom";

export const NoMedia = ({ feed }: { feed: getFeedResponse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = feed.content.split("\n");
  const [isLiked, setIsLiked] = useState(feed.isCurrentUserLiked);
  const [likeCount, setLikeCount] = useState(feed.likeCount);
  const firstLine = lines[0];
  const [commentCounts, setCommentCounts] = useAtom(commentCountAtom);
  const additionalLines = lines.slice(1).join("\n");
  const { isModalOpen: isCommentModalOpen, openModalFunc: openCommentModal, closeModalFunc: closeCommentModal } = useModal();
  const { isModalOpen: isLikeModalOpen, openModalFunc: openLikeModal, closeModalFunc: closeLikeModal } = useModal();
  const queryClient = useQueryClient();

  if (commentCounts[feed.diaryId] === undefined) {
    // 처음 렌더링 시에만 실행
    setCommentCounts((prev) => ({
      ...prev,
      [feed.diaryId]: feed.commentCount,
    }));
  }

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
      queryClient.invalidateQueries({
        queryKey: ["likelist", feed.diaryId],
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
      <ChatIcon className={styles.icon} onClick={openCommentModal} style={{ cursor: "pointer" }} />
      <div className={styles.likeComment}>
        {likeCount > 0 && (
          <button className={styles.greatText} onClick={openLikeModal}>
            좋아요 {likeCount}개
          </button>
        )}
        {commentCounts[feed.diaryId] > 0 && (
          <div className={styles.comment} onClick={openCommentModal}>
            댓글 {commentCounts[feed.diaryId]}개 모두 보기
          </div>
        )}
      </div>
      <div className={styles.date}>{feed.createdAt}</div>
      {isCommentModalOpen && <CommentModalContainer onClose={closeCommentModal} petId={feed.pet.id} diaryId={feed.diaryId} />}
      {isLikeModalOpen && <LikeList onClose={closeLikeModal} diaryId={feed.diaryId} />}
    </>
  );
};
