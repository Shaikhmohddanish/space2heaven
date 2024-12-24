import { connectDB } from "@/lib/dbConnection";
import PropertyModel from "@/models/propertyModel";
import { NextRequest, NextResponse } from "next/server";
import { addpropertyImages } from "@/lib/cloudinary";
// import { adminMiddleware } from "../../../../../../middlewares/adminMiddleware";

// Function to process form data
const processFormData = async (req: Request): Promise<any> => {
    const formData = await req.formData();
    const propertyData: Record<string, any> = {};

    // Loop through all entries in the form data
    for (const [key, value] of formData.entries()) {
        if (key === "images" && value instanceof File) {
            const buffer = await value.arrayBuffer();
            const imgUrl = await addpropertyImages(Buffer.from(buffer));
            if (imgUrl) {
                propertyData.images = propertyData.images || [];
                propertyData.images.push(imgUrl);
            }
        } else if (key.includes("[")) {
            const match = key.match(/^([^\[]+)\[([^\]]+)\]$/);
            if (match) {
                const parentKey = match[1];
                const childKey = match[2];
                propertyData[parentKey] = propertyData[parentKey] || {};
                propertyData[parentKey][childKey] = value;
            }
        } else {
            propertyData[key] = value;
        }
    }
    return propertyData;
};


export const POST = async (req: NextRequest) => {

    // const middlewareResponse = adminMiddleware(req);
    
    // if (middlewareResponse) return middlewareResponse;
    try {

        const inputData = await processFormData(req);

        await connectDB();

        const addProperty = new PropertyModel(inputData);
        await addProperty.save();

        return NextResponse.json(
            { msg: "Property added successfully!" },
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }
        );
    } catch (error) {
        console.error("Error occurred while adding property data:", error);
        return NextResponse.json(
            { error: "An error occurred while adding the property data." },
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};
