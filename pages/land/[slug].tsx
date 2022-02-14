import styled from "styled-components";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import {
  fetchCountries,
  fetchCountryBySlug,
  fetchCities,
  fetchStoresByCountry,
} from "../../utils/contentful";
import {
  ICityFields,
  IStoreFields,
  ICountryFields,
} from "../../types/generated/contentful";
import {
  IntroText,
  Layout,
  PageTitle,
  StoreBlockGrid,
  StoreBlock,
  StoreMap,
} from "../../components";

interface CountryPageProps {
  country: ICountryFields;
  stores: IStoreFields[];
  cities: ICityFields[];
}

interface CountryParams extends ParsedUrlQuery {
  country: string;
}

const StoreMapContainer = styled.div`
  height: 400px;
`;

export const StorePage = ({ country, stores, cities }: CountryPageProps) => {
  const canonical = "/land/" + country.slug;
  const pageTitle = `Stripwinkels in ${country.name}`;

  return (
    <Layout title={pageTitle} cities={cities} canonical={canonical}>
      <PageTitle>{pageTitle}</PageTitle>

      {country?.description && <IntroText>{country.description}</IntroText>}

      <StoreBlockGrid>
        {stores?.map((store) => (
          <StoreBlock store={store} key={store.slug} />
        ))}
      </StoreBlockGrid>

      <StoreMapContainer>
        <StoreMap locations={stores} />
      </StoreMapContainer>
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

  const citiesRes = await fetchCities();
  const cities = await citiesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  return {
    props: { country, stores, cities },
  };
};
