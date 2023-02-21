/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ["img.youtube.com"] },
  transpilePackages: ["gsap"],
};

module.exports = nextConfig;
