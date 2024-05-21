import loadingSpinner from "@/public/animation/loading-spinner-lg.json";
import * as styles from "./style.css";
import { Player } from "@lottiefiles/react-lottie-player";

//페이지 전체를 덮는 로딩 컴포넌트
const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <Player style={{ width: "20rem", height: "20rem" }} loop={true} src={loadingSpinner} autoplay={true} />
    </div>
  );
};

export default Loading;
