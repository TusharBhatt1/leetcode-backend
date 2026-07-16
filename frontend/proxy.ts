import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
	try {
		const rawToken = request.cookies.get("leetcode_user")?.value;

		if (!rawToken) {
			throw new Error("Token not found!");
		}

		jwt.verify(rawToken, process.env.JWT_PUBIC_KEY!, {
			algorithms: ["RS256"],
		});
	} catch (error) {
		console.log(error);
		// return NextResponse.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: ["/", "/problem/:path*"],
};
