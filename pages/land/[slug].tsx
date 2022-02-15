import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  fetchCountries,
  fetchCountryBySlug,
  fetchCities,
  fetchStores,
  fetchStoresByCountry,
} from "../../utils/contentful";
import {
  ICityFields,
  IStoreFields,
  ICountryFields,
} from "../../types/generated/contentful";
import {
  Hero,
  StoreBlockGrid,
  CenterContent,
  StoreBlock,
  Layout,
  PageTitle,
  LinkButton,
  DescriptionText,
} from "../../components";

interface CountryPageProps {
  country: ICountryFields;
  stores: IStoreFields[];
  allStores: IStoreFields[];
  cities: ICityFields[];
}

interface CountryParams extends ParsedUrlQuery {
  country: string;
}

export const StorePage = ({
  country,
  stores,
  allStores,
  cities,
}: CountryPageProps) => {
  const canonical = "/land/" + country.slug;
  const pageTitle = `Stripwinkels in ${country.name}`;

  return (
    <Layout
      title={pageTitle}
      header={<Hero stores={allStores} variant="compact" />}
      cities={cities}
      canonical={canonical}
    >
      <PageTitle>{pageTitle}</PageTitle>

      {country?.description && (
        <DescriptionText>{country.description}</DescriptionText>
      )}

      <StoreBlockGrid>
        {stores?.map((store) => (
          <StoreBlock store={store} key={store.slug} />
        ))}
      </StoreBlockGrid>

      <CenterContent>
        <Link href="/" passHref>
          <LinkButton>Naar de homepage</LinkButton>
        </Link>
      </CenterContent>
    </Layout>
  );
};

export default StorePage;

export async function getStaticPaths() {
  const res = await fetchCountries();

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
  CountryPageProps,
  CountryParams
> = async ({ params }) => {
  const res = await fetchCountryBySlug(params?.slug);
  const country = await res.map((p) => {
    return { ...p.fields, id: p.sys.id };
  })[0];

  const storesRes = await fetchStoresByCountry(country.name);
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
    props: { country, stores, allStores, cities },
  };
};