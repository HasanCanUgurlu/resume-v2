import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
const BlueBackground = styled.div`
  background-color: #a3e1ff;
  width: 50%;
  height: 100vh;
  box-sizing: border-box;
`;
const StyledH1 = styled.h1`
  margin-bottom: 0;
  font-family: "Noto Sans", sans-serif;
  font-weight: 700;
`;
const StyledH2 = styled.h2`
  margin: 4px 0px 24px 0px;
  font-family: "Noto Sans", sans-serif;
  font-weight: lighter;
`;
const Intro = styled.div`
  position: absolute;
  text-align: center;
  top: 16rem;
  ${"" /* left: 0;
  right: 0; */}
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 1;
  @media (max-width: 900px) {
    top: 8rem;
    display: block;
  }
`;
const StyledP = styled.p`
  line-height: 160%;
  margin: 7% 0 3% 0;
  font-family: "IBM Plex Mono", monospace;
`;
// the problem with the a tag is that the center tag wobbles on every hover.
// to be able to hover animation, i put inline-block display.
const SocialAnchorTag = styled.a`
  margin: ${(props) =>
    props.middleButton ? "18px 12px 0px 12px" : "18px 0px 0px 0px"};
  padding: 2%;
  transition: all 0.3s ease-in-out;
  display: inline-block;
  &:hover {
    cursor: pointer;
    color: ${(props) =>
      (props.twitter && "#0b76b8") ||
      (props.facebook && "#1196f5") ||
      (props.linkedin && "#08529b")};
    -ms-transform: scale(1.5, 1.5); /* IE 9 */
    -webkit-transform: scale(1.5, 1.5); /* Safari */
    transform: scale(1.5, 1.5);
  }
`;
const scrollDown = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;
const DownArrowDiv = styled.div`
  margin: 10vh 0 0 0;
  animation: ${scrollDown} 2s linear 2s infinite;
  animation-fill-mode: backwards;
`;

function TopPage() {
  return (
    <BlueBackground>
      <Intro>
        <StyledH1>Hello, I'm Hasan Ugurlu</StyledH1>
        <StyledH2>I'm a software developer</StyledH2>
        <StyledP>
          I create websites, mockups and scripts.
          <br />
          I like to solve algorithm problems and check out new technologies.
          <br />I love coding in <strong>JavaScript and Python</strong>
        </StyledP>
        <SocialAnchorTag twitter>
          <FontAwesomeIcon size={"2x"} icon={faTwitter} />
        </SocialAnchorTag>
        <SocialAnchorTag facebook middleButton>
          <FontAwesomeIcon size={"2x"} icon={faFacebook} />
        </SocialAnchorTag>
        <SocialAnchorTag linkedin>
          <FontAwesomeIcon size={"2x"} icon={faLinkedin} />
        </SocialAnchorTag>
        <DownArrowDiv>
          <FontAwesomeIcon size={"1x"} icon={faArrowDown} />
        </DownArrowDiv>
      </Intro>
    </BlueBackground>
  );
}

export default TopPage;
