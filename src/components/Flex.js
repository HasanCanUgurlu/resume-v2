import styled from "styled-components";
// SCREENSHOTS
import keeperapp from "../project-screenshots/keeperapp.png";
import todolist from "../project-screenshots/todolist.png";
import randomquote from "../project-screenshots/randomquote.png";
import newslettersignup from "../project-screenshots/newslettersignup.png";
import drumskit from "../project-screenshots/drumskit.png";
import calculator from "../project-screenshots/calculator.png";
import dailyblog from "../project-screenshots/dailyblog.png";
import markdownpreviewer from "../project-screenshots/markdownpreviewer.png";
import pomodoroclock from "../project-screenshots/pomodoroclock.png";
import tindog from "../project-screenshots/tindog.png";
// SCREENSHOTS END

// STYLED COMPONENTS START
const FlexDiv = styled.div`
  -webkit-font-smoothing: antialiased;
  display: flex;
  flex-direction: column;
  
  @media(max-width: 900px) {
     display: flex;
     justify-content: center;
     align-items: center;
     flex-direction: column;
  }
}
${
  "" /* filter: ${(props) =>
      (props.todoList && "brightness(110%)") ||
      (props.newsletterSignup && "brightness(110%)") ||
      (props.finance50 && "brightness(110%)") ||
      (props.calculator && "brightness(110%)")}; */
}
`;
const FlexItem = styled.div`
  display: flex;
  flex-direction: row;
  z-index: 1;
  transition: all 0.6s ease-in-out;
  &:hover {
    background-color: ${(props) =>
      (props.keeperApp && "#F9CC62") ||
      (props.randomQuote && "#FB9489") ||
      (props.dailyBlog && "#adefad") ||
      (props.newsletterSignup && "#9dc8e2") ||
      (props.calculator && "#E5FFAD") ||
      (props.pomorodoClock && "#eaffbe") ||
      (props.markdownPreviewer && "#a3e1ff") ||
      (props.tinDog && "#f3a59d") ||
      (props.todoList && "#cc99cc") ||
      (props.newsletterSignup && "#9dc8e2") ||
      (props.finance50 && "#b2ffff") ||
      (props.drumsKit && "#d0e2eb")};
  }
  @media (max-width: 800px) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }
`;
const ImageContainer = styled.div`
  max-width: 50%;
  min-width: 50%;

  @media (max-width: 800px) {
    visibility: hidden;
    display: none;
  }
`;
const Screenshot = styled.img`
  ${"" /* max-width: 50vw;
  max-height: 50vh; */}
  ${
    "" /* code above was breaking the images(inconsistent sizes). code downbelow fixed it.  */
  }
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;
const ExplanationDiv = styled.div`
  padding: 100px;
  width: 100%;
  justify-self: center;
  @media (max-width: 800px) {
    width: 100%;
    text-align: center;
  }
`;
const ExplanationTitle = styled.h2`
  margin: 0 0 0 0;
  font-family: "Noto Sans", sans-serif;
  font-weight: normal;
`;
const ExplanationSubtitle = styled.h4`
  margin: 3% 0 0 0;
  font-family: "Noto Sans", sans-serif;
  font-weight: lighter;
`;
const ExplanationP = styled.p`
  line-height: 140%;
  margin: 3% 0 0 0;
  width: 100%;
  font-family: "IBM Plex Mono", monospace;
`;
const VisitWebsite = styled.a`
  text-decoration: none;
  font-family: "IBM Plex Mono", monospace;
  border: 0;
  border-bottom: 2px solid #1f1f1f;
  background: none;
  color: black;
  font-weight: bold;
  position: relative;
  outline: none;
  padding: 10px 20px;
  top: 50px;
  &:hover {
    border-bottom: 0;
  }
  &::before,
  &::after {
    box-sizing: inherit;
    position: absolute;
    content: "";
    border: 2px solid transparent;
    width: 0;
    height: 0;
  }
  &::after {
    bottom: 0;
    right: 0;
  }
  &::before {
    top: 0;
    left: 0;
  }
  &:hover::before,
  &:hover::after {
    width: 100%;
    height: 100%;
  }
  &:hover::before {
    border-top-color: darkslategray;
    border-right-color: darkslategray;
    transition: width 0.3s ease-out, height 0.3s ease-out 0.3s;
  }
  &:hover::after {
    border-bottom-color: darkslategray;
    border-left-color: darkslategray;
    transition: border-color 0s ease-out 0.6s, width 0.3s ease-out 0.6s,
      height 0.3s ease-out 1s;
  }
