module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "res.cloudinary.com",
      //   port: "",
      //   pathname: "/my-account/**",
      // },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/*",
      },
    ],
  },
};
