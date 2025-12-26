// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. สร้าง Supabase Client สำหรับ Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. เช็คว่า User Login อยู่ไหม
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. กฎเหล็ก (Protection Rules)
  
  // ถ้าเข้าหน้า Admin แต่ยังไม่มี User -> เตะไปหน้า Login
  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ถ้าเข้าหน้า Login แต่มี User แล้ว -> เตะเข้าหน้า Admin เลย (ไม่ต้อง Login ซ้ำ)
  if (request.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

// กำหนดว่า Middleware นี้จะทำงานที่ Path ไหนบ้าง
export const config = {
  matcher: [
    "/admin/:path*", // เฝ้าทุกอย่างใน Admin
    "/login",        // เฝ้าหน้า Login
  ],
};