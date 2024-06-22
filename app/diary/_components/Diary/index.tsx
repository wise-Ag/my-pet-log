"use client";
import { Diary as DiaryType, GetDiaryListResponse } from "@/app/_types/diary/type";
import { getImagePath } from "@/app/_utils/getPetImagePath";
import LockIconURL from "@/public/icons/lock.svg?url";
import CommentIconURL from "@/public/icons/message.svg?url";
import Image from "next/image";
import Link from "next/link";
import * as styles from "./style.css";

export const Diary = ({ diary }: { diary: DiaryType }) => {
  return (
    <Link href={`/diary/detail/${diary.diaryId}`}>
      <div className={styles.diaryWrapper}>
        <div className={styles.contents}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className={styles.writer}>{diary.writer.nickname}</div>
            <Image src={CommentIconURL} alt="comment icon" width={14} height={14} />
            <p style={{ color: "#ACACAC", marginLeft: "0.2rem", marginRight: "0.5rem" }}>{diary.commentCount}</p>
            {diary.isPublic || <Image src={LockIconURL} alt="lock icon" width={14} height={14} />}
          </div>
          <div>
            <h3 className={styles.title}>{diary.title}</h3>
            <p className={styles.description}>{diary.content}</p>
          </div>
        </div>
        {diary.thumbnailPath ? (
          <div className={styles.diaryImage} style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_IMAGE_PREFIX}${diary.thumbnailPath})` }} />
        ) : (
          <div className={styles.loadingThumbnail} />
        )}
      </div>
    </Link>
  );
};

export const Diaries = ({ data, prevData }: { data: GetDiaryListResponse["content"]; prevData: GetDiaryListResponse["content"] | null }) => {
  if (!data) return;
  return (
    <>
      {data.map((v: any) => {
        return (
          <div className={styles.diaryListWrapper} key={v.date}>
            {prevData === null && <p className={styles.date}>{v.date}</p>}
            {prevData !== null && prevData[prevData?.length - 1].date !== v.date && <p className={styles.date}>{v.date}</p>}
            {v.diaries.map((diary: DiaryType) => {
              return <Diary diary={diary} key={diary.diaryId} />;
            })}
          </div>
        );
      })}
    </>
  );
};
