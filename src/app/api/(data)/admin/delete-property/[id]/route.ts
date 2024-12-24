import PropertyModel from "@/models/propertyModel";
import { NextRequest, NextResponse } from "next/server";
import DeletedPropertiesModel from "@/models/deletedPropertiesModel";
// import { disconnectDB } from "@/lib/dbConnection";
import { adminMiddleware } from "../../../../../../../middlewares/adminMiddleware";

export const DELETE = async (req: NextRequest) => {

    const middlewareResponse = adminMiddleware(req);
    
    if (middlewareResponse) return middlewareResponse;
    try {
        const { pathname } = new URL(req.url)
        const id = pathname.split("/").pop()

        const deleteProperty = await PropertyModel.findByIdAndDelete(id)
        if (!deleteProperty) {
            return NextResponse.json({ error: 'Property not found' },
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const archivedProperty = new DeletedPropertiesModel(deleteProperty.toObject());
        await archivedProperty.save();

        // await disconnectDB()

        return NextResponse.json({ msg: 'Property deleted successfully' },
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        )
    } catch (error) {
        console.error('Error deleting property:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}