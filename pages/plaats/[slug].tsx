import styles from "../../styles/Home.module.scss";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  fetchCities,
  fetchCityBySlug,
  fetchStoresByCity,
} from "../../utils/contentful";
import { ICityFields, IStoreFields } from "../../types/generated/contentful";
import {
  StoreBlockGrid,
  CenterContent,
  StoreBlock,
  Layout,
  PageTitle,
} from "../../components";

interface CityPageProps {
  stores: IStoreFields[];
  city: ICityFields;
  cities: ICityFields[];
}

interface CityParams extends ParsedUrlQuery {
  city: string;
}

export const CityPage = ({ city, cities, stores }: CityPageProps) => {
  const canonical = "/plaats/" + city.slug;
  const pageTitle = `Stripwinkels in ${city.name}`;

  return (
    <Layout title={pageTitle} cities={cities} canonical={canonical}>
      <PageTitle>Stripwinkels in {city.name}</PageTitle>
      {city?.description && <p>{city.description}</p>}

      <StoreBlockGrid>
        {stores?.map((store) => (
          <StoreBlock store={store} key={store.slug} />
        ))}
      </StoreBlockGrid>

      <CenterContent>
        <Link href="/">
          <a className="button">Toon alle winkels</a>
        </Link>
      </CenterContent>
    </Layout>
  );
};

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
