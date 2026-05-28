/** @type {import('next').NextConfig} */
const nextConfig = {
  // ভারী প্যাকেজগুলোকে সার্ভারলেস ফাংশন বান্ডেল থেকে বাইরে রাখার নির্দেশ
  serverExternalPackages: ['cloudinary', 'mongoose', 'mongodb'],
};

export default nextConfig;