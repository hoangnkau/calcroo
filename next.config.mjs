/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // static site — deploy miễn phí trên Vercel / Cloudflare Pages
  trailingSlash: true,
  webpack: (config) => {
    // Các lib export (xlsx, jspdf) có nhánh code Node — chặn để build client sạch.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      zlib: false,
    };
    return config;
  },
};

export default nextConfig;
