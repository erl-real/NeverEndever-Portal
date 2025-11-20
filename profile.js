/* ===========
   Config & State
   =========== */

const AppConfig = {
  // Gate edit mode here (false for public). Dashboard flips to true after auth.
  editEnabled: false,

  // Default avatar (open-source placeholder)
  defaultAvatar: "https://api.dicebear.com/9.x/shapes/svg?seed=artist",

  // Banner pool (random pick on load; replace with brand assets later)
  bannerPool: [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511192336575-5a0cc7e9bc6f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
  ],

  theme: {
    primary: "#6e61ff",
    accent: "#ff6ec7",
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    textColor: "#e7e7e9",
    mutedColor: "#a3a3ad",
    surface: "#16161b",
    surface2: "#1d1d24",
    reflections: true,
  },

  // Simple local analytics placeholders
  analytics: {
    visits7d: 1234,
    clicks7d: 312,
    topReferrer: "instagram.com",
  },

  // Safe embed defaults for widgets
  widgets: {
    instagram: {
      mode: "grid", // "grid" | "oembed"
      handle: "artist_handle",
      media: [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=80&w=400&auto=format&fit=crop",
      ],
    },
    youtube: {
      mode: "embed", // "embed" | "oembed"
      videoId: "dQw4w9WgXcQ",
      channelHandle: "@artist",
    },
  },
};

const State = {
  dragOn: false,
  currentTab: "timeline",
  contextTarget: null,
};

/* ===========
   Boot
   =========== */

document.addEventListener("DOMContentLoaded", () => {
  initAssets();
  initTabs();
  initEditUI();
  initContextMenu();
  initBlockSettings();
  initAnalytics();
});

function initAssets() {
  // Banner: random pick
  const banner = document.getElementById("bannerImage");
  const pool = AppConfig.bannerPool;
  banner.src = pool[Math.floor(Math.random() * pool.length)];

  // Avatar defaults
  const avatar = document.getElementById("profileAvatar");
  avatar.src = AppConfig.defaultAvatar;

  const postPfp = document.querySelector(".post-pfp");
  if (postPfp) postPfp.src = AppConfig.defaultAvatar;
}

/* ===========
   Tabs
   =========== */

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const name = btn.dataset.tab;
      switchTab(name);
    });
  });
  switchTab(State.currentTab);
}

function switchTab(name) {
  State.currentTab = name;
  document.querySelectorAll("[data-tab-content]").forEach((sec) => {
    sec.classList.toggle("hidden", sec.dataset.tabContent !== name);
  });

  // Show/hide analytics card in left column when Analytics tab selected
  const analyticsCard = document.querySelector("[data-block='analytics']");
  if (analyticsCard) {
    analyticsCard.classList.toggle("hidden", name !== "timeline"); // keep hidden unless timeline is active
    // If you want analytics visible only in a future "Analytics" tab, leave hidden here
  }
}

/* ===========
   Edit Mode Toolbar
   (hidden by default; dashboard flips AppConfig.editEnabled)
   =========== */

function initEditUI() {
  const toolbar = document.getElementById("editToolbar");
  if (!AppConfig.editEnabled) {
    toolbar.classList.add("hidden");
    toolbar.setAttribute("aria-hidden", "true");
    return;
  } else {
    toolbar.classList.remove("hidden");
    toolbar.setAttribute("aria-hidden", "false");
  }

  const toggleDragBtn = document.getElementById("toggleDrag");
  toggleDragBtn.addEventListener("click", () => {
    State.dragOn = !State.dragOn;
    document.querySelectorAll("[data-block]").forEach((el) => {
      const draggable = el.getAttribute("draggable") === "true";
      if (draggable) {
        el.classList.toggle("draggable", State.dragOn);
        el.addEventListener("dragstart", onDragStart);
        el.addEventListener("dragover", onDragOver);
        el.addEventListener("drop", onDrop);
      }
    });
  });

  document.getElementById("pageSettings").addEventListener("click", () => {
    openSettingsPopup({
      title: "Page Settings",
      fields: [
        { type: "color", label: "Primary color", key: "theme.primary", value: AppConfig.theme.primary },
        { type: "color", label: "Accent color", key: "theme.accent", value: AppConfig.theme.accent },
        { type: "text",  label: "Font stack", key: "theme.fontFamily", value: AppConfig.theme.fontFamily },
        { type: "checkbox", label: "Reflections", key: "theme.reflections", value: AppConfig.theme.reflections },
      ],
      onSave: (vals) => {
        applyTheme(vals.theme || {});
      },
    });
  });
}

