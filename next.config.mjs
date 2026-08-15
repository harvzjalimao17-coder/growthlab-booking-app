/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // Netlify's Next.js runtime handles SSR/ISR; no "output: export" here
  // because the booking flow needs server-rendered dynamic routes later
  // (client portal, admin dashboard) in future versions.
};

export default nextConfig;
