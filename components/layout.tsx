import styles from "../styles/Home.module.scss";
import Head from "next/head";
import { Header } from "./header";
import { Footer } from "./footer";
import { City } from "../types/city";

interface LayoutProps {
  cities: City[];
  canonical?: string;
  title?: string;
  children: React.ReactNode;
}

export const Layout = ({ title, canonical, cities, children }: LayoutProps) => {
  const pageTitle = title
    ? `${title} - Stripwinkelzoeker.nl `
    : "Stripwinkelzoeker.nl - Vind een stripspeciaalzaak bij jou in de buurt #steunjeboekhandel";

  return (
    <div className={styles.container}>
      <Head>
        <title>{pageTitle}</title>
        <link
          rel="canonical"
          href={`https://stripwinkelzoeker.nl${canonical}`}
        />
      </Head>

      <Header />

      <main className={styles.main}>{children}</main>

      <Footer cities={cities} />
    </div>
  );
};
