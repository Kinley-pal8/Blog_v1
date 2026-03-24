import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Include all routes except Next.js internals and static assets
    "/((?!_next|_icon|_app|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
