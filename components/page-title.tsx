import styled from "styled-components";

export const PageTitle = styled.h1`
  color: var(--color-primary);
  font-size: 1.6rem;
  margin: 1.5rem 0 1rem;
  text-wrap: balance;

  @media (min-width: 768px) {
    font-size: 2.6rem;
    margin: 2rem 0 1rem;
  }
`;