/* ===========
   Drag & Drop
   =========== */

function onDragStart(e) {
  if (!State.dragOn) { e.preventDefault(); return; }
  const target = e.currentTarget;
  e.dataTransfer.setData("text/plain", target.dataset.block);
  e.dataTransfer.effectAllowed = "move";
}

function onDragOver(e) {
  if (!State.dragOn) return;
  e.preventDefault();
  const target = e.currentTarget;
  target.classList.add("drag-over");
}

function onDrop(e) {
  if (!State.dragOn) return;
  e.preventDefault();
  const target = e.currentTarget;
  target.classList.remove("drag-over");

  const blockId = e.dataTransfer.getData("text/plain");
  const dragged = document.querySelector(`[data-block="${blockId}"]`);
  if (!dragged || dragged === target) return;

  // Swap positions within same column or move across columns safely.
  const parent = target.parentElement;
  if (parent && dragged.parentElement) {
    if (target.nextSibling) parent.insertBefore(dragged, target.nextSibling);
    else parent.appendChild(dragged);
  }
}

/* ===========
   Context Menu & Block Settings
   =========== */

function initContextMenu() {
  const menu = document.getElementById("blockMenu");
  document.addEventListener("contextmenu", (e) => {
    const block = e.target.closest("[data-block]");
    if (!block) return;
    if (!AppConfig.editEnabled) return; // public profile: disabled
    e.preventDefault();
    State.contextTarget = block;

    const { clientX: x, clientY: y } = e;
    menu.style.transform = `translate(${x}px, ${y}px)`;
    menu.classList.remove("hidden");
  });

  document.addEventListener("click", () => {
    hideContextMenu();
  });

  menu.addEventListener("click", (e) => {
    const action = e.target.dataset.menuAction;
    if (!action || !State.contextTarget) return;

    if (action === "open-settings") {
      openBlockSettings(State.contextTarget);
    } else if (action === "duplicate") {
      duplicateBlock(State.contextTarget);
    } else if (action === "remove") {
      removeBlock(State.contextTarget);
    }
    hideContextMenu();
  });
}

function hideContextMenu() {
  const menu = document.getElementById("blockMenu");
  menu.classList.add("hidden");
  menu.style.transform = "translate(-9999px, -9999px)";
  State.contextTarget = null;
}

function initBlockSettings() {
  // No-op on load; invoked via context menu when editEnabled
}

function openBlockSettings(block) {
  const id = block.dataset.block;
  const defs = getBlockSettingDefinition(id, block);
  openSettingsPopup(defs);
}

