import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Product from "../../../../model/Product";

export async function GET() {
  await connectDB();

  try {
    // Fetch all Products from the database
    const products = await Product.find();
    // Return Products data
    return NextResponse.json(products[0], { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
