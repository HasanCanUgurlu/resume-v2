"use strict";

(() => {
  const media = matchMedia(
    "(max-width:700px), (max-width:1000px) and (max-height:500px) and (pointer:coarse)",
  );
  const viewport = document.querySelector(".map-column");
  const root = document.documentElement;
  const places = [...document.querySelectorAll("[data-stop]")];
  const storyButton = document.querySelector("#mobile-story");
  const overviewButton = document.querySelector("#mobile-overview");
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const MIN_WORLD_WIDTH = 900;
  const WORLD_HEIGHT_RATIO = 0.76;
  const DRAG_THRESHOLD = 8;
  const placeLabel = document.querySelector("#mobile-place");
  const placeDescription = document.querySelector("#mobile-description");
  const workMenu = document.querySelector(".work-menu");
  let selected = Math.max(
    0,
    places.findIndex((place) => place.hasAttribute("aria-current")),
  );
  let overview = false;
  let width = 0;
  let camera = { x: 0, y: 0 };
  let drag = null;
  let suppressClick = false;

  function updateControls() {
    const place = places[selected];
    const label = place.querySelector(".place-name").textContent;
    const description = place.querySelector(
      ".landmark-description",
    ).textContent;
    placeLabel.textContent = label;
    placeDescription.textContent = description;
    storyButton.setAttribute("aria-label", `Open ${label}: ${description}`);
    overviewButton.textContent = overview ? "Back to place" : "View island";
    overviewButton.setAttribute("aria-pressed", String(overview));
  }

  function setCamera(x, y) {
    const rect = viewport.getBoundingClientRect();
    const height = width * WORLD_HEIGHT_RATIO;
    const bound = (value, extent, size) =>
      extent <= size
        ? (size - extent) / 2
        : Math.min(0, Math.max(size - extent, value));
    camera = {
      x: bound(x, width, rect.width),
      y: bound(y, height, rect.height),
    };
    root.style.setProperty("--mobile-camera-x", `${camera.x.toFixed(2)}px`);
    root.style.setProperty("--mobile-camera-y", `${camera.y.toFixed(2)}px`);
  }

  function framePlace() {
    if (!media.matches) return;
    const rect = viewport.getBoundingClientRect();
    width = overview
      ? Math.max(
          180,
          Math.min(rect.width - 24, (rect.height - 200) / WORLD_HEIGHT_RATIO),
        )
      : Math.max(MIN_WORLD_WIDTH, rect.width * 1.8);
    root.style.setProperty("--mobile-world-width", `${width}px`);
    if (overview)
      setCamera(
        (rect.width - width) / 2,
        (rect.height - width * WORLD_HEIGHT_RATIO) / 2,
      );
    else {
      const place = places[selected];
      const x = (parseFloat(place.style.getPropertyValue("--x")) / 100) * width;
      const y =
        (parseFloat(place.style.getPropertyValue("--y")) / 100) *
        width *
        WORLD_HEIGHT_RATIO;
      // Frame the landmark between the header and the thumb controls.
      const centerY = Math.max(100, (rect.height + 72 - 165) / 2);
      setCamera(rect.width / 2 - x, centerY - y + 25);
    }
    document.body.classList.toggle("is-overview", overview);
    updateControls();
  }

  function selectNext(direction) {
    selected = (selected + direction + places.length) % places.length;
    overview = false;
    workMenu.removeAttribute("open");
    document.dispatchEvent(
      new CustomEvent("island-select-destination", {
        detail: { id: places[selected].dataset.stop },
      }),
    );
  }
  document
    .querySelector("#mobile-previous")
    .addEventListener("click", () => selectNext(-1));
  document
    .querySelector("#mobile-next")
    .addEventListener("click", () => selectNext(1));
  storyButton.addEventListener("click", () => places[selected].click());
  overviewButton.addEventListener("click", () => {
    overview = !overview;
    framePlace();
  });
  document.addEventListener("island-destination-change", (event) => {
    const index = places.findIndex(
      (place) => place.dataset.stop === event.detail.id,
    );
    if (index < 0) return;
    selected = index;
    overview = false;
    if (media.matches) framePlace();
    else updateControls();
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (
      !media.matches ||
      overview ||
      !event.isPrimary ||
      event.button !== 0 ||
      event.target.closest(
        ".work-menu,.map-menu,.mobile-controls,.mobile-overview",
      )
    )
      return;
    drag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      camera: { ...camera },
      moved: false,
    };
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.startX,
      dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!drag.moved) {
      drag.moved = true;
      viewport.setPointerCapture(event.pointerId);
      document.body.classList.add("is-panning");
    }
    setCamera(drag.camera.x + dx, drag.camera.y + dy);
  });
  function resetDrag() {
    drag = null;
    document.body.classList.remove("is-panning");
  }

  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    if (drag.moved && event.type === "pointerup") {
      suppressClick = true;
      setTimeout(() => {
        suppressClick = false;
      }, 0);
    }
    if (viewport.hasPointerCapture(event.pointerId))
      viewport.releasePointerCapture(event.pointerId);
    resetDrag();
  }
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("lostpointercapture", endDrag);
  document.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );

  // A resize also covers rotation and switching back to the desktop layout.
  const resize = new ResizeObserver(() => {
    resetDrag();
    framePlace();
  });
  resize.observe(viewport);
  media.addEventListener("change", () => {
    resetDrag();
    if (!media.matches) document.body.classList.remove("is-overview");
    framePlace();
  });
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) framePlace();
  });
  if (media.matches) framePlace();
  else updateControls();
})();
