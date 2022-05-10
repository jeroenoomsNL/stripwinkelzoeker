import styled from "styled-components";
import Link from "next/link";
import { StoreImage } from "./store-image";
import { IStoreFields } from "../types/generated/contentful";

interface StoreBlockProps {
  store: IStoreFields;
}

const Container = styled.div`
  background-color: var(--color-white);
  border: 1px solid #dcdcdc;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  cursor: pointer;

  img {
    transition: transform 0.25s ease-in-out;
    transform: scale(1.05);
  }

  &:hover {
    background-color: var(--color-primary);

    * {
      color: var(--color-white);
    }

    a {
      text-decoration: none;
    }

    img {
      transform: scale(1);
    }
  }
`;

const Content = styled.div`
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const StoreName = styled.h2`
  color: var(--color-black);
  font-size: 1.1rem;
  margin: 0 0 0.2rem 0;

  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const CityName = styled.h3`
  color: var(--color-black);
  font-size: 1rem;
  font-weight: inherit;
  font-family: inherit;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FixedImage = styled(StoreImage)`
  height: 400px;
  width: 100%;
  object-fit: cover;
`;

export const StoreBlock = ({ store }: StoreBlockProps) => (
  <Container>
    <Link href="/winkel/[slug]" as={`/winkel/${store.slug}`}>
      <a>
        <FixedImage store={store} width={400} height={200} />
        <Content>
          <StoreName>{store.name}</StoreName>
          <CityName>{store.city}</CityName>
        </Content>
      </a>
    </Link>
  </Container>
);
