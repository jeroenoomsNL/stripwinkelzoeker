import Document, { Html, Head, Main, NextScript } from "next/document";
import { GA_TRACKING_ID } from "../utils/gtag";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <meta
            name="description"
            content="Stripwinkelzoeker.nl brengt alle stripspeciaalzaken van Nederland en België in kaart en laat zien of de winkel bij jouw in de buurt ook thuisbezorgt."
          />
          <meta property="og:title" content="Stripwinkelzoeker.nl" />
          <meta
            property="og:description"
            content="Stripwinkelzoeker.nl brengt alle stripspeciaalzaken van Nederland en België in kaart en laat zien of de winkel bij jouw in de buurt ook thuisbezorgt."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://stripwinkelzoeker.nl" />
          <link rel="manifest" href="manifest.json" />
          <link
            rel="apple-touch-icon"
            sizes="512x512"
            href="icon-512x512.png"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="#d10c04"
          />
          <meta name="apple-mobile-web-app-title" content="Stripwinkels" />
          <meta
            property="og:image"
            content="https://stripwinkelzoeker.nl/stripwinkelzoeker-header-2.png"
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
