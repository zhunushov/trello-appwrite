/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["links.papareact.com", "cloud.appwrite.io"],
    remotePatterns: [
      {
        hostname: "links.papareact.com",
        pathname: "/c2cdd5",
        protocol: "https",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
