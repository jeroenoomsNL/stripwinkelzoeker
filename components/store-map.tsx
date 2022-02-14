import styled from "styled-components";
import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  MarkerClusterer,
  InfoWindow,
} from "@react-google-maps/api";
import { IStoreFields } from "../types/generated/contentful";
import { StoreInfoBlock } from "../components/store-info-block";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS;

interface StoreMapProps {
  locations?: IStoreFields[];
}

const options = {
  imagePath: "/marker/m", //  m1.png, m2.png, m3.png, m4.png or 5.png
  averageCenter: true,
};

export const StoreMap = ({ locations }: StoreMapProps) => {
  const [activeMarker, setActiveMarker] = useState(null);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const handleOnLoad = (map) => {
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(({ location }) =>
      bounds.extend({ lat: location.lat, lng: location.lon })
    );
    map.fitBounds(bounds);
  };

  return (
    <LoadScript googleMapsApiKey={MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} onLoad={handleOnLoad}>
        <MarkerClusterer options={options}>
          {(clusterer) =>
            locations.map((store) => (
              <Marker
                position={{
                  lat: store.location.lat,
                  lng: store.location.lon,
                }}
                clusterer={clusterer}
                key={store.slug}
                onClick={() => setActiveMarker(store.slug)}
              >
                {activeMarker === store.slug ? (
                  <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <StoreInfoBlock store={store} />
                  </InfoWindow>
                ) : null}
              </Marker>
            ))
          }
        </MarkerClusterer>
      </GoogleMap>
    </LoadScript>
  );
};
