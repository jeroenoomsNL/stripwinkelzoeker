import styled from "styled-components";
import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import {
  fetchCities,
  fetchAllStores,
  fetchActiveStores,
} from "../utils/contentful";
import { ICityFields, IStoreFields } from "../types/generated/contentful";
import {
  Hero,
  Layout,
  DescriptionText,
  PageTitle,
  StoreMap,
} from "../components";

interface StoresAroundLocationPageProps {
  allStores: IStoreFields[];
  activeStores: IStoreFields[];
  cities: ICityFields[];
}

interface Location {
  lat: number;
  lng: number;
}

const StoreMapContainer = styled.div`
  width: 100%;
  height: 600px;
`;

export const StoresAroundLocationPage = ({
  cities,
  allStores,
  activeStores,
}: StoresAroundLocationPageProps) => {
  const canonical = "/stripwinkels-in-de-buurt";
  const pageTitle = `Stripwinkels in de buurt`;

  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>(undefined);

  useEffect(() => {
    if (navigator?.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        getLocationSuccess,
        getLocationError
      );
    }
  }, []);

  function getLocationSuccess(position: any) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    setCurrentLocation({ lat, lng });
    setLoading(false);
  }

  function getLocationError() {
    setLoading(false);
  }

  return (
    <Layout
      title={pageTitle}
      header={<Hero stores={allStores} variant="compact" />}
      cities={cities}
      canonical={canonical}
    >
      <PageTitle>{pageTitle}</PageTitle>

      <DescriptionText>
        <p>
          Ben je op zoek naar een stripwinkel bij jou in de buurt? We hebben
          alle stripwinkels in Nederland en België voor je in kaart gebracht. Zo
          kun je gemakkelijk zien welke winkels er bij jou in de buurt zijn en
          waar je de nieuwste stripboeken en klassiekers kunt vinden. Of je nu
          op zoek bent naar een stripspeciaalzaak met een uitgebreid assortiment
          of een winkel waar je juist terecht kunt voor een specifieke strip, op
          onze kaart vind je het allemaal.
        </p>

        <p>
          We hebben in Nederland en België maar liefst{" "}
          <strong>{activeStores.length} stripwinkels</strong> gevonden. Dan moet
          er toch wel een stripspeciaalzaak bij jou in de buurt te vinden zijn?
        </p>

        {loading && (
          <p>
            <em>Bezig met zoeken naar stripwinkels bij jou in de buurt...</em>
          </p>
        )}

        {!loading && !currentLocation && (
          <p>
            <em>
              Om stripwinkels in de buurt te tonen hebben wij je huidige locatie
              nodig. Zorg dat je browser toestemming heeft om deze te gebruiken.
            </em>
          </p>
        )}
      </DescriptionText>

      <StoreMapContainer>
        <StoreMap
          locations={activeStores}
          center={currentLocation}
          zoom={12}
          loading={loading}
        />
      </StoreMapContainer>
    </Layout>
  );
};

export default StoresAroundLocationPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const allStoresRes = await fetchAllStores();
  const allStores = await allStoresRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  const activeStoresRes = await fetchActiveStores();
  const activeStores = await activeStoresRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  const citiesRes = await fetchCities();
  const cities = await citiesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  return {
    props: {
      allStores,
      activeStores,
      cities,
    },
  };
};
