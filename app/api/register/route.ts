import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    // ডাটাবেস কানেক্ট করার চেষ্টা
    await connectMongoDB();

    // ইউজার অলরেডি আছে কি না চেক
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // পাসওয়ার্ড হ্যাশ করা এবং সেভ করা
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ 
      message: "Internal Server Error", 
      error: error.message 
    }, { status: 500 });
  }
}