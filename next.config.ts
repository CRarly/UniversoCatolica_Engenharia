import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O jogo usa somente imagens locais. Desativar o proxy de otimização evita
  // depender dos bindings ASSETS/IMAGES do Cloudflare ao executar no Windows.
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
