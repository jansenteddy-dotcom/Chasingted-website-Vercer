import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hop.behold.pictures',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.behold.pictures',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
