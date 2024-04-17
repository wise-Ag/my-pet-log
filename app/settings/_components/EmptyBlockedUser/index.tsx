import Image from "next/image";
import empty from "@/public/icons/empty-blocked-user-icon.svg?url";

import { container, title, description, icon } from "./style.css";

const EmptyBlockedUser = () => {
  return (
    <>
      <section className={container}>
        <Image className={icon} src={empty} alt="letter" width={200} height={193.3} />
        <p className={title}>앗! 비어있어요</p>
        <p className={description}>{`차단한 유저 목록이 없어요.`}</p>
      </section>
    </>
  );
};

export default EmptyBlockedUser;
