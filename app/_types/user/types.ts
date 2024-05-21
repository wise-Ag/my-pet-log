export interface UserType {
  id: string;
  email: string;
  nickname: string;
  profilePath: string;
  loginType: "EMAIL" | "KAKAO" | "GOOGLE";
}
