import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['kysely'],
  webpack: (config, { webpack }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(accounts|porto\/internal|@walletconnect\/ethereum-provider|@safe-global\/safe-apps-provider)$/,
      })
    );
    return config;
  },
};

export default nextConfig;
