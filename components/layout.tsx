import styled from "styled-components";
import Head from "next/head";
import { ICityFields } from "../types/generated/contentful";
import { Container, Footer, Navigation } from "../components";

interface LayoutProps {
  cities: ICityFields[];
  header?: JSX.Element;
  canonical?: string;
  title?: string;
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled(Container)``;

export const Layout = ({
  title,
  header,
  canonical,
  cities,
  children,
}: LayoutProps) => {
  const pageTitle = title
    ? `${title} - Stripwinkelzoeker.nl`
    : "Stripwinkelzoeker.nl - Vind een stripspeciaalzaak bij jou in de buurt #steunjeboekhandel";

  return (
    <LayoutContainer>
      <Head>
        <title>{pageTitle}</title>
        <link
          rel="canonical"
          href={`https://stripwinkelzoeker.nl${canonical}`}
        />
      </Head>

      <Navigation />

      {header}

      <Main as="main">{children}</Main>

      <Footer cities={cities} />
    </LayoutContainer>
  );
};
