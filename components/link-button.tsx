import styled from "styled-components";

export const LinkButton = styled.a`
  display: inline-block;
  background-color: var(--color-accent);
  color: var(--color-white);
  border: none;
  border-radius: 5px;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-title);
  font-weight: 500;
  font-size: 1.2rem;

  &:hover {
    background-color: var(--color-accent-dark);
    text-decoration: none;
  }
`;
