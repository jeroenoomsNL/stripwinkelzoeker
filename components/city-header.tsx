import styled from "styled-components";
import { ICityFields } from "../types/generated/contentful";
import { Container } from ".";

interface CityHeaderProps {
  city: ICityFields;
}

const HeroImage = styled.img`
  display: block;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  height: 200px;
  object-fit: cover;

  @media (min-width: 768px) {
    height: 300px;
  }

  @media (min-width: 1400px) {
    height: 500px;
  }
`;

const Licence = styled.div`
  text-align: right;
  font-family: var(--font-title);
  font-size: 0.7rem;
  margin: 0.5rem 0;

  a {
    white-space: nowrap;
  }
`;

export const CityHeader = ({ city }: CityHeaderProps) => {
  const licence = city.imageLicence.fields;

  return (
    <div>
      <HeroImage src={`${city.image.fields.file.url}?q=70&w=1500`} />
      <Container>
        <Licence>
          &quot;<a href={licence.imageUrl}>{licence.name}</a>&quot; by{" "}
          <a href={licence.authorUrl}>{licence.author}</a> is licensed under{" "}
          <a href={licence.licenceUrl}>{licence.licence}</a>.
        </Licence>
      </Container>
    </div>
  );
};
