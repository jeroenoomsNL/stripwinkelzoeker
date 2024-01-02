import Link from "next/link";
import styled from "styled-components";

export const LinkButton = styled(Link)`
  display: inline-block;
  background-color: var(--color-accent);
  color: var(--color-white);
  border: none;
  border-radius: 5px;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-title);
  font-weight: 500;
  font-size: 1.2rem;
  text-align: center;

  &:hover {
    background-color: var(--color-accent-dark);
    text-decoration: none;
  }
`;
