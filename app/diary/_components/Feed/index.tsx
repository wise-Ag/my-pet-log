"use client";

import Image from "next/image";
import { getImagePath } from "@/app/_utils/getPetImagePath";
import * as styles from "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import "./swiper.css";
import HeartIcon from "@/public/icons/heart-icon.svg";
import HeartFillIcon from "@/public/icons/heart-fill.svg";
import ChatIcon from "@/public/icons/chat-icon.svg";
import { useEffect, useState } from "react";
import { useModal } from "@/app/_hooks/useModal";
import CommentModalContainer from "@/app/diary/_components/CommentModalContainer";
import { getFeedResponse } from "@/app/_types/diary/type";
import NoPetProfileImage from "@/public/images/pet-profile-default.svg?url";
import { postDiaryLike } from "@/app/_api/diary";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NoMedia } from "./NoMedia";

export const Feed = ({ feed }: { feed: getFeedResponse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = feed.content.split("\n");
  const [isLiked, setIsLiked] = useState(feed.isCurrentUserLiked);
  const [likeCount, setLikeCount] = useState(feed.likeCount);
  const firstLine = lines[0];
  const additionalLines = lines.slice(1).join("\n");
  const { isModalOpen, openModalFunc, closeModalFunc } = useModal();
  const queryClient = useQueryClient();

  const getImagePathWithPrefix = (path: string | null) => {
    return path ? `${process.env.NEXT_PUBLIC_IMAGE_PREFIX}${path}` : NoPetProfileImage;
  };

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

  useEffect(() => {
    if (isModalOpen) {
      openModalFunc();
    }
  }, [isModalOpen, openModalFunc]);

  return (
    <>
      <section className={styles.profileInfo}>
        <Image className={styles.profileImage} src={getImagePath(feed.pet.profilePath)} alt="profile image" width={45} height={45} priority />
        <div className={styles.text}>
          {feed.pet.name} · {feed.isCurrentUserLiked ? "구독 중 🐾" : "구독하기"}
        </div>
      </section>
      {feed.medias && feed.medias.length > 0 ? (
        <>
          <Swiper
            className="friend"
            centeredSlides={true}
            pagination={{
              dynamicBullets: true,
              dynamicMainBullets: 3,
            }}
            modules={[Pagination]}
          >
            {feed.medias.map((media) => (
              <SwiperSlide key={media.mediaId}>
                <div className={styles.image}>
                  {media.path.endsWith(".mp4") ? (
                    <video controls className={styles.videoImage}>
                      <source src={`${process.env.NEXT_PUBLIC_IMAGE_PREFIX}${media.path}`} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={getImagePathWithPrefix(media.path)}
                      alt="upload images"
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button onClick={handleLikeClick}>
            {isLiked ? <HeartFillIcon className={`${styles.icon} ${styles.LikeIcon}`} /> : <HeartIcon className={styles.icon} style={{ fill: "var(--Gray33)" }} />}
          </button>
          <ChatIcon className={styles.icon} onClick={openModalFunc} />
          <section className={styles.greatChat}>
            {likeCount > 0 && <div className={styles.greatText}>좋아요 {likeCount}개</div>}
            <div className={styles.nameTitle}>
              {feed.pet.name} <span className={styles.title}>{feed.title}</span>
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
            {feed.commentCount > 0 && (
              <button className={styles.comment} onClick={openModalFunc}>
                댓글 {feed.commentCount}개 모두 보기
              </button>
            )}
            <div className={styles.date}>{feed.createdAt}</div>
          </section>
        </>
      ) : (
        <NoMedia feed={feed} />
      )}
      {isModalOpen && <CommentModalContainer onClose={closeModalFunc} petId={feed.pet.id} diaryId={feed.diaryId} />}
    </>
  );
};
