/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [];
  },
};

// Set the dev server port
if (process.env.NODE_ENV === 'development') {
  nextConfig.devServer = {
    port: 3001
  };
}

module.exports = nextConfig;
