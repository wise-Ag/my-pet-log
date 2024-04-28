"use client";
import ModalContainer from "@/app/_components/ModalContainer";
import CloseIcon from "@/public/icons/close.svg?url";
import Image from "next/image";
import * as styles from "@/app/_components/Modal/style.css";
import { text, container, title } from "./style.css";
import { useState } from "react";
import { useAtom } from "jotai";
import { loadDiaryDraftAtom } from "@/app/_states/atom";
import { deleteDiaryDraft } from "@/app/_api/diary";

const DiaryLoadModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [, setLoadDiaryDraft] = useAtom(loadDiaryDraftAtom);
  return (
    <>
      {isOpen && (
        <ModalContainer>
          <section className={`${styles.container} ${container}`}>
            <div className={styles.iconWrapper}>
              <Image className={styles.closebutton} src={CloseIcon} alt="close icon" width={24} height={24} onClick={() => setIsOpen(false)} />
            </div>
            <div className={title}>임시저장 불러오기</div>
            <p className={text}>임시저장한 글이 있습니다.</p>
            <button
              className={styles.button}
              onClick={() => {
                setLoadDiaryDraft(true);
                setIsOpen(false);
              }}
            >
              이이서 작성
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setIsOpen(false);
                deleteDiaryDraft();
              }}
            >
              새로 작성
            </button>
          </section>
        </ModalContainer>
      )}
    </>
  );
};

export default DiaryLoadModal;
