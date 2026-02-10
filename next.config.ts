import type { NextConfig } from "next";

const isMobile = process.env.IS_MOBILE === "true";

const nextConfig: NextConfig = {
  output: isMobile ? "export" : "standalone",
  trailingSlash: true,

  images: {
    // Se for Mobile, DESATIVA (obrigatório para export estático)
    // Se for Web, ATIVA (false significa que ele vai tentar otimizar)
    unoptimized: isMobile,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;