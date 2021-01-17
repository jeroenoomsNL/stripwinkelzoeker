import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import Fuse from "fuse.js";
import { classNames } from "classnames";

import { fetchEntries } from "../utils/contentfulPosts";

import styles from "../styles/Home.module.scss";
import { GetStaticProps } from "next";

interface HomePageProps {
  stores: Store[];
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
}

interface SearchItem {
  item: Store;
}

export const HomePage = ({ stores }: HomePageProps) => {
  const [currentStores, setStores] = useState(stores);
  const [currentQuery, setQuery] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const seachForm = useRef(null);

  useEffect(() => {
    if (!useCurrentLocation) return;

    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getLocationSuccess,
        getLocationError
      );
    }
  }, [useCurrentLocation]);

  function getLocationSuccess(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getStoresByLocation(latitude, longitude);
  }

  function getLocationError() {
    console.log("Unable to retrieve your location");
  }

  const getStoresByLocation = (latitude: number, longitude: number) => {
    console.log(latitude, longitude);

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

    setStores(newStores);
  };

  const resetFilters = () => {
    setStores(stores);
    setQuery("");
    seachForm.current.reset();
  };

  const handleChange = (change: any) => {
    const query = change?.target?.value;

    if (!query || query === "") {
      setStores(stores);
      return;
    } else {
      setQuery(query);
    }

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
    const fuse = new Fuse(stores, options);
    const newStores: any = fuse.search(query);

    setStores(newStores.map((store: SearchItem) => store.item));
  };

  var liClasses = classNames({
    "main-class": true,
    activeClass: self.state.focused === index,
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
          <form ref={seachForm}>
            <input
              type="text"
              placeholder="Zoek een winkel of webshop"
              className={styles.searchInput}
              onChange={handleChange}
            />
          </form>
          <button
            type="button"
            onClick={() => {
              setUseCurrentLocation(true);
            }}
            className={styles.iconButton}
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
            </svg>{" "}
            Winkels in de buurt
          </button>

          <button
            type="button"
            onClick={() => {
              setUseCurrentLocation(true);
            }}
            className={styles.iconButton}
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
            </svg>{" "}
            Winkels in de buurt
          </button>

          <button
            type="button"
            onClick={() => {
              setUseCurrentLocation(true);
            }}
            className={styles.iconButton}
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
            </svg>{" "}
            Winkels in de buurt
          </button>
        </div>

        <div className={styles.storeBlocks}>
          {currentStores.map((store) => (
            <div className={styles.storeBlock} key={store.id}>
              <img
                src={`${store.image.fields.file.url}?w=400&h=300&fit=fill`}
                className={styles.storeImage}
                width="400"
                height="300"
              />
              <h3 className={styles.storeTitle}>{store.name}</h3>
              <p className={styles.storeAddress}>
                {store.address}
                <br />
                {`${store.postalCode} ${store.city}`}
              </p>
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

        {currentQuery !== "" && (
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

        <div className={styles.info}>
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
          deze website is een initiatief van{" "}
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
