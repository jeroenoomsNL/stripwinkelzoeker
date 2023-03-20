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

const Main = styled(Container)`
  margin-bottom: 4rem;
`;

export const Layout = ({
  title,
  header,
  canonical,
  cities,
  children,
}: LayoutProps) => {
  const pageTitle = title
    ? `${title} - Stripwinkelzoeker.nl`
    : "Stripwinkelzoeker.nl - Vind een stripspeciaalzaak bij jou in de buurt";

  return (
    <LayoutContainer>
      <Head>
        <title>{pageTitle}</title>
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}${canonical}`}
        />
      </Head>

      <Navigation />

      {header}

      <Main as="main">{children}</Main>

      <Footer cities={cities} />
    </LayoutContainer>
  );
};
