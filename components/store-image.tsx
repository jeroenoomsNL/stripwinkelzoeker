import styled from "styled-components";
import { IStoreFields } from "../types/generated/contentful";
import Link from "next/link";

interface StoreImageProps {
  store: IStoreFields;
  clickable?: boolean;
  width?: number;
  height?: number;
}

const ResponsiveImage = styled.img`
  width: 100%;
  height: auto;
`;

const ImageElement = ({ store, width = 400, height = 250 }) => (
  <ResponsiveImage
    src={`https:${store.image.fields?.file?.url}?fm=jpg&w=${width}&h=${height}&fit=fill&q=90`}
    width={width}
    height={height}
    alt={store.image.fields?.title}
    loading="lazy"
  />
);

export const StoreImage = ({
  store,
  clickable,
  width,
  height,
}: StoreImageProps) => {
  if (clickable) {
    return (
      <Link
        href={`/winkel/${store.slug}`}
        title={store.image.fields?.title as string}
      >
        <ImageElement store={store} width={width} height={height} />
      </Link>
    );
  } else {
    return <ImageElement store={store} width={width} height={height} />;
  }
};
