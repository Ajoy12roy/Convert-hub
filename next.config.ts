/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                // your video page path
                source: '/video',

                // Next.js throws if `headers` is provided as an empty array.
                // If you don't need custom headers for this route, remove the entire rule.
                // For now we provide a harmless header.
                headers: [
                    { key: 'X-Video-Route', value: '1' },
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