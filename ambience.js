"use strict";

(() => {
  const layer = document.querySelector("#ambience");
  const trees = document.querySelector("#trees");
  const random = (min, max) => min + Math.random() * (max - min);
  let paused =
    document.body.classList.contains("paused") ||
    matchMedia("(prefers-reduced-motion: reduce)").matches;
  const effects = new Set();
  const ESCAPE_SPEED_MULTIPLIER = 2.3;
  const ESCAPE_WINGBEAT_SECONDS = 1.3;

  function trackEffect(animation, cleanup = () => {}) {
    effects.add(animation);
    const finish = () => {
      effects.delete(animation);
      cleanup();
    };
    animation.finished.then(finish, finish);
  }
  function makeBird(index) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
    node.setAttribute("class", "seabird");
    node.setAttribute("visibility", "hidden");
    node.setAttribute("aria-hidden", "true");
    node.setAttribute("tabindex", "-1");
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", "Seabird — send it flying away");
    node.setAttribute(
      "style",
      `--gull-cycle:${index === 0 ? 4.6 : 5.2}s;--gull-delay:${index === 0 ? 0 : -1.7}s`,
    );
    node.innerHTML = `<ellipse class="gull-shadow" cx="-1" cy="15" rx="8" ry="1.4" fill="#345e61" opacity=".12"/>
<!-- The farther wing sits behind the body and is shaded. -->
<g transform="translate(3 -1)"><g transform="scale(.7)"><g class="gull-wing gull-wing-far">
<path fill="#81998a" d="M0 1h-3v-3h-3v-3h-3v-3h-2v-5h3v3h3v3h3v4h3Z"/>
<path fill="#c7d3c0" d="M-1-1h-1v-2h-3v-3h-3v-4h1v3h3v3h3Z"/>
</g></g></g>
<!-- A compact body, fan tail, head, and beak remain stable during wingbeats. -->
<path fill="#839585" d="M-7-1h10v-2h3v-3h5v2h2v5h-3v3H-5V3h-4v-2h-4v-4h4v2Z"/>
<path fill="#f1eed5" d="M-6 0h10v-2h3v-2h3v1h1v3H8v3H-4V2h-3Z"/>
<path fill="#d6dfca" d="M-6 2H7v1H-4V2Zm-5-3h3v2h-3Z"/>
<path fill="#d3ab64" d="M11-2h4v2h-4Z"/>
<path fill="#405951" d="M9-3h1v1H9Z"/>
<g transform="translate(2 -1)"><g transform="scale(.65)"><g class="gull-wing gull-wing-near">
<path fill="#81998a" d="M0 1h-3v-2h-3v-3h-3v-3h-3v-3h-3v-4h4v3h4v3h3v3h3v3h2Z"/>
<path fill="#f4efd6" d="M-1-1h-1v-2h-3v-3h-3v-3h-3v-3h1v3h4v3h3v3h2Z"/>
<path fill="#c6d3bd" d="M-13-13h2v2h-2Zm3 4h3v1h-3Z"/>
</g></g></g>`;
    layer.append(node);
    const bird = { node, flight: null, timer: null, escaping: false };
    node.addEventListener("click", () => escapeBird(bird));
    node.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      if (!event.repeat) escapeBird(bird);
    });
    return bird;
  }
  const birds = [makeBird(0), makeBird(1)];

  function setBirdVisible(bird, visible) {
    bird.node.setAttribute("visibility", visible ? "visible" : "hidden");
    bird.node.setAttribute("tabindex", visible ? "0" : "-1");
    if (visible) bird.node.removeAttribute("aria-hidden");
    else {
      bird.node.setAttribute("aria-hidden", "true");
      if (document.activeElement === bird.node) {
        (
          document.querySelector("[data-stop][aria-current]") ||
          document.querySelector("[data-stop]")
        )?.focus();
      }
    }
  }
  function escapeBird(bird) {
    if (paused || document.hidden || !bird.flight || bird.escaping) return;
    bird.escaping = true;
    const flight = bird.flight;
    const progress = Math.min(
      1,
      Math.max(
        0,
        (flight.currentTime || 0) / flight.effect.getTiming().duration,
      ),
    );
    const samples = bird.samples;
    const nextIndex = samples.findIndex((sample) => sample.offset > progress);
    const next = samples[nextIndex < 0 ? samples.length - 1 : nextIndex];
    const previous =
      samples[
        Math.max(0, (nextIndex < 0 ? samples.length - 1 : nextIndex) - 1)
      ];
    const fraction =
      (progress - previous.offset) / (next.offset - previous.offset);
    const start = previous.point.map(
      (value, axis) => value + (next.point[axis] - value) * fraction,
    );
    const dx = next.point[0] - previous.point[0],
      dy = next.point[1] - previous.point[1];
    const length = Math.hypot(dx, dy);
    const heading = bird.heading;
    const turn =
      start[1] < 140 ? 1 : start[1] > 620 ? -1 : Math.random() < 0.5 ? -1 : 1;
    const end = [
      heading > 0 ? 1030 : -30,
      Math.min(730, Math.max(30, start[1] + turn * random(160, 260))),
    ];
    // The first control point keeps the existing heading as the escape curves away.
    startBirdFlight(
      bird,
      [
        start,
        [start[0] + (dx / length) * 65, start[1] + (dy / length) * 65],
        [start[0] + (end[0] - start[0]) * 0.55, end[1]],
        end,
      ],
      bird.speed * ESCAPE_SPEED_MULTIPLIER,
    );
    flight.cancel();
    bird.node.style.setProperty("--gull-cycle", `${ESCAPE_WINGBEAT_SECONDS}s`);
  }

  function scheduleBird(bird, first = false) {
    clearTimeout(bird.timer);
    if (paused || document.hidden || bird.flight) return;
    bird.timer = setTimeout(
      () => flyBird(bird),
      first ? random(1000, 16000) : random(10000, 55000),
    );
  }
  function flyBird(bird) {
    if (paused || document.hidden) return;
    const corridors = [
      [25, 85, 25, 85],
      [660, 724, 660, 724],
      [160, 310, 390, 560],
      [430, 590, 170, 330],
    ];
    const band = corridors[Math.floor(random(0, corridors.length))];
    const start = [-30, random(band[0], band[1])];
    const end = [1030, random(band[2], band[3])];
    const bend = random(-35, 35);
    let curve = [
      start,
      [random(280, 390), start[1] + (end[1] - start[1]) / 3 + bend],
      [random(640, 760), start[1] + (2 * (end[1] - start[1])) / 3 - bend],
      end,
    ];
    if (Math.random() < 0.5) curve = curve.reverse();
    bird.node.setAttribute(
      "style",
      `--gull-cycle:${random(3.8, 6.2).toFixed(2)}s;--gull-delay:-${random(0, 3).toFixed(2)}s`,
    );
    bird.escaping = false;
    setBirdVisible(bird, true);
    startBirdFlight(bird, curve, random(38, 76));
  }

  function startBirdFlight(bird, curve, speed) {
    const heading = curve[3][0] > curve[0][0] ? 1 : -1;
    const samples = [];
    let distance = 0;
    for (let i = 0; i <= 24; i++) {
      const t = i / 24,
        u = 1 - t;
      const point = [0, 1].map(
        (axis) =>
          u ** 3 * curve[0][axis] +
          3 * u * u * t * curve[1][axis] +
          3 * u * t * t * curve[2][axis] +
          t ** 3 * curve[3][axis],
      );
      if (samples.length) {
        const previous = samples[samples.length - 1].point;
        distance += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
      }
      samples.push({ point, distance });
    }
    samples.forEach((sample) => {
      sample.offset = sample.distance / distance;
    });
    bird.samples = samples;
    bird.heading = heading;
    bird.speed = speed;
    const flight = bird.node.animate(
      samples.map((sample) => ({
        transform: `translate(${sample.point[0].toFixed(2)}px,${sample.point[1].toFixed(2)}px) scale(${heading},1)`,
        offset: sample.offset,
      })),
      { duration: (distance / speed) * 1000, easing: "linear" },
    );
    bird.flight = flight;
    const finish = () => {
      // A replaced flight must not hide the bird or schedule another arrival.
      if (bird.flight !== flight) return;
      bird.flight = null;
      setBirdVisible(bird, false);
      scheduleBird(bird);
    };
    flight.finished.then(finish, finish);
  }

  function shakeTree(tree) {
    if (paused || !tree) return;
    document.dispatchEvent(
      new CustomEvent("island-tree-shake", { detail: { tree } }),
    );
    trackEffect(
      tree.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-1.5px)" },
          { transform: "translateX(1.5px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 240, easing: "ease-in-out" },
      ),
    );
    const x = Number(tree.getAttribute("x")) + 24;
    const y = Number(tree.getAttribute("y")) + 15;
    for (let i = 0; i < 6; i++) {
      const leaf = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      leaf.setAttribute("aria-hidden", "true");
      leaf.setAttribute("d", "M-1-2h3v3H1v1h-2Z");
      leaf.setAttribute("fill", i % 2 ? "#b7a75d" : "#6c954d");
      layer.append(leaf);
      const drift = random(-17, 17),
        fall = random(25, 43);
      trackEffect(
        leaf.animate(
          [
            { transform: `translate(${x}px,${y}px) rotate(0deg)`, opacity: 0 },
            {
              transform: `translate(${x + drift * 0.3}px,${y + fall * 0.25}px) rotate(45deg)`,
              opacity: 0.85,
              offset: 0.25,
            },
            {
              transform: `translate(${x + drift}px,${y + fall}px) rotate(160deg)`,
              opacity: 0,
            },
          ],
          {
            duration: random(1300, 2200),
            delay: i * 45,
            easing: "ease-out",
            fill: "both",
          },
        ),
        () => leaf.remove(),
      );
    }
  }
  trees.addEventListener("click", (event) =>
    shakeTree(event.target.closest("image")),
  );
  trees.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.repeat) return;
    const options = [...trees.querySelectorAll("image")];
    shakeTree(options[Math.floor(random(0, options.length))]);
  });
  document.addEventListener("island-spring", () => {
    if (paused) return;
    document.querySelectorAll(".spring-touch-ripple").forEach((ring, index) => {
      trackEffect(
        ring.animate(
          [
            { opacity: 0, transform: "scale(.55)" },
            { opacity: 0.7, transform: "scale(.8)", offset: 0.3 },
            { opacity: 0, transform: "scale(1.15)" },
          ],
          { duration: 950, delay: index * 170, easing: "ease-out" },
        ),
      );
    });
  });

  function syncPlayback() {
    const stopped = paused || document.hidden;
    if (stopped) effects.forEach((animation) => animation.finish());
    for (const bird of birds) {
      clearTimeout(bird.timer);
      if (bird.flight) {
        setBirdVisible(bird, !stopped);
        stopped ? bird.flight.pause() : bird.flight.play();
      } else scheduleBird(bird);
    }
  }
  document.addEventListener("island-motion-change", (event) => {
    paused = event.detail.paused;
    syncPlayback();
  });
  document.addEventListener("visibilitychange", syncPlayback);
  birds.forEach((bird) => scheduleBird(bird, true));
})();
