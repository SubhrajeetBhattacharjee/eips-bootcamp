import type { NextConfig } from "next";
import path from "path";

const asyncStorageShim = path.join(process.cwd(), 'app', 'shims', 'async-storage.ts');

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
      ...(config.resolve.alias || {}),
      '@react-native-async-storage/async-storage': asyncStorageShim,
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
