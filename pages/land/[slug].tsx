import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  fetchCountries,
  fetchCountryBySlug,
  fetchCities,
  fetchAllStores,
  fetchStoresByCountry,
} from "../../utils/contentful";
import {
  ICityFields,
  IStoreFields,
  ICountryFields,
} from "../../types/generated/contentful";
import {
  Hero,
  BlockGrid,
  CenterContent,
  StoreBlock,
  Layout,
  PageTitle,
  LinkButton,
  DescriptionText,
  CallToActionText,
} from "../../components";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

interface CountryPageProps {
  country: ICountryFields;
  stores: IStoreFields[];
  allStores: IStoreFields[];
  cities: ICityFields[];
}

interface CountryParams extends ParsedUrlQuery {
  country: string;
}

export const CountryPage = ({
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
        <DescriptionText>
          {country?.description &&
            documentToReactComponents(country?.description)}
        </DescriptionText>
      )}

      <BlockGrid>
        {stores?.map((store) => (
          <StoreBlock store={store} key={store.slug} />
        ))}
      </BlockGrid>

      <CallToActionText>
        Dit zijn de <strong>stripboekenwinkels in {country.name}</strong> die
        wij voor je hebben gevonden. Ga naar de homepage voor meer zoekopties,
        wellicht vind je daar de <strong>stripspeciaalzaak</strong> waar je naar
        op zoek bent.
      </CallToActionText>

      <CenterContent>
        <Link
          href="/"
          passHref
          title="Vind alle stripspeciaalzaken in Nederland en België"
        >
          <LinkButton>Vind meer stripspeciaalzaken</LinkButton>
        </Link>
      </CenterContent>
    </Layout>
  );
};

export default CountryPage;

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

  const allStoresRes = await fetchAllStores();
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
