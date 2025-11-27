import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  /**
   * 中间件-权限控制
   * 0 如果跳转路径是白名单，继续执行。
   * 1. 获取cookie中的token，如果没有token，跳转到登录页
   * 2. 如果有token，获取用户权限，如果没有权限，跳转到403页面。
   * 3. 如果有权限，继续执行。
   * 4. 如果是登录页，跳转到首页。
   */

  const { pathname } = request.nextUrl;
  const whiteList = ["/appLogin", "/403", "/404", "/500"];
  const isWhite = whiteList.includes(pathname);

  if (isWhite) {
    return NextResponse.next();
  } else {
    const token = request.cookies.get("SHIXI_TOKEN" as any)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/appLogin", request.url));
    } else {
      return NextResponse.next();
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
