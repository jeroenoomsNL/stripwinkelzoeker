import { GetStaticProps } from "next";
import { fetchAllStores, fetchCities } from "../utils/contentful";
import { ICityFields, IStoreFields } from "../types/generated/contentful";
import {
  BlockGrid,
  CityBlock,
  Hero,
  IntroText,
  Layout,
  PageTitle,
} from "../components";
import Link from "next/link";

interface StorePageProps {
  stores: IStoreFields[];
  cities: ICityFields[];
}

export const NotFoundPage = ({ stores, cities }: StorePageProps) => {
  return (
    <Layout cities={cities} header={<Hero stores={stores} />}>
      <PageTitle>Pagina niet gevonden</PageTitle>
      <IntroText>
        <p>
          De pagina die je zoekt bestaat niet. Ga terug naar de{" "}
          <Link href="/">homepage</Link>.
        </p>
      </IntroText>
    </Layout>
  );
};

export default NotFoundPage;

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetchAllStores();
  const stores = await res.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  const citiesRes = await fetchCities();
  const cities = await citiesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  return {
    props: { stores, cities },
  };
};
