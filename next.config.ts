/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                // আপনার ভিডিও পেজের পাথ যদি /video হয়, তবে এখানে সেটি দিন
                source: '/video', 
                headers: [
                    { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
                ],
            },
            {
                // ডকুমেন্ট পেজ এবং এপিআই-এর জন্য হেডার শিথিল রাখা
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;