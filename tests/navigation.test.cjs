const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { test } = require("node:test");

test("Story routes, moved links, travel, and mobile selection", async () => {
  class Element {
    constructor() {
      this.attrs = {};
      this.style = {};
      this.dataset = {};
      this.events = {};
      this.innerHTML = "";
      this.classList = {
        add() {},
        remove() {},
        toggle() {},
        contains() {
          return false;
        },
      };
    }
    setAttribute(k, v) {
      this.attrs[k] = v;
    }
    removeAttribute(k) {
      delete this.attrs[k];
    }
    addEventListener(k, v) {
      this.events[k] = v;
    }
    append() {}
    insertAdjacentHTML(_, v) {
      this.innerHTML += v;
    }
    querySelector() {
      return { outerHTML: "<svg></svg>" };
    }
    focus() {
      this.focused = true;
    }
    scrollIntoView() {}
    showModal() {
      this.open = true;
    }
    close() {
      this.open = false;
    }
  }
  const ids = [
    "story",
    "story-content",
    "traveler",
    "motion",
    "story-close",
    "story-title",
    "announcement",
    "credits",
    "credits-open",
    "trees",
    "journey-trail",
    "harbor-ship",
  ];
  const elements = Object.fromEntries(ids.map((k) => ["#" + k, new Element()]));
  elements[".destinations"] = new Element();
  const stops = [
    "product",
    "builds",
    "react",
    "state",
    "agents",
    "casehuddle",
  ].map((id) => {
    const e = new Element();
    e.dataset.stop = id;
    return e;
  });
  const media = {
    matches: false,
    addEventListener(k, v) {
      this.change = v;
    },
  };
  let frameId = 0;
  const frames = new Map();
  const events = {};
  const context = {
    CustomEvent: class {
      constructor(name, options) {
        this.type = name;
        this.detail = options.detail;
      }
    },
    document: {
      querySelector: (s) =>
        elements[s] ||
        stops.find((stop) => s.includes(`data-stop="${stop.dataset.stop}"`)),
      querySelectorAll: () => stops,
      body: new Element(),
      dispatchEvent() {},
      createElementNS: () => new Element(),
      addEventListener(k, v) {
        events[k] = v;
      },
    },
    matchMedia: () => media,
    location: { hash: "#map" },
    window: {
      addEventListener(k, v) {
        events[k] = v;
      },
    },
    requestAnimationFrame: (f) => {
      frames.set(++frameId, f);
      return frameId;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  context.history = {
    pushState(a, b, hash) {
      context.location.hash = hash;
    },
    replaceState(a, b, hash) {
      context.location.hash = hash;
    },
  };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(
      require("node:path").join(__dirname, "..", "stories.js"),
      "utf8",
    ) +
      fs.readFileSync(
        require("node:path").join(__dirname, "..", "map.js"),
        "utf8",
      ),
    context,
  );

  function route(hash) {
    context.location.hash = hash;
    events.hashchange();
    return elements["#story-content"].innerHTML;
  }
  let html = route("#agents");
  assert.match(html, /work-tab-qa/);
  assert.match(html, /work-tab-feedback/);
  assert.doesNotMatch(html, /work-tab-pii|work-tab-casehuddle/);
  html = route("#casehuddle");
  assert.match(html, /work-tab-casehuddle/);
  assert.match(html, /work-tab-pii/);
  assert.doesNotMatch(html, /work-tab-qa|work-tab-feedback/);
  for (const [old, newHash] of [
    ["#agents/pii", "#casehuddle/pii"],
    ["#casehuddle/qa", "#agents/qa"],
    ["#casehuddle/feedback", "#agents/feedback"],
  ]) {
    route(old);
    assert.equal(context.location.hash, newHash);
  }
  route("#pii");
  assert.match(elements["#story-content"].innerHTML, /PII detection/);
  route("#feedback");
  assert.match(elements["#story-content"].innerHTML, /Feedback, ready/);
  const menu = new Element();
  menu.attrs.open = "";
  const link = {
    dataset: {},
    hasAttribute: (k) => k === "data-work-link",
    getAttribute: () => "#builds",
    closest: () => menu,
  };
  events.click({
    button: 0,
    target: { closest: (s) => (s === "[data-explore]" ? null : link) },
    preventDefault() {},
  });
  assert.equal(menu.attrs.open, undefined);
  assert.equal(
    elements["#story"].open,
    false,
    "Menu selection travels before opening",
  );
  for (let t = 0; t < 1000 && frames.size; t += 16) {
    const pending = [...frames];
    frames.clear();
    pending.forEach(([, fn]) => fn(t));
  }
  assert.equal(elements["#story"].open, true);
  assert.match(
    elements["#story-content"].innerHTML,
    /Faster builds, less waiting/,
  );

  vm.runInContext("compactViewport.matches = true;", context);
  events["island-select-destination"]({ detail: { id: "react" } });
  assert.equal(
    elements["#story"].open,
    false,
    "Mobile arrows select without opening a story",
  );
  assert.equal(context.location.hash, "#map");
  assert.equal(stops[2].attrs["aria-current"], "location");
  assert.equal(elements["#traveler"].style.left, "52%");
  const before = context.location.hash;
  events["island-select-destination"]({ detail: { id: "invalid" } });
  assert.equal(context.location.hash, before);
});
