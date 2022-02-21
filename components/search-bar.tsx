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
  width: 100%;
  max-width: 500px;
`;

interface SearchInputProps {
  resultboxVisible: boolean;
}

const SearchInput = styled.input<SearchInputProps>`
  border: 1px solid rgba(0, 0, 0, 0.4);
  background: var(--color-white);
  font-size: 0.75rem;
  padding: 1rem 2.5rem 1rem 2.5rem;
  width: 100%;
  font-weight: 500;
  outline: none;
  border-radius: ${(props) =>
    props.resultboxVisible ? "1.5rem  1.5rem 0 0" : "9999px"};

  @media (min-width: 375px) {
    font-size: 1.1rem;
    padding: 0.75rem 2.4rem;
  }

  @media (min-width: 768px) {
    font-size: 1.2rem;
    padding: 0.75rem 3.5rem;
  }
`;

const SearchIcon = styled.div`
  color: var(--color-grey);
  position: absolute;
  left: 0.75rem;
  top: 1rem;

  svg {
    height: 1rem;
  }

  @media (min-width: 768px) {
    left: 1.2rem;
    top: 1.1rem;

    svg {
      height: 1.4rem;
    }
  }
`;

const ClearIcon = styled.div`
  color: var(--color-grey);
  position: absolute;
  right: 0.75rem;
  top: 1rem;
  cursor: pointer;

  &:hover {
    color: var(--color-black);
  }

  svg {
    height: 1rem;
  }

  @media (min-width: 375px) {
    right: 1.1rem;
    top: 1.1rem;
  }

  @media (min-width: 768px) {
    right: 1.2rem;
    top: 1.6rem;

    svg {
      height: 1.5rem;
    }
  }
`;

const Line = styled.div`
  border: none;
  border-top: 1px solid var(--color-light-grey);
  overflow: visible;
  margin: 0.75rem;

  @media (min-width: 768px) {
    margin: 0.5rem 0.75rem;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  display: flex;
  top: 44px;
  flex-direction: column;
  background: white;
  width: 100%;
  overflow: hidden;
  border-radius: 0 0 1.5rem 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-top: none;
  font-size: 0.75rem;

  @media (min-width: 375px) {
    font-size: 1rem;
  }

  @media (min-width: 768px) {
    top: 52px;
  }
`;

const SearchResult = styled.a`
  color: var(--color-black);
  padding: 0.75rem 0.75rem;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 768px) {
    padding: 1rem 1.25rem;
    gap: 1.25rem;
  }

  &:hover,
  &:focus-visible {
    background-color: var(--color-light-grey);
    text-decoration: none;
    outline: none;
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
  const [resultboxVisible, setResultboxVisible] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (searchTerm.length < 3) {
      setResultboxVisible(false);
      setResults([]);
      return;
    }

    setResultboxVisible(true);

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
        resultboxVisible={searchTerm.length > 2}
        type="text"
        autoComplete="off"
        role="combobox"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Zoek op winkel of plaatsnaam"
      />
      {searchTerm.length > 2 && (
        <ClearIcon
          onClick={() => {
            setResultboxVisible(false);
            setSearchTerm("");
          }}
        >
          <Icon name="circle-xmark" />
        </ClearIcon>
      )}

      {resultboxVisible && (
        <SearchResults>
          <Line />
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
          <Link href="/stripwinkels-in-de-buurt" passHref>
            <SearchResult>
              <ResultIcon>
                <Icon name="crosshairs" height={20} />
              </ResultIcon>{" "}
              Stripwinkels in de buurt
            </SearchResult>
          </Link>
        </SearchResults>
      )}
    </SearchInputContainer>
  );
};
