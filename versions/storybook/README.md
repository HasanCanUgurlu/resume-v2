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
