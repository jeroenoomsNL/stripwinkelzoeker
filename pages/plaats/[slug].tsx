import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  fetchCities,
  fetchCityBySlug,
  fetchCountryByName,
  fetchStores,
  fetchStoresByCity,
} from "../../utils/contentful";
import {
  ICityFields,
  ICountryFields,
  IStoreFields,
} from "../../types/generated/contentful";
import {
  StoreBlockGrid,
  CenterContent,
  StoreBlock,
  Layout,
  PageTitle,
  LinkButton,
  DescriptionText,
  Hero,
} from "../../components";

interface CityPageProps {
  stores: IStoreFields[];
  allStores: IStoreFields[];
  city: ICityFields;
  cities: ICityFields[];
  country: ICountryFields;
}

interface CityParams extends ParsedUrlQuery {
  city: string;
}

export const CityPage = ({
  city,
  cities,
  country,
  allStores,
  stores,
}: CityPageProps) => {
  const canonical = "/plaats/" + city.slug;
  const pageTitle = `Stripwinkels in ${city.name}`;

  return (
    <Layout
      title={pageTitle}
      header={<Hero stores={allStores} variant="compact" />}
      cities={cities}
      canonical={canonical}
    >
      <PageTitle>{pageTitle}</PageTitle>
      <DescriptionText>
        {city?.description && documentToReactComponents(city?.description)}
      </DescriptionText>

      <StoreBlockGrid>
        {stores?.map((store) => (
          <StoreBlock store={store} key={store.slug} />
        ))}
      </StoreBlockGrid>

      <CenterContent>
        <Link href={`/land/${country.slug}`} passHref>
          <LinkButton>Alle stripwinkels in {country.name}</LinkButton>
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

  const countryRes = await fetchCountryByName(city.country);
  const country = await countryRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  })[0];

  const storesRes = await fetchStoresByCity(city.name);
  const stores = await storesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  const allStoresRes = await fetchStores();
  const allStores = await allStoresRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  const citiesRes = await fetchCities();
  const cities = await citiesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  return {
    props: {
      stores,
      allStores,
      city,
      cities,
      country,
    },
  };
};
