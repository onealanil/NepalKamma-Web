import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack:{
    rules: {
      '*.svg':{
        loaders: ['@svgr/webpack'],
        as: '*.js'
      },
    },
  },
  // experimental:{
  //   typedRoutes: true,
  // }
};

export default nextConfig;
