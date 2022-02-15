import styled from "styled-components";
import Link from "next/link";
import { IStoreFields } from "../types/generated/contentful";
import { Container, Icon, SearchBar } from "../components";

interface HeroContainerProps {
  variant?: "default" | "compact";
}

interface HeroProps {
  stores: IStoreFields[];
  variant?: "default" | "compact";
}

const HeroContainer = styled.div<HeroContainerProps>`
  background-color: #ddd;
  min-height: ${(props) => (props.variant === "default" ? "300px" : "150px")};
  position: relative;

  @media (min-width: 375px) {
    min-height: ${(props) => (props.variant === "default" ? "250px" : "150px")};
  }

  @media (min-width: 768px) {
    min-height: ${(props) => (props.variant === "default" ? "500px" : "150px")};
  }
`;

const ContentContainer = styled(Container)`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  z-index: 2;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  filter: grayscale(100%);
  object-fit: cover;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.5;
`;

const Suggestions = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0 0;
  gap: 1em;
`;

const Suggestion = styled.a`
  display: flex;
  align-items: center;
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  font-weight: 300;
  font-family: var(--font-title);
  white-space: nowrap;
  font-size: 0.7rem;
  gap: 0.5rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  &:hover {
    background-color: var(--color-primary-dark);
    text-decoration: none;
  }
`;

export const Hero = ({ stores, variant = "default" }: HeroProps) => {
  return (
    <HeroContainer variant={variant}>
      <ContentContainer>
        <SearchBar stores={stores} />
        {variant === "default" && (
          <Suggestions>
            <Link href="/stripwinkels-in-de-buurt" passHref>
              <Suggestion>
                <Icon name="crosshairs" /> Stripwinkels in de buurt
              </Suggestion>
            </Link>
            <Link href="/land/nederland" passHref>
              <Suggestion>
                <span>🇳🇱</span> Stripwinkels in Nederland
              </Suggestion>
            </Link>
            <Link href="/land/belgie" passHref>
              <Suggestion>
                <span>🇧🇪</span> Stripwinkels in België
              </Suggestion>
            </Link>
          </Suggestions>
        )}
      </ContentContainer>
      <HeroImage src="https://images.ctfassets.net/tat9577n8aak/3n9SMhPyHlBZDZifUWgwiY/e34d2eb64cc41925ac6eb00766898182/jopo-de-pojo.jpg?q=70" />
      {/* <HeroImage src="https://images.ctfassets.net/tat9577n8aak/30r8XhpHlDMBED389IKPZI/484384c2b66d0c8dd3dc432fc0b77516/yendor.jpg" /> */}
    </HeroContainer>
  );
};
