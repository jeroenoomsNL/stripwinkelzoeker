import styled from "styled-components";

export const SubTitle = styled.h2`
  color: var(--color-primary-light);
  font-size: 1.2em;
  margin: -0.5rem 0 1rem;

  a:hover {
    text-decoration: underline;
  }

  @media (min-width: 768px) {
    font-size: 1.4em;
    margin: -1rem 0 1rem;
  }
`;
