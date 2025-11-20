/* === Profile Dashboard JS === */

const ProfileDashboard = {
  currentTab: "overview",
  contextTarget: null,

  init() {
    this.bindMenu();
    this.switchTab(this.currentTab);
    this.initContextMenu();
  },

  /* Sidebar Menu */
  bindMenu() {
    const items = document.querySelectorAll(".profiledashboard-menu-item");
    items.forEach(item => {
      item.addEventListener("click", () => {
        items.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        const tab = item.dataset.tab;
        this.switchTab(tab);
      });
    });
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    const sections = document.querySelectorAll(".profiledashboard-section");
    sections.forEach(sec => sec.classList.add("hidden"));
    const active = document.getElementById(`tab-${tabName}`);
    if (active) active.classList.remove("hidden");
  },

  close() {
    const modal = document.getElementById("profiledashboard");
    if (modal) modal.style.display = "none";
  },

  updatePreview(url) {
    const frame = document.getElementById("profilePreview");
    if (frame) frame.src = url;
  },

  /* Context Menu for Blocks */
  initContextMenu() {
    const menu = document.createElement("div");
    menu.id = "profiledashboard-menu";
    menu.className = "context-menu hidden";
    menu.innerHTML = `
      <button data-menu-action="open-settings">Settings…</button>
      <button data-menu-action="duplicate">Duplicate</button>
      <button data-menu-action="remove">Remove</button>
    `;
    document.body.appendChild(menu);

    document.addEventListener("contextmenu", e => {
      const block = e.target.closest("[data-block]");
      if (!block) return;
      e.preventDefault();
      this.contextTarget = block;
      menu.style.left = `${e.clientX}px`;
      menu.style.top = `${e.clientY}px`;
      menu.classList.remove("hidden");
    });

    document.addEventListener("click", () => {
      menu.classList.add("hidden");
    });

    menu.addEventListener("click", e => {
      const action = e.target.dataset.menuAction;
      if (!action || !this.contextTarget) return;
      if (action === "open-settings") {
        this.openBlockSettings(this.contextTarget);
      } else if (action === "duplicate") {
        this.duplicateBlock(this.contextTarget);
      } else if (action === "remove") {
        this.removeBlock(this.contextTarget);
      }
      menu.classList.add("hidden");
    });
  },

  duplicateBlock(block) {
    const clone = block.cloneNode(true);
    block.parentElement.insertBefore(clone, block.nextSibling);
  },

  removeBlock(block) {
    block.remove();
  },

  /* Settings Popup */
  openBlockSettings(block) {
    const defs = this.getBlockSettingDefinition(block);
    this.openSettingsPopup(defs);
  },

  getBlockSettingDefinition(block) {
    const id = block.dataset.block;
    switch (id) {
      case "profile":
        return {
          title: "Profile Settings",
          fields: [
            { type: "text", label: "Artist Name", key: "profile.name", value: document.getElementById("edit-name").value },
            { type: "text", label: "Handle", key: "profile.handle", value: document.getElementById("edit-handle").value },
            { type: "textarea", label: "Bio", key: "profile.bio", value: document.getElementById("edit-bio").value }
          ],
          onSave: vals => {
            if (vals.profile?.name) document.getElementById("edit-name").value = vals.profile.name;
            if (vals.profile?.handle) document.getElementById("edit-handle").value = vals.profile.handle;
            if (vals.profile?.bio) document.getElementById("edit-bio").value = vals.profile.bio;
          }
        };
      default:
        return {
          title: "Block Settings",
          fields: [
            { type: "text", label: "Custom Title", key: "block.title", value: block.querySelector(".section-title")?.textContent || "" },
            { type: "color", label: "Accent Color", key: "block.accent", value: "#ffffff" }
          ],
          onSave: vals => {
            const titleEl = block.querySelector(".section-title");
            if (titleEl && vals.block?.title) titleEl.textContent = vals.block.title;
            if (vals.block?.accent) block.style.borderColor = vals.block.accent;
          }
        };
    }
  },

  openSettingsPopup({ title, fields, onSave }) {
    let popup = document.getElementById("profiledashboard-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "profiledashboard-popup";
      popup.className = "popup hidden";
      popup.innerHTML = `
        <div class="popup-titlebar">
          <h3 id="popupTitle"></h3>
          <button class="popup-close">✕</button>
        </div>
        <div class="popup-body"></div>
        <div class="popup-actions">
          <button class="btn primary" data-popup-action="save">Save</button>
          <button class="btn" data-popup-action="cancel">Cancel</button>
        </div>
      `;
      document.body.appendChild(popup);
    }

    const body = popup.querySelector(".popup-body");
    const titleEl = popup.querySelector("#popupTitle");
    titleEl.textContent = title;
    body.innerHTML = "";

    const form = document.createElement("form");
    fields.forEach(f => {
      const wrap = document.createElement("div");
      wrap.className = "field";
      const label = document.createElement("label");
      label.textContent = f.label;
      let input;
      if (f.type === "text") {
        input = document.createElement("input");
        input.type = "text";
        input.value = f.value || "";
      } else if (f.type === "textarea") {
        input = document.createElement("textarea");
        input.value = f.value || "";
      } else if (f.type === "color") {
        input = document.createElement("input");
        input.type = "color";
        input.value = f.value || "#ffffff";
      }
      input.dataset.key = f.key;
      wrap.appendChild(label);
      wrap.appendChild(input);
      form.appendChild(wrap);
    });
    body.appendChild(form);

    popup.classList.remove("hidden");

    popup.querySelector(".popup-close").onclick = () => popup.classList.add("hidden");
    popup.querySelector("[data-popup-action='cancel']").onclick = () => popup.classList.add("hidden");
    popup.querySelector("[data-popup-action='save']").onclick = () => {
      const vals = {};
      form.querySelectorAll("input, textarea").forEach(el => {
        const path = el.dataset.key.split(".");
        this.setDeep(vals, path, el.value);
      });
      try { onSave && onSave(vals); } catch (e) { console.error(e); }
      popup.classList.add("hidden");
    };
  },

  setDeep(obj, pathArr, value) {
    let curr = obj;
    for (let i = 0; i < pathArr.length; i++) {
      const key = pathArr[i];
      if (i === pathArr.length - 1) {
        curr[key] = value;
        return;
      }
      curr[key] = curr[key] || {};
      curr = curr[key];
    }
  }
};

/* === Boot === */
document.addEventListener("DOMContentLoaded", () => {
  ProfileDashboard.init();
});
