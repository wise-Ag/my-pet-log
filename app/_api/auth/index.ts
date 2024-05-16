"use server";
import instance from "@/app/_api/axios";
import { cookies } from "next/headers";

interface FormData {
  email: string;
  password: string;
}

interface SocialData {
  email?: string | null;
  loginType?: "KAKAO" | "GOOGLE";
}

export const postLogin = async ({ email, password }: FormData) => {
  try {
    const res = await instance.post("/auth/signin", {
      email,
      password,
    });

    if (res.status === 200) {
      const expiresAt = new Date(Date.now() + (23 * 60 + 59) * 60 * 1000);
      cookies().set("expire", "expire", { expires: expiresAt });
      cookies().set("accessToken", res.data.access_token);
      cookies().set("refreshToken", res.data.refresh_token);
      return "signin success";
    }
  } catch (error: any) {
    console.error(error.response.data.message);
    return null;
  }
};

export const postSocial = async ({ email, loginType }: SocialData) => {
  try {
    const res = await instance.post("/auth/login/social", {
      email,
      loginType,
    });

    if (res.status === 200) {
      const expiresAt = new Date(Date.now() + (23 * 60 + 59) * 60 * 1000);
      cookies().set("expire", "expire", { expires: expiresAt });
      cookies().set("accessToken", res.data.access_token);
      cookies().set("refreshToken", res.data.refresh_token);
      return "signin success";
    }
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const postLogout = async () => {
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const res = await instance.post(
      "/auth/logout",
      {},
      {
        headers: {
          accessToken: accessToken,
        },
      },
    );

    if (res.status === 204) {
      cookies().delete("accessToken");
      cookies().delete("refreshToken");
      cookies().delete("petId");
      cookies().delete("expire");
      return true;
    }
  } catch (error: any) {
    console.error(error.response.data);
    return null;
  }
};

export const postSignup = async ({ email, password }: FormData) => {
  try {
    const res = await instance.post("/auth/signup", {
      email,
      password,
    });

    if (res.status === 200) {
      return "signup success";
    }
  } catch (error: any) {
    console.error(error.response.data.message);
    return null;
  }
};

export const getRefreshToken = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
      refreshToken: `${cookies().get("refreshToken")?.value}`,
    },
  });
  if (res.status === 200) {
    //accessToken갱신
    const data = await res.json();

    return data.access_token;
  } else {
    return false;
  }
};

export const emailVerifyRequest = async ({ email }: { email: string }) => {
  try {
    await instance.post("/auth/emails/verification-requests", {
      email,
    });

    return true;
  } catch (error: any) {
    console.error(error.response.data.status);
    return error.response.data.status;
  }
};

export const emailVerifyResponse = async ({ email, code }: { email: string; code: string }) => {
  try {
    await instance.post("/auth/emails/verifications", {
      email,
      code,
    });

    return true;
  } catch (error: any) {
    console.error(error.response.data.status);
    return error.response.data.status;
  }
};