function getBlockSettingDefinition(id, block) {
  switch (id) {
    case "banner":
      return {
        title: "Banner Settings",
        fields: [
          { type: "image", label: "Banner URL", key: "banner.url", value: document.getElementById("bannerImage").src },
          { type: "text", label: "Profile name", key: "profile.name", value: document.getElementById("profileName").textContent },
          { type: "text", label: "Handle", key: "profile.handle", value: document.getElementById("profileHandle").textContent },
        ],
        onSave: (vals) => {
          if (vals.banner?.url) document.getElementById("bannerImage").src = vals.banner.url;
          if (vals.profile?.name) document.getElementById("profileName").textContent = vals.profile.name;
          if (vals.profile?.handle) document.getElementById("profileHandle").textContent = vals.profile.handle;
        },
      };

    case "pfp":
      return {
        title: "Avatar Settings",
        fields: [
          { type: "image", label: "Avatar URL", key: "pfp.url", value: document.getElementById("profileAvatar").src },
          { type: "color", label: "Ring gradient start", key: "pfp.gradStart", value: getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() },
          { type: "color", label: "Ring gradient end", key: "pfp.gradEnd", value: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() },
        ],
        onSave: (vals) => {
          if (vals.pfp?.url) document.getElementById("profileAvatar").src = vals.pfp.url;
          const wrap = document.querySelector(".pfp-wrap");
          if (wrap && vals.pfp?.gradStart && vals.pfp?.gradEnd) {
            wrap.style.background = `linear-gradient(135deg, ${vals.pfp.gradStart}, ${vals.pfp.gradEnd})`;
          }
        },
      };

    case "intro":
      return {
        title: "Intro Settings",
        fields: [
          { type: "text", label: "Occupation", key: "intro.occupation", value: document.getElementById("introOccupation").textContent },
          { type: "text", label: "Location", key: "intro.location", value: document.getElementById("introLocation").textContent },
          { type: "text", label: "Player name", key: "intro.player", value: document.getElementById("introPlayer").textContent },
        ],
        onSave: (vals) => {
          if (vals.intro?.occupation) document.getElementById("introOccupation").textContent = vals.intro.occupation;
          if (vals.intro?.location) document.getElementById("introLocation").textContent = vals.intro.location;
          if (vals.intro?.player) document.getElementById("introPlayer").textContent = vals.intro.player;
        },
      };

    case "widgets":
      return {
        title: "Widgets Settings",
        fields: [
          { type: "select", label: "Instagram mode", key: "widgets.instagram.mode", value: AppConfig.widgets.instagram.mode, options: ["grid","oembed"] },
          { type: "text", label: "Instagram handle", key: "widgets.instagram.handle", value: AppConfig.widgets.instagram.handle },
          { type: "text", label: "YouTube channel handle", key: "widgets.youtube.channelHandle", value: AppConfig.widgets.youtube.channelHandle },
          { type: "text", label: "YouTube video ID", key: "widgets.youtube.videoId", value: AppConfig.widgets.youtube.videoId },
        ],
        onSave: (vals) => {
          // Apply in-memory config; later persist via dashboard
          if (vals.widgets?.instagram) Object.assign(AppConfig.widgets.instagram, vals.widgets.instagram);
          if (vals.widgets?.youtube) Object.assign(AppConfig.widgets.youtube, vals.widgets.youtube);
          renderWidgets();
        },
      };

    case "analytics":
      return {
        title: "Analytics Settings",
        fields: [
          { type: "number", label: "Visits (7d)", key: "analytics.visits7d", value: AppConfig.analytics.visits7d },
          { type: "number", label: "Clicks (7d)", key: "analytics.clicks7d", value: AppConfig.analytics.clicks7d },
          { type: "text", label: "Top referrer", key: "analytics.topReferrer", value: AppConfig.analytics.topReferrer },
        ],
        onSave: (vals) => {
          Object.assign(AppConfig.analytics, vals.analytics || {});
          initAnalytics();
        },
      };

    default:
      return {
        title: "Block Settings",
        fields: [
          { type: "text", label: "Custom title", key: "block.title", value: block.querySelector(".card-title")?.textContent || "" },
          { type: "color", label: "Accent color", key: "block.accent", value: "#ffffff" },
        ],
        onSave: (vals) => {
          const titleEl = block.querySelector(".card-title");
          if (titleEl && vals.block?.title) titleEl.textContent = vals.block.title;
          if (vals.block?.accent) block.style.borderColor = vals.block.accent;
        },
      };
  }
}

function duplicateBlock(block) {
  const clone = block.cloneNode(true);
  block.parentElement.insertBefore(clone, block.nextSibling);
}

function removeBlock(block) {
  block.remove();
}

/* ===========
   Settings Popup (generic)
   =========== */

function openSettingsPopup({ title, fields, onSave }) {
  const popup = document.getElementById("settingsPopup");
  const body = popup.querySelector(".popup-body");
  const titleEl = document.getElementById("popupTitle");
  titleEl.textContent = title;

  body.innerHTML = "";
  const form = document.createElement("form");
  form.className = "settings-form";

  fields.forEach((f) => {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const label = document.createElement("label");
    label.textContent = f.label;

    let input;
    if (f.type === "text" || f.type === "image" || f.type === "number") {
      input = document.createElement("input");
      input.type = f.type === "image" ? "url" : f.type;
      input.value = f.value ?? "";
    } else if (f.type === "color") {
      input = document.createElement("input");
      input.type = "color";
      input.value = f.value ?? "#ffffff";
    } else if (f.type === "checkbox") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.checked = !!f.value;
    } else if (f.type === "select") {
      input = document.createElement("select");
      (f.options || []).forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt; o.textContent = opt;
        if (opt === f.value) o.selected = true;
        input.appendChild(o);
      });
    }
    input.dataset.key = f.key;

    wrap.appendChild(label);
    wrap.appendChild(input);
    form.appendChild(wrap);
  });

  body.appendChild(form);
  popup.classList.remove("hidden");

  // Drag the popup smoothly (titlebar grab)
  const titlebar = popup.querySelector(".popup-titlebar");
  let dragging = false, startX = 0, startY = 0, originX = 0, originY = 0;
  titlebar.addEventListener("mousedown", (e) => {
    dragging = true; startX = e.clientX; startY = e.clientY;
    const rect = popup.getBoundingClientRect();
    originX = rect.left; originY = rect.top;
    document.body.style.userSelect = "none";
  });
  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    popup.style.left = `${originX + dx}px`;
    popup.style.top = `${Math.max(40, originY + dy)}px`;
    popup.style.transform = "translateX(0)"; // disable center translate while moving
  });
  document.addEventListener("mouseup", () => {
    dragging = false; document.body.style.userSelect = "";
  });

  // Close
  popup.querySelector(".popup-close").onclick = () => popup.classList.add("hidden");
  popup.querySelector("[data-popup-action='cancel']").onclick = () => popup.classList.add("hidden");

  // Save
  popup.querySelector("[data-popup-action='save']").onclick = () => {
    const vals = {};
    form.querySelectorAll("input, select").forEach((el) => {
      const path = el.dataset.key.split(".");
      setDeep(vals, path, el.type === "checkbox" ? el.checked : el.value);
    });
    try { onSave && onSave(vals); } catch (e) { console.error(e); }
    popup.classList.add("hidden");
  };
}

