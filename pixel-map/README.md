# Pixel island

A static portfolio built with HTML, CSS, and vanilla JavaScript. All artwork, fonts, and sprites are local. No install or build step is required.

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [the island](http://localhost:8000/pixel-map/).

## Code layout

- `index.html`: terrain, landmark artwork, navigation, and native dialogs.
- `map.css`: shared styles, compact desktop styles, mobile styles, and reduced-motion styles.
- `stories.js`: the copy displayed by the story dialogs.
- `map.js`: routes, destination selection, character travel, story tabs, and dialog transitions.
- `mobile.js`: camera framing, panning, overview, and thumb controls.
- `wildlife.js`: fish, wandering rabbits, tree surprises, and `island.hop()`.
- `ambience.js`: bird flights and escapes, falling leaves, and spring effects.
- `docs/content-drafts.md`: preserved story material that is not loaded by the site.

`map.js` owns destination selection and motion settings. The other scripts listen for small document events:

| Event                       | Purpose                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `island-select-destination` | Mobile controls request a destination without opening a story.   |
| `island-destination-change` | Selected destination changed; mobile controls and camera update. |
| `island-motion-change`      | Pause or resume optional motion.                                 |
| `island-tree-shake`         | A shaken tree may reveal a surprise bunny.                       |
| `island-spring`             | Play the spring ripple effect.                                   |

Keep script order in `index.html`: the trees are created by `map.js` before wildlife and ambience inspect them. Mobile controls initialize last, using the current landmark selection.

## Behavior checks

Run from the repository root with Node.js 18 or newer:

```sh
node --test pixel-map/tests/*.test.cjs
```

These dependency-free checks simulate navigation, movement, mobile dragging, camera framing, bird escapes, rabbit surprises, and motion settings. They do not render a browser or validate actual touch behavior.

For visual changes, also check desktop and phone-sized Safari windows, phone landscape, story scrolling and tabs, and reduced motion. Verify that ordinary taps still activate landmarks and animals, while dragging pans without activating them.

The root Storybook site, saved versions, earlier concepts, and legacy React app are separate and remain available.

## Netlify deployment

The repository's `netlify.toml` uses `pixel-map` as the base directory and runs `node build-site.cjs`. It publishes the generated `dist` directory with the island at the domain root, alongside the resume and local assets. The legacy React dependencies are outside this base directory.

To verify the release files locally, run from the repository root:

```sh
node pixel-map/build-site.cjs
python3 -m http.server 8001 --directory pixel-map/dist --bind 127.0.0.1
```

Open http://localhost:8001/. Tests, draft writing, and previous prototypes are preserved in the repository and excluded from the island deployment.
