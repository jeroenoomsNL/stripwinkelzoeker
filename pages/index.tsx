import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import Fuse from "fuse.js";
import classNames from "classnames/bind";

import { fetchEntries } from "../utils/contentfulPosts";
import { GA_TRACKING_ID } from "../utils/gtag";

import styles from "../styles/Home.module.scss";
import { GetStaticProps } from "next";

interface HomePageProps {
  stores: Store[];
}

interface ImageProps {
  store: Store;
}

interface Store {
  address: string;
  city: string;
  country: string;
  id: string;
  image: {
    fields: {
      file: {
        url: string;
      };
      title: string;
    };
  };
  location: { lon: number; lat: number };
  name: string;
  orders: string;
  postalCode: string;
  website: string;
  phoneNumber: string;
  doesDeliver: boolean;
  doesPickup: boolean;
  deliversInRegionOnly: boolean;
}

interface SearchItem {
  item: Store;
}

export const HomePage = ({ stores }: HomePageProps) => {
  const [showBelgium, setShowBelgium] = useState(false);
  const [currentStores, setStores] = useState(stores);
  const [currentQuery, setQuery] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [showDelivery, setDelivery] = useState(false);
  const [showPickup, setPickup] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({});
  const [showWarning, setShowWarning] = useState(true);
  const useLocationStateRef = useRef(useCurrentLocation);
  const seachForm = useRef(null);

  useEffect(() => {
    setStores(randomStores());
    const checkedWarning = localStorage.getItem("checkedWarning");
    if (checkedWarning) {
      setShowWarning(false);
    }
  }, []);

  useEffect(() => {
    if (!showWarning) {
      localStorage.setItem("checkedWarning", "true");
    }
  }, [showWarning]);

  useEffect(() => {
    const loc: any = currentLocation;
    getStoresByLocation(loc.latitude, loc.longitude);
  }, [currentLocation]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!useCurrentLocation) return;

    if (navigator?.geolocation) {
      setLocationLoading(true);
      seachForm.current.reset();
      setQuery("");
      setShowBelgium(false);

      navigator.geolocation.getCurrentPosition(
        getLocationSuccess,
        getLocationError
      );
    }
  }, [useCurrentLocation, showDelivery, showPickup, showBelgium]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!useCurrentLocation) {
      setLocationLoading(false);
    }

    if (useCurrentLocation) return;
    doFuzzySearch(currentQuery, randomStores());
  }, [useCurrentLocation, showDelivery, showPickup, showBelgium]);

  function getLocationSuccess(position: any) {
    if (!useLocationStateRef) {
      setLocationLoading(false);
      return;
    }

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setCurrentLocation({ latitude, longitude });
    setLocationLoading(false);
  }

  function getLocationError() {
    setLocationLoading(false);

    if (!useLocationStateRef) return;

    setUseCurrentLocation(false);
    doFuzzySearch("", randomStores());
    console.log("Unable to retrieve location");
  }

  const trackOutboundLink = function (url: string) {
    gtag("event", "klik", {
      event_category: "uitgaand",
      event_label: url,
      transport_type: "beacon",
    });
  };

  const trackFilter = function (filter: string) {
    gtag("event", "klik", {
      event_category: "filters",
      event_label: filter,
      transport_type: "beacon",
    });
  };

  function randomStores() {
    const filteredStores = stores.filter(
      (store) =>
        (!showBelgium && store.country === "Nederland") ||
        (showBelgium && store.country === "België")
    );
    return filteredStores.sort(() => Math.random() - 0.5);
  }

  const getStoresByLocation = (latitude: number, longitude: number) => {
    const newStores = stores.map((store) => {
      return {
        ...store,
        distance: calcDistance(
          longitude,
          latitude,
          store.location.lon,
          store.location.lat
        ),
      };
    });

    const sortedStores = newStores.sort((a, b) =>
      a.distance > b.distance ? 1 : -1
    );

    doFuzzySearch(currentQuery, [...sortedStores], 12);
  };

  const calcDistance = (
    lon1: number,
    lat1: number,
    lon2: number,
    lat2: number
  ) => {
    var R = 6371; // Radius of the earth in km
    var dLat = ((lat2 - lat1) * Math.PI) / 180; // Javascript functions in radians
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  const resetFilters = () => {
    setStores(randomStores());
    setQuery("");
    setUseCurrentLocation(false);
    setDelivery(false);
    setPickup(false);
    seachForm.current.reset();
  };

  const preventSubmit = (event: any) => {
    event.preventDefault();
  };

  const handleSearch = (event: any) => {
    const query = event?.target?.value;

    if (!query || query === "") {
      setStores(randomStores());
      return;
    } else {
      setQuery(query);
    }

    setUseCurrentLocation(false);
    doFuzzySearch(query, randomStores());
  };

  const doFuzzySearch = (
    searchQuery: string,
    storesArray: Store[],
    limit?: number
  ) => {
    let foundStores: any;

    if (searchQuery && searchQuery !== "") {
      let options: Fuse.IFuseOptions<Store> = {
        threshold: 0.3,
        keys: [
          {
            name: "name",
            weight: 2,
          },
          "city",
          "image.fields.title",
        ],
      };
      const fuse = new Fuse(storesArray, options);
      fuse.remove((store: Store) => {
        return (
          (showDelivery && store.doesDeliver === false) ||
          (showPickup && store.doesPickup === false)
        );
      });
      foundStores = fuse
        .search(searchQuery)
        .map((store: SearchItem) => store.item);
    } else {
      foundStores = storesArray.filter((store) => {
        if (showPickup && !store.doesPickup) return false;
        if (showDelivery && !store.doesDeliver) return false;
        return true;
      });
    }

    const newStores = limit ? foundStores.slice(0, limit) : foundStores;

    setStores([...newStores]);
  };

  const Image = ({ store }: ImageProps) => {
    if (store.website) {
      return (
        <a
          href={store.website}
          target="_blank"
          title={store.image.fields?.title}
          onClick={() => {
            trackOutboundLink(store.website);
            return false;
          }}
        >
          <img
            src={`${store.image.fields?.file?.url}?fm=jpg&w=400&h=300&fit=fill`}
            className={styles.storeImage}
            width="400"
            height="300"
            alt={store.image.fields?.title}
          />
        </a>
      );
    } else {
      return (
        <img
          src={`${store.image.fields?.file?.url}?fm=jpg&w=400&h=300&fit=fill`}
          className={styles.storeImage}
          width="400"
          height="300"
          alt={store.image.fields?.title}
        />
      );
    }
  };

  let cx = classNames.bind(styles);

  const headerClasses = cx({
    wrapper: true,
    headerContainer: true,
  });

  const locationButtonClasses = cx({
    iconButton: true,
    "iconButton--active": useCurrentLocation,
    "iconButton--loading": locationLoading,
  });

  const pickupButtonClasses = cx({
    iconButton: true,
    "iconButton--active": showPickup,
  });

  const deliveryButtonClasses = cx({
    iconButton: true,
    "iconButton--active": showDelivery,
  });

  const belgiumButtonClasses = cx({
    iconButton: true,
    "iconButton--active": showBelgium,
  });

  const spinnerClasses = cx({
    icon: true,
    spinner: true,
  });

  const contentSpinnerClasses = cx({
    contentSpinner: true,
    "contentSpinner--spinning": locationLoading,
  });

  const storeBlocksClasses = cx({
    storeBlocks: true,
    "storeBlocks--hidden": locationLoading,
  });

  const infoClasses = cx({
    info: true,
    "info--hidden": locationLoading,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>
          Stripwinkelzoeker.nl - Vind een stripspeciaalzaak bij jou in de buurt
          #steunjeboekhandel
        </title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="Stripwinkelzoeker.nl brengt alle stripspeciaalzaken van Nederland en België in kaart en laat zien of de winkel bij jouw in de buurt ook thuisbezorgt."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Stripwinkelzoeker.nl" />
        <meta
          property="og:description"
          content="Stripwinkelzoeker.nl brengt alle stripspeciaalzaken van Nederland en België in kaart en laat zien of de winkel bij jouw in de buurt ook thuisbezorgt."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stripwinkelzoeker.nl" />
        <link rel="canonical" href="https://stripwinkelzoeker.nl" />
        <link rel="manifest" href="manifest.json" />
        <link rel="apple-touch-icon" sizes="512x512" href="icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#d10c04" />
        <meta name="apple-mobile-web-app-title" content="Stripwinkels" />
        <meta
          property="og:image"
          content="https://stripwinkelzoeker.nl/stripwinkelzoeker-header-2.png"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
          `,
          }}
        />
      </Head>

      <header className={styles.header}>
        <div className={headerClasses}>
          <h1>
            Stripwinkelzoeker<span>.nl</span>
          </h1>
          <h3>Koop je strips bij een stripspeciaalzaak!</h3>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.searchGrid}>
          <div className={styles.searchContainer}>
            <form ref={seachForm} onSubmit={preventSubmit}>
              <input
                type="text"
                placeholder="Zoek een stripwinkel"
                className={styles.searchInput}
                onChange={handleSearch}
              />
            </form>
            <div className={styles.filterButtons}>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setUseCurrentLocation(!useCurrentLocation);
                  trackFilter("Winkels in de buurt");
                }}
                className={locationButtonClasses}
              >
                <svg
                  className={styles.icon}
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="currentColor"
                    d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"
                  ></path>
                </svg>
                <svg
                  className={spinnerClasses}
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
                  ></path>
                </svg>{" "}
                <span className={styles.buttonText}>
                  <span className={styles.desktopText}>
                    Winkels in de buurt
                  </span>
                  <span className={styles.mobileText} aria-hidden="true">
                    In de buurt
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setDelivery(!showDelivery);
                  trackFilter("Winkels met bezorgservice");
                }}
                className={deliveryButtonClasses}
              >
                <svg
                  className={styles.icon}
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"
                  ></path>
                </svg>
                <span className={styles.buttonText}>
                  <span className={styles.desktopText}>
                    Winkels met bezorgservice
                  </span>
                  <span className={styles.mobileText} aria-hidden="true">
                    Bezorgservice
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setPickup(!showPickup);
                  trackFilter("Afhalen op afspraak");
                }}
                className={pickupButtonClasses}
              >
                <svg
                  className={styles.icon}
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M496 224c-79.6 0-144 64.4-144 144s64.4 144 144 144 144-64.4 144-144-64.4-144-144-144zm64 150.3c0 5.3-4.4 9.7-9.7 9.7h-60.6c-5.3 0-9.7-4.4-9.7-9.7v-76.6c0-5.3 4.4-9.7 9.7-9.7h12.6c5.3 0 9.7 4.4 9.7 9.7V352h38.3c5.3 0 9.7 4.4 9.7 9.7v12.6zM320 368c0-27.8 6.7-54.1 18.2-77.5-8-1.5-16.2-2.5-24.6-2.5h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h347.1c-45.3-31.9-75.1-84.5-75.1-144zm-96-112c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128z"
                  ></path>
                </svg>
                <span className={styles.buttonText}>
                  <span className={styles.desktopText}>
                    Afhalen op afspraak
                  </span>
                  <span className={styles.mobileText} aria-hidden="true">
                    Pickup
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setShowBelgium(!showBelgium);
                  setUseCurrentLocation(false);
                  trackFilter("Winkels in België");
                }}
                className={belgiumButtonClasses}
              >
                <svg
                  className={styles.icon}
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21.013 21.013"
                >
                  <g>
                    <path
                      fill="currentColor"
                      d="M20.896,10.687c-0.825-1.417-1.865-2.526-3.721-2.549c0.314-0.622,0.584-1.116,0.816-1.63
		c0.145-0.319,0.263-0.793-0.163-0.879c-0.8-0.164-1.283-1.095-2.236-0.852c-0.52,0.132-1.126-0.053-1.277-0.505
		c-0.438-1.317-1.606-0.713-2.351-0.853c-1.226-0.23-2.376,0.441-3.348,1.274C8.231,5.024,4.971,5.022,4.81,4.637
		C4.431,3.737,3.88,4.14,3.385,4.34C2.616,4.647,1.91,5.13,1.126,5.372c-1.298,0.401-1.317,1.241-0.841,2.205
		c0.415,0.841,0.956,1.69,2.146,1.15C2.976,8.482,3.506,8.52,3.61,9.119c0.186,1.062,0.769,1.474,1.775,1.481
		c0.413,0.005,0.564,0.271,0.637,0.663c0.082,0.442,0.28,0.484,0.813,0.415c1.552-0.208,2.162,0.354,2.039,1.917
		c-0.056,0.718,0.146,0.831,0.713,0.897c1.18,0.141,2.147-0.193,2.841-1.293c-0.014,0.967-0.183,2.03,0.694,2.414
		c1.042,0.457,2.005,0.932,2.844,1.708c0.643,0.596,1.462,0.224,2.039-0.066c0.689-0.347,0.276-0.966-0.028-1.514
		c-0.551-0.981,0.156-2.403,1.295-2.729C20.49,12.667,21.333,11.439,20.896,10.687z"
                    />
                  </g>
                </svg>

                <span className={styles.buttonText}>
                  <span className={styles.desktopText}>
                    Toon winkels in België
                  </span>
                  <span className={styles.mobileText} aria-hidden="true">
                    België
                  </span>
                </span>
              </button>
            </div>
          </div>
          <div className={styles.searchImageContainer}>
            <img
              src="/stripwinkelzoeker-illustratie.png"
              className={styles.searchImage}
              alt="Stripwinkelzoeker"
            />
          </div>
        </div>

        <div className={contentSpinnerClasses}>
          <svg
            className={spinnerClasses}
            aria-hidden="true"
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
            ></path>
          </svg>
        </div>

        {showWarning && (
          <p className={styles.pickupWarning}>
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 352 512"
              className={styles.pickUpCloseButton}
              onClick={() => {
                setShowWarning(false);
              }}
            >
              <path
                fill="currentColor"
                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
              ></path>
            </svg>
            <strong>Let op!</strong> Alle winkels in Nederland zijn op dit
            moment gesloten, dus afhalen in de winkel is niet mogelijk. Sommige
            winkels bieden een alternatieve oplossing. Neem contact op met de
            winkel om dit te bespreken.
          </p>
        )}

        {useCurrentLocation && !locationLoading && (
          <h2 className={styles.resultsTitle}>Stripwinkels in de buurt</h2>
        )}

        <div className={storeBlocksClasses}>
          {currentStores.map((store) => (
            <div className={styles.storeBlock} key={store.id}>
              <Image store={store} />
              <div className={styles.storeContent}>
                <h3 className={styles.storeTitle}>{store.name}</h3>
                <p className={styles.storeAddress}>
                  <span>{store.address}</span>
                  <span>{`${store.postalCode} ${store.city}`}</span>
                </p>
                <p className={styles.storeExtra}>
                  {store.phoneNumber && (
                    <span>
                      <svg
                        className={styles.icon}
                        aria-hidden="true"
                        focusable="false"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"
                        ></path>
                      </svg>
                      <a
                        href={`tel:${store.phoneNumber}`}
                        title={`Telefoonnummer ${store.name} ${store.city}`}
                      >
                        {store.phoneNumber}
                      </a>
                    </span>
                  )}
                  {store.website && (
                    <span>
                      <svg
                        className={styles.icon}
                        aria-hidden="true"
                        focusable="false"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 496 512"
                      >
                        <path
                          fill="currentColor"
                          d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"
                        ></path>
                      </svg>
                      <a
                        href={store.website}
                        target="_blank"
                        title={`Website ${store.name} ${store.city}`}
                        onClick={() => {
                          trackOutboundLink(store.website);
                          return false;
                        }}
                      >
                        {store.website}
                      </a>
                    </span>
                  )}
                </p>
                <p className={styles.storeLabelContainer}>
                  {store.doesDeliver && (
                    <span
                      className={styles.storeLabel}
                      title={`${
                        store.deliversInRegionOnly
                          ? `${store.name} bezorgt in de regio ${store.city}`
                          : `${store.name} verzendt jouw bestelling naar je thuis adres`
                      }`}
                    >
                      <svg
                        className={styles.icon}
                        aria-hidden="true"
                        focusable="false"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path
                          fill="currentColor"
                          d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"
                        ></path>
                      </svg>
                      <span>
                        {store.deliversInRegionOnly
                          ? `Bezorgt in de regio`
                          : `Bezorgservice`}
                      </span>
                    </span>
                  )}
                  {store.doesPickup && (
                    <span
                      className={styles.storeLabel}
                      title={`Je kunt je bestelling bij ${store.name} ${store.city} afhalen volgens afspraak.`}
                    >
                      <svg
                        className={styles.icon}
                        aria-hidden="true"
                        focusable="false"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path
                          fill="currentColor"
                          d="M496 224c-79.6 0-144 64.4-144 144s64.4 144 144 144 144-64.4 144-144-64.4-144-144-144zm64 150.3c0 5.3-4.4 9.7-9.7 9.7h-60.6c-5.3 0-9.7-4.4-9.7-9.7v-76.6c0-5.3 4.4-9.7 9.7-9.7h12.6c5.3 0 9.7 4.4 9.7 9.7V352h38.3c5.3 0 9.7 4.4 9.7 9.7v12.6zM320 368c0-27.8 6.7-54.1 18.2-77.5-8-1.5-16.2-2.5-24.6-2.5h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h347.1c-45.3-31.9-75.1-84.5-75.1-144zm-96-112c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128z"
                        ></path>
                      </svg>
                      <span>Afhalen mogelijk</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!currentStores.length && (
          <div className={styles.notFound}>
            <h2>Niets gevonden</h2>
            <p>
              Er zijn geen winkels gevonden met jouw zoekopdracht. Probeer het{" "}
              <a href="#" onClick={resetFilters}>
                opnieuw
              </a>
              .
            </p>
          </div>
        )}

        {!locationLoading &&
          (useCurrentLocation ||
            showDelivery ||
            showPickup ||
            currentQuery !== "") && (
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={resetFilters}
                className={styles.button}
              >
                Toon alle winkels
              </button>
            </div>
          )}

        <div className={infoClasses}>
          <div className={styles.infoGrid}>
            <div>
              <h2>Waarom een Stripwinkelzoeker?</h2>
              <p className={styles.infoText}>
                Stripwinkelzoeker.nl is gemaakt om de stripspeciaalzaken met
                fysieke winkels zichtbaarder te maken voor de stripliefhebber.
                Veel winkels zijn op dit moment welliswaar gesloten maar bieden
                wel de mogelijkheid om te bestellen via e-mail of een webshop.
                Door deze winkels beter vindbaar te maken hopen we dat de
                stripliefhebbers er sneller zulllen kopen.{" "}
                <a
                  href="https://www.hebban.nl/steunjeboekhandel"
                  target="_blank"
                >
                  #steunjeboekhandel
                </a>
              </p>
            </div>
            <div>
              <img
                src="/stripwinkelzoeker-illustratie.png"
                className={styles.infoImage}
                alt="Stripwinkelzoeker"
              />
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p className={styles.wrapper}>
          <a
            href="https://rebootcomics.nl?utm_source=stripwinkelzoeker&utm_medium=footer&utm_campaign=stripwinkelzoeker"
            target="_blank"
            onClick={() => {
              trackOutboundLink("https://rebootcomics.nl");
              return false;
            }}
          >
            <img
              src="/reboot-comics.svg"
              alt="Reboot Comics Logo"
              className={styles.rebootLogo}
              aria-label="Reboot Comics"
            />
          </a>
        </p>
        <p className={styles.wrapper}>
          Stripwinkelzoeker.nl is een initiatief van{" "}
          <a
            href="https://rebootcomics.nl?utm_source=stripwinkelzoeker&utm_medium=footer&utm_campaign=stripwinkelzoeker"
            className={styles.rebootLink}
            target="_blank"
            onClick={() => {
              trackOutboundLink("https://rebootcomics.nl");
              return false;
            }}
          >
            Reboot Comics
          </a>
        </p>
        <p className={styles.wrapper}>Illustratie: Johan Neefjes</p>
        <p className={styles.wrapper}>
          <small>
            gemaakt met behulp van{" "}
            <a href="https://nextjs.org" title="Next.js" target="_blank">
              Next.js
            </a>
            ,{" "}
            <a href="https://www.netlify.com" title="Netlify" target="_blank">
              Netlify
            </a>
            ,{" "}
            <a
              href="https://www.contentful.com"
              title="Contentful"
              target="_blank"
            >
              Contentful
            </a>
            ,{" "}
            <a
              href="https://fontawesome.com/license"
              title="FontAwesome"
              target="_blank"
            >
              FontAwesome
            </a>{" "}
            and{" "}
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
              target="_blank"
            >
              Flaticon.com
            </a>
          </small>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetchEntries();
  const stores = await res.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  return {
    props: {
      stores,
    },
  };
};
