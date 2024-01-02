import styled from "styled-components";
import Link from "next/link";
import { trackOutboundLink } from "../utils/gtag";
import { ICityFields } from "../types/generated/contentful";
import { Icon, Container, Logo } from "../components";

const FooterWrapper = styled.footer`
  background-color: var(--color-primary-dark);
  width: 100%;
  border-top: 1px solid #eaeaea;
  padding: 2rem 20px;
  color: var(--color-white);
  margin-top: auto;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;

    & > div:nth-child(1) {
      width: 60%;
    }
  }
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: underline;
`;

const LinkListTitle = styled.h3`
  color: var(--color-white);
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  line-height: 1.7;
`;

interface FooterProps {
  cities: ICityFields[];
}

export const Footer = ({ cities }: FooterProps) => (
  <>
    <FooterWrapper>
      <Container>
        <FlexContainer>
          <div>
            <Logo />
            <p>
              Vind jouw favoriete stripboekhandel of stripspeciaalzaak met
              Stripwinkelzoeker - dé website voor het vinden van klassieke
              strips en de nieuwste releases bij jou in de buurt. Veel
              leesplezier!
            </p>
            <p>
              Stripwinkelzoeker.nl is een initiatief van{" "}
              <FooterLink
                href="https://striplezer.nl?utm_source=stripwinkelzoeker&utm_medium=footer&utm_campaign=stripwinkelzoeker"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackOutboundLink("https://striplezer.nl");
                  return false;
                }}
              >
                Striplezer
              </FooterLink>{" "}
              en{" "}
              <FooterLink
                href="https://rebootcomics.nl?utm_source=stripwinkelzoeker&utm_medium=footer&utm_campaign=stripwinkelzoeker"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackOutboundLink("https://rebootcomics.nl");
                  return false;
                }}
              >
                Reboot Comics
              </FooterLink>
              .
            </p>
          </div>
          <div>
            <LinkListTitle>Vind een stripspeciaalzaak</LinkListTitle>
            <LinkList>
              <li>
                <FooterLink href={`/stripwinkels-in-de-buurt`}>
                  Stripwinkels bij jou in de buurt
                </FooterLink>
              </li>
              {cities.map((city) => (
                <li key={city.slug}>
                  <FooterLink href={`/plaats/${city.slug}`}>
                    Stripwinkels in {city.name}
                  </FooterLink>
                </li>
              ))}
            </LinkList>
          </div>
        </FlexContainer>
      </Container>
    </FooterWrapper>
  </>
);
