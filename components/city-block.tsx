import styled from "styled-components";
import Link from "next/link";
import { ICityFields } from "../types/generated/contentful";
import { Icon } from "../components";

interface StoreBlockProps {
  city: ICityFields;
}

interface ContainerProps {
  readonly $image: string;
}

const Container = styled.div<ContainerProps>`
  background-image: url(${(props) => props.$image});
  background-size: cover;
  border-radius: 1rem;
  position: relative;
  min-height: 200x;
  box-shadow: inset 0 -50px 50px rgb(0, 0, 0, 20%);

  @supports (aspect-ratio: 16/9) {
    aspect-ratio: 16/9;
    min-height: auto;
  }

  &:hover {
    cursor: pointer;
  }
`;

const CitySubTitle = styled.span`
  font-size: 1rem;
`;

const CityName = styled.a`
  color: var(--color-white);
  font-family: var(--font-title);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  width: 100%;
  height: 100%;

  &:hover {
    text-decoration: none;
  }
`;

const LicenceContainer = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  max-width: 80%;

  &:hover {
    & > span {
      display: none;
    }

    & > div {
      display: block;
    }
  }
`;

const LicenceIcon = styled.span`
  color: var(--color-white);
`;

const Licence = styled.div`
  display: none;
  background-color: var(--color-white);
  font-family: var(--font-title);
  text-decoration: none;
  font-size: 0.7rem;
  line-height: 1.6;
  border-radius: 5px;
  padding: 0.5rem;
  right: 0;
  bottom: 0;

  a {
    white-space: nowrap;
  }
`;

export const CityBlock = ({ city }: StoreBlockProps) => {
  const licence: any = city.imageLicence?.fields;

  return (
    <Container
      $image={`${city.image.fields?.file?.url}?fm=jpg&w=800&h=450&fit=fill&q=90`}
    >
      <Link
        href="/plaats/[slug]"
        as={`/plaats/${city.slug}`}
        legacyBehavior
        passHref
      >
        <CityName>
          <CitySubTitle>Stripwinkels in </CitySubTitle>
          <span>{city.name}</span>
        </CityName>
      </Link>
      {licence && (
        <LicenceContainer>
          <LicenceIcon>
            <Icon name="info" />
          </LicenceIcon>
          <Licence>
            &quot;<a href={licence.imageUrl}>{licence.name}</a>&quot; by{" "}
            <a href={licence.authorUrl}>{licence.author}</a> is licensed under{" "}
            <a href={licence.licenceUrl}>{licence.licence}</a>.
          </Licence>
        </LicenceContainer>
      )}
    </Container>
  );
};
