/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:4000/api/:path*', // Proxy API
            },
            {
                source: '/:shortCode',
                destination: 'http://localhost:4000/:shortCode', // Proxy Redirection
            },
        ];
    },
};

module.exports = nextConfig;
