# Retained story drafts

Earlier story material preserved during cleanup. This file is not loaded by the website. Displayed copy remains in `stories.js`; the booking story is retained here until it has a destination.

## Features that helped win accounts (product)

**title:** Features that helped win accounts

**short:** Product impact

**company:** WhereTo

**category:** product

**symbol:** ↗

**metric:** ~$1M / year

**badge:** Closer

**summary:** Enterprise features with a business outcome.

**problem:** Enterprise sales needed better ways to propose trips and invite travelers.

**role:** I led frontend on Trip Proposals and Trip Invites.

**decisions:**

- Built the frontend for both enterprise features.
- Connected product delivery with the needs of sales.

**result:** Sales used the features to win enterprise accounts worth about $1M a year.

**stack:** Frontend engineering · Trip Proposals · Trip Invites

## A new foundation for 150+ packages (react)

**title:** A new foundation for 150+ packages

**short:** Frontend foundations

**company:** WhereTo

**category:** systems

**symbol:** ⌘

**metric:** React 16 → 18

**badge:** Time Traveler

**summary:** A major migration across a React monorepo.

**problem:** An older React foundation stood in the way of a shared component library.

**role:** I upgraded our React monorepo from 16 to 18 across 150+ packages.

**decisions:**

- Updated the React foundation across the monorepo.
- Cleared the way for a shared component library and Storybook.

**result:** The codebase moved onto React 18, opening the path to shared UI foundations.

**stack:** React · Monorepo · Storybook

## Less state code. Fewer repeat requests. (state)

**title:** Less state code. Fewer repeat requests.

**short:** State & caching

**company:** WhereTo

**category:** systems

**symbol:** ½

**metric:** −60% repeat API calls

**badge:** Half Off

**summary:** About half the state code, with smarter caching.

**problem:** Older Redux patterns meant more state code and repeated API requests.

**role:** I replaced old Redux code with Redux Toolkit and RTK Query.

**decisions:**

- Used Redux Toolkit for state management.
- Moved server data and caching into RTK Query.

**result:** About half the state code went away. Caching cut repeat API calls by 60%.

**stack:** Redux Toolkit · RTK Query · Caching

## Feedback, ready before the workday (feedback)

**title:** Feedback, ready before the workday

**short:** Feedback agent

**company:** CaseHuddle

**category:** ai

**symbol:** ☾

**metric:** Overnight → Slack

**badge:** Night Shift

**summary:** An agent that turns feedback into a ranked report.

**problem:** In-app feedback mixes bugs with confusion about how the product works.

**role:** For CaseHuddle, I built an agent that reads feedback overnight.

**decisions:**

- Separated real bugs from user confusion.
- Ranked findings and delivered them to Slack before the team logged on.

**result:** The team starts its day with a ranked feedback report.

**stack:** AI agents · Feedback triage · Slack

## PII detection with a human review step (pii)

**title:** PII detection with a human review step

**short:** PII scrubber

**company:** CaseHuddle

**category:** product

**symbol:** ◎

**metric:** Detect → review → redact

**badge:** Privacy by Design

**summary:** A review workflow for sensitive clinical case drafts.

**problem:** Clinical case drafts can contain identifying patient details.

**role:** I integrated self-hosted GLiNER and built detection filtering, review, and redaction into the composer.

**decisions:**

- Combined model predictions with TypeScript rules and configurable thresholds.
- Resolved overlapping entity spans and preserved offsets during replacement.
- Let authors review repeated mentions together and recheck edited drafts.
- Built fixture-based evaluation for misses and false positives.

**result:** Authors can review and redact flagged details before posting. Evaluation tools make detector changes easier to assess.

**stack:** GLiNER · TypeScript · Entity spans · Human review

## QA, from ticket to browser (qa)

**title:** QA, from ticket to browser

**short:** QA agent

**company:** CaseHuddle

**category:** ai

**symbol:** ✓

**metric:** Jira → browser → tests

**badge:** Second Set of Eyes

**summary:** An agent that checks what a ticket says should work.

**problem:** Acceptance criteria need to be checked against the actual product.

**role:** I built a QA agent that reads Jira tickets and checks acceptance criteria in a real browser.

**decisions:**

- Reported failures with suggested fixes.
- Extended the agent to write and update automated tests in CI.

**result:** Ticket criteria become browser checks, actionable findings, and automated tests.

**stack:** Jira · Browser automation · CI

## Faster builds, less waiting (builds)

**title:** Faster builds, less waiting

**short:** Developer experience

**company:** WhereTo

**category:** systems

**symbol:** »

**metric:** 2× faster dev builds

**badge:** Fast Forward

**summary:** Build tooling that gives the team time back.

**problem:** Development builds and CI were areas where the team could spend less time and money.

**role:** I moved our builds to Webpack 5 and Vite.

**decisions:**

- Updated the development build tooling.
- Focused on build speed and CI cost.

**result:** Dev builds got about twice as fast, and CI got cheaper to run.

**stack:** Webpack 5 · Vite · CI

## A shorter path to a booked trip (booking)

**title:** A shorter path to a booked trip

**short:** Booking experience

**company:** WhereTo

**category:** product

**symbol:** ↝

**metric:** −20% booking time

**badge:** Clear the Path

**summary:** Using behavior data to find and fix friction.

**problem:** Travelers were getting stuck during booking.

**role:** I used Mixpanel to find those spots and fixed them.

**decisions:**

- Used booking behavior to identify friction.
- Made focused improvements to the booking experience.

**result:** Fixing those spots cut average booking time by 20%.

**stack:** Mixpanel · Product analytics · Frontend

## CaseHuddle, from zero to product (casehuddle)

**title:** CaseHuddle, from zero to product

**short:** CaseHuddle

**company:** CaseHuddle

**category:** product

**symbol:** ch

**metric:** Built end to end

**badge:** From Zero

**summary:** A private consultation platform for licensed therapists.

**problem:** Therapists need a place to get peer input on hard cases.

**role:** I co-founded CaseHuddle and built it from the ground up.

**decisions:**

- Built the application, data layer, authentication, and deployment.
- Used Next.js, tRPC, Drizzle, and PostgreSQL.
- Integrated PII detection and review for case writing.

**result:** An invite-only platform where every member is a verified licensed clinician.

**stack:** Next.js · tRPC · Drizzle · PostgreSQL
