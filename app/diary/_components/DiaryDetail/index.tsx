"use client";

import { deleteDiary, getComments, getDiary, postComment, postDiaryLike } from "@/app/_api/diary";
import { getMe } from "@/app/_api/users";
import Modal from "@/app/_components/Modal";
import { showToast } from "@/app/_components/Toast";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";
import { useModal } from "@/app/_hooks/useModal";
import { CommentType, GetCommentsResponse } from "@/app/_types/diary/type";
import { UserType } from "@/app/_types/users/types";
import { getImagePath } from "@/app/_utils/getPersonImagePath";
import { COMMENT_PAGE_SIZE } from "@/app/diary/(diary)/constant";
import KebabIcon from "@/public/icons/kebab.svg?url";
import LikeIcon from "@/public/icons/like.svg";
import SendIcon from "@/public/icons/send.svg?url";
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Comment from "./Comment";
import * as styles from "./style.css";
import "./swiper.css";

const DiaryDetail = ({ petId, diaryId }: { petId: number; diaryId: number }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const { isModalOpen, openModalFunc, closeModalFunc } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();

  //일기 상세 조회
  const { data: diary } = useQuery({ queryKey: ["diary", { petId, diaryId }], queryFn: () => getDiary({ diaryId }) });

  //일기 삭제
  const deleteDiaryMutation = useMutation({
    mutationFn: () => deleteDiary({ diaryId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries", petId] });
      router.push("/diary");
    },
    onError: () => {
      showToast("일기 삭제에 실패했습니다.", false);
      closeModalFunc();
    },
  });

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
    mutationFn: () => postComment({ diaryId, content: commentValue }),
    onSuccess: (data: CommentType) => {
      const newComments = queryClient.getQueryData<InfiniteData<GetCommentsResponse>>(["comments", { petId, diaryId }]);
      if (!newComments) return;
      newComments?.pages[0]?.content.unshift(data);
      queryClient.setQueryData(["comments", { petId, diaryId }], newComments);
      setCommentValue("");

      showToast("댓글을 생성했습니다.", true);

      if (diary) {
        const newDiaryData = { ...diary };
        newDiaryData.commentCount = diary?.commentCount + 1;
        queryClient.setQueryData(["diary", { petId, diaryId }], newDiaryData);
      }
    },
    onError: () => {
      showToast("댓글 생성에 실패했습니다.", false);
    },
  });

  //일기 좋아요
  const postDiaryLikeMutation = useMutation({
    mutationFn: () => postDiaryLike({ diaryId }),
  });

  const handleDiaryLike = () => {
    postDiaryLikeMutation.mutate();
    if (!diary) return;
    const newDiary = { ...diary };
    newDiary.isCurrentUserLiked = !diary?.isCurrentUserLiked;
    newDiary.likeCount = diary?.isCurrentUserLiked ? diary.likeCount - 1 : diary.likeCount + 1;
    queryClient.setQueryData(["diary", { petId, diaryId }], newDiary);
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.target.value);
  };

  const handlePostComment = () => {
    if (commentValue.trim() == "") return;
    postCommentMutation.mutate();
  };

  const { data: user } = useQuery<UserType>({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });

  const onCommentEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePostComment();
    }
  };

  useEffect(() => {
    setTargetActive((prev) => !prev);
  }, [comments, setTargetActive]);

  if (!diary) return;
  if (!user) return;

  return (
    <>
      <div className={styles.root}>
        <section className={styles.header}>
          <p className={styles.petInfo}>
            {diary.pet.breed} | {diary.pet.age ?? ""}
          </p>
          <h3 className={styles.title}>{diary.title}</h3>
          <p className={styles.date}>{diary.date}</p>
          {diary.writer.isCurrentUser && (
            <div onBlur={() => setIsKebabOpen(false)} tabIndex={1} className={styles.kebab}>
              <Image src={KebabIcon} alt="kebab icon" width={24} height={24} onClick={() => setIsKebabOpen(!isKebabOpen)} />
              {isKebabOpen && (
                <ul className={styles.kebabModal}>
                  <li
                    className={styles.kebabList}
                    onClick={() => {
                      router.push(`/diary/edit/${diary.diaryId}`);
                    }}
                  >
                    수정하기
                  </li>
                  <li
                    className={styles.kebabList}
                    onClick={() => {
                      openModalFunc();
                      setIsKebabOpen(false);
                    }}
                  >
                    삭제하기
                  </li>
                </ul>
              )}
            </div>
          )}
        </section>

        <section className={styles.main}>
          {(diary.images.length > 0 || diary.videos.length > 0) && (
            <>
              <div onClick={() => setIsKebabOpen(false)}>
                <Swiper
                  className="diary"
                  onSlideChange={(e) => setCurrentPage(e.activeIndex)}
                  pagination={{
                    dynamicBullets: true,
                  }}
                  modules={[Pagination]}
                >
                  <div className={styles.swiperFraction}>
                    {currentPage + 1}/{diary.images.length + diary.videos.length}
                  </div>
                  {diary.images.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <div className={styles.image} style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_IMAGE_PREFIX}${image.path})` }}></div>
                    </SwiperSlide>
                  ))}
                  {diary.videos.length > 0 && (
                    <SwiperSlide>
                      <video controls className={styles.image} autoPlay={true} loop={true}>
                        동영상 재생에 실패했습니다.
                        <source src={`${process.env.NEXT_PUBLIC_IMAGE_PREFIX}${diary.videos[0].path}`} type="video/mp4" />
                      </video>
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>
            </>
          )}

          <div className={styles.profile}>
            <div style={{ display: "flex", gap: "0.9rem", alignItems: "center" }}>
              <Image className={styles.profileImage} src={getImagePath(diary.writer.profilePath)} alt="유저 프로필 사진" width={30} height={30} />
              <p style={{ fontSize: "1.4rem", fontWeight: "700" }}>{diary.writer.nickname}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button onClick={handleDiaryLike} className={`${diary.isCurrentUserLiked ? styles.LikeIcon : ""}`}>
                <LikeIcon color={diary.isCurrentUserLiked ? "var(--MainOrange)" : "var(--Gray81)"} style={{ cursor: "pointer" }} />
              </button>
              <p style={{ fontSize: "1.4rem", color: "var(--Gray81)" }}>{diary.likeCount}</p>
            </div>
          </div>
          <pre className={styles.content}>{diary.content}</pre>
        </section>

        <section>
          <div className={styles.commentsCount}>댓글({diary.commentCount})</div>
          <div className={styles.commentsList}>
            {comments?.pages.map((v, pageNum) =>
              v?.content.map((comment, contentNum) => (
                <Comment comment={comment} diaryId={diaryId} pageNum={pageNum} contentNum={contentNum} petId={petId} commentId={comment.commentId} key={comment.commentId} />
              )),
            )}
            {/* 로딩중이 아니고 다음 페이지가 있을 때 무한스크롤됨 */}
            {!isLoading && hasNextPage && <div ref={targetRef} />}
          </div>

          <div className={styles.commentInputContainer}>
            <Image className={styles.profileImage} src={getImagePath(user.profilePath)} alt="유저 프로필 사진" width={30} height={30} />
            <div style={{ width: "100%", position: "relative" }}>
              <textarea placeholder="댓글을 남겨주세요" className={styles.commentInput} onChange={handleCommentChange} value={commentValue} onKeyDown={onCommentEnterPress} />
              <Image src={SendIcon} alt="send icon" width={20} height={20} className={styles.sendIcon} onClick={handlePostComment} />
            </div>
          </div>
        </section>
        {isModalOpen && <Modal text="정말 일기를 삭제하시겠습니까?" buttonText="삭제" onClick={deleteDiaryMutation.mutate} onClose={closeModalFunc} />}
      </div>
    </>
  );
};

export default DiaryDetail;
