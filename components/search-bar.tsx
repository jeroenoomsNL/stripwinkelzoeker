import styled from "styled-components";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Fuse from "fuse.js";
import { IStoreFields } from "../types/generated/contentful";
import { Icon } from "../components";

interface SearchBarProps {
  stores: IStoreFields[];
}

interface SearchResult {
  item: IStoreFields;
  refIndex?: number;
}

const SearchInputContainer = styled.form`
  position: relative;
  width: 90%;
  max-width: 500px;

  @media (min-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.4);
  background: var(--color-white);
  border-radius: 9999px;
  font-size: 0.75em;
  padding: 1rem 0.5rem 1rem 2.5rem;
  width: 100%;
  font-weight: 500;

  @media (min-width: 375px) {
    padding: 1rem 0.5rem 1rem 3rem;
    font-size: 0.9em;
  }

  @media (min-width: 768px) {
    font-size: 1.3em;
    padding: 1.3rem 1.3rem 1.3rem 5rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 1rem;

  svg {
    height: 1rem;
  }

  @media (min-width: 375px) {
    left: 1.1rem;
    top: 1.1rem;
  }

  @media (min-width: 768px) {
    left: 1.75rem;
    top: 1.6rem;

    svg {
      height: 1.5rem;
    }
  }
`;

const SearchResults = styled.div`
  position: absolute;
  display: flex;
  top: 62px;
  flex-direction: column;
  background: white;
  border-radius: 1em;
  width: 100%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media (min-width: 768px) {
    top: 80px;
  }
`;

const SearchResult = styled.a`
  color: var(--color-black);
  padding: 0.75rem 1rem;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }

  &:hover {
    background-color: lightgrey;
    text-decoration: none;
  }
`;

const NoResult = styled.div`
  padding: 0.75em 1em;
  font-family: "Poppins", sans-serif;
  font-style: italic;

  @media (min-width: 768px) {
    padding: 1em 2em;
  }
`;

const ResultIcon = styled.div`
  width: 1rem;
  line-height: 1;
  display: flex;
  justify-content: center;
`;

interface MakeRelevantPartBoldProps {
  result: string;
  searchTerm: string;
}

function MakeRelevantTextBold({
  result,
  searchTerm,
}: MakeRelevantPartBoldProps) {
  const textArray = result.split(RegExp(searchTerm, "ig"));
  const match = result.match(RegExp(searchTerm, "ig"));

  return (
    <span>
      {textArray.map((item: string, index: number) => (
        <>
          {item}
          {index !== textArray.length - 1 && match && <b>{match[index]}</b>}
        </>
      ))}
    </span>
  );
}

export const SearchBar = ({ stores }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (searchTerm.length < 3) return setResults([]);

    const options = {
      threshold: 0.2,
      keys: ["name", "city"],
    };

    const fuse = new Fuse(stores, options);
    const results = fuse.search(searchTerm);

    return setResults(results.slice(0, 5));
  }, [searchTerm, stores]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (results.length) {
      router.push(`/winkel/${results[0].item.slug}`);
    }
  };

  return (
    <SearchInputContainer onSubmit={handleSubmit}>
      <SearchIcon>
        <Icon name="search" />
      </SearchIcon>
      <SearchInput
        type="search"
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Zoek op winkel of plaatsnaam"
      />

      <SearchResults>
        {searchTerm.length > 2 && results.length === 0 && (
          <NoResult>Er zijn geen stripwinkels gevonden.</NoResult>
        )}
        {results?.map((result) => (
          <Link
            href={`/winkel/${result.item.slug}`}
            passHref
            key={result.item.slug}
          >
            <SearchResult>
              <ResultIcon>
                <Icon name="map-marker" height={20} />
              </ResultIcon>
              <MakeRelevantTextBold
                result={`${result.item.name}, ${result.item.city}`}
                searchTerm={searchTerm}
              />
            </SearchResult>
          </Link>
        ))}
        {searchTerm.length > 2 && (
          <Link href="/stripwinkels-in-de-buurt" passHref>
            <SearchResult>
              <ResultIcon>
                <Icon name="crosshairs" height={20} />
              </ResultIcon>{" "}
              Stripwinkels in de buurt
            </SearchResult>
          </Link>
        )}
      </SearchResults>
    </SearchInputContainer>
  );
};
