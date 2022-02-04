import styles from "../styles/Home.module.scss";
import { trackOutboundLink } from "../utils/gtag";
import { ICityFields } from "../types/generated/contentful";
import Link from "next/link";

interface FooterProps {
  cities: ICityFields[];
}

export const Footer = ({ cities }: FooterProps) => (
  <>
    <p className={styles.footerLinksContainer}>
      <h3>Vind Stripwinkels bij jou in de buurt</h3>
      <div className={styles.footerLinks}>
        {cities.map((city) => (
          <div className={styles.footerLink} key={city.slug}>
            <Link href={`/plaats/${city.slug}`}>
              <a>Stripwinkels in {city.name}</a>
            </Link>
          </div>
        ))}
      </div>
    </p>
    <footer>
      <p className={styles.wrapper}>
        Stripwinkelzoeker.nl is een initiatief van{" "}
        <a
          href="https://rebootcomics.nl?utm_source=stripwinkelzoeker&utm_medium=footer&utm_campaign=stripwinkelzoeker"
          className={styles.footerLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            trackOutboundLink("https://rebootcomics.nl");
            return false;
          }}
        >
          Reboot Comics
        </a>{" "}
        en{" "}
        <a
          href="https://striplezer.nl?utm_source=stripwinkelzoeker&utm_medium=footer&utm_campaign=stripwinkelzoeker"
          className={styles.footerLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            trackOutboundLink("https://striplezer.nl");
            return false;
          }}
        >
          Striplezer
        </a>
      </p>
      <p className={styles.wrapper}>
        Mis je een winkel of is de informatie niet juist? Neem contact met ons
        op via{" "}
        <a
          href="https://facebook.com/striplezer"
          className={styles.footerLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            trackOutboundLink("https://facebook.com/striplezer");
            return false;
          }}
        >
          Facebook
        </a>
      </p>
      <p className={styles.wrapper}>
        Illustratie:{" "}
        <a
          href="https://www.roughmen.nl/johan-neefjes"
          className={styles.footerLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            trackOutboundLink("https://www.roughmen.nl/johan-neefjes");
            return false;
          }}
        >
          Johan Neefjes
        </a>
      </p>
      <p className={styles.wrapper}>
        <small>
          gemaakt met behulp van{" "}
          <a
            href="https://nextjs.org"
            title="Next.js"
            target="_blank"
            rel="noreferrer"
          >
            Next.js
          </a>
          ,{" "}
          <a
            href="https://www.netlify.com"
            title="Netlify"
            target="_blank"
            rel="noreferrer"
          >
            Netlify
          </a>
          ,{" "}
          <a
            href="https://www.contentful.com"
            title="Contentful"
            target="_blank"
            rel="noreferrer"
          >
            Contentful
          </a>
          ,{" "}
          <a
            href="https://fontawesome.com/license"
            title="FontAwesome"
            target="_blank"
            rel="noreferrer"
          >
            FontAwesome
          </a>{" "}
          and{" "}
          <a
            href="https://www.flaticon.com/"
            title="Flaticon"
            target="_blank"
            rel="noreferrer"
          >
            Flaticon.com
          </a>
        </small>
      </p>
    </footer>
  </>
);
