import styled from "styled-components";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Fuse from "fuse.js";
import { IStoreFields } from "../types/generated/contentful";
import { Container, Icon } from "../components";

interface HeroProps {
  stores: IStoreFields[];
}

interface SearchResult {
  item: IStoreFields;
  refIndex?: number;
}

const HeroContainer = styled.div`
  background-color: #ddd;
  min-height: 300px;
  position: relative;

  @media (min-width: 375px) {
    min-height: 250px;
  }

  @media (min-width: 768px) {
    min-height: 500px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  filter: grayscale(100%);
  object-fit: cover;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.5;
`;

const SearchContainer = styled(Container)`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  z-index: 2;
`;

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
  margin: 0 0 2rem 0;
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
  padding: 0.75em 1em;
  font-family: "Poppins", sans-serif;
  cursor: pointer;

  @media (min-width: 768px) {
    padding: 1em 2em;
  }

  &:hover {
    background-color: lightgrey;
  }
`;

const Suggestions = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1em;
`;

const Suggestion = styled.a`
  display: flex;
  align-items: center;
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  font-weight: 300;
  font-family: var(--font-title);
  white-space: nowrap;
  font-size: 0.7rem;
  gap: 0.5rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  &:hover {
    background-color: var(--color-primary-dark);
  }
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

export const Hero = ({ stores }: HeroProps) => {
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
    <HeroContainer>
      <SearchContainer>
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
            {results?.map((result) => (
              <Link
                href={`/winkel/${result.item.slug}`}
                passHref
                key={result.item.slug}
              >
                <SearchResult>
                  <MakeRelevantTextBold
                    result={`${result.item.name}, ${result.item.city}`}
                    searchTerm={searchTerm}
                  />
                </SearchResult>
              </Link>
            ))}
          </SearchResults>
        </SearchInputContainer>
        <Suggestions>
          <Link href="/stripwinkels-in-de-buurt" passHref>
            <Suggestion>
              <Icon name="crosshairs" /> Stripwinkels in de buurt
            </Suggestion>
          </Link>
          <Link href="/land/nederland" passHref>
            <Suggestion>Stripwinkels in Nederland</Suggestion>
          </Link>
          <Link href="/land/belgie" passHref>
            <Suggestion>Stripwinkels in België</Suggestion>
          </Link>
        </Suggestions>
      </SearchContainer>
      <HeroImage src="https://images.ctfassets.net/tat9577n8aak/3n9SMhPyHlBZDZifUWgwiY/e34d2eb64cc41925ac6eb00766898182/jopo-de-pojo.jpg?q=70" />
      {/* <HeroImage src="https://images.ctfassets.net/tat9577n8aak/30r8XhpHlDMBED389IKPZI/484384c2b66d0c8dd3dc432fc0b77516/yendor.jpg" /> */}
    </HeroContainer>
  );
};
