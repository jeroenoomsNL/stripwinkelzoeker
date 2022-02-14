import styled from "styled-components";
import Link from "next/link";

const SiteTitle = styled.a`
  font-family: var(--font-title);
  color: white;
  font-style: italic;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 300;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  strong {
    font-weight: bold;
  }

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

export const Logo = () => (
  <Link href="/" passHref>
    <SiteTitle>
      <strong>Strip</strong>winkelzoeker
    </SiteTitle>
  </Link>
);
