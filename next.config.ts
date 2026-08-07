import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//         domains: [
//           'uploadthing.com',
//           'utfs.io',
//           'img.clerk.com',
//           'subdomain',
//           'files.stripe.com',
//         ],
//       },
//       reactStrictMode: false,
// };

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https", // Note: If 'subdomain' is for local testing, this might need to be "http"
        hostname: "subdomain",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
      },
    ],
  },
  reactStrictMode: false,
  // Prevents Next.js/Turbopack from bundling Prisma, fixing module & driver adapter errors
  // For Next.js 15
  serverExternalPackages: ['@prisma/client', 'prisma'],
  
};


export default nextConfig;
