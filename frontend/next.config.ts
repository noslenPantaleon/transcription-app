import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: { resolve: { alias: { [x: string]: string; }; }; }) => {
    // Add the @ alias
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

export default nextConfig;

