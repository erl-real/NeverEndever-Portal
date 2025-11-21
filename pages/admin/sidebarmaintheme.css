:root {
  --glider-color: #9d4edd;
  --glider-color-opacity: rgba(157,77,221,0.15);
}

/* Toggle button */
.toggle-btn {
  position: fixed;
  top: -2px;
  left: -5px;
  z-index: 1001;
  background: transparent;
  border: none;
  cursor: pointer;
}
.burger-menu { width: 40px; height: 40px; position: relative; }
.burger-bun {
  position: absolute;
  left: 50%;
  width: 25px;
  height: 2px;
  background: #ccc;
  transform: translateX(-50%);
  transition: all 0.3s ease;
  border-radius: 2px;
}
.burger-bun--top { top: 12px; }
.burger-bun--mid { top: 18px; }
.burger-bun--bottom { top: 24px; }
.burger-menu.open .burger-bun--top {
  top: 18px; transform: translateX(-50%) rotate(45deg);
}
.burger-menu.open .burger-bun--mid { opacity: 0; }
.burger-menu.open .burger-bun--bottom {
  top: 18px; transform: translateX(-50%) rotate(-45deg);
}

/* Sidebar */
.sidebar-wrapper {
  flex-shrink: 0;
left: -9px;
hight: 100vh;
top: 0px;
bottom: 0px;
  width: 200px;
  background: #0a0a0e;
  border-right: 1px solid rgba(255,255,255,0.08);
  transition: transform 0.3s ease;
  position: fixed;
overflow-y: auto;
overflow-x: hidden;
  z-index: 100;
  display: flex;
}
.sidebar-wrapper.collapsed { transform: translateX(-100%); }

.sidebar-inner { display: flex; flex-direction: column; width: 100%; min-height: 100%; }
/* Firefox */
.sidebar-wrapper {
  scrollbar-width: thin;
  scrollbar-color: var(--glider-color) #111; /* thumb + track */
}

/* WebKit (Chrome, Edge, Safari) */
.sidebar-wrapper::-webkit-scrollbar {
  width: 8px;
}
.sidebar-wrapper::-webkit-scrollbar-track {
  background: #111; /* track color */
}
.sidebar-wrapper::-webkit-scrollbar-thumb {
  background-color: var(--glider-color); /* thumb color */
  border-radius: 4px;
  border: 2px solid #111; /* creates spacing effect */
}
.sidebar-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #b26eff; /* lighter purple on hover */
}
/* Radio nav */
.radio-nav-container { display: flex; flex-direction: column; position: relative; padding: 16px; }
.radio-nav-container input { appearance: none; position: absolute; opacity: 0; pointer-events: none; }
.radio-nav-container label {
  display: flex; align-items: center; gap: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border-radius: 8rem;
  border: 1px solid transparent;
  color: #a3a3a3;
  transition: all 0.3s ease-in-out;
  position: relative;
  z-index: 1;
  border-bottom: 1px solid rgba(255,255,255,0.06);
border-top: 0.3px solid rgba(255,255,255,0.06);
}
.radio-nav-container label:last-of-type { border-bottom: none; }
.radio-nav-container input:checked + label {
  color: var(--glider-color);
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
}
.radio-nav-container label a { color: inherit; text-decoration: none; flex: 1; }
.radio-nav-container input:checked + label a { color: var(--glider-color); }

/* Glider */
.glider-container {
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(0deg, transparent 0%, #1b1b1b 50%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}
.glider {
  position: absolute; top: 0; left: 0; width: 100%;
  background: linear-gradient(0deg, transparent 0%, var(--glider-color) 50%, transparent 100%);
  transition: transform 0.3s ease, height 0.3s ease, opacity 0.2s ease;
  opacity: 0;
}
.glider::before {
  content: ""; position: absolute; height: 50%; width: 150%; top: 50%;
  transform: translateY(-50%);
  background: var(--glider-color);
  filter: blur(6px); opacity: 0.6;
}
.glider::after {
  content: ""; position: absolute; left: 0; height: 100%; width: 150px;
  background: linear-gradient(90deg, var(--glider-color-opacity) 0%, transparent 100%);
}
.radio-nav-container:hover .glider { opacity: 1; }
