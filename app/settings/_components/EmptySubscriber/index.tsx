import Image from "next/image";
import empty from "@/public/icons/empty-blocked-user-icon.svg?url";
import Link from "next/link";

import { button, container, title, description, icon } from "./style.css";

const EmptySubscriber = () => {
  return (
    <>
      <section className={container}>
        <Image className={icon} src={empty} alt="letter" width={200} height={193.3} />
        <p className={title}>앗! 비어있어요</p>
        <p className={description}>{`마이펫의 구독자가 없어요.\n육아일기를 작성하며 새로운 구독자를 기다려볼까요?`}</p>
        <Link className={button} href="/diary/my-pet">
          육아일기 작성하기
        </Link>
      </section>
    </>
  );
};

export default EmptySubscriber;
