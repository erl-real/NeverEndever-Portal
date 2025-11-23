// --- Core Data -----------------------------------------------------------
const ITEMS = [
  { key: 'tshirt',   name: 'T-Shirts',   baseRange: [10, 50]   },
  { key: 'vinyl',    name: 'Vinyl',      baseRange: [20, 100]  },
  { key: 'hoodie',   name: 'Hoodies',    baseRange: [30, 120]  },
  { key: 'poster',   name: 'Posters',    baseRange: [5, 30]    },
  { key: 'pin',      name: 'Pins',       baseRange: [2, 15]    },
];

const LOCATIONS = [
  { key: 'la',     name: 'Los Angeles',  modifiers: { tshirt: 1.0, vinyl: 1.1, hoodie: 1.0, poster: 0.95, pin: 1.0 } },
  { key: 'nyc',    name: 'New York',     modifiers: { tshirt: 1.15, vinyl: 1.0, hoodie: 1.1, poster: 1.0,  pin: 0.9 } },
  { key: 'chicago',name: 'Chicago',      modifiers: { tshirt: 0.95, vinyl: 0.9, hoodie: 1.05, poster: 1.1, pin: 1.0 } },
  { key: 'austin', name: 'Austin',       modifiers: { tshirt: 1.0, vinyl: 1.2, hoodie: 0.95, poster: 1.0, pin: 1.05 } },
];

const EVENTS = [
  {
    key: 'venueBan',
    chance: 0.08,
    effect: (state) => {
      const lost = 2;
      state.turnsLeft = Math.max(0, state.turnsLeft - lost);
      logEvent(`Venue shut your table down. Lost ${lost} turns.`);
    }
  },
  {
    key: 'shippingDelay',
    chance: 0.10,
    effect: (state) => {
      state.canBuy = false;
      logEvent('Shipping delays — buying disabled for this turn.');
    }
  },
  {
    key: 'counterfeitFlood',
    chance: 0.06,
    effect: (state) => {
      const i = randInt(0, ITEMS.length - 1);
      const item = ITEMS[i].key;
      state.priceOverlays[item] = { factor: 0.6, turns: 1 };
      logEvent('Counterfeit merch hit the market — one item tanked in price.');
    }
  },
  {
    key: 'viralSpike',
    chance: 0.07,
    effect: (state) => {
      const i = randInt(0, ITEMS.length - 1);
      const item = ITEMS[i].key;
      state.priceOverlays[item] = { factor: 1.5, turns: 1 };
      logEvent('Your new single went viral — demand spiked for one item.');
    }
  },
];

// --- Game State ----------------------------------------------------------
const initialState = () => ({
  cash: 500,
  capacity: 20,
  turnsLeft: 20,
  location: 'la',
  canBuy: true,
  priceOverlays: {},
  inventory: Object.fromEntries(ITEMS.map(i => [i.key, { units: 0, avgCost: 0 }])),
  prices: {},
});

let state = initialState();

// --- Utility -------------------------------------------------------------
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max) { return Math.random() * (max - min) + min; }
function formatMoney(n) { return `$${n.toFixed(2)}`; }
function totalUnits(inv) { return Object.values(inv).reduce((s, v) => s + v.units, 0); }

// --- Pricing -------------------------------------------------------------
function rollPrices() {
  const loc = LOCATIONS.find(l => l.key === state.location);
  state.prices = {};
  ITEMS.forEach(item => {
    const [low, high] = item.baseRange;
    let base = randFloat(low, high);
    base *= loc.modifiers[item.key] ?? 1.0;
    base *= randFloat(0.85, 1.15);
    const overlay = state.priceOverlays[item.key];
    if (overlay) base *= overlay.factor;
    state.prices[item.key] = Math.max(0.5, Math.round(base * 100) / 100);
  });
}

function decayOverlays() {
  for (const [key, overlay] of Object.entries(state.priceOverlays)) {
    overlay.turns -= 1;
    if (overlay.turns <= 0) delete state.priceOverlays[key];
  }
}

// --- Events --------------------------------------------------------------
function maybeTriggerEvents() {
  state.canBuy = true;
  EVENTS.forEach(evt => {
    if (Math.random() < evt.chance) evt.effect(state);
  });
}

// --- Transactions --------------------------------------------------------
function buyItem(itemKey, qty) {
  if (!state.canBuy) return logTxn('Buying disabled this turn.', 'bad');
  qty = Number(qty);
  const price = state.prices[itemKey];
  const cost = price * qty;
  if (totalUnits(state.inventory) + qty > state.capacity) return logTxn('Not enough capacity.', 'bad');
  if (cost > state.cash) return logTxn('Insufficient cash.', 'bad');
  state.cash -= cost;
  const inv = state.inventory[itemKey];
  const totalCost = inv.avgCost * inv.units + cost;
  inv.units += qty;
  inv.avgCost = inv.units > 0 ? totalCost / inv.units : 0;
  logTxn(`Bought ${qty} ${getItem(itemKey).name} at ${formatMoney(price)} each.`, 'ok');
  render();
}

function sellItem(itemKey, qty) {
  qty = Number(qty);
  const price = state.prices[itemKey];
  const inv = state.inventory[itemKey];
  if (qty > inv.units) return logTxn('Not enough units to sell.', 'bad');
  const revenue = price * qty;
  state.cash += revenue;
  inv.units -= qty;
  if (inv.units === 0) inv.avgCost = 0;
  const profit = revenue - (inv.avgCost * qty);
  logTxn(`Sold ${qty} ${getItem(itemKey).name} for ${formatMoney(revenue)}. Profit: ${formatMoney(profit)}.`, profit >= 0 ? 'ok' : 'bad');
  render();
}

