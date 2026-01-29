const nextConfig = {
  experimental: {
    dynamicIO: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cbtfmicezymjvrrupnwx.supabase.co',
        pathname:  '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;