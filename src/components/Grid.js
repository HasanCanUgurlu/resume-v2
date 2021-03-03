// I created this component to have images of my projects. But it caused some problems with
// styling. I wanted to create 2col x 11row every cell is a singular entity. So when I wanted to
// style a row, couldn't do it. Instead, I used Flex component.

// I'm leaving this component, so in the future I can come back and judge myself.

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
// STYLED COMPONENTS
const GridDiv = styled.div`
    -webkit-font-smoothing: antialiased;
  display: grid;
  
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(11, 50vh);
  @media(max-width: 900px) {
     display: flex;
     justify-content: center;
     align-items: center;
     flex-direction: column;
  }
}
`;
const Screenshot = styled.img`
  grid-row: ${(props) =>
    (props.keeperApp && 1) ||
    (props.todoList && 2) ||
    (props.randomQuote && 3) ||
    (props.dailyBlog && 4) ||
    (props.newsletterSignup && 5) ||
    (props.finance50 && 6) ||
    (props.calculator && 7) ||
    (props.markdownPreviewer && 8) ||
    (props.pomorodoClock && 9) ||
    (props.tinDog && 10) ||
    (props.drumsKit && 11)};
  grid-column: ${(props) =>
    (props.keeperApp && 2) ||
    (props.todoList && 1) ||
    (props.randomQuote && 2) ||
    (props.dailyBlog && 1) ||
    (props.newsletterSignup && 2) ||
    (props.drumsKit && 2) ||
    (props.calculator && 2) ||
    (props.markdownPreviewer && 1) ||
    (props.pomorodoClock && 2) ||
    (props.tinDog && 1) ||
    (props.finance50 && 1)};
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
  background-image: url("https://www.transparenttextures.com/patterns/brushed-alum.png");

  justify-self: center;
  transition: all 0.5s ease-in-out;
  grid-row: ${(props) =>
    (props.keeperApp && 1) ||
    (props.todoList && 2) ||
    (props.randomQuote && 3) ||
    (props.dailyBlog && 4) ||
    (props.newsletterSignup && 5) ||
    (props.finance50 && 6) ||
    (props.calculator && 7) ||
    (props.markdownPreviewer && 8) ||
    (props.pomorodoClock && 9) ||
    (props.tinDog && 10) ||
    (props.drumskit && 11)};
  grid-column: ${(props) =>
    (props.keeperApp && 1) ||
    (props.todoList && 2) ||
    (props.randomQuote && 1) ||
    (props.dailyBlog && 2) ||
    (props.newsletterSignup && 1) ||
    (props.drumsKit && 1) ||
    (props.calculator && 1) ||
    (props.markdownPreviewer && 2) ||
    (props.pomorodoClock && 1) ||
    (props.tinDog && 2) ||
    (props.finance50 && 2)};
  background-color: ${(props) =>
    (props.keeperApp && "#ffffb2") ||
    (props.todoList && "#cc99cc") ||
    (props.randomQuote && "#fcb2aa") ||
    (props.dailyBlog && "#adefad") ||
    (props.newsletterSignup && "#9dc8e2") ||
    (props.finance50 && "#b2ffff") ||
    (props.calculator && "#eaffbe") ||
    (props.markdownPreviewer && "#a3e1ff") ||
    (props.pomorodoClock && "#eaffbe") ||
    (props.tinDog && "#f3a59d") ||
    (props.drumsKit && "#d0e2eb")};
  &:hover {
    filter: brightness(110%);

    ${
      "" /* background-color: ${(props) =>
      (props.keeperApp && "#ceffe0") ||
      (props.randomQuote && "#FCC1DC") ||
      (props.todoList && "#FEF4F9")}; */
    }
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
  background: none;
  color: black;
  font-weight: bold;
  position: relative;
  outline: none;
  padding: 10px 20px;
  top: 50px;
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
    border-top-color: #65a0bd;
    border-right-color: #65a0bd;
    transition: width 0.3s ease-out, height 0.3s ease-out 0.3s;
  }
  &:hover::after {
    border-bottom-color: #65a0bd;
    border-left-color: #65a0bd;
    transition: border-color 0s ease-out 0.6s, width 0.3s ease-out 0.6s,
      height 0.3s ease-out 1s;
  }
`;
function Grid() {
  return (
    <GridDiv>
      <Screenshot keeperApp src={keeperapp} alt="note taking app" />
      <ExplanationDiv keeperApp>
        <ExplanationTitle>Keeper App</ExplanationTitle>
        <ExplanationSubtitle>
          <em>JavaScript - React.js - JSX - Heroku</em>
        </ExplanationSubtitle>
        <ExplanationP>
          - A similar design and functionality of Google Keep, coded with
          &#10084;&#65039;
        </ExplanationP>
        <VisitWebsite href="https://googlekeeperreact.herokuapp.com/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot todoList src={todolist} alt="todo list" loading="lazy" />
      <ExplanationDiv todoList>
        <ExplanationTitle>To-Do List</ExplanationTitle>
        <ExplanationSubtitle>
          <em>JavaScript - Node.js - Express.js - EJS - MongoDB - Heroku</em>
        </ExplanationSubtitle>
        <ExplanationP>
          - First to-do list app of mine. It's connected to MongoDB, that means
          it can keep the inputs till you delete them. <br />- For an extra
          functionality, you can create custom routing addresses.
        </ExplanationP>
        <VisitWebsite href="https://stormy-ravine-19871.herokuapp.com/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot
        randomQuote
        src={randomquote}
        alt="random quote generator"
        loading="lazy"
      />
      <ExplanationDiv randomQuote>
        <ExplanationTitle>Random Quote Generator</ExplanationTitle>
        <ExplanationSubtitle>
          <em>JavaScript - jQuery - Netlify</em>
        </ExplanationSubtitle>
        <ExplanationP>
          - A colorful website that has quotes from wise people.
        </ExplanationP>
        <VisitWebsite href="https://quote-generator-hasan-ugurlu.netlify.app/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot
        dailyBlog
        src={dailyblog}
        alt="daily blog website"
        loading="lazy"
      />
      <ExplanationDiv dailyBlog>
        <ExplanationTitle>Daily Blog Website</ExplanationTitle>
        <ExplanationSubtitle>
          <em>JavaScript - Node.js - Express.js - EJS - bodyparse - Heroku</em>
        </ExplanationSubtitle>
        <ExplanationP>- Daily journal website with fresh theme.</ExplanationP>
        <VisitWebsite href="https://boiling-mountain-20318.herokuapp.com/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot
        newsletterSignup
        src={newslettersignup}
        alt="newsletter signup website"
        loading="lazy"
      />
      <ExplanationDiv newsletterSignup>
        <ExplanationTitle>Newsletter Signup API</ExplanationTitle>
        <ExplanationSubtitle>
          <em>JavaScript - Node.js - Express.js - Netlify</em>
        </ExplanationSubtitle>
        <ExplanationP>
          - I created a landing page, for newsletter subscription. MailChimp
          does the heavy work ;)
        </ExplanationP>
        <VisitWebsite href="https://newsletter-signup-hasan-ugurlu.herokuapp.com/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot
        finance50
        src="https://user-images.githubusercontent.com/45573073/72932217-15ba0280-3d3e-11ea-81e5-5b77ad9f86d2.png"
        alt="harvard finance project"
        loading="lazy"
      />
      <ExplanationDiv finance50>
        <ExplanationTitle>Finance50x</ExplanationTitle>
        <ExplanationSubtitle>
          <em>Python - Flask - SQLite - Github</em>
        </ExplanationSubtitle>
        <ExplanationP>- Buy and sell totally legit stocks(not!)</ExplanationP>
        <VisitWebsite href="https://github.com/HasanCanUgurlu/financeApp">
          visit github project
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot
        calculator
        src={calculator}
        alt="javascript calculator website"
      />
      <ExplanationDiv calculator>
        <ExplanationTitle>JavaScript Calculator</ExplanationTitle>
        <ExplanationSubtitle>
          <em>JavaScript - React - Netlify</em>
        </ExplanationSubtitle>
        <ExplanationP>- Little, but a proud calculator.</ExplanationP>
        <VisitWebsite href="https://calculator-hasan-ugurlu.netlify.app/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot
        markdownPreviewer
        src={markdownpreviewer}
        alt="markdown previewer"
        loading="lazy"
      />
      <ExplanationDiv markdownPreviewer>
        <ExplanationTitle>Markdown Previewer</ExplanationTitle>
        <ExplanationSubtitle>
          <em>JavaScript - React - Netlify</em>
        </ExplanationSubtitle>
        <ExplanationP>
          - Website to teach millenials how comments worked in older reddit.
        </ExplanationP>
        <VisitWebsite href="https://markdown-preview-hasan-ugurlu.netlify.app/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot
        pomorodoClock
        src={pomodoroclock}
        alt="pomodoro clock"
        loading="lazy"
      />
      <ExplanationDiv pomorodoClock>
        <ExplanationTitle>Pomodoro Clock</ExplanationTitle>
        <ExplanationSubtitle>
          <em>JavaScript - React - Netlify</em>
        </ExplanationSubtitle>
        <ExplanationP>
          - To the people who wanna get things done, but don't know when.
        </ExplanationP>
        <VisitWebsite href="https://pomodoro-clock-hasan-ugurlu.netlify.app/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot
        tinDog
        src={tindog}
        alt="tinder for dogs website"
        loading="lazy"
      />
      <ExplanationDiv tinDog>
        <ExplanationTitle>Tindog</ExplanationTitle>
        <ExplanationSubtitle>
          <em>Pure HTML / CSS</em>
        </ExplanationSubtitle>
        <ExplanationP>
          - This is one of the ideas, will make me a lot of money.
        </ExplanationP>
        <VisitWebsite href="https://hasancanugurlu.github.io/tindog/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
      <Screenshot
        drumsKit
        src={drumskit}
        alt="drums kit website"
        loading="lazy"
      />
      <ExplanationDiv drumsKit>
        <ExplanationTitle>Drums Kit</ExplanationTitle>
        <ExplanationSubtitle>
          <em>Javascript - React - Netlify</em>
        </ExplanationSubtitle>
        <ExplanationP>- This website is great for quick beats!</ExplanationP>
        <VisitWebsite href="https://drums-kit-hasan-ugurlu.netlify.app/">
          visit website
        </VisitWebsite>
      </ExplanationDiv>
    </GridDiv>
  );
}

export default Grid;
