module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
  generateRobotsTxt: true,
  exclude: ["/sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: [process.env.NEXT_PUBLIC_BASE_URL + "/sitemap.xml"],
  },
};
