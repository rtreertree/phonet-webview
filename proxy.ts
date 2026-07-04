import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    console.log("Proxy middleware:", req.nextUrl.pathname);

    if (process.env.AUTHJS_ENABLED === "true") {
        return NextResponse.next();
    }

    return NextResponse.next();
}