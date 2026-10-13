"use strict";

const chapterIds = [
  "product",
  "builds",
  "react",
  "state",
  "agents",
  "casehuddle",
];
const route = [
  [195, 470],
  [285, 415],
  [325, 330],
  [415, 290],
  [520, 195],
  [587, 270],
  [655, 350],
  [574, 413],
  [555, 485],
  [635, 505],
  [706, 526],
  [815, 570],
];
const stops = {
  product: 0,
  builds: 2,
  react: 4,
  state: 6,
  agents: 8,
  casehuddle: 11,
};
const destinationLinks = [...document.querySelectorAll("[data-stop]")];
const tabGroups = {
  agents: ["qa", "feedback"],
  casehuddle: ["casehuddle", "pii"],
};
let activeTabGroup = null;
const panel = document.querySelector("#story");
const content = document.querySelector("#story-content");
const traveler = document.querySelector("#traveler");
const motionButton = document.querySelector("#motion");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const compactViewport = matchMedia(
  "(max-width:700px), (max-width:1000px) and (max-height:500px) and (pointer:coarse)",
);
let paused = reducedMotion.matches;
let position = [...route[0]];
let currentDestination = "product";
let animationFrame = 0;
let pendingArrival = null;
let popupAnimation = null;
let shipAnimation = null;
let robotGreeting = null;
const journeyTrail = document.querySelector("#journey-trail");
const ship = document.querySelector("#harbor-ship");

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

