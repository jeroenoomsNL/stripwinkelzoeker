import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  fetchCities,
  fetchCityBySlug,
  fetchCountryByName,
  fetchStoresByCity,
} from "../../utils/contentful";
import {
  ICityFields,
  ICountryFields,
  IStoreFields,
} from "../../types/generated/contentful";
import {
  BlockGrid,
  CenterContent,
  CityHeader,
  DescriptionText,
  StoreBlock,
  Layout,
  PageTitle,
  LinkButton,
  CallToActionText,
} from "../../components";

interface CityPageProps {
  stores: IStoreFields[];
  city: ICityFields;
  cities: ICityFields[];
  country: ICountryFields;
}

interface CityParams extends ParsedUrlQuery {
  city: string;
}

export const CityPage = ({ city, cities, country, stores }: CityPageProps) => {
  const canonical = "/plaats/" + city.slug;
  const pageTitle = `Stripwinkels in ${city.name}`;

  return (
    <Layout
      title={pageTitle}
      header={city.image && <CityHeader city={city} />}
      cities={cities}
      canonical={canonical}
    >
      <PageTitle>{pageTitle}</PageTitle>
      <DescriptionText>
        {city?.description && documentToReactComponents(city?.description)}
      </DescriptionText>

      <BlockGrid>
        {stores?.map((store) => <StoreBlock store={store} key={store.slug} />)}
      </BlockGrid>

      <CallToActionText>
        Dit zijn de <strong>stripboekenwinkels in {city.name}</strong> die wij
        voor je hebben gevonden. Maar er zijn natuurlijk nog veel meer{" "}
        <strong>stripspeciaalzaken in {country.name}</strong>.
      </CallToActionText>

      <CenterContent>
        <LinkButton href={`/land/${country.slug}`}>
          Alle stripwinkels in {country.name}
        </LinkButton>
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

  const citiesRes = await fetchCities();
  const cities = await citiesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  return {
    props: {
      stores,
      city,
      cities,
      country,
    },
  };
};
