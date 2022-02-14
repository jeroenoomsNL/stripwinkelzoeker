import styled from "styled-components";
import { Container, Logo } from "../components";

const NavContainer = styled.nav`
  background: var(--color-primary);
  border-bottom: 1px solid #fff;
  padding: 0.5rem 0;

  @media (min-width: 768px) {
    padding: 1rem 0;
  }
`;

export const Navigation = () => (
  <NavContainer>
    <Container>
      <Logo />
    </Container>
  </NavContainer>
);
