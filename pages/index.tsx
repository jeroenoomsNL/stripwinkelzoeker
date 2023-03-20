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
          Ben jij een echte stripfanaat en op zoek naar dat ene stripboek dat
          nog steeds in je collectie ontbeekt? Of ben je gewoon op zoek naar de
          nieuwste strips? Stripwinkelzoeker helpt je om de dichtstbijzijnde
          stripwinkel of stripspeciaalzaak te vinden. Met meer dan 65 winkels in
          Nederland en België hoef jij niet lang meer te zoeken. Van Batman tot
          Lucky Luke, bij Stripwinkelzoeker vind je het allemaal. Dus waar wacht
          je nog op? Ga op zoek naar jouw volgende stripavontuur!
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
