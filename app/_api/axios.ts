import { getRefreshToken } from "@/app/_api/auth";
import axios from "axios";
import ExpiryMap from "expiry-map";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import pMemoize from "p-memoize";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const accessToken = cookies().get("accessToken")?.value;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

const cache = new ExpiryMap(1000);
const getNewAccessToken = pMemoize(
  async () => {
    const newAccessToken = await getRefreshToken();
    return newAccessToken;
  },
  { cache },
);

instance.interceptors.response.use(
  (config) => config,
  async (error) => {
    //토큰 만료 에러
    if (error.response.status === 401) {
      const newAccessToken = await getNewAccessToken();
      if (newAccessToken) {
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        try {
          const expiresAt = new Date(Date.now() + (23 * 60 + 59) * 60 * 1000);
          cookies().set("expire", "expire", { expires: expiresAt });
          cookies().set("accessToken", newAccessToken);
        } catch {
          console.error("쿠키 설정 시도");
        }
        return axios(error.config); //재요청
      } else {
        redirect("/access-expired");
      }
    }

    return `${error}`;
  },
);
export default instance;
