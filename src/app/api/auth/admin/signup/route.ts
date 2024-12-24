import bcrypt from "bcrypt"
import AdminModel from "@/models/adminModel";
import { connectDB } from "@/lib/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { name, email, password: inputPassword } = await req.json()

        if (!name || !email || !inputPassword) {
            return NextResponse.json(
                { error: "All fields are mandatory" },
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                }
            );
        }

        await connectDB()

        const isUserExists = await AdminModel.findOne({ email })

        if (isUserExists) return NextResponse.json(
            { msg: "Admin with same email ID already exists! Kindly, Sign In" },
            {
                status: 409,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }
        )

        const encryptedPassword = bcrypt.hashSync(inputPassword, 10)

        const newAdmin = new AdminModel({
            name, email, password: encryptedPassword
        })

        await newAdmin.save()
        
        return NextResponse.json(
            { msg: "New Admin created! You can login now" },
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            }
        );

    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json(
            { error: "Failed to create admin credentials!" },
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}