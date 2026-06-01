import { auth } from "@/auth"

export const proxy = auth((req) => {
    console.log("Proxy middleware:", req.nextUrl.pathname, "Auth:", req.auth)
    if (!req.auth && req.nextUrl.pathname !== "/login") {
        const newUrl = new URL("/login", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})