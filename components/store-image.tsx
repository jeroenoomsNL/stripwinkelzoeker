import styles from "../styles/Home.module.scss";
import { trackOutboundLink } from "../utils/gtag";
import { Store } from "../types/store";

interface StoreImageProps {
  store: Store;
}

export const StoreImage = ({ store }: StoreImageProps) => {
  if (store.website) {
    return (
      <a
        href={store.website}
        target="_blank"
        rel="noreferrer"
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