function setDeep(obj, pathArr, value) {
  let curr = obj;
  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i];
    if (i === pathArr.length - 1) {
      curr[key] = value; return;
    }
    curr[key] = curr[key] || {};
    curr = curr[key];
  }
}

/* ===========
   Theme
   =========== */

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme.primary) root.style.setProperty("--primary", theme.primary);
  if (theme.accent) root.style.setProperty("--accent", theme.accent);
  if (theme.textColor) root.style.setProperty("--text", theme.textColor);
  if (theme.mutedColor) root.style.setProperty("--muted", theme.mutedColor);
  if (theme.surface) root.style.setProperty("--surface", theme.surface);
  if (theme.surface2) root.style.setProperty("--surface-2", theme.surface2);
  if (theme.fontFamily) root.style.setProperty("--font", theme.fontFamily);
}

/* ===========
   Widgets rendering
   =========== */

function renderWidgets() {
  // Instagram
  const instaGrid = document.querySelector(".insta-grid");
  if (instaGrid) {
    instaGrid.innerHTML = "";
    if (AppConfig.widgets.instagram.mode === "grid") {
      AppConfig.widgets.instagram.media.forEach((src) => {
        const img = document.createElement("img");
        img.src = src; img.alt = "Instagram media";
        instaGrid.appendChild(img);
      });
    } else {
      // oEmbed placeholder: show instruction card
      const note = document.createElement("div");
      note.className = "widget-note";
      note.textContent = `oEmbed mode for @${AppConfig.widgets.instagram.handle} (wire fetch in dashboard with server-side caching).`;
      instaGrid.appendChild(note);
    }
  }

  // YouTube
  const yt = document.querySelector(".yt-embed iframe");
  if (yt) {
    if (AppConfig.widgets.youtube.mode === "embed" && AppConfig.widgets.youtube.videoId) {
      yt.src = `https://www.youtube.com/embed/${AppConfig.widgets.youtube.videoId}`;
    } else {
      yt.src = "about:blank";
      const wrap = yt.parentElement;
      const note = document.createElement("div");
      note.className = "widget-note";
      note.textContent = `oEmbed mode for ${AppConfig.widgets.youtube.channelHandle} (wire API after auth).`;
      wrap.appendChild(note);
    }
  }
}

/* ===========
   Analytics placeholders
   =========== */

function initAnalytics() {
  setKpi("visits", AppConfig.analytics.visits7d);
  setKpi("clicks", AppConfig.analytics.clicks7d);
  setKpi("referrer", AppConfig.analytics.topReferrer);
}

function setKpi(key, val) {
  const el = document.querySelector(`[data-kpi="${key}"]`);
  if (el) el.textContent = val ?? "–";
}

/* ===========
   Security notes (for dev wiring, not user-visible):
   - No URL-based editing. All edits gated behind AppConfig.editEnabled,
     which must be toggled only in the dashboard after verified auth.
   - Persist changes via authenticated API calls; do not accept client-only changes
     for other profiles. Use server-side ownership checks.
   =========== */

// Expose minimal controls for dashboard integration (optional)
window.ProfileUI = {
  setEditEnabled(v) {
    AppConfig.editEnabled = !!v;
    initEditUI();
  },
  applyTheme,
  renderWidgets,
};
