"use Client";
import { useRouter } from "next/navigation";
import SignButton from ".";
import { Oauth } from "@/app/_constants/oauth";

const GoogleButton = () => {
  const router = useRouter();
  const onClick = () => {
    router.push(Oauth.google);
  };
  return (
    <div>
      <SignButton type="google" action="시작하기" onClick={onClick} />
    </div>
  );
};

export default GoogleButton;