// --- Turn / Travel -------------------------------------------------------
function endTurn() {
  if (state.turnsLeft <= 0) return;
  state.turnsLeft -= 1;
  decayOverlays();
  maybeTriggerEvents();
  rollPrices();
  render();
  if (state.turnsLeft === 0) {
    const netWorth = state.cash + estimateInventoryValue();
    logEvent(`Tour ended. Net worth: ${formatMoney(netWorth)}.`);
    alert(`Tour ended!\nNet worth: ${formatMoney(netWorth)}`);
  }
}

function travelTo(newLocKey) {
  if (state.location === newLocKey) return;
  state.location = newLocKey;
  endTurn();
  logEvent(`Traveled to ${getLocation(newLocKey).name}.`);
  render();
}

function estimateInventoryValue() {
  return ITEMS.reduce((sum, item) => sum + state.inventory[item.key].units * (state.prices[item.key] ?? item.baseRange[0]), 0);
}

// --- Helpers -------------------------------------------------------------
function getItem(key) { return ITEMS.find(i => i.key === key); }
function getLocation(key) { return LOCATIONS.find(l => l.key === key); }

function logEvent(msg) {
  const el = document.getElementById('eventLog');
  const p = document.createElement('p');
  p.textContent = msg;
  el.prepend(p);
}

function logTxn(msg, type='') {
  const el = document.getElementById('txnLog');
  const p = document.createElement('p');
  p.innerHTML = type ? `<span class="${type}">•</span> ${msg}` : msg;
  el.prepend(p);
}

// --- Render --------------------------------------------------------------
function renderStats() {
  const stats = document.getElementById('statsBar');
  stats.innerHTML = '';
  const pills = [
    { label: 'Cash', val: formatMoney(state.cash) },
    { label: 'Capacity', val: `${totalUnits(state.inventory)} / ${state.capacity}` },
    { label: 'Turns', val: `${state.turnsLeft}` },
    { label: 'City', val: getLocation(state.location).name },
    { label: 'Buy', val: state.canBuy ? 'Enabled' : 'Disabled' },
  ];
  pills.forEach(p => {
    const el = document.createElement('div');
    el.className = 'stat';
    el.innerHTML = `<b>${p.label}:</b> ${p.val}`;
    stats.appendChild(el);
  });
}
function renderLocations() {
  const sel = document.getElementById('locationSelect');
  sel.innerHTML = '';
  LOCATIONS.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc.key;
    opt.textContent = loc.name;
    if (loc.key === state.location) opt.selected = true;
    sel.appendChild(opt);
  });
}

function renderMarket() {
  const tbody = document.querySelector('#marketTable tbody');
  tbody.innerHTML = '';
  ITEMS.forEach(item => {
    const tr = document.createElement('tr');
    const price = state.prices[item.key];
    const [low, high] = item.baseRange;
    const colorClass =
      price >= (high * 0.9) ? 'price-high' :
      price <= (low * 1.1) ? 'price-low' : '';
    tr.innerHTML = `
      <td>${item.name}</td>
      <td><span class="${colorClass}">${formatMoney(price)}</span></td>
      <td>${estimateStockDescriptor(item.key)}</td>
      <td>
        <div class="row">
          <input type="number" min="1" step="1" value="1" id="buyQty_${item.key}" />
          <button ${state.canBuy ? '' : 'disabled'} data-item="${item.key}" class="buyBtn">Buy</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  document.querySelectorAll('.buyBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-item');
      const qty = document.getElementById(`buyQty_${key}`).value;
      buyItem(key, qty);
    });
  });
}

function estimateStockDescriptor(itemKey) {
  const p = state.prices[itemKey];
  const [low, high] = getItem(itemKey).baseRange;
  if (p < (low * 1.05)) return 'Overstocked';
  if (p > (high * 0.95)) return 'Scarce';
  return 'Normal';
}

function renderInventory() {
  const tbody = document.querySelector('#inventoryTable tbody');
  tbody.innerHTML = '';
  ITEMS.forEach(item => {
    const inv = state.inventory[item.key];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${inv.units}</td>
      <td>${inv.units ? formatMoney(inv.avgCost) : '-'}</td>
      <td>
        <div class="row">
          <input type="number" min="1" step="1" value="${inv.units ? 1 : 0}" id="sellQty_${item.key}" />
          <button ${inv.units ? '' : 'disabled'} data-item="${item.key}" class="sellBtn">Sell</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  document.querySelectorAll('.sellBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-item');
      const qty = document.getElementById(`sellQty_${key}`).value;
      sellItem(key, qty);
    });
  });
}

function render() {
  renderStats();
  renderLocations();
  renderMarket();
  renderInventory();
}

// --- Wiring --------------------------------------------------------------
document.getElementById('travelBtn').addEventListener('click', () => {
  const dest = document.getElementById('locationSelect').value;
  travelTo(dest);
});

document.getElementById('endTurnBtn').addEventListener('click', () => {
  endTurn();
});

// --- Boot --------------------------------------------------------------
function boot() {
  state = initialState();
  rollPrices();
  render();
  logEvent('Tour started in Los Angeles with $500 cash and 20 turns.');
}

boot();
