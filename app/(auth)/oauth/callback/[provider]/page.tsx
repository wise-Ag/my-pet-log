"use client";

import { postSocial } from "@/app/_api/auth";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function OAuth() {
  const pathname = usePathname();
  const provider = pathname.split("/").at(-1);
  const searchParam = useSearchParams();
  const code = searchParam.get("code");

  const router = useRouter();
  const handleOAuth = useCallback(async () => {
    try {
      let email = "";
      if (provider === "kakao") {
        const kakaoToken = await axios.post(
          "https://kauth.kakao.com/oauth/token",
          {
            grant_type: "authorization_code",
            client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET,
            redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI_KAKAO,
            code,
          },
          { headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" } },
        );
        const accessToken = kakaoToken?.data.access_token;
        const emailRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        });
        email = emailRes.data.kakao_account.email;
      }
      const res = (await postSocial({ email })) as any;
      if (res) {
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    handleOAuth();
  }, []);

  return null;
}