function selectDestination(id) {
  currentDestination = id;
  destinationLinks.forEach((link) => {
    if (link.dataset.stop === id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  document.dispatchEvent(
    new CustomEvent("island-destination-change", { detail: { id } }),
  );
}

function drawTraveler() {
  traveler.style.left = `${position[0] / 10}%`;
  traveler.style.top = `${position[1] / 7.6}%`;
}
function stopWalking() {
  cancelAnimationFrame(animationFrame);
  traveler.classList.remove("walking");
  journeyTrail.classList.remove("is-traveling");
  pendingArrival = null;
}
function animateLandmark(id) {
  if (paused || reducedMotion.matches) return;
  if (id === "state") {
    document.dispatchEvent(new CustomEvent("island-spring"));
    return;
  }
  if (id === "agents") {
    const eye = document.querySelector(".robot-wink");
    if (!eye?.animate) return;
    robotGreeting?.cancel();
    robotGreeting = eye.animate(
      [
        { transform: "scaleY(1)" },
        { transform: "scaleY(.15)", offset: 0.3 },
        { transform: "scaleY(.15)", offset: 0.55 },
        { transform: "scaleY(1)" },
      ],
      { duration: 650, easing: "steps(2, end)" },
    );
    return;
  }
  if (id !== "product" || !ship.animate) return;
  shipAnimation?.cancel();
  shipAnimation = ship.animate(
    [
      { transform: "translate(0, 0)", opacity: 1 },
      { transform: "translate(-55px, 25px)", opacity: 1, offset: 0.75 },
      { transform: "translate(-80px, 38px)", opacity: 0 },
    ],
    { duration: 2400, easing: "ease-in-out", fill: "forwards" },
  );
}
function markVisited(id) {
  document.querySelector(`[data-stop="${id}"]`)?.classList.add("visited");
}
function travelTo(id, onArrival = () => {}) {
  stopWalking();
  pendingArrival = onArrival;
  const destinationIndex = stops[id];
  if (paused || reducedMotion.matches) {
    position = [...route[destinationIndex]];
    drawTraveler();
    pendingArrival = null;
    onArrival();
    return;
  }
  // Resume from the current position when another destination is selected mid-walk.
  const nearest = route.reduce(
    (best, point, i) =>
      Math.hypot(point[0] - position[0], point[1] - position[1]) <
      Math.hypot(route[best][0] - position[0], route[best][1] - position[1])
        ? i
        : best,
    0,
  );
  const direction = destinationIndex >= nearest ? 1 : -1;
  const waypoints = [];
  for (let i = nearest; ; i += direction) {
    waypoints.push(route[i]);
    if (i === destinationIndex) break;
  }
  journeyTrail.setAttribute(
    "d",
    "M" + [position, ...waypoints].map((point) => point.join(" ")).join(" L"),
  );
  journeyTrail.classList.add("is-traveling");
  let previousTime;
  let previousPoint = position;
  const totalDistance = waypoints.reduce((sum, point) => {
    const distance = Math.hypot(
      point[0] - previousPoint[0],
      point[1] - previousPoint[1],
    );
    previousPoint = point;
    return sum + distance;
  }, 0);
  const speed = totalDistance / 550;
  traveler.classList.add("walking");
  function step(time) {
    let distance =
      previousTime === undefined
        ? 0
        : Math.min(time - previousTime, 60) * speed;
    previousTime = time;
    while (waypoints.length) {
      const target = waypoints[0];
      const remaining = Math.hypot(
        target[0] - position[0],
        target[1] - position[1],
      );
      if (remaining > distance) {
        position = [
          position[0] + ((target[0] - position[0]) * distance) / remaining,
          position[1] + ((target[1] - position[1]) * distance) / remaining,
        ];
        break;
      }
      position = [...target];
      distance -= remaining;
      waypoints.shift();
    }
    drawTraveler();
    if (waypoints.length) animationFrame = requestAnimationFrame(step);
    else {
      traveler.classList.remove("walking");
      journeyTrail.classList.remove("is-traveling");
      const arrived = pendingArrival;
      pendingArrival = null;
      arrived?.();
    }
  }
  animationFrame = requestAnimationFrame(step);
}
function introMarkup() {
  return `<div class="intro-portrait" aria-hidden="true">${traveler.querySelector("svg").outerHTML}</div>
    <h2 id="story-title" class="intro-title" tabindex="-1">Hi, I’m Hasan.<br><span>I build things<br>that move<br>things forward.</span></h2>
    <p class="lead">Senior Frontend Engineer at WhereTo and co-founder of CaseHuddle. I turn complicated problems into things people can use.</p>
    <button class="primary-link" type="button" data-explore>Explore my work <span aria-hidden="true">→</span></button>`;
}
function storyMarkup(id) {
  const item = work[id];
  const extra =
    id === "casehuddle"
      ? '<p><a href="https://casehuddle.com">Visit CaseHuddle ↗</a></p>'
      : "";
  return `<p class="company-label">${escapeHtml(item.company)}</p>
    <h2 id="story-title" tabindex="-1">${escapeHtml(item.title)}</h2>
    <p class="lead">${escapeHtml(item.role)}</p>
    <div class="outcome"><strong>${escapeHtml(item.metric)}</strong><p>${escapeHtml(item.result)}</p></div>${extra}`;
}
function tabsMarkup(group, selected) {
  const tabs = tabGroups[group];
  const buttons = tabs
    .map(
      (id) =>
        `<button id="work-tab-${id}" type="button" role="tab" aria-selected="${id === selected}" aria-controls="story-tabpanel" tabindex="${id === selected ? "0" : "-1"}" data-work-tab="${id}">${id === "casehuddle" ? "Overview" : escapeHtml(work[id].short)}</button>`,
    )
    .join("");
  return `<div class="story-tabs" role="tablist" aria-label="${group === "agents" ? "Agent stories" : "CaseHuddle stories"}">${buttons}</div>
    <section id="story-tabpanel" role="tabpanel" aria-labelledby="work-tab-${selected}" tabindex="0">${storyMarkup(selected)}</section>`;
}
function selectStoryTab(id, updateUrl = true) {
  if (!activeTabGroup || !tabGroups[activeTabGroup].includes(id)) return;
  content.querySelectorAll("[data-work-tab]").forEach((tab) => {
    const selected = tab.dataset.workTab === id;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  const tabPanel = document.querySelector("#story-tabpanel");
  tabPanel.innerHTML = storyMarkup(id);
  tabPanel.setAttribute("aria-labelledby", `work-tab-${id}`);
  if (updateUrl)
    history.replaceState(
      null,
      "",
      id === "casehuddle" ? "#casehuddle" : `#${activeTabGroup}/${id}`,
    );
  document.querySelector("#announcement").textContent =
    `Showing ${work[id].title}`;
}
content.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-work-tab]");
  if (tab) selectStoryTab(tab.dataset.workTab);
});
content.addEventListener("keydown", (event) => {
  const tab = event.target.closest("[data-work-tab]");
  if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
    return;
  event.preventDefault();
  const tabs = tabGroups[activeTabGroup];
  const index = tabs.indexOf(tab.dataset.workTab);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
          tabs.length;
  selectStoryTab(tabs[next]);
  document.querySelector(`#work-tab-${tabs[next]}`).focus();
});
function cancelPopupAnimation() {
  popupAnimation?.cancel();
  popupAnimation = null;
  panel.classList.remove("is-closing");
}
function openStory(id, group = null) {
  cancelPopupAnimation();
  activeTabGroup = Object.hasOwn(tabGroups, group) ? group : null;
  content.innerHTML =
    id === "intro"
      ? introMarkup()
      : activeTabGroup
        ? tabsMarkup(activeTabGroup, id)
        : storyMarkup(id);
  panel.classList.toggle("is-intro", id === "intro");
  panel.classList.toggle("has-tabs", Boolean(activeTabGroup));
  if (!panel.open) panel.showModal();
  if (!paused && !reducedMotion.matches && panel.animate) {
    popupAnimation = panel.animate(
      [
        {
          opacity: 0,
          transform: compactViewport.matches
            ? "translateY(40px)"
            : "translateY(14px) scale(.975)",
        },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: 220, easing: "cubic-bezier(.16, 1, .3, 1)" },
    );
  }
  panel.scrollTop = 0;
  document.querySelector("#story-title").focus({ preventScroll: true });
  document.querySelector("#announcement").textContent =
    id === "intro" ? "Introduction" : `Showing ${work[id].title}`;
}
function focusCurrentDestination() {
  document
    .querySelector(`[data-stop=\"${currentDestination}\"]`)
    ?.focus({ preventScroll: true });
}
async function closeStory() {
  if (panel.classList.contains("is-closing")) return;
  stopWalking();
  cancelPopupAnimation();
  if (panel.open && !paused && !reducedMotion.matches && panel.animate) {
    panel.classList.add("is-closing");
    const animation = panel.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        {
          opacity: 0,
          transform: compactViewport.matches
            ? "translateY(40px)"
            : "translateY(8px) scale(.985)",
        },
      ],
      { duration: 150, easing: "cubic-bezier(.4, 0, 1, 1)", fill: "forwards" },
    );
    popupAnimation = animation;
    try {
      await animation.finished;
    } catch {
      return;
    }
    // A newly opened story cancels a pending close instead of being dismissed by it.
    if (popupAnimation !== animation) return;
  }
  panel.close();
  cancelPopupAnimation();
  history.replaceState(null, "", "#map");
  requestAnimationFrame(focusCurrentDestination);
}
function visitDestination(id, animate, onArrival = () => {}) {
  selectDestination(id);
  const arrive = () => {
    markVisited(id);
    onArrival();
  };
  if (animate) {
    panel.close();
    animateLandmark(id);
    travelTo(id, arrive);
  } else {
    position = [...route[stops[id]]];
    drawTraveler();
    arrive();
  }
}

