import { connectDB } from "@/lib/mongodb";
import {User} from "@/models/User";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // ১. ডাটাবেস কানেকশন
    await connectDB();

    // ২. ইউজার চেক
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    // ৩. ওটিপি জেনারেট (৬ ডিজিট)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // ১০ মিনিট মেয়াদ

    // ৪. ডাটাবেসে ওটিপি আপডেট
    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    // ৫. ইমেইল ট্রান্সপোর্টার সেটআপ
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ConvertHub Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - ConvertHub",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #030303; color: #ffffff; border-radius: 15px;">
          <h2 style="color: #D4F82E;">Password Reset Request</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background: #121214; padding: 20px; border: 1px solid #D4F82E; display: inline-block; font-size: 24px; font-weight: bold; color: #D4F82E; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="color: #888; margin-top: 20px;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    // ৬. ইমেইল পাঠানো
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP sent successfully!" }, { status: 200 });

  } catch (error) {
    // TypeScript-এ error: any এর বদলে এভাবে হ্যান্ডেল করা ভালো
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Forgot Password Error:", errorMessage);
    
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}