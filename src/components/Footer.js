import styled from "styled-components";

const FooterDiv = styled.div`
  text-align: center;
  font-family: "IBM Plex Mono", monospace;
  margin: 2% 0;
`;

function Footer() {
  return <FooterDiv>Hasan Ugurlu {new Date().getFullYear()}</FooterDiv>;
}

export default Footer;
