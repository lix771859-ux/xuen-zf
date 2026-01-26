const nextConfig = {
  experimental: {
    dynamicIO: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cbtfmicezymjvrrupnwx.supabase.co',
        pathname: '/storage/v1/object/public/**',
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