import { NextResponse } from "next/server";
import connectDB from "../../../../utils/db";
import Product from "../../../../model/Product";

export async function POST(req) {
  await connectDB();
  const productData = await req.json();
  const jsonString = JSON.stringify(productData);
  try {
    const user = new Product({
      products: jsonString,
    });

    await user.save();

    return NextResponse.json(
      { message: "productData registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
