import {
  fetchCities,
  fetchCountries,
  fetchAllStores,
} from "../../utils/contentful";
import type { NextApiRequest, NextApiResponse } from "next";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${posts
       .map(({ loc, lastmod, priority }) => {
         return `
       <url>
           <loc>${loc}</loc>
           <loc>${lastmod}</loc>
           <loc>${priority}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

const Sitemap = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const staticPages = [
    { loc: `${BASE_URL}`, lastmod: new Date().toISOString(), priority: 1 },
    {
      loc: `${BASE_URL}/stripwinkels-in-de-buurt`,
      lastmod: new Date().toISOString(),
      priority: 0.9,
    },
  ];

  const resCountries = await fetchCountries();
  const countries = await resCountries.map((store) => {
    return {
      loc: `${BASE_URL}/land/${store.fields.slug}`,
      lastmod: new Date(store.sys.updatedAt).toISOString(),
      priority: 0.8,
    };
  });

  const resCities = await fetchCities();
  const cities = await resCities.map((store) => {
    return {
      loc: `${BASE_URL}/plaats/${store.fields.slug}`,
      lastmod: new Date(store.sys.updatedAt).toISOString(),
      priority: 0.8,
    };
  });

  const resStores = await fetchAllStores();
  const stores = await resStores.map((store) => {
    return {
      loc: `${BASE_URL}/winkel/${store.fields.slug}`,
      lastmod: new Date(store.sys.updatedAt).toISOString(),
      priority: 0.7,
    };
  });

  const sitemap = generateSiteMap([
    ...staticPages,
    ...countries,
    ...cities,
    ...stores,
  ]);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
};

export default Sitemap;
