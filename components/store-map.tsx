import { useState, useEffect } from "react";
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
  zoom?: number;
  center?: { lat: number; lng: number };
  loading?: boolean;
}

export const StoreMap = ({ locations, center, zoom }: StoreMapProps) => {
  const [activeMarker, setActiveMarker] = useState(null);
  const [currentMap, setMap] = useState(null);

  useEffect(() => {
    if (center && currentMap) {
      currentMap.setCenter({
        lat: center.lat,
        lng: center.lng,
      });
      currentMap.setZoom(12);
      console.log("update center", center);
      return;
    }
  }, [center, currentMap]);

  const options = {
    imagePath: "/marker/m", //  m1.png, m2.png, m3.png, m4.png or 5.png
    averageCenter: true,
  };

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const handleOnLoad = (map) => {
    setMap(map);

    if (!center && locations?.length < 2) {
      map.setCenter({
        lat: locations[0].location.lat,
        lng: locations[0].location.lon,
      });
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    locations.forEach(({ location }) =>
      bounds.extend({ lat: location.lat, lng: location.lon })
    );
    map.fitBounds(bounds);
  };

  return (
    <LoadScript googleMapsApiKey={MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={zoom || 12}
        onLoad={handleOnLoad}
      >
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
                    <StoreInfoBlock
                      store={store}
                      showLink={locations.length > 1}
                    />
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
