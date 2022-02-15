import styled from "styled-components";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  fetchStores,
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
    gap: 1rem;

    & > div {
      flex: 1 0 50%;
    }
  }
`;

const StoreAddress = styled.address`
  font-size: 1.4rem;
  line-height: 1.6;
  font-style: normal;
  margin: 2rem 0;
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

export const StorePage = ({ store, cities }: StorePageProps) => {
  const canonical = "/winkel/" + store.slug;
  const pageTitle = store.name;
  const city = cities.find((city) => city.name === store.city);

  return (
    <Layout title={pageTitle} cities={cities} canonical={canonical}>
      <StoreContainer>
        <div>
          <StoreTitle>{store.name}</StoreTitle>
          {city?.slug ? (
            <SubTitle>
              Stripspeciaalzaak in{" "}
              <Link href={`/plaats/${city.slug}`}>
                <a>
                  <strong>{store.city}</strong>
                </a>
              </Link>
            </SubTitle>
          ) : (
            <SubTitle>Stripspeciaalzaak in {store.city}</SubTitle>
          )}
          <StoreAddress>
            {store.address}
            <br />
            {store.postalCode}, {store.city}
            <br />
            {store.country}
            <br />
            <br />
            {store.website && (
              <>
                <span>website:</span>{" "}
                <a href={store.website} target="_blank" rel="noreferrer">
                  {store.website.replace(/^https?:\/\//, "")}
                </a>
              </>
            )}
            <br />
            {store.phoneNumber && (
              <>
                <span>telefoonnummer:</span>{" "}
                <a href={`tel:${store.phoneNumber}`}>{store.phoneNumber}</a>
              </>
            )}
          </StoreAddress>
        </div>
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
  const res = await fetchStores();

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
