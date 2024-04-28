"use client";
import * as styles from "@/app/_components/BackHeader/style.css";
import { useModal } from "@/app/_hooks/useModal";
import DiarySaveModal from "@/app/diary/_components/DiaryDraftModal/DiarySaveModal";
import BackIcon from "@/public/icons/chevron-left.svg?url";
import Image from "next/image";

const BackHeader = () => {
  const { isModalOpen, openModalFunc, closeModalFunc } = useModal();
  return (
    <>
      <header className={styles.header} style={{ top: "0" }}>
        <h1 className={styles.title}>육아일기 글작성</h1>
        <div className={styles.backIcon} onClick={openModalFunc}>
          <Image src={BackIcon} alt="backward icon" width={25} height={25} />
        </div>
      </header>
      {isModalOpen && <DiarySaveModal closeModalFunc={closeModalFunc} />}
    </>
  );
};
export default BackHeader;
