const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const client = require("contentful").createClient({
  space: space,
  accessToken: accessToken,
});

export async function fetchStores() {
  const entries = await client.getEntries({ content_type: "store" });
  if (entries.items) return entries.items;
  console.log(`Error getting Shop entries.`);
}

export async function fetchStoresByCity(city: string) {
  console.log(city);
  const entries = await client.getEntries({
    content_type: "store",
    "fields.city": city,
  });

  if (entries.items) return entries.items;
  console.log(`Error getting Shop entries.`);
}

export async function fetchCities() {
  const entries = await client.getEntries({
    content_type: "city",
    order: "fields.name",
  });
  if (entries.items) return entries.items;
  console.log(`Error getting cities.`);
}

export interface City {
  fields: {
    name: string;
    slug: string;
    description: any;
  };
}

export async function fetchCityBySlug(slug: string | string[]) {
  console.log(slug);
  const entries = await client.getEntries({
    content_type: "city",
    "fields.slug": slug,
  });
  if (entries.items) return entries.items;
  console.log(`Error getting city.`);
}
