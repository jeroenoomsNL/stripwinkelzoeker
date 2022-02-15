import styled from "styled-components";

export const StoreBlockGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }

  @media (min-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 4rem;
  }
`;
