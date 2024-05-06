import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const path = request.nextUrl.pathname;
  const petId = request.cookies.get("petId");

  const withoutWWWPathname = path.replace(/^\/(www\.)?/, "/");

  // 소셜로그인 URL에서 www를 제거하도록 설정
  if (path.startsWith("/api/auth/callback/kakao") || path.startsWith("/api/auth/callback/google")) {
    return NextResponse.redirect(new URL(withoutWWWPathname, request.url));
  }

  // www를 제거한 경로로 리디렉션
  if (path !== withoutWWWPathname) return NextResponse.redirect(new URL(withoutWWWPathname, request.url));
  if (accessToken) {
    if (path === "/" || path.startsWith("/login") || path.startsWith("/signup")) return NextResponse.redirect(new URL("/home", request.url));

    //petId여부에 따라 redirect
    if (path === "/diary/friend-pet") return;
    if (path === "/diary/my-pet") return;
    if (path.startsWith("/diary") && !petId) return NextResponse.redirect(new URL("/diary/my-pet", request.url));

    if (path === "/healthlog/select" && !petId) return;
    if (path === "/healthlog/select" && petId) return NextResponse.redirect(new URL("/healthlog", request.url));
    if (path.startsWith("/healthlog") && !petId) return NextResponse.redirect(new URL("/healthlog/select", request.url));
  } else {
    if (path === "/" || path.startsWith("/login") || path.startsWith("/signup")) {
    } else return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: ["/((?!api|_next/static\\/?).*)"],
};
