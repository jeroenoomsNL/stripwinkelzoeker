const path = require("path");

module.exports = {
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["images.ctfassets.net"],
  },
  async redirects() {
    return [
      {
        source: "/winkel/stripwinkel-jopo-de-pojo",
        destination: "/winkel/stripwinkel-jopo-de-pojo-haarlem",
        permanent: true,
      },
      {
        source: "/plaats/stripwinkels-in-den-haag",
        destination: "/plaats/den-haag",
        permanent: true,
      },
      {
        source: "/winkel/stripwinkel-de-strip-aap",
        destination: "/winkel/stripwinkel-de-strip-aap-enschede",
        permanent: true,
      },
      {
        source: "/winkel/stripwinkel-aelix-strips-en-comics",
        destination: "/winkel/stripwinkel-aelix-strips-en-comics-den-haag",
        permanent: true,
      },
      {
        source: "/winkel/stripwinkel-dick-bos",
        destination: "/winkel/stripwinkel-dick-bos-rotterdam",
        permanent: true,
      },
      {
        source: "/winkel/stripwinkel-bul-super",
        destination: "/winkel/stripwinkel-bul-super-delft",
        permanent: true,
      },
    ];
  },
};
