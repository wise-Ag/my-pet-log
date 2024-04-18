import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import * as styles from "./style.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/close.svg?url";
import { getComments } from "@/app/_api/diary";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";
import { COMMENT_PAGE_SIZE } from "@/app/diary/(diary)/constant";
import { Comment } from "@/app/diary/_components/Feed/Comment";
interface CommentModalContainerProps {
  petId: number;
  diaryId: number;
  onClose: () => void;
}
const CommentModalContainer = ({ petId, onClose, diaryId }: CommentModalContainerProps) => {
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  //댓글 조회
  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["comments", { petId, diaryId }],
    queryFn: ({ pageParam }) => getComments({ petId, diaryId, page: pageParam, size: COMMENT_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => (lastPage?.last ? undefined : lastPageParam + 1),
  });

  const { targetRef, setTargetActive } = useInfiniteScroll({ callbackFunc: fetchNextPage });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const isTop = e.currentTarget.scrollTop === 0;
    setIsAtTop(isTop);
    setIsScrolling(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isAtTop && !isScrolling) {
      setStartY(e.touches[0].clientY);
      setIsSliding(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isAtTop || isScrolling) return;

    const touchY = e.touches[0].clientY;
    const movement = touchY - startY;

    if (movement < 0) {
      setTranslateY(0);
    } else {
      setTranslateY(movement);
    }
  };

  const closeSmoothly = () => {
    const animationDuration = 200;
    setTranslateY(window.innerHeight);
    setTimeout(() => {
      onClose();
    }, animationDuration);
  };

  const handleTouchEnd = () => {
    setIsSliding(true);
    setIsScrolling(false);
    if (translateY > window.innerHeight * 0.3 && isAtTop && !isScrolling) {
      closeSmoothly();
    } else {
      setTranslateY(0);
    }
  };

  const handleTouchCancel = () => {
    setIsScrolling(false);
  };

  useEffect(() => {
    setTargetActive((prev) => !prev);
  }, [comments, setTargetActive]);

  const dynamicStyles = isSliding
    ? {
        transform: `translateX(-50%) translateY(${translateY}px)`,
        transition: "transform 0.2s ease-out",
      }
    : {
        transform: `translateX(-50%) translateY(0)`,
        animation: `${styles.slideUp} 0.2s ease-out forwards`,
      };

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div
        className={styles.container}
        style={dynamicStyles}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        <header className={styles.header}>
          <div className={styles.commentTitle}>댓글</div>
          <Image src={CloseIcon} alt="close icon" width={24} height={24} onClick={closeSmoothly} style={{ cursor: "pointer" }} />
        </header>
        {comments?.pages.map((page, pageNum) =>
          page?.content.map((comment, contentNum) => (
            <Comment comment={comment} diaryId={diaryId} pageNum={pageNum} contentNum={contentNum} petId={petId} commentId={comment.commentId} key={comment.commentId} />
          )),
        )}
        <div ref={targetRef} style={{ height: "1px", opacity: 0, pointerEvents: "none" }}></div>
      </div>
    </div>,
    document.getElementById("portal") as HTMLElement,
  );
};

export default CommentModalContainer;
