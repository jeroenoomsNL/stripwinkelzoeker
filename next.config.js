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
        source: "/winkel/stripwinkel-jopo-de-pojo-haarlem",
        permanent: true,
      },
      {
        source: "/plaats/stripwinkels-in-den-haag",
        source: "/plaats/den-haag",
        permanent: true,
      },
      {
        source: "/winkel/stripwinkel-de-strip-aap",
        source: "/winkel/stripwinkel-de-strip-aap-enschede",
        permanent: true,
      },
      {
        source: "/winkel/stripwinkel-aelix-strips-en-comics",
        source: "/winkel/stripwinkel-aelix-strips-en-comics-den-haag",
        permanent: true,
      },
      {
        source: "/winkel/stripwinkel-dick-bos",
        source: "/winkel/stripwinkel-dick-bos-rotterdam",
        permanent: true,
      },
      {
        source: "/winkel/stripwinkel-bul-super",
        source: "/winkel/stripwinkel-bul-super-delft",
        permanent: true,
      },
    ];
  },
};
