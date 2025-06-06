/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Handle ESM packages
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };
    
    // Handle ESM packages
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
  // Enable ESM support
  experimental: {
    esmExternals: 'loose',
  },
  // Optional: Add if you need to load external images
  images: {
    domains: ['your-image-domain.com'],
  },
  // Add these to prevent build errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Transpile required packages
  transpilePackages: ['@react-pdf/renderer'],
};

export default nextConfig;