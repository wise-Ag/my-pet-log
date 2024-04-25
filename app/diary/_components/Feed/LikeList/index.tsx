"use client";

import * as styles from "./style.css";
import CloseIcon from "@/public/icons/close.svg?url";
import Image from "next/image";
import { getLikeList } from "@/app/_api/diary";
import { useQuery } from "@tanstack/react-query";
import { getImagePath } from "@/app/_utils/getPersonImagePath";
import { GetLikeListResponse } from "@/app/_types/diary/type";
import { useEffect, useState } from "react";

interface LikeListProps {
  diaryId: number;
  onClose: () => void;
}

export const LikeList = ({ diaryId, onClose }: LikeListProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const { data: likelist } = useQuery<GetLikeListResponse[]>({
    queryKey: ["likelist", { diaryId }],
    queryFn: () => getLikeList({ diaryId }),
  });

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500);
  };

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={handleBackgroundClick}>
      <div className={styles.container} data-closing={isClosing ? "true" : "false"} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h1 className={styles.title}>좋아요</h1>
          <div className={styles.closeIcon} onClick={handleClose}>
            <Image src={CloseIcon} alt="close icon" width={24} height={24} />
          </div>
        </header>
        <ul style={{ marginTop: "5.6rem" }}>
          {likelist?.map((user) => (
            <li key={user.id} className={styles.likeEntry}>
              <div className={styles.profileImageWrapper}>
                <Image src={getImagePath(user.profilePath)} alt={`Profile of ${user.nickname}`} width={50} height={50} />
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userId}>{user.id}</div>
                <div className={styles.userNickname}>{user.nickname}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
