const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { test } = require("node:test");

test("Bunny surprises, console hops, cooldowns, and motion controls", async () => {
  const events = {},
    nodes = [],
    frames = new Map(),
    animations = [],
    messages = [],
    window = {};
  let frameId = 0,
    now = 0,
    chance = 0.5;
  function node() {
    return {
      animate(keyframes, options) {
        let finish;
        const animation = {
          keyframes,
          options,
          finished: new Promise((resolve) => {
            finish = resolve;
          }),
          finish() {
            finish();
          },
        };
        animations.push(animation);
        return animation;
      },
      attrs: {},
      parts: {},
      listeners: {},
      setAttribute(k, v) {
        this.attrs[k] = v;
      },
      getAttribute(k) {
        return this.attrs[k];
      },
      removeAttribute(k) {
        delete this.attrs[k];
      },
      addEventListener(k, fn) {
        this.listeners[k] = fn;
      },
      querySelector(k) {
        return (this.parts[k] ||= node());
      },
      remove() {
        this.removed = true;
      },
    };
  }
  const trees = [
    [120, 200],
    [160, 220],
    [210, 200],
    [800, 550],
    [850, 590],
  ].map(([x, y]) => {
    const n = node();
    n.attrs = { x, y };
    return n;
  });
  const layer = {
    append(n) {
      if (!nodes.includes(n)) nodes.push(n);
    },
  };
  const document = {
    hidden: false,
    body: { classList: { contains: () => false } },
    querySelector: (s) => (s === "#wildlife" ? layer : layer),
    querySelectorAll: () => trees,
    createElementNS: node,
    addEventListener(k, fn) {
      events[k] = fn;
    },
  };
  const math = Object.create(Math);
  math.random = () => chance;
  vm.runInNewContext(
    fs.readFileSync(
      require("node:path").join(__dirname, "..", "wildlife.js"),
      "utf8",
    ),
    {
      window,
      console: { info: (message) => messages.push(message) },
      document,
      Math: math,
      performance: { now: () => now },
      matchMedia: () => ({ matches: false }),
      requestAnimationFrame(fn) {
        frames.set(++frameId, fn);
        return frameId;
      },
      cancelAnimationFrame(id) {
        frames.delete(id);
      },
      setTimeout,
      clearTimeout,
    },
  );
  function shake(tree) {
    events["island-tree-shake"]({ detail: { tree } });
  }
  function tick() {
    now += 50;
    const [id, fn] = [...frames][0];
    frames.delete(id);
    fn(now);
  }
  assert.equal(nodes.length, 20);
  assert.equal(messages.length, 1);
  assert.ok(messages[0].includes("island.hop()"));
  assert.equal(window.island.hop(), 4);
  assert.equal(animations.length, 4);
  assert.equal(window.island.hop(), 0, "Repeated command does not stack hops");
  assert.ok(
    animations.every(
      (animation) => animation.keyframes.at(-1).transform === "translateY(0)",
    ),
  );

  chance = 0.3;
  shake(trees[0]);
  assert.equal(nodes.length, 20, "30% boundary excludes .3");
  chance = 0.29;
  shake(trees[0]);
  assert.equal(nodes.length, 21, "Below .3 spawns bunny");
  const bunny = nodes[20];
  assert.equal(bunny.attrs["aria-hidden"], "true");
  assert.equal(bunny.attrs.tabindex, undefined);
  assert.equal(bunny.parts[".rabbit-hitbox"].removed, true);
  shake(trees[1]);
  assert.equal(nodes.length, 21);
  for (let i = 0; i < 80; i++) tick();
  assert.equal(bunny.attrs.visibility, "hidden", "Bunny hides at destination");
  const restingTransform = bunny.attrs.transform;
  shake(trees[0]);
  assert.equal(
    bunny.attrs.visibility,
    "hidden",
    "Cooldown suppresses new spawn",
  );
  for (let i = 0; i < 25; i++) tick();
  shake(trees[3]);
  assert.equal(nodes.length, 21, "Reuses one bunny");
  assert.equal(bunny.attrs.visibility, undefined);
  for (let i = 0; i < 80; i++) tick();
  assert.equal(bunny.attrs.visibility, "hidden");
  assert.ok(
    /translate\(874\.00 624\.00\)/.test(bunny.attrs.transform),
    "Commons bunny stays on Commons",
  );
  now += 6000;
  shake(trees[0]);
  events["island-motion-change"]({ detail: { paused: true } });
  assert.equal(bunny.attrs.visibility, "hidden");
  now += 6000;
  shake(trees[0]);
  assert.equal(bunny.attrs.visibility, "hidden", "No surprise while paused");
  assert.equal(window.island.hop(), 0, "Paused command creates no hops");

  await Promise.resolve();

  events["island-motion-change"]({ detail: { paused: false } });
  assert.equal(window.island.hop(), 4, "Finished hops can be replayed");
  document.hidden = true;
  events.visibilitychange();
  assert.equal(window.island.hop(), 0, "No hops in a hidden tab");
});
