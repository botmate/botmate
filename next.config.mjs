import { readFileSync } from 'fs';

const packageJSON = JSON.parse(readFileSync('./package.json', 'utf8'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    version: packageJSON.version,
  },
};

export default nextConfig;
