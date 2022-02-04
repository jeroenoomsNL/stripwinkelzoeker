import styles from "../styles/Home.module.scss";
import { StoreImage } from "./store-image";
import { IStoreFields } from "../types/generated/contentful";
import { trackOutboundLink } from "../utils/gtag";

interface StoreBlockProps {
  store: IStoreFields;
}

export const StoreBlock = ({ store }: StoreBlockProps) => (
  <div className={styles.storeBlock} key={store.slug}>
    <StoreImage store={store} />
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
              rel="noreferrer"
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
      </p>
    </div>
  </div>
);
