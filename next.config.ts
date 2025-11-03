import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Gera arquivos estáticos (necessário pro Capacitor)
  output: "export",

  // Define a pasta onde o build será exportado
  distDir: "out",

  // Evita erros do next/image (Capacitor não tem servidor Node)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;