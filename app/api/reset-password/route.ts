// app/api/reset-password/route.ts
import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, newPassword } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    // সিকিউরিটির জন্য কোডগুলো মুছে ফেলা
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Reset failed" }, { status: 500 });
  }
}