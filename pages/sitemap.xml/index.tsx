import { getServerSideSitemapLegacy } from "next-sitemap";
import { GetServerSideProps } from "next";
import {
  fetchCities,
  fetchCountries,
  fetchAllStores,
} from "../../utils/contentful";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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

  return getServerSideSitemapLegacy(ctx, [
    ...staticPages,
    ...countries,
    ...cities,
    ...stores,
  ]);
};

const Sitemap = () => {};
export default Sitemap;
