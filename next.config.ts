import type { NextConfig } from 'next';

// GitHub Pages serves the site from /<repo>; the deploy workflow sets BASE_PATH.
const basePath = process.env.BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
