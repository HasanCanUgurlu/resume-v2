import styled from "styled-components";
import Header from "./Header";
import hasan from "../project-screenshots/hasan.jpeg";
const RedBackground = styled.div`
  background-color: #ffc2a3;
  width: 50%;
  height: 160vh;
  box-sizing: border-box;
  z-index: -1;
`;
const StyledH1 = styled.h1`
  margin-bottom: 19%;
  text-align: center;
  letter-spacing: 0.5vw;
  font-family: "Noto Sans", sans-serif;
  font-weight: 700;
`;
const StyledH2 = styled.h2`
  margin: ${(props) =>
    (props.hasanUgurlu && "10vh 0px 12px 0px;") ||
    (props.funFactsSection && "6vh 0px 12px 0px;")};
  font-family: "Noto Sans", sans-serif;
  font-weight: ${(props) =>
    (props.hasanUgurlu && "600") || (props.funFactsSection && "400")};
  font-size: ${(props) =>
    (props.hasanUgurlu && "24px") || (props.funFactsSection && "18px")};
`;
const Intro = styled.div`
  position: absolute;
  width: 58vw;
  padding: 50px;
  top: 11rem;
  z-index: 1;
  ${"" /* left: 0;
  right: 0; */}
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 10;
  @media (max-width: 900px) {
    top: 12rem;
    padding: 25px;
    display: block;
    width: 90vw;
  }
  @media (max-width: 600px) {
    top: 3.5rem;
    padding: 10px;
    width: 100vw;
  }
`;
const StyledP = styled.p`
  line-height: 160%;
  font-size: 14px;
  margin: ${(props) =>
    (props.link && "0") ||
    (props.aboutMeP && "7% 0 3% 0") ||
    (props.fact && "2px 0 0 0")};
  font-family: "IBM Plex Mono", monospace;
`;
const HasanPicture = styled.div`
  position: absolute;
  margin: 100px 0 0 86px;
  background-image: url(${hasan});
  background-color: #ffaba3;
  background-blend-mode: soft-light;
  width: 42vh;
  height: 52vh;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background-repeat: no-repeat;
  left: 30%;
  -webkit-transform: translateX(-70%);
  transform: translateX(-70%);
  ${
    "" /* didn't want to dive deeper to center the image for mobile.
  I used this custom 40 percent. Instead of 50.
  I gotta change header to use 50 percent from left.  
  So with translate -50 I got the result I liked. But I bet since I kind of
  hardcoded it, it's gonna come back and bite me later.*/
  }
  @media (max-width: 800px) {
    position: absolute;
    width: 1fr;
    height: 1fr;
    top: 4rem;
    left: 47%;
  }
  ${
    "" /* @media (max-width: 700px) {
    visibility: hidden;
    display: none;
  } */
  }
`;
const Footer = styled.p`
  font-family: "IBM Plex Mono", monospace;
  text-align: center;
  width: 100%;
  position: absolute;
  top: 150vh;
`;
const SocialTag = styled.a.attrs((props) => ({
  href:
    (props.twitter && "https://twitter.com/hasancanugurlu") ||
    (props.linkedIn && "https://www.linkedin.com/in/hasan-ugurlu-6993051b3/") ||
    (props.eMail && "mailto:hasancan.ugurlu@gmail.com") ||
    (props.github && "https://github.com/HasanCanUgurlu"),
  target: "_blank",
}))`
  text-decoration: none;
  color: black;
  border-bottom: 2px solid black;
  margin-right: 12px;
`;
const FunFacts = styled.ul`
  list-style-type: none;
  line-height: 160%;
  padding: 0;
  font-family: "IBM Plex Mono", monospace;
`;
function About() {
  return (
    <div>
      <RedBackground>
        <Header />
        <HasanPicture />
        <Intro>
          <StyledH1 aboutme>about me</StyledH1>
          <StyledH2 hasanUgurlu>Hasan Ugurlu</StyledH2>
          <StyledP link>
            {"   "}
            <span>
              <SocialTag twitter>Twitter</SocialTag>
            </span>
            {"   "}
            <span>
              <SocialTag linkedIn>LinkedIn</SocialTag>
            </span>
            {"   "}
            <span>
              <SocialTag github>Github</SocialTag>
            </span>
            {"   "}
            <span>
              <SocialTag eMail>E-mail</SocialTag>
            </span>
          </StyledP>
          <StyledP aboutMeP>
            I love thinking differently. It makes life more interesting by
            showing the world from various angles. Since I was aware of myself,
            I've been curious. I remember one day when I was big enough to hold
            a hammer, breaking window sills to see how strong they were. (by the
            way, they're not very strong)
            <br />
            <br />
            Whatever I do in my life I always use a formula. If I want to have
            good results, I believe in creating a good team. My schema for
            creating a good team: <br />
            trust {"->"} cooperation {"->"} safe environment {"->"} good team{" "}
            <br />
            <br />
            The way I create a safe environment is by bringing people who enjoy
            creating value together and treating them with respect and
            integrity. That way we can combine our skills and strengths to
            create amazing results.
            <br />
            <br />
            I’m always excited about new adventures. It can be a new friend, a
            new job, or a project. Feel free to contact me for any inquiries
            that you think I might help with.
          </StyledP>

          <StyledH2 funFactsSection>Fun Facts :</StyledH2>
          <FunFacts>
            <StyledP fact>
              - I was 25 years old when I found out that "Stressed" is just
              "Desserts" spelled backward.
            </StyledP>
            <StyledP fact>- I can speak both Turkish and English.</StyledP>
            <StyledP fact>- I lived in Seoul for a while.</StyledP>
            <StyledP fact>- I'm a fan of martial arts.</StyledP>
          </FunFacts>
        </Intro>
        <Footer>Hasan Ugurlu 2021</Footer>
      </RedBackground>
    </div>
  );
}
export default About;
