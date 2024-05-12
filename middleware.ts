import { getRefreshToken } from "@/app/_api/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const path = request.nextUrl.pathname;
  const petId = request.cookies.get("petId");
  const isAuth = request.cookies.get("expire");

  if (accessToken) {
    if (path === "/" || path.startsWith("/login") || path.startsWith("/signup")) return NextResponse.redirect(new URL("/home", request.url));
    if (!isAuth && path !== "/access-expired") {
      //accessToken만료일경우
      const response = NextResponse.next();
      const newAccessToken = await getRefreshToken();
      if (newAccessToken) {
        response.cookies.set("accessToken", newAccessToken);
        const expiresAt = new Date(Date.now() + (23 * 60 + 59) * 60 * 1000);
        response.cookies.set("expire", "expire", { expires: expiresAt });
        return response;
      }
      //refreshToken도 만료일경우
      const responseHeaders = new Headers();
      responseHeaders.set("x-frontend-path", "/access-expired");
      return NextResponse.rewrite(new URL("/access-expired", request.url));
    }

    //petId여부에 따라 redirect
    if (path === "/diary/friend-pet") return;
    if (path === "/diary/my-pet") return;
    if (path.startsWith("/diary") && !petId) return NextResponse.redirect(new URL("/diary/my-pet", request.url));

    if (path === "/healthlog/select" && !petId) return;
    if (path === "/healthlog/select" && petId) return NextResponse.redirect(new URL("/healthlog", request.url));
    if (path.startsWith("/healthlog") && !petId) return NextResponse.redirect(new URL("/healthlog/select", request.url));
  } else {
    if (path === "/" || path.startsWith("/login") || path.startsWith("/signup") || path.startsWith("/oauth")) {
    } else return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: ["/((?!api|_next/static\\/?).*)"],
};
