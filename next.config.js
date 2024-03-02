const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ahmedibra.com'
            },
            {
                protocol: 'https',
                hostname: 'bookdriving.co.uk'
            },
            {
                protocol: 'https',
                hostname: 'github.com'
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com'
            },
            {
                protocol: 'https',
                hostname: 'unsplash.com'
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com'
            }
        ]
    }
}

module.exports = nextConfig
