const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { test } = require("node:test");

test("Mobile camera, continuous dragging, overview, and rotation", async () => {
  const classSet = new Set(),
    rootStyle = {},
    events = {},
    listeners = {},
    emitted = [],
    timeouts = [];
  const viewport = {
    events: {},
    rect: { width: 390, height: 844 },
    getBoundingClientRect() {
      return this.rect;
    },
    addEventListener(k, fn) {
      this.events[k] = fn;
    },
    setPointerCapture(id) {
      this.capture = id;
    },
    hasPointerCapture(id) {
      return this.capture === id;
    },
    releasePointerCapture() {
      this.capture = null;
    },
  };
  const names = [
    "Launch Harbor",
    "Build Mill",
    "React Keep",
    "Cache Springs",
    "Agent Tower",
    "CaseHuddle Commons",
  ];
  const descriptions = [
    "Product impact",
    "Faster builds",
    "React 16 → 18",
    "State & caching",
    "AI agents",
    "Built from scratch",
  ];
  const ids = ["product", "builds", "react", "state", "agents", "casehuddle"];
  const coords = [
    [19.5, 61.84],
    [32.5, 43.42],
    [52, 25.66],
    [65.5, 46.05],
    [55.5, 63.82],
    [81.5, 75],
  ];
  const places = ids.map((id, i) => ({
    dataset: { stop: id },
    style: { getPropertyValue: (k) => coords[i][k === "--x" ? 0 : 1] + "%" },
    hasAttribute: () => i === 0,
    querySelector: (s) =>
      s === ".place-name"
        ? { textContent: names[i] }
        : { textContent: descriptions[i] },
    click() {
      this.clicked = true;
    },
  }));
  function control() {
    return {
      attrs: {},
      events: {},
      setAttribute(k, v) {
        this.attrs[k] = v;
      },
      removeAttribute(k) {
        delete this.attrs[k];
      },
      addEventListener(k, fn) {
        this.events[k] = fn;
      },
    };
  }
  const elements = Object.fromEntries(
    [
      "#mobile-story",
      "#mobile-overview",
      "#mobile-previous",
      "#mobile-next",
      "#mobile-place",
      "#mobile-description",
      ".work-menu",
    ].map((id) => [id, control()]),
  );
  const media = {
    matches: true,
    addEventListener(k, fn) {
      this.listener = fn;
    },
  };
  const motion = { matches: false, addEventListener() {} };
  const document = {
    documentElement: {
      style: {
        setProperty(k, v) {
          rootStyle[k] = v;
        },
      },
    },
    body: {
      classList: {
        add: (k) => classSet.add(k),
        remove: (k) => classSet.delete(k),
        toggle(k, on) {
          on ? classSet.add(k) : classSet.delete(k);
        },
      },
    },
    querySelector: (s) =>
      s === ".map-column" ? viewport : s === ".world" ? {} : elements[s],
    querySelectorAll: () => places,
    addEventListener(k, fn, capture) {
      (listeners[k] ||= []).push({ fn, capture });
    },
    dispatchEvent(event) {
      emitted.push(event);
      if (event.type === "island-select-destination")
        this.dispatchEvent({
          type: "island-destination-change",
          detail: event.detail,
        });
      for (const { fn } of listeners[event.type] || []) fn(event);
    },
  };
  let resize;
  vm.runInNewContext(
    fs.readFileSync(
      require("node:path").join(__dirname, "..", "mobile.js"),
      "utf8",
    ),
    {
      document,
      matchMedia: (q) => (q.includes("reduced-motion") ? motion : media),
      CustomEvent: class {
        constructor(type, options) {
          this.type = type;
          this.detail = options.detail;
        }
      },
      ResizeObserver: class {
        constructor(fn) {
          resize = fn;
        }
        observe() {}
      },
      setTimeout: (fn) => timeouts.push(fn),
    },
  );
  assert.equal(rootStyle["--mobile-world-width"], "900px");
  assert.equal(elements["#mobile-place"].textContent, names[0]);
  elements["#mobile-next"].events.click();
  assert.equal(elements["#mobile-place"].textContent, names[1]);
  elements["#mobile-story"].events.click();
  assert.equal(places[1].clicked, true);
  elements["#mobile-previous"].events.click();
  elements["#mobile-previous"].events.click();
  assert.equal(
    elements["#mobile-place"].textContent,
    names[5],
    "Wraps through all destinations",
  );
  const zoomWidth = parseFloat(rootStyle["--mobile-world-width"]);
  elements["#mobile-overview"].events.click();
  assert.equal(elements["#mobile-overview"].attrs["aria-pressed"], "true");
  assert.ok(parseFloat(rootStyle["--mobile-world-width"]) < zoomWidth);
  assert.equal(classSet.has("is-overview"), true);
  elements["#mobile-overview"].events.click();
  assert.equal(parseFloat(rootStyle["--mobile-world-width"]), zoomWidth);
  const target = { closest: () => null };
  function down(x, y) {
    viewport.events.pointerdown({
      isPrimary: true,
      button: 0,
      pointerId: 1,
      clientX: x,
      clientY: y,
      target,
    });
  }
  down(100, 100);
  viewport.events.pointermove({ pointerId: 1, clientX: 104, clientY: 101 });
  assert.equal(classSet.has("is-panning"), false, "Small movement stays a tap");
  viewport.events.pointermove({ pointerId: 1, clientX: 140, clientY: 140 });
  assert.equal(classSet.has("is-panning"), true);
  const firstCamera = rootStyle["--mobile-camera-x"];
  viewport.events.pointermove({ pointerId: 1, clientX: 180, clientY: 140 });
  const secondCamera = rootStyle["--mobile-camera-x"];
  assert.notEqual(
    secondCamera,
    firstCamera,
    "A held pointer continues moving past the threshold",
  );
  viewport.events.pointermove({ pointerId: 1, clientX: 220, clientY: 140 });
  assert.notEqual(
    rootStyle["--mobile-camera-x"],
    secondCamera,
    "Multiple pointer moves continue the drag",
  );
  viewport.events.pointerup({ pointerId: 1, type: "pointerup" });
  let prevented = false,
    stopped = false;
  listeners.click[0].fn({
    preventDefault() {
      prevented = true;
    },
    stopImmediatePropagation() {
      stopped = true;
    },
  });
  assert.ok(prevented && stopped, "Drag does not activate scenery");
  viewport.rect = { width: 844, height: 390 };
  resize();
  assert.equal(
    rootStyle["--mobile-world-width"],
    "1519.2px",
    "Landscape layout recomputes camera",
  );
  for (const id of ids) {
    document.dispatchEvent({
      type: "island-destination-change",
      detail: { id },
    });
    const i = ids.indexOf(id),
      x =
        (coords[i][0] / 100) * parseFloat(rootStyle["--mobile-world-width"]) +
        parseFloat(rootStyle["--mobile-camera-x"]);
    assert.ok(x >= 0 && x <= 844, "Selected landmark remains visible");
  }
  media.matches = false;
  media.listener();
  const oldCamera = rootStyle["--mobile-camera-x"];
  viewport.rect = { width: 1440, height: 900 };
  resize();
  assert.equal(
    rootStyle["--mobile-camera-x"],
    oldCamera,
    "Desktop does not apply a camera",
  );
});
