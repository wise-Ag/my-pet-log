import Image from "next/image";
import * as styles from "./Notification.css";

const Notification = ({ type, item }: { type: "new" | "past"; item: any }) => {
  return (
    <li className={type === "new" ? styles.containerBasic : styles.containerPast}>
      <div className={type === "new" ? styles.thumbnailWrapperNew : styles.thumbnailWrapperBasic}>
        <Image className={styles.thumbnail} src={`${process.env.NEXT_PUBLIC_IMAGE_PREFIX}${item.thumbnailPath}`} alt="썸네일 이미지" fill={true} />
      </div>
      <p className={styles.type}>{item.type}</p>
      <p className={styles.createdAt}>{item.createdAt}</p>
      <p className={styles.message}>{item.message}</p>
    </li>
  );
};

export default Notification;
