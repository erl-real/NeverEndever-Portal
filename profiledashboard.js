/* === Profile Dashboard Theme (ELO Style) === */
:root {
  --bg-app: #050505;
  --bg-panel: #0f1016;
  --border: rgba(255, 255, 255, 0.1);
  --accent-primary: #00f5d4; /* Cyan */
  --accent-secondary: #9d4edd; /* Purple */
  --text-main: #f0f0f0;
  --text-muted: #9ca3af;
}

body.elo-bg {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #020203 0%, #0a0a0e 100%);
  color: var(--text-main);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* === Profile Dashboard Modal === */
.profiledashboard-modal {
  width: 95vw;
  max-width: 1400px;
  height: 90vh;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 80px rgba(0,0,0,0.9);
  overflow: hidden;
}

/* Header */
.profiledashboard-header {
  height: 70px;
  padding: 0 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #15151a;
}
.profiledashboard-title {
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.profiledashboard-actions .btn-icon {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.profiledashboard-actions .btn-icon:hover {
  color: var(--text-main);
  border-color: var(--accent-primary);
}

/* Body Layout */
.profiledashboard-body {
  flex: 1;
  display: grid;
  grid-template-columns: 220px 1fr 400px;
  height: 100%;
}

/* Sidebar */
.profiledashboard-sidebar {
  background: #0a0b10;
  border-right: 1px solid var(--border);
  padding: 20px;
}
.profiledashboard-menu-item {
  padding: 12px;
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 6px;
  transition: 0.2s;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.profiledashboard-menu-item:hover,
.profiledashboard-menu-item.active {
  background: var(--accent-primary);
  color: black;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 245, 212, 0.3);
}

/* Main Panel */
.profiledashboard-main {
  padding: 30px;
  overflow-y: auto;
}
.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
}
.profiledashboard-section.hidden { display: none; }

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.stat-box {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.stat-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 1px;
}
.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 6px;
}

/* Form Inputs */
.form-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 12px;
  margin-bottom: 4px;
  font-weight: 600;
}
.form-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.05);
  color: var(--text-main);
  font-size: 0.9rem;
  margin-bottom: 12px;
}
.form-input:focus {
  border-color: var(--accent-primary);
  outline: none;
  background: rgba(255,255,255,0.08);
}

/* Preview Panel */
.profiledashboard-preview {
  border-left: 1px solid var(--border);
  background: #0a0b10;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.preview-frame {
  flex: 1;
  border: none;
  border-radius: 12px;
  background: black;
  box-shadow: 0 0 20px rgba(0,0,0,0.6);
}