function showRoute(animate = false) {
  cancelPopupAnimation();
  stopWalking();
  const [requested, requestedTab] = location.hash.slice(1).split("/");
  if (requested === "map") {
    panel.close();
    return;
  }
  const aliases = { qa: "agents", feedback: "agents", pii: "casehuddle" };
  const movedGroup =
    requested === "agents" && requestedTab === "pii"
      ? "casehuddle"
      : requested === "casehuddle" && ["qa", "feedback"].includes(requestedTab)
        ? "agents"
        : null;
  const chapter =
    movedGroup ||
    (chapterIds.includes(requested) ? requested : aliases[requested]);
  if (movedGroup)
    history.replaceState(null, "", `#${movedGroup}/${requestedTab}`);
  if (!chapter) {
    openStory("intro");
    return;
  }
  const tabs = tabGroups[chapter];
  const tab = aliases[requested] ? requested : requestedTab;
  const id = tabs ? (tabs.includes(tab) ? tab : tabs[0]) : chapter;
  visitDestination(chapter, animate, () => openStory(id, chapter));
}
function updateMotion() {
  document.body.classList.toggle("paused", paused);
  document.dispatchEvent(
    new CustomEvent("island-motion-change", {
      detail: { paused: paused || reducedMotion.matches },
    }),
  );
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.textContent = paused ? "▷ Motion paused" : "Ⅱ Pause motion";
  if (paused) {
    popupAnimation?.finish();
    shipAnimation?.finish();
    robotGreeting?.finish();
    const arrived = pendingArrival;
    stopWalking();
    position = [...route[stops[currentDestination]]];
    drawTraveler();
    arrived?.();
  }
}
document.addEventListener("island-select-destination", (event) => {
  const id = event.detail.id;
  if (!compactViewport.matches || !chapterIds.includes(id)) return;
  cancelPopupAnimation();
  panel.close();
  history.replaceState(null, "", "#map");
  visitDestination(id, true);
});

