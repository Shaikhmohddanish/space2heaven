import PropertyModel from "@/models/propertyModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Property ID is required." },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid Property ID format." },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Fetch the property matching the given ID
    const matchingData = await PropertyModel.findById(id);

    if (!matchingData) {
      return NextResponse.json(
        { error: "Property not found." },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Fetch similar properties (limit to 5 for performance)
    const recommendedData = await PropertyModel.find({
      recommend: true,
      _id: { $ne: id }, // Exclude the current property
    })
      .limit(5) // Limit the number of results
      .select("title price propertyType location images features configuration tag recommend");

      console.log("Matching data : ", recommendedData);
      
    return NextResponse.json(
      { matchingData, recommendedData },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching property data:", error.message);

    return NextResponse.json(
      { error: error.message || "An internal server error occurred." },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
