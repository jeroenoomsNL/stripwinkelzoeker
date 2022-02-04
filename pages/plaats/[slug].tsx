import styles from "../../styles/Home.module.scss";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  fetchCities,
  fetchCityBySlug,
  fetchStoresByCity,
} from "../../utils/contentful";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { StoreBlock } from "../../components/store-block";
import { Store } from "../../types/store";
import { City } from "../../types/city";

interface CityPageProps {
  stores: Store[];
  city: City;
  cities: City[];
}

interface CityParams extends ParsedUrlQuery {
  city: string;
}

export const CityPage = ({ city, cities, stores }: CityPageProps) => (
  <div className={styles.container}>
    <Head>
      <title>Stripwinkels in {city.name} - Stripwinkelzoeker.nl</title>
      <link
        rel="canonical"
        href={`https://stripwinkelzoeker.nl/plaats/${city.slug}`}
      />
    </Head>

    <Header />

    <main className={styles.main}>
      <h2 className={styles.pageTitle}>Stripwinkels in {city.name}</h2>
      {city?.description && <p>{city.description}</p>}

      <div className={styles.storeBlocks}>
        {stores?.map((store) => (
          <StoreBlock store={store} key={store.id} />
        ))}
      </div>

      <div className={styles.buttonContainer}>
        <Link href="/">
          <a className="button">Toon alle winkels</a>
        </Link>
      </div>
    </main>
    <Footer cities={cities} />
  </div>
);

export default CityPage;

export async function getStaticPaths() {
  const res = await fetchCities();

  const stores = await res.map((p) => {
    return {
      params: {
        slug: p.fields.slug,
      },
    };
  });

  return {
    paths: stores,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<
  CityPageProps,
  CityParams
> = async ({ params }) => {
  const cityRes = await fetchCityBySlug(params?.slug);
  const city = await cityRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  })[0];

  const storesRes = await fetchStoresByCity(city.name);
  const stores = await storesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  const citiesRes = await fetchCities();
  const cities = await citiesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  return {
    props: {
      stores,
      city,
      cities,
    },
  };
};
