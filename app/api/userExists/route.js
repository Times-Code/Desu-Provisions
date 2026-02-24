import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const email = body?.email;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select("_id");
    console.log("user: ", user);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error in userExists API detailed:", {
      message: error.message,
      stack: error.stack,
      email: body?.email
    });
    return NextResponse.json(
      { message: "An error occurred while checking if user exists.", error: error.message },
      { status: 500 }
    );
  }
}
