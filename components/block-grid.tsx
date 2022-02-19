import styled from "styled-components";

export const BlockGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin: 1rem 0 2rem;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin: 2rem 0;
  }

  @media (min-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr;
    margin: 3rem 0;
  }
`;
