import styles from "../../styles/Home.module.scss";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import {
  fetchStores,
  fetchCities,
  fetchStoreBySlug,
} from "../../utils/contentful";
import { ICityFields, IStoreFields } from "../../types/generated/contentful";
import { StoreBlock } from "../../components/store-block";
import { Layout } from "../../components/layout";

interface StorePageProps {
  store: IStoreFields;
  cities: ICityFields[];
}

interface StoreParams extends ParsedUrlQuery {
  store: string;
}

export const StorePage = ({ store, cities }: StorePageProps) => {
  const canonical = "/winkel/" + store.slug;
  const pageTitle = store.name;

  return (
    <Layout title={pageTitle} cities={cities} canonical={canonical}>
      <h1 className={styles.pageTitle}>{store.name}</h1>
      {store?.description && <p>{store.description}</p>}

      <div className={styles.storeBlocks}>
        <StoreBlock store={store} />
      </div>
    </Layout>
  );
};

export default StorePage;

export async function getStaticPaths() {
  const res = await fetchStores();

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
  StorePageProps,
  StoreParams
> = async ({ params }) => {
  const res = await fetchStoreBySlug(params?.slug);
  const store = await res.map((p) => {
    return { ...p.fields, id: p.sys.id };
  })[0];

  const citiesRes = await fetchCities();
  const cities = await citiesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  return {
    props: { store, cities },
  };
};
