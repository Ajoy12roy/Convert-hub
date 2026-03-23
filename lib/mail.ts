import nodemailer from "nodemailer";

export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"ConvertHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - ConvertHub",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #D4F82E;">Reset Your Password</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #D4F82E; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Nodemailer Error:", error);
    throw new Error("Failed to send email");
  }
};