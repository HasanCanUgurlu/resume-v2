import React from "react";
import styled, { keyframes, css } from "styled-components";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import resumePdf from "../Documents/Hasan-Ugurlu-Resume-PDF.pdf";
const Navigation = styled.nav`
  background-color: transparent;
  position: fixed;
  display: flex;
  flex-direction: row;
  width: 100vw;
  z-index: 2;
  @media (max-width: 800px) {
    visibility: hidden;
    display: none;
  }
`;

const MenuButtonForMobile = styled.button`
  display: none;
  border: none;
  @media (max-width: 800px) {
    visibility: visible;
    display: block;
    position: fixed;
    background-color: transparent;
    text-decoration: none;
    width: 25vw;
    height: 14vh;
    top: 1%;
    left: 73%;
    font-size: 24px;
    font-family: "IBM Plex Mono", monospace;
    z-index: 5;
    outline-color: grey;
    box-shadow: none;
    outline: none;
    cursor: pointer;
  }
`;
// KEYFRAMES FOR SMOOTH DOWN MOVE FOR NAVBAR
const barDown = keyframes`
  from {
    height: 1px;
  }
  to {
    height: 40vh;
  }
`;
// KEYFRAMES FOR SMOOTH UP MOVE FOR NAVBAR
const barUp = keyframes`
    from {
    height: 40vh;
  }

  to {
    height: 1px;
  }
`;
const MobileNavLinksAnimationIn = keyframes`
    from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const MobileNavLinksAnimationOut = keyframes`
    from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;
// I'm having trouble with closing the menu gradually with hooks.
// Since I declared the visibility and display to false on click, it doesn't animate the
// closing keyframe.

// Here I was trying to conditionally animate the keyframes. If someone clicked the
// menu, it should animate barDown, if clicked on the "X" animates barUp.
const MobileNavigation = styled.nav`
  display: none;
  visibility: none;
  -webkit-font-smoothing: antialiased;
  @media (max-width: 800px) {
    ${"" /* Transition is very important for barUp function!!!!! */}
    transition: all 0.5s ease-in-out;
    animation: ${(props) =>
      props.isMenuActive
        ? css`
            ${barDown} 0.5s ease-out
          `
        : css`
            ${barUp} 0.5s ease-out
          `};
    visibility: ${(props) => (props.isMenuActive ? "visible" : "hidden")};
    display: block;
    background-color: #fcffef;
    width: 100%;
    height: ${(props) => (props.isMenuActive ? "40vh" : "1px")};
    position: fixed;
    z-index: 4;
    ${"" /* opacity: ${(props) => (props.isMenuActive ? "1" : "0")}; */}
    ${"" /* display: ${(props) => (props.isMenuActive ? "block" : "none")}; */}
    
    ${"" /* width: ${(props) => (props.isMenuActive ? "100%" : "1px")}; */}
  }
`;
const MobileNavLink = styled.p`
  animation: ${(props) =>
    props.isMenuActive
      ? css`
          ${MobileNavLinksAnimationIn} 0.5s ease-out
        `
      : css`
          ${MobileNavLinksAnimationOut} 0.5s ease-out
        `};
  margin: 32px 0 0 0;
  width: 100%;
  font-size: 16px;
  text-align: center;
  font-family: "IBM Plex Mono", monospace;
  &:nth-child(1) {
    margin-top: 15%;
  }
  ${
    "" /* visibility: ${(props) => (props.isMenuActive ? "visible" : "hidden")}; */
  }
`;
const NavLinks = styled.p`
  margin: 16px 0 8px 36px;
  font-family: "IBM Plex Mono", monospace;
`;
// somehow couldn't style the Link from router. Had to use inline styling.
const styleForLink = {
  textDecoration: "none",
  borderBottom: "2px solid black",
  color: "black",
};
function Header() {
  const [isMenuActive, setMenu] = useState(false);

  return (
    <>
      <Navigation>
        <NavLinks>
          <Link style={styleForLink} to="/">
            projects
          </Link>
        </NavLinks>
        <NavLinks>
          <Link style={styleForLink} to="/about">
            about
          </Link>
        </NavLinks>
        <NavLinks>
          <Link style={styleForLink} to={resumePdf} target="_blank">
            resume
          </Link>
        </NavLinks>
      </Navigation>
      <MenuButtonForMobile
        isMenuActive={isMenuActive}
        onClick={() => setMenu(!isMenuActive)}
      >
        menu
      </MenuButtonForMobile>
      <MobileNavigation isMenuActive={isMenuActive}>
        {/* <FontAwesomeIcon
          onClick={() => setMenu(!isMenuActive)}
          size={"2x"}
          icon={faTimes}
          style={{ color: "grey", margin: "5% 0 0 85%", cursor: "pointer" }}
        /> */}
        <MobileNavLink isMenuActive={isMenuActive}>
          <Link style={styleForLink} to="/">
            projects
          </Link>
        </MobileNavLink>
        <MobileNavLink isMenuActive={isMenuActive}>
          <Link style={styleForLink} to="/about">
            about
          </Link>
        </MobileNavLink>
        <MobileNavLink isMenuActive={isMenuActive}>
          <Link style={styleForLink} to={resumePdf} target="_blank">
            resume
          </Link>
        </MobileNavLink>
      </MobileNavigation>
    </>
  );
}

export default Header;
