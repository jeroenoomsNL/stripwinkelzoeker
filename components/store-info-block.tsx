import Link from "next/link";
import { IStoreFields } from "../types/generated/contentful";
import { LinkButton } from "../components";

interface StoreInfoBlockProps {
  store: IStoreFields;
  showLink?: boolean;
}

import styled from "styled-components";

export const StoreBlockContainer = styled.div`
  display: block;

  h2 {
    margin: 0.5rem 0 0;
    line-height: 1;
  }

  p {
    margin: 0.5rem 0 1rem;
  }

  a {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
`;

export const StoreBlockContent = styled.div``;

export const StoreInfoBlock = ({ store, showLink }: StoreInfoBlockProps) => (
  <StoreBlockContainer>
    <StoreBlockContent>
      <h2>{store.name}</h2>
      <p>
        <span>{store.address}</span>
        <br />
        <span>{`${store.postalCode} ${store.city}`}</span>
      </p>
      {showLink && (
        <p>
          <LinkButton
            href={`/winkel/${store.slug}`}
            title={`Meer informatie over ${store.name} in ${store.city}`}
          >
            Meer informatie
          </LinkButton>
        </p>
      )}
    </StoreBlockContent>
  </StoreBlockContainer>
);
