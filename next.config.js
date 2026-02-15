/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['prisma/generated'],
}

module.exports = nextConfig
