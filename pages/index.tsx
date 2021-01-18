import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import Fuse from "fuse.js";
import classNames from "classnames/bind";

import { fetchEntries } from "../utils/contentfulPosts";

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
  const [currentStores, setStores] = useState(stores);
  const [currentQuery, setQuery] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [showDelivery, setDelivery] = useState(false);
  const [showPickup, setPickup] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const seachForm = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!useCurrentLocation) return;

    if (navigator?.geolocation) {
      setLocationLoading(true);
      setStores(stores);
      setQuery("");
      seachForm.current.reset();

      navigator.geolocation.getCurrentPosition(
        getLocationSuccess,
        getLocationError
      );
    }
  }, [useCurrentLocation, showDelivery, showPickup]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (useCurrentLocation) return;

    doFuzzySearch(currentQuery, [...stores]);
  }, [useCurrentLocation, showDelivery, showPickup]);

  function getLocationSuccess(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocationLoading(false);
    setUseCurrentLocation(true);
    getStoresByLocation(latitude, longitude);
  }

  function getLocationError() {
    setLocationLoading(false);
    setUseCurrentLocation(false);
    console.log("Unable to retrieve your location");
  }

  const getStoresByLocation = (latitude: number, longitude: number) => {
    const newStores = stores.sort((a, b) => {
      // This is untested example logic to
      // help point you in the right direction.
      var diffA =
        Number(a.location.lat) -
        Number(latitude) +
        (Number(a.location.lon) - Number(longitude));
      var diffB =
        Number(b.location.lat) -
        Number(latitude) +
        (Number(b.location.lon) - Number(longitude));

      if (diffA > diffB) {
        return 1;
      } else if (diffA < diffB) {
        return -1;
      } else {
        return 0; // same
      }
    });

    console.log(newStores);

    doFuzzySearch(currentQuery, [...newStores]);
  };

  const resetFilters = () => {
    setStores(stores);
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
      setStores(stores);
      return;
    } else {
      setQuery(query);
    }

    setUseCurrentLocation(false);
    doFuzzySearch(query, [...stores]);
  };

  const doFuzzySearch = (searchQuery: string, storesArray: Store[]) => {
    if (searchQuery && searchQuery !== "") {
      let options: Fuse.IFuseOptions<Store> = {
        threshold: 0.3,
        keys: [
          {
            name: "name",
            weight: 2,
          },
          "city",
        ],
      };
      const fuse = new Fuse(storesArray, options);
      fuse.remove((store: Store) => {
        return (
          (showDelivery && store.doesDeliver === false) ||
          (showPickup && store.doesPickup === false)
        );
      });
      const newStores: any = fuse.search(searchQuery);

      setStores(newStores.map((store: SearchItem) => store.item));
    } else {
      const newStores: Store[] = storesArray.filter((store) => {
        if (showPickup && !store.doesPickup) return false;
        if (showDelivery && !store.doesDeliver) return false;
        return true;
      });
      setStores(newStores);
    }
  };

  const Image = ({ store }: ImageProps) => {
    if (store.website) {
      return (
        <a href={store.website} target="_blank">
          <img
            src={`${store.image.fields.file.url}?fm=jpg&w=400&h=300&fit=fill`}
            className={styles.storeImage}
            width="400"
            height="300"
          />
        </a>
      );
    } else {
      return (
        <img
          src={`${store.image.fields.file.url}?fm=jpg&w=400&h=300&fit=fill`}
          className={styles.storeImage}
          width="400"
          height="300"
        />
      );
    }
  };

  let cx = classNames.bind(styles);

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
          Stripwinkel zoeker - Winkels en webshops van alle stripspeciaalzaken
          in Nederland #steunjeboekhandel
        </title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header>
        <div className={styles.wrapper}>
          <h1>
            Stripwinkelzoeker<span>.nl</span>
          </h1>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <form ref={seachForm} onSubmit={preventSubmit}>
            <input
              type="text"
              placeholder="Zoek een winkel"
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
                <span className={styles.desktopText}>Winkels in de buurt</span>
                <span className={styles.mobileText}>In de buurt</span>
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                setDelivery(!showDelivery);
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
                <span className={styles.mobileText}>Bezorgservice</span>
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                setPickup(!showPickup);
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
                <span className={styles.desktopText}>Ophalen in de winkel</span>
                <span className={styles.mobileText}>Pickup</span>
              </span>
            </button>
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
                  <div>{store.address}</div>
                  <div>{`${store.postalCode} ${store.city}`}</div>
                </p>
                <p className={styles.storeExtra}>
                  {store.phoneNumber && (
                    <div>
                      telefoon:{" "}
                      <a href={`tel:${store.phoneNumber}`}>
                        {store.phoneNumber}
                      </a>
                    </div>
                  )}
                  {store.website && (
                    <div>
                      <a href={store.website} target="_blank">
                        {store.website}
                      </a>
                    </div>
                  )}
                </p>
                <p className={styles.storeLabelContainer}>
                  {store.doesDeliver && (
                    <span className={styles.storeLabel}>
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
                    <span className={styles.storeLabel}>
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
                      <span>Ophalen mogelijk</span>
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

        {(currentQuery !== "" ||
          showDelivery ||
          showPickup ||
          (useCurrentLocation && !locationLoading)) && (
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
          <h2>Waarom deze Stripwinkelzoeker?</h2>
          <div className={styles.infoGrid}>
            <p className={styles.infoText}>
              Stripwinkelzoeker is gemaakt om de stripspeciaalzaken met fysieke
              winkels zichtbaarder te maken voor de stripliefhebber. Veel
              winkels zijn op dit moment welliswaar gesloten maar bieden wel de
              mogelijkheid om te bestellen via e-mail of een webshop. Door deze
              winkels beter vindbaar te maken hopen we dat de stripliefhebbers
              er sneller zulllen kopen.{" "}
              <a href="https://www.hebban.nl/steunjeboekhandel">
                #steunjeboekhandel
              </a>
            </p>
            <div>
              <img
                src="/steun-je-boekhandel.png"
                className={styles.infoImage}
              />
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p className={styles.wrapper}>
          Stripwinkelzoeker.nl is een initiatief van{" "}
          <a
            href="https://rebootcomics.nl?utm_source=stripwinkelzoeker&utm_medium=footer&utm_campaign=stripwinkelzoeker"
            target="_blank"
          >
            <img
              src="/reboot-comics.svg"
              alt="Reboot Comics Logo"
              className={styles.logo}
            />
          </a>
        </p>
        <p className={styles.wrapper}>
          <small>
            gemaakt met behulp van Next.js, Netlify, Contentful en{" "}
            <a href="https://fontawesome.com">FontAwesome</a>
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