motionButton.addEventListener("click", () => {
  paused = !paused;
  updateMotion();
});
reducedMotion.addEventListener("change", () => {
  paused = reducedMotion.matches;
  updateMotion();
});
window.addEventListener("hashchange", () => showRoute());
// Arrow navigation works immediately after a dialog closes, even before a landmark is focused.
document.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", " "].includes(event.key) || panel.open)
    return;
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const active = document.activeElement;
  if (active?.matches('input, textarea, select, [contenteditable=\"true\"]'))
    return;
  if (active !== document.body && !active?.matches("[data-stop]")) return;
  event.preventDefault();
  const focusedIndex = chapterIds.indexOf(active?.dataset.stop);
  const index =
    focusedIndex >= 0 ? focusedIndex : chapterIds.indexOf(currentDestination);
  if (event.key === " ") {
    if (!event.repeat)
      document.querySelector(`[data-stop="${chapterIds[index]}"]`)?.click();
    return;
  }
  const next =
    (index + (event.key === "ArrowRight" ? 1 : -1) + chapterIds.length) %
    chapterIds.length;
  document.querySelector(`[data-stop=\"${chapterIds[next]}\"]`)?.focus();
});
document.querySelector("#story-close").addEventListener("click", closeStory);
panel.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeStory();
});
panel.addEventListener("click", (event) => {
  if (event.target !== panel) return;
  const rect = panel.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    closeStory();
});
document.addEventListener("click", (event) => {
  if (event.target.closest("[data-explore]")) {
    closeStory();
    return;
  }
  const link = event.target.closest('a[href^="#"]');
  if (
    !link ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  )
    return;
  event.preventDefault();
  const hash = link.getAttribute("href");
  if (location.hash !== hash) history.pushState(null, "", hash);
  link.closest(".work-menu")?.removeAttribute("open");
  showRoute(Boolean(link.dataset.stop) || link.hasAttribute("data-work-link"));
});
const credits = document.querySelector("#credits");
document
  .querySelector("#credits-open")
  .addEventListener("click", () => credits.showModal());
credits.addEventListener("click", (event) => {
  if (event.target !== credits) return;
  const rect = credits.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    credits.close();
});
// A deliberately composed forest, using Kenney's 16px Tiny Town sprites.
const trees = [
  [160, 240, 4],
  [197, 270, 4],
  [157, 330, 3],
  [220, 350, 4],
  [250, 218, 5],
  [290, 185, 4],
  [330, 170, 3],
  [229, 556, 4],
  [284, 558, 5],
  [291, 502, 4],
  [380, 475, 4],
  [415, 510, 3],
  [453, 550, 5],
  [458, 360, 4],
  [474, 399, 4],
  [488, 335, 3],
  [581, 320, 5],
  [710, 270, 4],
  [730, 305, 3],
  [720, 405, 4],
  [889, 555, 4],
  [911, 593, 3],
  [842, 650, 5],
];
const treeGroup = document.querySelector("#trees");
for (const [x, y, tile] of trees) {
  const sprite = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "image",
  );
  sprite.setAttribute("aria-hidden", "true");
  sprite.setAttribute(
    "href",
    `assets/tile_${String(tile).padStart(4, "0")}.png`,
  );
  sprite.setAttribute("x", x - 24);
  sprite.setAttribute("y", y - 48);
  sprite.setAttribute("width", 48);
  sprite.setAttribute("height", 48);
  treeGroup.append(sprite);
}
updateMotion();
// A closed dialog is navigation state, not a reason to skip the welcome on reload.
if (location.hash === "#map") history.replaceState(null, "", "#intro");
showRoute();
