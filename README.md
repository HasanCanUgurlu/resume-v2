# Hasan Ugurlu's component explorer

A static, Storybook-inspired personal website. WhereTo stories cover Product impact, Frontend foundations, and Developer experience. CaseHuddle stories cover QA agent, Feedback agent, From zero to product, and PII scrubber. The Feedback agent is grouped under CaseHuddle and attributed to WhereTo.

Open `index.html` directly, or serve this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit http://localhost:8000. No packages, framework, or build step are required.

The site consists of `index.html`, `styles.css`, `resume.pdf`, and `favicon.svg`. Hash links select stories; native controls and CSS handle theme, technical context, and addon panels. The small inline script only sets disclosure defaults when crossing the mobile breakpoint. Without JavaScript, the disclosures start open and remain usable. Settings are not saved between visits.

On desktop, the canvas scrolls inside the explorer. On phones, the page scrolls naturally, with navigation and addons initially collapsed. The Accessibility panel records verification status; it does not perform a live audit. Browser, screen reader, and Lighthouse verification remain pending.

The previous React website remains in `src/` and `public/` for reference. Its npm scripts are not used by this version. Deploy the four static files directly rather than running the old React build.

## Alternative design prototypes

Open http://localhost:8000/concepts/ to compare the second design round:

- **Launchpad:** a personal desktop with app icons, a dock, and project windows. The PII story includes a fictional redaction example.
- **Achievements:** illustrated medals, category filters, a featured achievement, and stories in native dialogs.
- **App Store:** a developer listing with visual project previews, section navigation, and career version history.
- **Results:** selectable metrics, before/after charts, engineering context, and an outcome table.

Each concept has its own page structure and stylesheet. `shared.js` holds factual content and interaction handlers; `shared.css` provides common accessibility and dialog styles. Everything runs as static HTML, CSS, and plain JavaScript, without a build step. The Storybook version remains in `versions/storybook/`.

Project preview artwork is labeled as illustration. The results charts use reported outcomes and normalized baselines; they are not time-series measurements. Validation covers HTML structure, local assets, interaction logic, and chart values. Visual browser and assistive-technology checks are still pending because the browser connection is unavailable.

### Pixel-map prototype

Open **http://localhost:8000/pixel-map/** (or serve this directory with `python3 -m http.server 8000 --bind 127.0.0.1`). The existing root site, saved Storybook version, and previous concepts are preserved.

`pixel-map/` is a buildless HTML/CSS/JavaScript prototype with a full-screen map, six destinations, and centered native dialogs for the introduction and stories. Selecting a landmark triggers a roughly 550ms walk before opening its story; direct links and reduced-motion mode open immediately. The name reopens the introduction without moving the character. Close, Escape, and backdrop clicks return to the map. Motion settings and art credits live in the corner menu. Dialogs resize and scroll on mobile. All fonts and images are served locally. Kenney Tiny Town sprites are CC0; the included Press Start 2P font uses the SIL Open Font License. Credits and license files are included.

Validation: JavaScript syntax, local asset references and HTTP contents, and simulated route/movement/keyboard behavior checked, including dialog arrival, mid-walk redirection, Escape/close, and pausing during travel. Actual browser rendering and assistive-technology behavior remain to be checked; the browser connection was unavailable during implementation.

Landmark artwork is drawn as six original SVG sprites in `pixel-map/assets/` and embedded in the map for individual animation. Compare their static silhouettes at **http://localhost:8000/pixel-map/landmarks.html**. Artwork was reviewed as a rendered sprite sheet; full browser rendering remains unverified.

Ambient activity lives in `pixel-map/ambience.js`: two occasional gulls, finite tree-leaf and spring-ripple effects, and motion/visibility controls. Shore wavelets and chimney smoke use CSS. Empty navigation space passes pointer events through to the scenery.
