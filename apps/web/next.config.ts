import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // typedRoutes désactivé - les routes dynamiques causent des erreurs de types
  // TODO: Corriger les routes invalides et réactiver
  // typedRoutes: true,
  serverExternalPackages: ['pino', 'pino-pretty'],
};

export default nextConfig;
