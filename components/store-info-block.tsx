import styles from "../styles/Home.module.scss";
import Link from "next/link";
import { StoreImage } from "./store-image";
import { IStoreFields } from "../types/generated/contentful";

interface StoreInfoBlockProps {
  store: IStoreFields;
}

import styled from "styled-components";

export const StoreBlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StoreBlockContent = styled.div`
  padding: 2em;
`;

export const StoreInfoBlock = ({ store }: StoreInfoBlockProps) => (
  <StoreBlockContainer>
    <StoreImage store={store} clickable={false} height={200} />
    <StoreBlockContent>
      <h2>{store.name}</h2>
      <p>
        <span>{store.address}</span>
        <br />
        <span>{`${store.postalCode} ${store.city}`}</span>
      </p>
      <p>
        <Link href={`/winkel/${store.slug}`}>
          <a className="button">Meer informatie</a>
        </Link>
      </p>
    </StoreBlockContent>
  </StoreBlockContainer>
);
