const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [{ hostname: "images.ctfassets.net" }],
  },
  compiler: {
    styledComponents: true,
  },
};
