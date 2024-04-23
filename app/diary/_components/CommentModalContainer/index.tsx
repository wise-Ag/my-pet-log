import ReactDOM from "react-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import * as styles from "./style.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/close.svg?url";
import { getComments, postComment } from "@/app/_api/diary";
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";
import { COMMENT_PAGE_SIZE } from "@/app/diary/(diary)/constant";
import { Comment } from "@/app/diary/_components/Feed/Comment";
import SendIcon from "@/public/icons/send.svg?url";
import { getImagePath } from "@/app/_utils/getPersonImagePath";
import { showToast } from "@/app/_components/Toast";
import { CommentType, GetCommentsResponse } from "@/app/_types/diary/type";
import { UserType } from "@/app/_types/user/types";
import { getMe } from "@/app/_api/users";
import { NoComments } from "@/app/diary/_components/CommentModalContainer/EmptyComment";
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
  const [commentValue, setCommentValue] = useState("");
  const queryClient = useQueryClient();

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

  //댓글 생성
  const postCommentMutation = useMutation({
    mutationFn: () => postComment({ petId, diaryId, content: commentValue }),
    onSuccess: (data: CommentType) => {
      const newComments = queryClient.getQueryData<InfiniteData<GetCommentsResponse>>(["comments", { petId, diaryId }]);
      if (!newComments) return;
      newComments?.pages[0]?.content.unshift(data);
      queryClient.setQueryData(["comments", { petId, diaryId }], newComments);
      setCommentValue("");

      showToast("댓글을 생성했습니다.", true);
    },
    onError: () => {
      showToast("댓글 생성에 실패했습니다.", false);
    },
  });

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

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.target.value);
  };

  const handlePostComment = () => {
    if (commentValue.trim() == "") return;
    postCommentMutation.mutate();
  };

  const onCommentEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePostComment();
    }
  };

  const { data: user } = useQuery<UserType>({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

  useEffect(() => {
    setTargetActive((prev) => !prev);
  }, [comments, setTargetActive]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const dynamicStyles = isSliding
    ? {
        transform: `translateX(-50%) translateY(${translateY}px)`,
        transition: "transform 0.2s ease-out",
      }
    : {
        transform: `translateX(-50%) translateY(0)`,
        animation: `${styles.slideUp} 0.2s ease-out forwards`,
      };

  const noComments = comments?.pages.every((page) => page?.content.length === 0);
  if (!user) return;

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
        <div style={{ marginBottom: "8.25rem" }}>
          {noComments ? (
            <NoComments />
          ) : (
            comments?.pages.map((page, pageNum) =>
              page?.content.map((comment, contentNum) => (
                <Comment comment={comment} diaryId={diaryId} pageNum={pageNum} contentNum={contentNum} petId={petId} commentId={comment.commentId} key={comment.commentId} />
              )),
            )
          )}
          <div ref={targetRef} style={{ height: "1px", opacity: 0, pointerEvents: "none" }}></div>
        </div>
      </div>
      <div className={styles.commentInputContainer}>
        <Image className={styles.profileImage} src={getImagePath(user.profilePath)} alt="유저 프로필 사진" width={30} height={30} />
        <div style={{ width: "100%", position: "relative" }}>
          <textarea placeholder="댓글을 남겨주세요" className={styles.commentInput} onChange={handleCommentChange} value={commentValue} onKeyDown={onCommentEnterPress} />
          <Image src={SendIcon} alt="send icon" width={20} height={20} className={styles.sendIcon} onClick={handlePostComment} />
        </div>
      </div>
    </div>,
    document.getElementById("portal") as HTMLElement,
  );
};

export default CommentModalContainer;
