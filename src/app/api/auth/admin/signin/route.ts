import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import AdminModel from "@/models/adminModel";
import { connectDB } from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { email, password: inputPassword } = await req.json()

        if (!email || !inputPassword) {
            throw new Error("Email and password are required");
        }

        await connectDB()

        const findUser = await AdminModel.findOne({ email })

        if (!findUser) {
            return NextResponse.json(
                { error: "Details not found. Please, signup first!" },
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );
        }

        const isPasswordMatching = await bcrypt.compare(inputPassword, findUser.password)

        if (!isPasswordMatching) {
            return NextResponse.json(
                { error: "Unauthorized attempt!" },
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": "true"
                    },
                }
            );
        }

        const secretKey = process.env.TOKEN_SECRET_KEY;
        if (!secretKey) {
            throw new Error("TOKEN_SECRET_KEY is not defined in environment variables");
        }

        const token = jwt.sign({ id: findUser._id }, secretKey);

        const { password, ...otherDetails } = findUser.toObject()


        const response = NextResponse.json(otherDetails,
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                },
            }
        );
        
        response.cookies.set("admin_cookie_token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600 * 24,
            sameSite: "strict",
            path: "/api/admin/:path*"
        })
        
        return response
    } catch (error) {
        console.error("Error saving customer:", error);
        return NextResponse.json(
            { error: "Failed to authorize" },
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}