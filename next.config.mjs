import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/jlab-open-source',
  // Required for next/image with static export
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default withMDX(nextConfig);
