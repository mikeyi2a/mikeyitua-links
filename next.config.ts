import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Same-origin URL so GemSmoke can load the SVG into WebGL (Paper CDN is not CORS-open). */
  async rewrites() {
    return [
      {
        source: "/rewrites/paper-gem-logo.svg",
        destination:
          "https://app.paper.design/file-assets/01KN027W5A7GQVN1N6VKRTT87B/01KP894NXCM0CD6F30QQ2NM40R.svg",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "aidesignhq.com",
        pathname: "/og/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/gpt-engineer-file-uploads/**",
      },
      {
        protocol: "https",
        hostname: "pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.mikeyitua.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
