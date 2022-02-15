const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const client = require("contentful").createClient({
  space: space,
  accessToken: accessToken,
});

export async function fetchStores() {
  const entries = await client.getEntries({ content_type: "store" });
  if (entries.items) return entries.items;
  console.log(`Error getting stores.`);
}

export async function fetchStoreBySlug(slug: string | string[]) {
  const entries = await client.getEntries({
    content_type: "store",
    "fields.slug": slug,
  });
  if (entries.items) return entries.items;
  console.log(`Error getting store by slug.`);
}

export async function fetchStoresByCity(city: string) {
  const entries = await client.getEntries({
    content_type: "store",
    "fields.city": city,
  });

  if (entries.items) return entries.items;
  console.log(`Error getting stores by city name.`);
}

export async function fetchStoresByCountry(country: string) {
  const entries = await client.getEntries({
    content_type: "store",
    "fields.country": country,
  });

  if (entries.items) return entries.items;
  console.log(`Error getting stores by country name.`);
}

export async function fetchCities() {
  const entries = await client.getEntries({
    content_type: "city",
    order: "fields.name",
  });
  if (entries.items) return entries.items;
  console.log(`Error getting cities.`);
}

export async function fetchCityBySlug(slug: string | string[]) {
  const entries = await client.getEntries({
    content_type: "city",
    "fields.slug": slug,
  });
  if (entries.items) return entries.items;
  console.log(`Error getting city by slug.`);
}

export async function fetchCountries() {
  const entries = await client.getEntries({
    content_type: "country",
    order: "fields.name",
  });
  if (entries.items) return entries.items;
  console.log(`Error getting countries.`);
}

export async function fetchCountryByName(country: string) {
  const entries = await client.getEntries({
    content_type: "country",
    "fields.name": country,
  });
  if (entries.items) return entries.items;
  console.log(`Error getting country by slug.`);
}

export async function fetchCountryBySlug(slug: string | string[]) {
  const entries = await client.getEntries({
    content_type: "country",
    "fields.slug": slug,
  });
  if (entries.items) return entries.items;
  console.log(`Error getting country by slug.`);
}
