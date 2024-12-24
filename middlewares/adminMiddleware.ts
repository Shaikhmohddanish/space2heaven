import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";

export const adminMiddleware = async(req: NextRequest) => {

    // console.log("Cookies : ", req.cookies);
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_cookie_token')?.value;
    // console.log("token : ", token);
    
    if (!token) {
        return NextResponse.json(
            { error: "Session timeout!. Please sign in." },
            {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        )
    }
    const secretKey = process.env.TOKEN_SECRET_KEY;

    if(!secretKey) throw new Error("Secret Key is not defined");

    const decodeToken = jwt.verify(token, secretKey);
    // console.log("Decode : ", decodeToken);
    
    return NextResponse.next()
}

export const config = {
matchers:"/api/admin/*"
}

