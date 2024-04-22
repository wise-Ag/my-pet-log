"use client";

import * as styles from "./style.css";
import BackIcon from "@/public/icons/chevron-left.svg?url";
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

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={styles.container} data-closing={isClosing ? "true" : "false"}>
      <header className={styles.header}>
        <h1 className={styles.title}>좋아요</h1>
        <div className={styles.backIcon} onClick={handleClose}>
          <Image src={BackIcon} alt="backward icon" width={25} height={25} />
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
  );
};
