import styled from "styled-components";

export default function Header() {
  return (
    <TopHeader>
      <Logo>Portal Evangélico</Logo>

      <Nav>
        <a href="/">Home</a>
        <a href="#articles">Artigos</a>
        <a href="#events">Eventos</a>
        <a href="/videos">Vídeos</a>
        <a href="#contact">Contato</a>
        <a href="/radio">Rádio</a>
      </Nav>
    </TopHeader>
  );
}

// -----------------------------
//  STYLED COMPONENTS
// -----------------------------

const TopHeader = styled.header`
  width: 100%;
  background: #ffffff;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: sticky;
  top: 0;
  z-index: 999;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
`;

const Logo = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
  gap: 25px;

  a {
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    color: #444;
    transition: 0.2s;

    &:hover {
      color: #1a73e8;
    }
  }
`;
