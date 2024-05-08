export const Oauth = {
  kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI_KAKAO}&response_type=code`,
  google: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI_GOOGLE}&response_type=codescope=https://www.googleapis.com/auth/analytics`,
};
