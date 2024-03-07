import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import styled from "styled-components";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  fetchAllStores,
  fetchCities,
  fetchStoreBySlug,
} from "../../utils/contentful";
import { ICityFields, IStoreFields } from "../../types/generated/contentful";
import {
  StoreMap,
  StoreImage,
  Layout,
  PageTitle,
  SubTitle,
} from "../../components";

interface StorePageProps {
  store: IStoreFields;
  cities: ICityFields[];
}

interface StoreParams extends ParsedUrlQuery {
  store: string;
}

const StoreTitle = styled(PageTitle)`
  margin-top: 0;
`;

const StoreContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;

    & > div {
      flex: 0 0 50%;
    }
  }
`;

const StoreAddress = styled.address`
  font-size: 1rem;
  line-height: 1.6;
  font-style: normal;
  margin: 2rem 0;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StoreContent = styled.section`
  font-size: 1rem;
  line-height: 1.6;
  font-style: normal;
  margin: 2rem 0;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StoreImageContainer = styled.div`
  margin-bottom: 1rem;

  img {
    height: 400px;
    width: 100%;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const StoreMapContainer = styled.div`
  width: 100%;
  height: 400px;
`;

const PermanentlyClosed = styled.span`
  color: #d51010;
  font-weight: bold;
`;

export const StorePage = ({ store, cities }: StorePageProps) => {
  const canonical = "/winkel/" + store.slug;
  const pageTitle = `${store.name} - Stripspeciaalzaak in ${store.city}`;
  const city = cities.find((city) => city.name === store.city);

  return (
    <Layout title={pageTitle} cities={cities} canonical={canonical}>
      <StoreContainer>
        <article>
          <StoreTitle>{store.name}</StoreTitle>
          {city?.slug ? (
            <SubTitle>
              Stripspeciaalzaak in{" "}
              <Link
                href={`/plaats/${city.slug}`}
                title={`Stripwinkels in ${store.city}`}
                rel="tag"
              >
                <strong>{store.city}</strong>
              </Link>
            </SubTitle>
          ) : (
            <SubTitle>Stripspeciaalzaak in {store.city}</SubTitle>
          )}

          <StoreAddress>
            {store.address}
            <br />
            {store.postalCode} {store.city}
            <br />
            {store.country}
            <br />
            <br />
            {!store.permanentlyClosed && (
              <>
                {store.website && (
                  <>
                    <span>website:</span>{" "}
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noreferrer"
                      title={`De website van ${store.name}`}
                    >
                      {store.website.replace(/^https?:\/\//, "")}
                    </a>
                  </>
                )}
                <br />
                {store.phoneNumber && (
                  <>
                    <span>telefoonnummer:</span>{" "}
                    <a
                      href={`tel:${store.phoneNumber}`}
                      title={`Het telefoonnummer van ${store.name}`}
                    >
                      {store.phoneNumber}
                    </a>
                  </>
                )}
              </>
            )}
            {store.permanentlyClosed && (
              <>
                <PermanentlyClosed>Permanent gesloten</PermanentlyClosed>
                {city?.slug && (
                  <p>
                    <em>
                      Vind andere Stripwinkels in{" "}
                      <Link href={`/plaats/${city.slug}`} rel="tag">
                        <strong>{store.city}</strong>
                      </Link>
                    </em>
                  </p>
                )}
              </>
            )}
          </StoreAddress>

          {store.description && (
            <>
              <StoreContent>
                <h2>Over {store.name}</h2>
                {documentToReactComponents(store.description)}
              </StoreContent>
            </>
          )}
        </article>
        <div>
          <StoreImageContainer>
            <StoreImage store={store} width={800} height={500} />
          </StoreImageContainer>

          <StoreMapContainer>
            <StoreMap locations={[store]} zoom={13} />
          </StoreMapContainer>
        </div>
      </StoreContainer>
    </Layout>
  );
};

export default StorePage;

export async function getStaticPaths() {
  const res = await fetchAllStores();

  const stores = await res.map((p) => {
    return {
      params: {
        slug: p.fields.slug,
      },
    };
  });

  return {
    paths: stores,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<
  StorePageProps,
  StoreParams
> = async ({ params }) => {
  const res = await fetchStoreBySlug(params?.slug);
  const store = await res.map((p) => {
    return { ...p.fields, id: p.sys.id };
  })[0];

  const citiesRes = await fetchCities();
  const cities = await citiesRes.map((p) => {
    return { ...p.fields, id: p.sys.id };
  });

  return {
    props: { store, cities },
  };
};