`;
// STYLED COMPONENTS END

function Flex() {
  return (
    <FlexDiv>
      <FlexItem keeperApp>
        <ExplanationDiv keeperApp>
          <ExplanationTitle>Keeper App</ExplanationTitle>
          <ExplanationSubtitle>
            <em>JavaScript - React.js - JSX - Heroku</em>
          </ExplanationSubtitle>
          <ExplanationP>
            - A similar design and functionality of Google Keep, coded with
            &#10084;&#65039;
          </ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://googlekeeperreact.herokuapp.com/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
        <ImageContainer>
          <Screenshot keeperApp src={keeperapp} alt="note taking app" />
        </ImageContainer>
      </FlexItem>
      <FlexItem todoList>
        <ImageContainer>
          <Screenshot todoList src={todolist} alt="to do list" />
        </ImageContainer>
        <ExplanationDiv todoList>
          <ExplanationTitle>To-Do List</ExplanationTitle>
          <ExplanationSubtitle>
            <em>JavaScript - Node.js - Express.js - EJS - MongoDB - Heroku</em>
          </ExplanationSubtitle>
          <ExplanationP>
            - First to-do list app of mine. It's connected to MongoDB, that
            means it can keep the inputs till you delete them. <br />- For an
            extra functionality, you can create custom routing addresses.
          </ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://stormy-ravine-19871.herokuapp.com/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
      </FlexItem>
      <FlexItem randomQuote>
        <ExplanationDiv randomQuote>
          <ExplanationTitle>Random Quote Generator</ExplanationTitle>
          <ExplanationSubtitle>
            <em>JavaScript - jQuery - Netlify</em>
          </ExplanationSubtitle>
          <ExplanationP>
            - A colorful website that has quotes from wise people.
          </ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://quote-generator-hasan-ugurlu.netlify.app/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
        <ImageContainer>
          <Screenshot
            randomQuote
            src={randomquote}
            alt="random quote generator"
            loading="lazy"
          />
        </ImageContainer>
      </FlexItem>

      <FlexItem dailyBlog>
        <ImageContainer>
          <Screenshot
            dailyBlog
            src={dailyblog}
            alt="daily blog website"
            loading="lazy"
          />
        </ImageContainer>

        <ExplanationDiv dailyBlog>
          <ExplanationTitle>Daily Blog Website</ExplanationTitle>
          <ExplanationSubtitle>
            <em>
              JavaScript - Node.js - Express.js - EJS - bodyparse - Heroku
            </em>
          </ExplanationSubtitle>
          <ExplanationP>- Daily journal website with fresh theme.</ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://boiling-mountain-20318.herokuapp.com/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
      </FlexItem>

      <FlexItem newsletterSignup>
        <ExplanationDiv newsletterSignup>
          <ExplanationTitle>Newsletter Signup API</ExplanationTitle>
          <ExplanationSubtitle>
            <em>JavaScript - Node.js - Express.js - Netlify</em>
          </ExplanationSubtitle>
          <ExplanationP>
            - I created a landing page, for newsletter subscription. MailChimp
            does the heavy work ;)
          </ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://newsletter-signup-hasan-ugurlu.herokuapp.com/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
        <ImageContainer>
          <Screenshot
            newsletterSignup
            src={newslettersignup}
            alt="newsletter signup website"
            loading="lazy"
          />
        </ImageContainer>
      </FlexItem>

      <FlexItem finance50>
        <ImageContainer>
          <Screenshot
            finance50
            src="https://user-images.githubusercontent.com/45573073/72932217-15ba0280-3d3e-11ea-81e5-5b77ad9f86d2.png"
            alt="harvard finance project"
            loading="lazy"
          />
        </ImageContainer>
        <ExplanationDiv finance50>
          <ExplanationTitle>Finance50x</ExplanationTitle>
          <ExplanationSubtitle>
            <em>Python - Flask - SQLite - Github</em>
          </ExplanationSubtitle>
          <ExplanationP>- Buy and sell totally legit stocks(not!)</ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://github.com/HasanCanUgurlu/financeApp"
          >
            visit github project
          </VisitWebsite>
        </ExplanationDiv>
      </FlexItem>

      <FlexItem calculator>
        <ExplanationDiv calculator>
          <ExplanationTitle>JavaScript Calculator</ExplanationTitle>
          <ExplanationSubtitle>
            <em>JavaScript - React - Netlify</em>
          </ExplanationSubtitle>
          <ExplanationP>- Little, but a proud calculator.</ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://calculator-hasan-ugurlu.netlify.app/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
        <ImageContainer>
          <Screenshot
            calculator
            src={calculator}
            alt="javascript calculator website"
          />
        </ImageContainer>
      </FlexItem>

      <FlexItem markdownPreviewer>
        <ImageContainer>
          <Screenshot
            markdownPreviewer
            src={markdownpreviewer}
            alt="markdown previewer"
            loading="lazy"
          />
        </ImageContainer>
        <ExplanationDiv markdownPreviewer>
          <ExplanationTitle>Markdown Previewer</ExplanationTitle>
          <ExplanationSubtitle>
            <em>JavaScript - React - Netlify</em>
          </ExplanationSubtitle>
          <ExplanationP>
            - Website to teach millenials how comments worked in older reddit.
          </ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://markdown-preview-hasan-ugurlu.netlify.app/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
      </FlexItem>

      <FlexItem pomorodoClock>
        <ExplanationDiv pomorodoClock>
          <ExplanationTitle>Pomodoro Clock</ExplanationTitle>
          <ExplanationSubtitle>
            <em>JavaScript - React - Netlify</em>
          </ExplanationSubtitle>
          <ExplanationP>
            - To the people who wanna get things done, but don't know when.
          </ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://pomodoro-clock-hasan-ugurlu.netlify.app/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
        <ImageContainer>
          <Screenshot
            pomorodoClock
            src={pomodoroclock}
            alt="pomodoro clock"
            loading="lazy"
          />
        </ImageContainer>
      </FlexItem>

      <FlexItem tinDog>
        <ImageContainer>
          <Screenshot
            tinDog
            src={tindog}
            alt="tinder for dogs website"
            loading="lazy"
          />
        </ImageContainer>
        <ExplanationDiv tinDog>
          <ExplanationTitle>Tindog</ExplanationTitle>
          <ExplanationSubtitle>
            <em>Pure HTML / CSS</em>
          </ExplanationSubtitle>
          <ExplanationP>
            - This is one of the ideas, would make world a better place.
          </ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://hasancanugurlu.github.io/tindog/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
      </FlexItem>

      <FlexItem drumsKit>
        <ExplanationDiv drumsKit>
          <ExplanationTitle>Drums Kit</ExplanationTitle>
          <ExplanationSubtitle>
            <em>Javascript - React - Netlify</em>
          </ExplanationSubtitle>
          <ExplanationP>- This website is great for quick beats!</ExplanationP>
          <VisitWebsite
            target="_blank"
            href="https://drums-kit-hasan-ugurlu.netlify.app/"
          >
            visit website
          </VisitWebsite>
        </ExplanationDiv>
        <ImageContainer>
          <Screenshot
            drumsKit
            src={drumskit}
            alt="drums kit website"
            loading="lazy"
          />
        </ImageContainer>
      </FlexItem>
    </FlexDiv>
  );
}

export default Flex;
