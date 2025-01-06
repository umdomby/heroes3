/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
            },
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb',
            serverActions: true,
            allowedOrigins: ['localhost:3000/', 'https://gamerecord.online'],
        },
    },
};

export default nextConfig;
