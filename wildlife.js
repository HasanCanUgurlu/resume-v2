"use strict";

(() => {
  const layer = document.querySelector("#wildlife");
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const random = (min, max) => min + Math.random() * (max - min);
  const TREE_BUNNY_CHANCE = 0.3;
  const TREE_BUNNY_COOLDOWN_MS = 5000;
  const BUNNY_FLEE_SPEED = 75;
  const BUNNY_RELOCATE_SPEED = 55;
  const TREE_BUNNY_RUN_SPEED = 85;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const fishArt = `<path fill="#376f76" d="M-9-3h12v2h4v4H3v2H-9V2h-3v-4h3Z"/>
    <path fill="#75aaa5" d="M-7-2H2v1h3v3H2v1H-7Z"/>
    <path class="fish-tail" fill="#376f76" d="M-14-4h3v2h3v4h-3v2h-3Z"/>
    <path fill="#a4c6b1" d="M2-1h1v1H2Z"/><path fill="#50888c" d="M-4 1h3v2h-3Z"/>`;
  const bunnySheets = {
    idle: { file: "Idle.png", frames: 2 },
    walk: { file: "Walk.png", frames: 4 },
    turn: { file: "Turn.png", frames: 1 },
  };
  // Keep the original 64px frames intact; the viewport selects one frame at a time.
  const rabbitArt = `<svg x="-13" y="-22" width="26" height="24" viewBox="18 18 26 24" overflow="hidden" aria-hidden="true" focusable="false">
    <image class="rabbit-sheet" href="assets/duckhive-bunny/Idle.png" width="128" height="64" x="0" y="0" image-rendering="pixelated"/>
  </svg>`;

  const rabbitPatches = [
    { island: "main", left: 362, right: 416, top: 376, bottom: 409 },
    { island: "main", left: 140, right: 190, top: 367, bottom: 408 },
    { island: "main", left: 612, right: 660, top: 215, bottom: 244 },
    { island: "commons", left: 752, right: 792, top: 622, bottom: 636 },
    { island: "main", left: 299, right: 339, top: 393, bottom: 419 },
    { island: "main", left: 128, right: 151, top: 413, bottom: 451 },
    { island: "main", left: 655, right: 681, top: 190, bottom: 216 },
    { island: "commons", left: 879, right: 906, top: 626, bottom: 646 },
  ];

  function createCreature(kind, position, habitat, delay, interactive = true) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
    node.setAttribute("class", `wildlife-${kind}`);
    node.innerHTML =
      kind === "fish"
        ? `<path class="fish-ripple" d="M-13-4h5v-2H5v2h5v6H5v2H-8V2h-5Z" fill="none" stroke="#b2d4c7" stroke-width="1" opacity="0"/><g class="animal-body">${fishArt}</g>`
        : `<ellipse class="animal-shadow" cx="0" cy="2" rx="9" ry="2" fill="#446541" opacity=".24"/><g class="animal-body"><g class="rabbit-hop">${rabbitArt}<rect class="rabbit-hitbox" x="-13" y="-22" width="26" height="24" fill="transparent" aria-hidden="true"/></g></g>`;
    if (!interactive) node.querySelector(".rabbit-hitbox")?.remove();
    layer.append(node);
    const creature = {
      kind,
      node,
      body: node.querySelector(".animal-body"),
      ripple: node.querySelector(".fish-ripple"),
      tail: node.querySelector(".fish-tail"),
      shadow: node.querySelector(".animal-shadow"),
      sheet: node.querySelector(".rabbit-sheet"),
      hop: kind === "rabbit" ? node.querySelector(".rabbit-hop") : null,
      sheetPose: "idle",
      sheetFrame: 0,
      idleFrame: 0,
      blinkWait: random(1.5, 6),
      blinkRemaining: 0,
      turnTime: 0,
      position,
      habitat,
      size: kind === "rabbit" ? random(0.6, 0.72) : random(0.44, 0.6),
      displayFacing: 1,
      swimTime: random(0, 10),
      speed: random(4.5, 7.5),
      facing: 1,
      phase: "rest",
      elapsed: 0,
      duration: delay,
    };
    if (kind === "rabbit" && interactive) {
      node.setAttribute("role", "button");
      node.setAttribute("tabindex", "0");
      node.setAttribute("aria-label", "Bunny — hide behind a tree");
      node.addEventListener("click", () => hideBunny(creature));
      node.addEventListener("keydown", (event) => {
        if (!["Enter", " "].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat) hideBunny(creature);
      });
    } else node.setAttribute("aria-hidden", "true");
    return creature;
  }

  function createRabbit(habitat) {
    return createCreature(
      "rabbit",
      [
        random(habitat.left, habitat.right),
        random(habitat.top, habitat.bottom),
      ],
      habitat,
      random(2, 8),
    );
  }

  // Clear patches deliberately avoid buildings, paths, shoreline edges, and the pier.
  const creatures = [
    createCreature(
      "fish",
      [34, 427],
      { left: 24, right: 66, top: 400, bottom: 478 },
      random(1, 4),
    ),
    createCreature(
      "fish",
      [56, 465],
      { left: 24, right: 66, top: 400, bottom: 478 },
      random(3, 6),
    ),
    createCreature(
      "fish",
      [61, 595],
      { left: 45, right: 128, top: 588, bottom: 627 },
      random(2, 5),
    ),
    createCreature(
      "fish",
      [112, 612],
      { left: 45, right: 128, top: 588, bottom: 627 },
      random(4, 7),
    ),
    createCreature(
      "fish",
      [366, 655],
      { left: 330, right: 468, top: 642, bottom: 710 },
      random(1, 5),
    ),
    createCreature(
      "fish",
      [427, 685],
      { left: 330, right: 468, top: 642, bottom: 710 },
      random(5, 8),
    ),
    createCreature(
      "fish",
      [51, 246],
      { left: 28, right: 76, top: 212, bottom: 267 },
      random(1, 6),
    ),
    createCreature(
      "fish",
      [171, 107],
      { left: 135, right: 202, top: 78, bottom: 123 },
      random(2, 7),
    ),
    createCreature(
      "fish",
      [371, 48],
      { left: 335, right: 410, top: 30, bottom: 69 },
      random(1, 5),
    ),
    createCreature(
      "fish",
      [483, 63],
      { left: 448, right: 523, top: 32, bottom: 73 },
      random(4, 8),
    ),
    createCreature(
      "fish",
      [701, 96],
      { left: 656, right: 737, top: 71, bottom: 110 },
      random(2, 6),
    ),
    createCreature(
      "fish",
      [873, 338],
      { left: 840, right: 921, top: 303, bottom: 364 },
      random(1, 7),
    ),
    createCreature(
      "fish",
      [815, 408],
      { left: 785, right: 850, top: 386, bottom: 435 },
      random(3, 8),
    ),
    createCreature(
      "fish",
      [981, 570],
      { left: 975, right: 987, top: 535, bottom: 610 },
      random(2, 6),
    ),
    createCreature(
      "fish",
      [722, 716],
      { left: 688, right: 755, top: 694, bottom: 732 },
      random(4, 9),
    ),
    createCreature(
      "fish",
      [581, 682],
      { left: 539, right: 618, top: 654, bottom: 710 },
      random(1, 5),
    ),
    createRabbit(rabbitPatches[0]),
    createRabbit(rabbitPatches[1]),
    createRabbit(rabbitPatches[2]),
    createRabbit(rabbitPatches[3]),
  ];
  let paused =
    document.body.classList.contains("paused") || motionPreference.matches;
  let frame = 0;
  let lastTime;
  const bunnyHops = new Map();

  function hopBunnies() {
    if (paused || motionPreference.matches || document.hidden) return 0;
    let count = 0;
    for (const creature of creatures) {
      if (
        creature.kind !== "rabbit" ||
        creature === surpriseBunny ||
        ["hiding", "dormant"].includes(creature.phase) ||
        bunnyHops.has(creature)
      )
        continue;
      const animation = creature.hop.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(-7px)", offset: 0.45 },
          { transform: "translateY(0)" },
        ],
        { duration: 480, easing: "ease-in-out" },
      );
      bunnyHops.set(creature, animation);
      const finish = () => bunnyHops.delete(creature);
      animation.finished.then(finish, finish);
      count++;
    }
    return count;
  }

  const shelterLayer = document.querySelector("#wildlife-shelters");
  const shelters = [...document.querySelectorAll("#trees image")].map(
    (tree) => [
      Number(tree.getAttribute("x")) + 24,
      Number(tree.getAttribute("y")) + 34,
    ],
  );

  let surpriseBunny = null;
  let nextTreeSurprise = 0;

  function hideSurpriseBunny() {
    if (!surpriseBunny) return;
    surpriseBunny.phase = "dormant";
    surpriseBunny.node.setAttribute("visibility", "hidden");
  }

  function revealTreeBunny(event) {
    if (
      paused ||
      document.hidden ||
      performance.now() < nextTreeSurprise ||
      (surpriseBunny && surpriseBunny.phase !== "dormant")
    )
      return;
    const tree = event.detail.tree;
    const start = [
      Number(tree.getAttribute("x")) + 24,
      Number(tree.getAttribute("y")) + 34,
    ];
    const onCommons = (point) => point[0] > 750 && point[1] > 530;
    const destinations = shelters
      .filter(
        (point) =>
          onCommons(point) === onCommons(start) &&
          Math.hypot(point[0] - start[0], point[1] - start[1]) > 10,
      )
      .sort(
        (a, b) =>
          Math.hypot(a[0] - start[0], a[1] - start[1]) -
          Math.hypot(b[0] - start[0], b[1] - start[1]),
      )
      .slice(0, 3);
    if (!destinations.length || Math.random() >= TREE_BUNNY_CHANCE) return;
    if (!surpriseBunny) {
      surpriseBunny = createCreature("rabbit", start, null, 0.35, false);
      creatures.push(surpriseBunny);
    }
    nextTreeSurprise = performance.now() + TREE_BUNNY_COOLDOWN_MS;
    surpriseBunny.position = start;
    surpriseBunny.target =
      destinations[Math.floor(random(0, destinations.length))];
    surpriseBunny.facing = surpriseBunny.target[0] >= start[0] ? 1 : -1;
    surpriseBunny.phase = "rest";
    surpriseBunny.elapsed = 0;
    surpriseBunny.duration = 0.35;
    surpriseBunny.idleFrame = 0;
    surpriseBunny.node.removeAttribute("visibility");
    render(surpriseBunny);
  }
  document.addEventListener("island-tree-shake", revealTreeBunny);

  function runRabbit(creature, target, phase, speed) {
    creature.start = [...creature.position];
    creature.target = [...target];
    const distance = Math.hypot(
      target[0] - creature.position[0],
      target[1] - creature.position[1],
    );
    creature.duration = Math.max(0.5, distance / speed);
    creature.hops = Math.max(1, Math.ceil(distance / 10));
    creature.facing = target[0] >= creature.position[0] ? 1 : -1;
    creature.turnTime = 0.1;
    creature.phase = phase;
    creature.elapsed = 0;
  }

  function finishHiding(creature) {
    layer.append(creature.node);
    creature.node.removeAttribute("visibility");
    creature.node.removeAttribute("aria-hidden");
    creature.node.setAttribute("tabindex", "0");
    const patches = rabbitPatches.filter(
      (patch) =>
        patch.island === creature.habitat.island && patch !== creature.habitat,
    );
    creature.habitat = patches[Math.floor(random(0, patches.length))];
    const destination = [
      random(creature.habitat.left, creature.habitat.right),
      random(creature.habitat.top, creature.habitat.bottom),
    ];
    if (paused) {
      creature.position = destination;
      creature.phase = "rest";
      creature.elapsed = 0;
      creature.duration = random(3, 7);
      render(creature);
    } else runRabbit(creature, destination, "relocate", BUNNY_RELOCATE_SPEED);
  }

  function restUnderTree(creature) {
    creature.phase = "hiding";
    creature.position = [...creature.target];
    render(creature);
    if (document.activeElement === creature.node) {
      (
        document.querySelector("[data-stop][aria-current]") ||
        document.querySelector("[data-stop]")
      )?.focus();
    }
    shelterLayer.append(creature.node);
    creature.node.setAttribute("visibility", "hidden");
    creature.node.setAttribute("aria-hidden", "true");
    creature.node.setAttribute("tabindex", "-1");
    creature.hideTimer = setTimeout(
      () => finishHiding(creature),
      random(1000, 5000),
    );
  }

  function hideBunny(creature) {
    if (
      ["flee", "hiding", "relocate"].includes(creature.phase) ||
      !shelters.length
    )
      return;
    const distance = (point) =>
      Math.hypot(
        point[0] - creature.position[0],
        point[1] - creature.position[1],
      );
    const tree = shelters.reduce((nearest, point) =>
      distance(point) < distance(nearest) ? point : nearest,
    );
    runRabbit(creature, tree, "flee", BUNNY_FLEE_SPEED);
    if (paused) restUnderTree(creature);
  }

  function beginMovement(creature) {
    const {
      position: [x, y],
      habitat,
      kind,
    } = creature;
    const rabbit = kind === "rabbit";
    const target = [
      clamp(
        x + random(-1, 1) * (rabbit ? 28 : 35),
        habitat.left,
        habitat.right,
      ),
      clamp(
        y + random(-1, 1) * (rabbit ? 16 : 22),
        habitat.top,
        habitat.bottom,
      ),
    ];
    const distance = Math.hypot(target[0] - x, target[1] - y);
    if (distance < 8) {
      creature.duration = random(1.5, 3);
      creature.elapsed = 0;
      return;
    }
    creature.start = [...creature.position];
    creature.target = target;
    creature.control = [
      clamp((x + target[0]) / 2 + random(-8, 8), habitat.left, habitat.right),
      clamp((y + target[1]) / 2 + random(-10, 10), habitat.top, habitat.bottom),
    ];
    const facing = target[0] >= x ? 1 : -1;
    if (rabbit && facing !== creature.facing) creature.turnTime = 0.22;
    creature.facing = facing;
    creature.hops = rabbit ? Math.ceil(distance / 10) : 0;
    creature.duration = rabbit
      ? creature.hops * random(0.36, 0.46)
      : distance / creature.speed;
    creature.surface = !rabbit && Math.random() < 0.2;
    creature.phase = "move";
    creature.elapsed = 0;
  }

  function setBunnyFrame(creature, pose, frame) {
    const sheet = bunnySheets[pose];
    if (creature.sheetPose !== pose) {
      creature.sheet.setAttribute(
        "href",
        `assets/duckhive-bunny/${sheet.file}`,
      );
      creature.sheet.setAttribute("width", String(sheet.frames * 64));
      creature.sheetPose = pose;
    }
    if (creature.sheetFrame !== frame) {
      creature.sheet.setAttribute("x", String(-frame * 64));
      creature.sheetFrame = frame;
    }
  }

  function updateBunnyBlink(creature, elapsed) {
    if (creature.kind !== "rabbit" || creature.phase !== "rest") return;
    if (creature.blinkRemaining > 0) {
      creature.blinkRemaining -= elapsed;
      if (creature.blinkRemaining <= 0) {
        creature.idleFrame = 0;
        creature.blinkWait = random(2.5, 7.5);
      }
    } else {
      creature.blinkWait -= elapsed;
      if (creature.blinkWait <= 0) {
        creature.idleFrame = 1;
        creature.blinkRemaining = random(0.12, 0.22);
      }
    }
  }

  function render(creature, progress = 0) {
    const moving =
      ["move", "flee", "relocate", "surprise-run"].includes(creature.phase) &&
      !paused;
    creature.node.setAttribute(
      "transform",
      `translate(${creature.position[0].toFixed(2)} ${creature.position[1].toFixed(2)})`,
    );
    if (creature.kind === "rabbit") {
      const turning = moving && creature.turnTime > 0;
      const pose = turning ? "turn" : moving ? "walk" : "idle";
      const frame = paused
        ? 0
        : turning
          ? 0
          : moving
            ? Math.floor(progress * creature.hops * 4) % 4
            : creature.idleFrame;
      setBunnyFrame(creature, pose, frame);
      creature.body.setAttribute(
        "transform",
        `scale(${((turning ? 1 : creature.facing) * creature.size).toFixed(2)} ${creature.size.toFixed(2)})`,
      );
      creature.shadow.setAttribute(
        "transform",
        `scale(${creature.size.toFixed(2)})`,
      );
    } else {
      const tailAngle = paused
        ? 0
        : Math.sin(creature.swimTime * (moving ? 8 : 3)) * (moving ? 17 : 5);
      creature.body.setAttribute(
        "transform",
        `scale(${(creature.size * creature.displayFacing).toFixed(3)} ${creature.size.toFixed(2)})`,
      );
      creature.tail.setAttribute(
        "transform",
        `rotate(${tailAngle.toFixed(2)} -9 0)`,
      );
      const surface =
        moving && creature.surface ? Math.sin(progress * Math.PI) : 0;
      const depth = paused
        ? 0.35
        : 0.32 + Math.sin(creature.swimTime * 0.5) * 0.06;
      creature.body.setAttribute("opacity", String(depth + surface * 0.2));
      creature.ripple.setAttribute("opacity", String(surface * 0.28));
      creature.ripple.setAttribute(
        "transform",
        `scale(${(creature.size * (1 + surface * 0.45)).toFixed(2)})`,
      );
    }
  }

  function tick(time) {
    const elapsed =
      lastTime === undefined ? 0 : Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    for (const creature of creatures) {
      if (["hiding", "dormant"].includes(creature.phase)) continue;
      updateBunnyBlink(creature, elapsed);
      creature.elapsed += elapsed;
      creature.swimTime += elapsed;
      creature.turnTime = Math.max(0, creature.turnTime - elapsed);
      if (creature.kind === "fish")
        creature.displayFacing += clamp(
          creature.facing - creature.displayFacing,
          -elapsed * 4,
          elapsed * 4,
        );
      if (creature.phase === "rest") {
        if (creature.elapsed >= creature.duration) {
          if (creature === surpriseBunny)
            runRabbit(
              creature,
              creature.target,
              "surprise-run",
              TREE_BUNNY_RUN_SPEED,
            );
          else beginMovement(creature);
        }
        render(creature);
        continue;
      }
      const progress = Math.min(creature.elapsed / creature.duration, 1);
      const t =
        creature.kind === "rabbit"
          ? progress
          : progress * progress * (3 - 2 * progress);
      const [start, control, target] = [
        creature.start,
        creature.control,
        creature.target,
      ];
      creature.position =
        creature.kind === "rabbit"
          ? start.map((value, i) => value + (target[i] - value) * t)
          : start.map(
              (value, i) =>
                (1 - t) ** 2 * value +
                2 * (1 - t) * t * control[i] +
                t * t * target[i],
            );
      render(creature, progress);
      if (progress === 1) {
        if (creature === surpriseBunny) {
          hideSurpriseBunny();
          continue;
        }
        if (creature.phase === "flee") {
          restUnderTree(creature);
          continue;
        }
        creature.phase = "rest";
        creature.idleFrame = 0;
        creature.blinkRemaining = 0;
        creature.blinkWait = random(1, 6);
        creature.elapsed = 0;
        creature.duration =
          creature.kind === "rabbit" ? random(5, 11) : random(0.7, 2.5);
      }
    }
    frame = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    cancelAnimationFrame(frame);
    lastTime = undefined;
    if (paused || document.hidden) {
      bunnyHops.forEach((animation) => animation.finish());
      if (paused) creatures.forEach((creature) => render(creature));
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  document.addEventListener("island-motion-change", (event) => {
    paused = event.detail.paused;
    if (paused) hideSurpriseBunny();
    syncPlayback();
  });
  document.addEventListener("visibilitychange", syncPlayback);
  creatures.forEach((creature) => render(creature));
  syncPlayback();
  window.island = Object.freeze({ hop: hopBunnies });
  console.info(
    "You found the island’s engine room. 🛠️\n\n" +
      "Built with HTML, CSS, and vanilla JavaScript.\n" +
      "No framework. Just a few rabbits keeping things running.\n\n" +
      "Try typing island.hop() for a surprise.",
  );
})();
