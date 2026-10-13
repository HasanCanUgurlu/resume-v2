const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { test } = require("node:test");

test("Bird escape continuity, speed, cancellation, and motion controls", async () => {
  function setup(reduced = false) {
    let sequence = 0;
    const timers = new Map(),
      nodes = [],
      animations = [],
      events = {};
    function makeNode() {
      return {
        attrs: {},
        listeners: {},
        style: {
          values: {},
          setProperty(key, value) {
            this.values[key] = value;
          },
        },
        setAttribute(key, value) {
          this.attrs[key] = value;
        },
        getAttribute(key) {
          return this.attrs[key];
        },
        removeAttribute(key) {
          delete this.attrs[key];
        },
        addEventListener(key, fn) {
          this.listeners[key] = fn;
        },
        remove() {
          this.removed = true;
        },
        animate(frames, options) {
          let complete, reject;
          const animation = {
            frames,
            options,
            rateUpdates: 0,
            updatePlaybackRate(rate) {
              this.playbackRate = rate;
              this.rateUpdates++;
            },
            currentTime: 0,
            effect: { getTiming: () => options },
            finished: new Promise((resolve, fail) => {
              complete = resolve;
              reject = fail;
            }),
            cancel() {
              this.cancelled = true;
              reject();
            },
            finish() {
              complete();
            },
            pause() {
              this.paused = true;
            },
            play() {
              this.paused = false;
            },
          };
          animations.push(animation);
          return animation;
        },
      };
    }
    const tree = makeNode();
    tree.attrs = { x: 100, y: 200 };
    const trees = makeNode();
    trees.querySelectorAll = () => [tree];
    const rings = [makeNode(), makeNode()];
    const document = {
      hidden: false,
      body: { classList: { contains: () => false } },
      querySelector: (selector) =>
        selector === "#ambience"
          ? { append: (node) => nodes.push(node) }
          : trees,
      querySelectorAll: () => rings,
      createElementNS: makeNode,
      addEventListener(key, fn) {
        events[key] = fn;
      },
    };
    const context = {
      document,
      Math,
      matchMedia: () => ({ matches: reduced }),
      setTimeout(fn, delay) {
        timers.set(++sequence, { fn, delay });
        return sequence;
      },
      clearTimeout: (timer) => timers.delete(timer),
    };
    vm.createContext(context);
    vm.runInContext(
      fs.readFileSync(
        require("node:path").join(__dirname, "..", "ambience.js"),
        "utf8",
      ),
      context,
    );
    return { timers, nodes, animations, events, trees, tree, document };
  }

  const state = setup();
  const [id, timer] = [...state.timers][0];
  state.timers.delete(id);
  timer.fn();
  const bird = state.nodes[0],
    original = state.animations[0];
  original.currentTime = original.options.duration * 0.5;
  const midpoint = original.frames[12];
  original.currentTime = original.options.duration * midpoint.offset;
  bird.listeners.click();
  const escape = state.animations[1];
  assert.equal(
    escape.frames[0].transform,
    midpoint.transform,
    "Escape starts at current location",
  );
  assert.notEqual(
    escape.frames.at(-1).transform,
    original.frames.at(-1).transform,
    "Route changes",
  );
  assert.equal(original.cancelled, true);
  assert.equal(bird.style.values["--gull-cycle"], "1.3s");
  function distance(frames) {
    const points = frames.map((frame) =>
      [...frame.transform.matchAll(/translate\(([-\d.]+)px,([-\d.]+)px/g)][0]
        .slice(1)
        .map(Number),
    );
    return points
      .slice(1)
      .reduce(
        (sum, point, i) =>
          sum + Math.hypot(point[0] - points[i][0], point[1] - points[i][1]),
        0,
      );
  }
  const ratio =
    distance(escape.frames) /
    escape.options.duration /
    (distance(original.frames) / original.options.duration);
  assert.ok(Math.abs(ratio - 2.3) < 0.001, "Escape is 2.3 times normal speed");
  bird.listeners.click();
  assert.equal(state.animations.length, 2, "Repeated clicks do not stack");
  await Promise.resolve();
  assert.equal(
    bird.attrs.visibility,
    "visible",
    "Cancelled flight does not hide replacement",
  );
  state.events["island-motion-change"]({ detail: { paused: true } });
  assert.equal(escape.paused, true);
  assert.equal(bird.attrs.tabindex, "-1");
  state.events["island-motion-change"]({ detail: { paused: false } });
  assert.equal(escape.paused, false);
  escape.finish();
  await Promise.resolve();
  assert.equal(bird.attrs.visibility, "hidden");
  assert.equal(state.timers.size, 2);
  const quiet = setup(true);
  assert.equal(quiet.timers.size, 0);
});
