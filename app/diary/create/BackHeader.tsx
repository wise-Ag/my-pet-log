"use client";
import * as styles from "@/app/_components/BackHeader/style.css";
import { useModal } from "@/app/_hooks/useModal";
import { diaryDataAtom } from "@/app/_states/atom";
import DiarySaveModal from "@/app/diary/_components/DiaryDraftModal/DiarySaveModal";
import BackIcon from "@/public/icons/chevron-left.svg?url";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BackHeader = () => {
  const { isModalOpen, openModalFunc, closeModalFunc } = useModal();
  const [diaryData] = useAtom(diaryDataAtom);
  const router = useRouter();
  return (
    <>
      <header className={styles.header} style={{ top: "0" }}>
        <h1 className={styles.title}>육아일기 글작성</h1>
        <div
          className={styles.backIcon}
          onClick={() => {
            diaryData.title && diaryData.content ? openModalFunc() : router.back();
          }}
        >
          <Image src={BackIcon} alt="backward icon" width={25} height={25} />
        </div>
      </header>
      {isModalOpen && <DiarySaveModal closeModalFunc={closeModalFunc} />}
    </>
  );
};
export default BackHeader;
