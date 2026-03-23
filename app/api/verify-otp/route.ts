// app/api/verify-otp/route.ts
import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    const user = await User.findOne({ 
      email, 
      resetOtp: otp,
      resetOtpExpiry: { $gt: new Date() } 
    });

    if (!user) {
      return NextResponse.json({ message: "ভুল অথবা মেয়াদোত্তীর্ণ ওটিপি" }, { status: 400 });
    }

    return NextResponse.json({ message: "Verified" }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}