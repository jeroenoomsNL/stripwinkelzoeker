import styled from "styled-components";
import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { fetchCities, fetchStores } from "../utils/contentful";
import { ICityFields, IStoreFields } from "../types/generated/contentful";
import { Layout, DescriptionText, PageTitle, StoreMap } from "../components";

interface StoresAroundLocationPageProps {
  stores: IStoreFields[];
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
  stores,
}: StoresAroundLocationPageProps) => {
  const canonical = "/stripwinkels-in-de-buurt";
  const pageTitle = `Stripwinkels in de buurt`;

  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>(undefined);

  useEffect(() => {
    if (navigator?.geolocation) {
      console.log("getLocation");
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
    console.log("Error");
    setLoading(false);
  }

  return (
    <Layout title={pageTitle} cities={cities} canonical={canonical}>
      <PageTitle>{pageTitle}</PageTitle>

      <DescriptionText>
        <p>
          We hebben in Nederland en België maar liefst{" "}
          <strong>{stores.length} stripwinkels</strong> gevonden. Dan moet er
          toch wel een stripspeciaalzaak bij jou in de buurt te vinden zijn?
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
          locations={stores}
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
  const storesRes = await fetchStores();
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
      cities,
    },
  };
};
