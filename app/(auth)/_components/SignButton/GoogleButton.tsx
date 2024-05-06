import { signIn, useSession } from "next-auth/react"; // signOut import 삭제
import SignButton from ".";

const GoogleButton = () => {
  const { data: session } = useSession();

  console.log("구글버튼안누름");

  const onClick = () => {
    console.log("구글버튼눌렀니?");
    if (!session) {
      signIn("google", { redirect: true, callbackUrl: "/loginflow" });
    }
  };

  console.log("구글session:", session);

  return (
    <div>
      <SignButton type="google" action="시작하기" onClick={onClick} />
    </div>
  );
};

export default GoogleButton;
