"use Client";
import { signIn, useSession } from "next-auth/react";
import SignButton from ".";

const KakaoButton = () => {
  const { data: session } = useSession();

  console.log("카카오버튼안누름");

  const onClick = async () => {
    console.log("카카오버튼눌렀니?");
    if (!session) {
      await signIn("kakao", { redirect: true, callbackUrl: "/loginflow" });
    }
  };

  console.log("카카오session:", session);

  return (
    <div>
      <SignButton type="kakao" action="시작하기" onClick={onClick} />
    </div>
  );
};

export default KakaoButton;
