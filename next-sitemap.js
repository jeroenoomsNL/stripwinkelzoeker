module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
  exclude: ["/sitemap.xml"], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [process.env.NEXT_PUBLIC_BASE_URL + "/sitemap.xml"],
  },
};
