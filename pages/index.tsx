import { GetStaticProps } from "next";
import { fetchStores, fetchCities } from "../utils/contentful";
import { ICityFields, IStoreFields } from "../types/generated/contentful";
import {
  BlockGrid,
  CityBlock,
  Hero,
  IntroText,
  Layout,
  PageTitle,
} from "../components";

interface StorePageProps {
  stores: IStoreFields[];
  cities: ICityFields[];
}

export const HomePage = ({ stores, cities }: StorePageProps) => {
  const displayCities = cities.filter((city) => city.image);

  return (
    <Layout cities={cities} header={<Hero stores={stores} />}>
      <PageTitle>Koop je strips bij een stripspeciaalzaak</PageTitle>
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

      <BlockGrid>
        {displayCities.map((city) => (
          <CityBlock key={city.slug} city={city} />
        ))}
      </BlockGrid>
    </Layout>
  );
};

export default HomePage;

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
