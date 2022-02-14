import { GetStaticProps } from "next";
import { fetchStores, fetchCities } from "../utils/contentful";
import { ICityFields, IStoreFields } from "../types/generated/contentful";
import {
  Hero,
  IntroText,
  StoreBlockGrid,
  Layout,
  PageTitle,
  StoreBlock,
} from "../components";

interface StorePageProps {
  stores: IStoreFields[];
  cities: ICityFields[];
}

export const StorePage = ({ stores, cities }: StorePageProps) => {
  return (
    <Layout cities={cities} header={<Hero stores={stores} />}>
      <PageTitle>Stripwinkels in Nederland</PageTitle>
      <StoreBlockGrid>
        {stores?.map((store) => (
          <StoreBlock store={store} key={store.slug} />
        ))}
      </StoreBlockGrid>
      <IntroText>
        <p>
          Stripwinkelzoeker.nl is gemaakt om de stripspeciaalzaken met fysieke
          winkels zichtbaarder te maken voor de stripliefhebber. Door deze
          winkels beter vindbaar te maken hopen we dat de stripliefhebbers
          sneller hun nieuwe stripboeken bij een stripspeciaalzaak zullen kopen.{" "}
          <a
            href="https://www.hebban.nl/steunjeboekhandel"
            target="_blank"
            rel="noreferrer"
          >
            #steunjeboekhandel
          </a>
        </p>
      </IntroText>
    </Layout>
  );
};

export default StorePage;

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetchStores();
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
