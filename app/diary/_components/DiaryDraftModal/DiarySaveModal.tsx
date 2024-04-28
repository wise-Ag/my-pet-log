"use client";
import * as styles from "@/app/_components/Modal/style.css";
import ModalContainer from "@/app/_components/ModalContainer";
import CloseIcon from "@/public/icons/close.svg?url";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { container, text, title } from "./style.css";
import { useAtom } from "jotai";
import { saveDiaryDraftAtom } from "@/app/_states/atom";

const DiarySaveModal = ({ closeModalFunc }: { closeModalFunc: () => void }) => {
  const router = useRouter();
  const [, setSaveDiaryDraft] = useAtom(saveDiaryDraftAtom);
  return (
    <>
      <ModalContainer>
        <section className={`${styles.container} ${container}`}>
          <div className={styles.iconWrapper}>
            <Image className={styles.closebutton} src={CloseIcon} alt="close icon" width={24} height={24} onClick={closeModalFunc} />
          </div>
          <div className={title}>작성하기를 나가시겠습니까?</div>
          <p className={text}>
            임시저장을 하면
            <br />
            다음에 이어서 작성할 수 있습니다.
          </p>
          <button className={styles.button} onClick={() => setSaveDiaryDraft(true)}>
            임시저장
          </button>
          <button className={styles.button} onClick={closeModalFunc}>
            계속 작성
          </button>
          <button className={styles.button} onClick={() => router.back()}>
            나가기
          </button>
        </section>
      </ModalContainer>
    </>
  );
};

export default DiarySaveModal;
