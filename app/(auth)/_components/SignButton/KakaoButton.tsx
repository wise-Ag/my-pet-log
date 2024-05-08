"use Client";
import SignButton from ".";
import { useRouter } from "next/navigation";
import { Oauth } from "@/app/_constants/oauth";

const KakaoButton = () => {
  const router = useRouter();

  const onClick = async () => {
    router.push(Oauth.kakao);
  };
  return (
    <div>
      <SignButton type="kakao" action="시작하기" onClick={onClick} />
    </div>
  );
};

export default KakaoButton;
