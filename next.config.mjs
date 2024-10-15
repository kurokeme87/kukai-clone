/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  // Other custom configurations can go here
  reactStrictMode: true, // Enables React strict mode
  swcMinify: true, // Enables SWC minification for better build performance
};

export default nextConfig;
