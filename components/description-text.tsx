import styled from "styled-components";

export const DescriptionText = styled.div`
  font-size: 1rem;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  @media (min-width: 1000px) {
    max-width: 900px;
  }
`;
