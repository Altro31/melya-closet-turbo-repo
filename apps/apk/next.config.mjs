/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
