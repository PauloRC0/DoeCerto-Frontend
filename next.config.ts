import type { NextConfig } from "next";

const isMobile = process.env.IS_MOBILE === "true";

const nextConfig: NextConfig = {
  // Define o tipo de saída baseado na plataforma
  output: (isMobile ? "export" : "standalone") as any,
  
  // Garante que as rotas funcionem bem no Android (ex: /login/)
  trailingSlash: true,

  images: {
    // Obrigatório ser true para export estático (Mobile)
    unoptimized: isMobile,
  },

  // Blindagem contra erros de TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;