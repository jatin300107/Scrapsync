/* ============================================================
   Kabadiwala Connect — app.js
   Stage 1 + Stage 2 + Stage 3 (Lot Detail screen)
   ============================================================ */

"use strict";

// ── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  hi: {
    appName:          "कबाड़ीवाला कनेक्ट",
    tabCollector:     "कबाड़ी",
    tabRecycler:      "खरीदार",
    langToggle:       "English",
    photoBtn:         "📷 फोटो खींचें",
    galleryBtn:       "🖼️ गैलरी से चुनें",
    myLots:           "मेरा माल",
    loading:          "रुकिए...",
    error:            "कुछ गड़बड़ हो गई। दोबारा कोशिश करें।",
    retry:            "दोबारा कोशिश करें",
    back:             "← वापस",
    noLots:           "अभी कोई माल नहीं है।",
    noPrice:          "अभी कीमत उपलब्ध नहीं",
    priceRange:       (mn, mx) => `₹${inr(mn)} से ₹${inr(mx)}`,
    step:             (n, total) => `चरण ${n} / ${total}`,
    // Status labels
    statusCreated:    "नया माल",
    statusOffered:    "प्रस्ताव भेजा",
    statusQuoted:     "कीमत आ गई",
    statusClosed:     "सौदा पूरा",
    // Screen 2 - scan
    scanHeading:      "फोटो की पहचान",
    scanLoading:      "पहचान हो रही है, 15 सेकंड तक लग सकते हैं",
    scanFail:         "पहचान नहीं हो पाई, दोबारा कोशिश करें।",
    retake:           "दोबारा फोटो लें",
    // Screen 3 - review
    reviewTitle:      "माल की जानकारी",
    itemName:         "नाम",
    itemCategory:     "श्रेणी",
    removeItem:       "हटाएँ",
    nothingFound:     "कुछ नहीं मिला",
    nothingFoundSub:  "सभी चीज़ें हटा दी गईं या मिली नहीं।",
    weightLabel:      (cat) => `${cat} — वज़न (किलो)`,
    weightHint:       "0 से ज़्यादा लिखें",
    weightError:      "वज़न 0 से ज़्यादा होना चाहिए",
    address:          "आपका पता",
    addressHint:      "जैसे: साहिबाबाद, गाज़ियाबाद",
    addressRequired:  "पता लिखना ज़रूरी है",
    addressError:     "पता नहीं मिला, इलाका और शहर भी लिखें",
    submitLot:        "माल दर्ज करें",
    submitting:       "दर्ज हो रहा है...",
    // Screen 4 - lot detail
    lotDetail:        "माल की पूरी जानकारी",
    totalWeightLabel: "कुल वज़न",
    safetyRules:      "सुरक्षा के नियम",
    findBuyer:        "खरीदार खोजें",
    waitingQuote:     "खरीदार के जवाब का इंतज़ार है",
    withdraw:         "प्रस्ताव वापस लें",
    buyerPrice:       "खरीदार की कीमत",
    rateCardPrice:    "रेट कार्ड की कीमत",
    agree:            "मंज़ूर है",
    viewReceipt:      "सौदे की रसीद देखें",
    listen:           "सुनें 🔊",
    // Placeholder stage 4
    nextStep:         "अगला चरण",
    nextStepTitle:    "अगला चरण (Stage 4 में आ रहा है)",
    // Category labels
    catMobilePhone:   "📱 मोबाइल फोन",
    catLaptop:        "💻 लैपटॉप",
    catBattery:       "🔋 बैटरी",
    catCableWire:     "🔌 तार / केबल",
    catCircuitBoard:  "🖥️ सर्किट बोर्ड",
    catSmallAppliance:"⚡ छोटे उपकरण",
    catLargeAppliance:"🏠 बड़े उपकरण",
    catOther:         "📦 अन्य",
  },
  en: {
    appName:          "Kabadiwala Connect",
    tabCollector:     "Collector",
    tabRecycler:      "Recycler",
    langToggle:       "हिंदी",
    photoBtn:         "📷 Take Photo",
    galleryBtn:       "🖼️ Pick from Gallery",
    myLots:           "My Lots",
    loading:          "Please wait...",
    error:            "Something went wrong. Please try again.",
    retry:            "Try Again",
    back:             "← Back",
    noLots:           "No lots yet.",
    noPrice:          "Price not available yet",
    priceRange:       (mn, mx) => `₹${inr(mn)} to ₹${inr(mx)}`,
    step:             (n, total) => `Step ${n} of ${total}`,
    statusCreated:    "New Lot",
    statusOffered:    "Offer Sent",
    statusQuoted:     "Price Received",
    statusClosed:     "Deal Done",
    scanHeading:      "Photo Identification",
    scanLoading:      "Identifying items, may take up to 15 seconds",
    scanFail:         "Could not identify items. Please try again.",
    retake:           "Take Photo Again",
    reviewTitle:      "Review Items",
    itemName:         "Name",
    itemCategory:     "Category",
    removeItem:       "Remove",
    nothingFound:     "Nothing Found",
    nothingFoundSub:  "No items were identified or all were removed.",
    weightLabel:      (cat) => `${cat} — Weight (kg)`,
    weightHint:       "Must be more than 0",
    weightError:      "Weight must be more than 0",
    address:          "Your Address",
    addressHint:      "e.g. Sahibabad, Ghaziabad",
    addressRequired:  "Address is required",
    addressError:     "Address not found. Add area and city.",
    submitLot:        "Register Lot",
    submitting:       "Registering...",
    lotDetail:        "Lot Details",
    totalWeightLabel: "Total Weight",
    safetyRules:      "Safety Rules",
    findBuyer:        "Find Buyers",
    waitingQuote:     "Waiting for buyer's response",
    withdraw:         "Withdraw Offer",
    buyerPrice:       "Buyer's Price",
    rateCardPrice:    "Rate Card Price",
    agree:            "Accept",
    viewReceipt:      "View Receipt",
    listen:           "Listen 🔊",
    nextStep:         "Next Step",
    nextStepTitle:    "Next Step (Coming in Stage 4)",
    catMobilePhone:   "📱 Mobile Phone",
    catLaptop:        "💻 Laptop",
    catBattery:       "🔋 Battery",
    catCableWire:     "🔌 Cables & Wires",
    catCircuitBoard:  "🖥️ Circuit Board",
    catSmallAppliance:"⚡ Small Appliance",
    catLargeAppliance:"🏠 Large Appliance",
    catOther:         "📦 Other E-Waste",
  }
};

const CAT_KEY_MAP = {
  mobile_phone:    "catMobilePhone",
  laptop:          "catLaptop",
  battery:         "catBattery",
  cable_wire:      "catCableWire",
  circuit_board:   "catCircuitBoard",
  small_appliance: "catSmallAppliance",
  large_appliance: "catLargeAppliance",
  other:           "catOther",
};

// Indian number formatting: 123456 → "1,23,456"
function inr(n) {
  if (n == null || isNaN(n)) return "0";
  return Number(n).toLocaleString(STATE.lang === "hi" ? "hi-IN" : "en-IN");
}

function t(key, ...args) {
  const dict = T[STATE.lang] || T.hi;
  const val  = dict[key] ?? T.hi[key];
  if (typeof val === "function") return val(...args);
  return val ?? key;
}

function catLabel(key) {
  const mapKey = CAT_KEY_MAP[key];
  if (mapKey) return t(mapKey);
  const cached = STATE.categories.find(c => c.key === key);
  return cached ? cached.label : key;
}

function statusLabel(status) {
  const map = {
    created: "statusCreated",
    offered: "statusOffered",
    quoted:  "statusQuoted",
    closed:  "statusClosed",
  };
  return t(map[status] || status);
}

function statusBadgeClass(status) {
  return `badge badge-${status}`;
}

// Locale-aware date formatting
function formatDate(iso) {
  try {
    const d = new Date(iso);
    if (STATE.lang === "hi") {
      return d.toLocaleDateString("hi-IN", {
        day: "numeric", month: "short", year: "numeric"
      });
    } else {
      return d.toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      });
    }
  } catch { return iso; }
}

function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function extractDetail(body) {
  if (!body) return "";
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.detail) && body.detail[0]) {
    const d = body.detail[0];
    if (typeof d === "string") return d;
    if (d.msg) return d.msg;
  }
  return "";
}

// ── STATE ──────────────────────────────────────────────────────
const STATE = {
  lang:          "hi",
  activeTab:     "collector",
  currentScreen: "home",

  categories:    [],         // from GET /categories
  lots:          [],         // from GET /lots
  currentLot:    null,

  // Stage 2
  identifyBlob:  null,       // resized JPEG blob
  identifyBlobURL: null,     // object URL for display
  reviewItems:   [],         // editable copy of identify results
};

// ── SCREEN MANAGER ─────────────────────────────────────────────
function show(screenId) {
  STATE.currentScreen = screenId;
  document.querySelectorAll("#main section").forEach(s => {
    s.classList.toggle("active", s.id === screenId);
  });
  document.getElementById("main").scrollTo(0, 0);
  window.scrollTo(0, 0);
}

// ── LANGUAGE TOGGLE ────────────────────────────────────────────
function setLang(lang) {
  STATE.lang = lang;
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
  renderTopBar();
  renderTabs();
  refreshCurrentScreen();
}

function toggleLang() {
  setLang(STATE.lang === "hi" ? "en" : "hi");
}

function refreshCurrentScreen() {
  const s = STATE.currentScreen;
  if (s === "home") renderHome();
  else if (s === "scan") {
    const el = document.querySelector("#scan .step-line");
    if (el) el.textContent = t("step", 1, 4);
  }
  else if (s === "review") renderReview();
  else if (s === "lot-detail" && STATE.currentLot) renderLotDetail(STATE.currentLot);
}

// ── TOP BAR & TABS ─────────────────────────────────────────────
function renderTopBar() {
  document.getElementById("app-name").textContent = t("appName");
  document.getElementById("lang-toggle").textContent = t("langToggle");
}

function renderTabs() {
  document.getElementById("tab-collector").textContent = t("tabCollector");
  document.getElementById("tab-recycler").textContent  = t("tabRecycler");
}

function switchTab(tab) {
  STATE.activeTab = tab;
  document.getElementById("tab-collector").setAttribute("aria-selected", tab === "collector");
  document.getElementById("tab-recycler").setAttribute("aria-selected",  tab === "recycler");
  if (tab === "collector") {
    show("home");
    renderHome();
  } else {
    show("recycler");
    renderRecycler();
  }
}

// ── API HELPERS ────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const url = window.API_BASE + path;
  const res = await fetch(url, opts);
  return res;
}

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderTopBar();
  renderTabs();

  document.getElementById("lang-toggle").addEventListener("click", toggleLang);
  document.getElementById("tab-collector").addEventListener("click", () => switchTab("collector"));
  document.getElementById("tab-recycler").addEventListener("click", () => switchTab("recycler"));

  show("home");
  initHome();
});

// ── SCREEN 1: HOME ─────────────────────────────────────────────
async function initHome() {
  const listEl = document.getElementById("my-lots-list");
  listEl.innerHTML = `<div class="loading-box"><div class="spinner" aria-hidden="true"></div><p class="loading-text">${t("loading")}</p></div>`;

  try {
    const catRes = await apiFetch("/categories");
    if (catRes.ok) {
      STATE.categories = await catRes.json();
    }
  } catch (err) {
    console.warn("Categories fetch failed:", err);
  }

  renderHome();
}

async function renderHome() {
  const section = document.getElementById("home");
  const listEl  = document.getElementById("my-lots-list");

  document.getElementById("camera-label").textContent  = t("photoBtn");
  document.getElementById("gallery-label").textContent = t("galleryBtn");
  document.getElementById("my-lots-title").textContent  = t("myLots");

  const cameraInput  = document.getElementById("camera-input");
  const galleryInput = document.getElementById("gallery-input");

  cameraInput.onchange  = e => { if (e.target.files[0]) handlePhotoSelected(e.target.files[0]); };
  galleryInput.onchange = e => { if (e.target.files[0]) handlePhotoSelected(e.target.files[0]); };

  listEl.innerHTML = `<div class="loading-box"><div class="spinner" aria-hidden="true"></div><p class="loading-text">${t("loading")}</p></div>`;

  try {
    const res = await apiFetch("/lots");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      renderLotsError(listEl, extractDetail(body));
      return;
    }
    const data = await res.json();
    STATE.lots = data.lots || [];
    renderLotsList(listEl);
  } catch (err) {
    if (err instanceof TypeError && /fetch|network|cors/i.test(err.message)) {
      listEl.innerHTML = `<div class="error-box"><p>⚠️ CORS ERROR — backend failed.</p></div>`;
      return;
    }
    renderLotsError(listEl, null);
  }
}

function renderLotsError(container, detail) {
  container.innerHTML = `<div class="error-box">
    <p>${t("error")}${detail ? " — " + escHtml(detail) : ""}</p>
    <button class="btn btn-secondary btn-sm mt" onclick="renderHome()">${t("retry")}</button>
  </div>`;
}

function renderLotsList(container) {
  if (!STATE.lots.length) {
    container.innerHTML = `<div class="empty-state">${t("noLots")}</div>`;
    return;
  }
  const sorted = [...STATE.lots].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  container.innerHTML = "";

  sorted.forEach(lot => {
    const btn = document.createElement("button");
    btn.className = "lot-item";
    btn.setAttribute("aria-label", `${statusLabel(lot.status)} — ${formatDate(lot.created_at)}`);

    const thumbHtml = lot.image_url
      ? `<img class="lot-thumb" src="${escHtml(lot.image_url)}" alt="माल की फोटो" loading="lazy">`
      : `<div class="lot-thumb-placeholder" aria-hidden="true">📦</div>`;

    const catSummary = lot.categories.map(c => catLabel(c.category)).join(", ");

    const priceHtml = (lot.estimated_min != null && lot.estimated_max != null)
      ? `<span class="lot-price">${t("priceRange", lot.estimated_min, lot.estimated_max)}</span>`
      : `<span class="lot-price">${t("noPrice")}</span>`;

    btn.innerHTML = `
      ${thumbHtml}
      <div class="lot-meta">
        <div class="row-between mb">
          <span class="${statusBadgeClass(lot.status)}">${escHtml(statusLabel(lot.status))}</span>
          <span class="small" style="color:#444">${formatDate(lot.created_at)}</span>
        </div>
        <div class="lot-cats small">${escHtml(catSummary)}</div>
        ${priceHtml}
      </div>`;

    btn.addEventListener("click", () => showLotDetail(lot.uuid));
    container.appendChild(btn);
  });
}

// ── STEP 1: RESIZE IMAGE ───────────────────────────────────────
async function resizeImage(file) {
  const MAX = 1024;
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const ow = bmp.width;
  const oh = bmp.height;

  let tw, th;
  if (ow >= oh) {
    tw = Math.min(ow, MAX);
    th = Math.round(oh * (tw / ow));
  } else {
    th = Math.min(oh, MAX);
    tw = Math.round(ow * (th / oh));
  }

  const canvas = document.createElement("canvas");
  canvas.width  = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bmp, 0, 0, tw, th);
  bmp.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/jpeg", 0.85);
  });
}

// ── STEP 2: HANDLE PHOTO SELECTED ─────────────────────────────
async function handlePhotoSelected(file) {
  show("scan");
  const scan = document.getElementById("scan");
  scan.innerHTML = `
    <div class="step-line">${t("step", 1, 4)}</div>
    <h1>${t("scanHeading")}</h1>
    <div class="loading-box">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-text">${t("scanLoading")}</p>
    </div>`;

  let blob;
  try {
    blob = await resizeImage(file);
  } catch (err) {
    scan.innerHTML = `
      <div class="step-line">${t("step", 1, 4)}</div>
      <div class="error-box">
        <p>${t("scanFail")}</p>
        <button class="btn btn-primary mt" onclick="show('home');renderHome()">${t("retake")}</button>
      </div>`;
    return;
  }

  if (STATE.identifyBlobURL) URL.revokeObjectURL(STATE.identifyBlobURL);
  STATE.identifyBlob    = blob;
  STATE.identifyBlobURL = URL.createObjectURL(blob);

  scan.innerHTML = `
    <div class="step-line">${t("step", 1, 4)}</div>
    <h1>${t("scanHeading")}</h1>
    <img src="${STATE.identifyBlobURL}" alt="फोटो का पूर्वावलोकन" class="scan-preview">
    <div class="loading-box">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-text">${t("scanLoading")}</p>
    </div>`;

  try {
    const fd = new FormData();
    fd.append("image", blob, "photo.jpg");

    const res = await apiFetch("/identify", { method: "POST", body: fd });

    if (res.status === 502) {
      showScanError(scan, t("scanFail"));
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      showScanError(scan, extractDetail(body) || t("scanFail"));
      return;
    }

    const data = await res.json();
    const items = data.items || [];

    STATE.reviewItems = items.map((item, i) => ({
      id:       i,
      name:     item.name,
      category: item.category,
      box:      item.box,
    }));

    show("review");
    renderReview();

  } catch (err) {
    if (err instanceof TypeError && /fetch|network|cors/i.test(err.message)) {
      scan.innerHTML = `<div class="error-box"><p>⚠️ CORS ERROR — backend setting issue.</p></div>`;
      return;
    }
    showScanError(scan, t("scanFail"));
  }
}

function showScanError(scan, msg) {
  scan.innerHTML = `
    <div class="step-line">${t("step", 1, 4)}</div>
    <h1>${t("scanHeading")}</h1>
    ${STATE.identifyBlobURL ? `<img src="${STATE.identifyBlobURL}" alt="फोटो" class="scan-preview">` : ""}
    <div class="error-box">
      <p>${escHtml(msg)}</p>
      <div class="stack mt">
        <button class="btn btn-primary" onclick="show('home');renderHome()">${t("retake")}</button>
      </div>
    </div>`;
}

// ── SCREEN 3: REVIEW ──────────────────────────────────────────
function renderReview() {
  const section = document.getElementById("review");
  const items   = STATE.reviewItems;

  if (items.length === 0) {
    section.innerHTML = `
      <div class="step-line">${t("step", 2, 4)}</div>
      <h1>${t("reviewTitle")}</h1>
      ${STATE.identifyBlobURL ? `<img src="${STATE.identifyBlobURL}" alt="फोटो" class="scan-preview">` : ""}
      <div class="empty-state" style="margin-top:24px">
        <p style="font-size:28px;margin-bottom:8px">🔍</p>
        <p class="bold">${t("nothingFound")}</p>
        <p class="small mt">${t("nothingFoundSub")}</p>
        <button class="btn btn-primary mt" onclick="show('home');renderHome()">${t("retake")}</button>
      </div>`;
    return;
  }

  const boxColors = ["#D32F2F","#1565C0","#F57F17","#6A1B9A","#00695C","#E65100","#37474F","#880E4F"];

  let boxDivs = "";
  items.forEach((item, i) => {
    const b = item.box;
    const color = boxColors[i % boxColors.length];
    const pct = v => (v * 100).toFixed(4) + "%";
    boxDivs += `
      <div class="det-box" style="
        left:${pct(b.x)};
        top:${pct(b.y)};
        width:${pct(b.w)};
        height:${pct(b.h)};
        border-color:${color};
      " aria-hidden="true">
        <span class="det-box-num">${i + 1}</span>
      </div>`;
  });

  let itemCards = "";
  items.forEach((item, i) => {
    const color = boxColors[i % boxColors.length];
    const selectedOpts = STATE.categories.map(c =>
      `<option value="${escHtml(c.key)}" ${c.key === item.category ? "selected" : ""}>${escHtml(catLabel(c.key))}</option>`
    ).join("");

    itemCards += `
      <div class="item-card" id="item-card-${item.id}">
        <div class="item-card-header">
          <span class="item-num-badge" style="background:${color}">${i + 1}</span>
          <span class="bold" style="font-size:18px">${t("itemName")} ${i + 1}</span>
        </div>
        <div class="field" style="margin-bottom:12px">
          <label for="item-name-${item.id}">${t("itemName")}</label>
          <input
            type="text"
            id="item-name-${item.id}"
            value="${escHtml(item.name)}"
            oninput="updateItemName(${item.id}, this.value)"
            aria-label="${t("itemName")} ${i+1}"
          >
        </div>
        <div class="field" style="margin-bottom:12px">
          <label for="item-cat-${item.id}">${t("itemCategory")}</label>
          <select
            id="item-cat-${item.id}"
            onchange="updateItemCategory(${item.id}, this.value)"
            aria-label="${t("itemCategory")} ${i+1}"
          >${selectedOpts}</select>
        </div>
        <button
          class="btn btn-danger btn-sm"
          onclick="removeItem(${item.id})"
          aria-label="${t("removeItem")} ${i+1}"
        >${t("removeItem")}</button>
      </div>`;
  });

  const catGroups = computeCatGroups();
  let weightRows = "";
  catGroups.forEach(cg => {
    weightRows += `
      <div class="weight-row" id="weight-row-${cg.key}">
        <label for="weight-${cg.key}">${catLabel(cg.key)} — वज़न (किलो)</label>
        <div class="small mb" style="color:#5A4000">${catLabel(cg.key)} का वज़न (किलो)</div>
        <input
          type="number"
          id="weight-${cg.key}"
          data-cat="${cg.key}"
          inputmode="decimal"
          min="0.01"
          step="0.01"
          placeholder="0.0"
          value="${cg.weight || ""}"
          oninput="updateWeight('${cg.key}', this.value)"
          aria-label="${catLabel(cg.key)} weight"
        >
        <div class="hint small">${t("weightHint")}</div>
        <div class="field-error" id="weight-err-${cg.key}" style="display:none"></div>
      </div>`;
  });

  const savedAddr = STATE._reviewAddress || "";
  const addressField = `
    <div class="field" style="margin-top:20px" id="address-field">
      <label for="review-address">${t("address")}</label>
      <input
        type="text"
        id="review-address"
        value="${escHtml(savedAddr)}"
        oninput="STATE._reviewAddress = this.value"
        aria-label="${t("address")}"
        autocomplete="street-address"
      >
      <div class="hint small">${t("addressHint")}</div>
      <div class="field-error" id="address-err" style="display:none"></div>
    </div>`;

  section.innerHTML = `
    <div class="step-line">${t("step", 2, 4)}</div>
    <h1>${t("reviewTitle")}</h1>

    <div class="box-wrapper">
      <img src="${STATE.identifyBlobURL}" alt="माल की फोटो">
      ${boxDivs}
    </div>

    <div id="item-cards">${itemCards}</div>

    <hr class="divider">

    <h2 style="font-size:22px;margin-bottom:12px">वज़न दर्ज करें</h2>
    <div id="weight-rows">${weightRows}</div>

    ${addressField}

    <div id="submit-err" class="error-box" style="display:none;margin-bottom:12px"></div>

    <button
      class="btn btn-primary"
      id="submit-lot-btn"
      onclick="submitLot()"
    >${t("submitLot")}</button>
    <div style="height:80px"></div>`;

  catGroups.forEach(cg => {
    if (cg.weight) {
      const el = document.getElementById(`weight-${cg.key}`);
      if (el) el.value = cg.weight;
    }
  });
}

// ── WEIGHT STATE ───────────────────────────────────────────────
const _weights = {};

function computeCatGroups() {
  const groups = {};
  STATE.reviewItems.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item.name);
  });
  return Object.keys(groups).map(key => ({
    key,
    names:  groups[key],
    weight: _weights[key] || "",
  }));
}

function updateWeight(catKey, val) {
  _weights[catKey] = val;
}

function updateItemName(id, val) {
  const item = STATE.reviewItems.find(i => i.id === id);
  if (item) item.name = val;
}

function updateItemCategory(id, val) {
  const item = STATE.reviewItems.find(i => i.id === id);
  if (!item) return;
  const oldCat = item.category;
  item.category = val;

  const catGroups = computeCatGroups();
  const weightContainer = document.getElementById("weight-rows");
  if (!weightContainer) return;

  const oldGroup = catGroups.find(cg => cg.key === oldCat);
  if (!oldGroup) {
    const oldRow = document.getElementById(`weight-row-${oldCat}`);
    if (oldRow) oldRow.remove();
  }
  const newGroup = catGroups.find(cg => cg.key === val);
  if (newGroup && !document.getElementById(`weight-row-${val}`)) {
    const div = document.createElement("div");
    div.className = "weight-row";
    div.id = `weight-row-${val}`;
    div.innerHTML = `
      <div class="small mb bold" style="color:#5A4000">${catLabel(val)} का वज़न (किलो)</div>
      <input
        type="number"
        id="weight-${val}"
        data-cat="${val}"
        inputmode="decimal"
        min="0.01"
        step="0.01"
        placeholder="0.0"
        value="${_weights[val] || ""}"
        oninput="updateWeight('${val}', this.value)"
        aria-label="${catLabel(val)} weight"
      >
      <div class="hint small">${t("weightHint")}</div>
      <div class="field-error" id="weight-err-${val}" style="display:none"></div>`;
    weightContainer.appendChild(div);
  }
}

function removeItem(id) {
  STATE.reviewItems = STATE.reviewItems.filter(i => i.id !== id);
  renderReview();
}

// ── SUBMIT LOT ─────────────────────────────────────────────────
async function submitLot() {
  document.querySelectorAll("[data-cat]").forEach(el => {
    _weights[el.dataset.cat] = el.value;
  });

  const address = (document.getElementById("review-address")?.value || "").trim();
  STATE._reviewAddress = address;

  let valid = true;
  const catGroups = computeCatGroups();

  catGroups.forEach(cg => {
    const errEl = document.getElementById(`weight-err-${cg.key}`);
    const w = parseFloat(_weights[cg.key] || "0");
    if (!w || w <= 0) {
      if (errEl) { errEl.textContent = t("weightError"); errEl.style.display = "block"; }
      valid = false;
    } else {
      if (errEl) errEl.style.display = "none";
    }
  });

  const addrErr = document.getElementById("address-err");
  if (!address) {
    if (addrErr) { addrErr.textContent = t("addressRequired"); addrErr.style.display = "block"; }
    valid = false;
  } else {
    if (addrErr) addrErr.style.display = "none";
  }

  if (!valid) return;

  const btn = document.getElementById("submit-lot-btn");
  if (btn) { btn.disabled = true; btn.textContent = t("submitting"); }
  const globalErr = document.getElementById("submit-err");
  if (globalErr) globalErr.style.display = "none";

  const categoriesPayload = catGroups.map(cg => ({
    category:  cg.key,
    weight_kg: parseFloat(_weights[cg.key]),
    items:     STATE.reviewItems
                 .filter(i => i.category === cg.key)
                 .map(i => i.name),
  }));

  const fd = new FormData();
  fd.append("image",      STATE.identifyBlob, "photo.jpg");
  fd.append("categories", JSON.stringify(categoriesPayload));
  fd.append("address",    address);

  try {
    const res = await apiFetch("/lots", { method: "POST", body: fd });

    if (res.status === 422) {
      const body = await res.json().catch(() => ({}));
      const detail = extractDetail(body) || t("addressError");
      const addrErrEl = document.getElementById("address-err");
      if (addrErrEl) {
        addrErrEl.textContent = t("addressError") + (detail ? " (" + detail + ")" : "");
        addrErrEl.style.display = "block";
      }
      if (btn) { btn.disabled = false; btn.textContent = t("submitLot"); }
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const detail = extractDetail(body);
      if (globalErr) {
        globalErr.textContent = t("error") + (detail ? " — " + detail : "");
        globalErr.style.display = "block";
      }
      if (btn) { btn.disabled = false; btn.textContent = t("submitLot"); }
      return;
    }

    const lot = await res.json();

    STATE.lots = [lot, ...STATE.lots.filter(l => l.uuid !== lot.uuid)];
    STATE.reviewItems = [];
    STATE._reviewAddress = "";
    Object.keys(_weights).forEach(k => delete _weights[k]);

    // Go straight to Screen 4 (lot detail)
    showLotDetail(lot.uuid);

  } catch (err) {
    if (err instanceof TypeError && /fetch|network|cors/i.test(err.message)) {
      if (globalErr) {
        globalErr.textContent = "⚠️ CORS ERROR — backend setting issue.";
        globalErr.style.display = "block";
      }
    } else {
      if (globalErr) { globalErr.textContent = t("error"); globalErr.style.display = "block"; }
    }
    if (btn) { btn.disabled = false; btn.textContent = t("submitLot"); }
  }
}

// ── SCREEN 4: LOT DETAIL (Stage 3) ─────────────────────────────
async function showLotDetail(lotUuid) {
  show("lot-detail");
  const section = document.getElementById("lot-detail");
  section.innerHTML = `
    <button class="btn btn-secondary btn-sm mb" onclick="show('home');renderHome()">${t("back")}</button>
    <div class="loading-box">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-text">${t("loading")}</p>
    </div>`;

  try {
    const res = await apiFetch(`/lots/${lotUuid}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      renderLotDetailError(section, lotUuid, extractDetail(body) || t("error"));
      return;
    }
    const lot = await res.json();
    STATE.currentLot = lot;
    renderLotDetail(lot);
  } catch (err) {
    if (err instanceof TypeError && /fetch|network|cors/i.test(err.message)) {
      section.innerHTML = `
        <button class="btn btn-secondary btn-sm mb" onclick="show('home');renderHome()">${t("back")}</button>
        <div class="error-box"><p>⚠️ CORS ERROR — backend failed.</p></div>`;
      return;
    }
    renderLotDetailError(section, lotUuid, t("error"));
  }
}

function renderLotDetailError(container, lotUuid, msg) {
  container.innerHTML = `
    <button class="btn btn-secondary btn-sm mb" onclick="show('home');renderHome()">${t("back")}</button>
    <div class="error-box">
      <p>${escHtml(msg)}</p>
      <div class="stack mt">
        <button class="btn btn-primary" onclick="showLotDetail('${lotUuid}')">${t("retry")}</button>
      </div>
    </div>`;
}

function groupSafetyRules(guidelines) {
  const groups = [];
  const map = {};
  (guidelines || []).forEach(rule => {
    const cat = rule.category;
    if (!map[cat]) {
      map[cat] = [];
      groups.push({ category: cat, rules: map[cat] });
    }
    map[cat].push(rule);
  });
  return groups;
}

function renderLotDetail(lot) {
  const section = document.getElementById("lot-detail");

  // 1. Photo thumbnail + Status badge
  const statusBadge = `<span class="${statusBadgeClass(lot.status)}" style="font-size:18px; font-weight:700; padding:6px 16px">${escHtml(statusLabel(lot.status))}</span>`;
  const photoHtml   = lot.image_url
    ? `<img src="${escHtml(lot.image_url)}" alt="माल की फोटो" class="scan-preview" style="max-height:260px; object-fit:cover; border-radius:12px; border:2px solid #ccc; width:100%; margin-bottom:12px">`
    : "";

  // 2. Price range (BIGGEST text)
  const priceHtml = (lot.estimated_min != null && lot.estimated_max != null)
    ? `<div class="price-big" style="font-size:32px; font-weight:700; color:#1B5E20; line-height:1.2">${t("priceRange", lot.estimated_min, lot.estimated_max)}</div>`
    : `<div class="price-big" style="font-size:24px; font-weight:700; color:#C8860A">${t("noPrice")}</div>`;

  // 3. Categories & total weight
  const catRows = (lot.categories || []).map(c => `
    <div class="row-between" style="padding:8px 0; border-bottom:1px solid #eee">
      <span class="bold" style="font-size:17px">${escHtml(catLabel(c.category))}</span>
      <span class="bold" style="font-size:17px">${c.weight_kg} kg</span>
    </div>
  `).join("");

  const totalWeight = lot.total_weight_kg || (lot.categories || []).reduce((a, b) => a + (b.weight_kg || 0), 0);

  const categoriesCard = `
    <div class="card" style="margin-bottom:20px">
      <h3 style="font-size:18px; margin-bottom:8px">${t("itemCategory")}</h3>
      ${catRows}
      <div class="row-between bold" style="padding-top:12px; font-size:18px; color:#1B5E20">
        <span>${t("totalWeightLabel")}</span>
        <span>${totalWeight} kg</span>
      </div>
    </div>`;

  // 4. Safety Guidelines cards (grouped by category in amber warning style)
  const safetyGroups = groupSafetyRules(lot.safety_guidelines);
  let safetyHtml = "";
  if (safetyGroups.length > 0) {
    const groupCards = safetyGroups.map(group => `
      <div style="margin-bottom:16px">
        <h3 style="font-size:18px; margin-bottom:8px; color:#1B5E20">${escHtml(catLabel(group.category))}</h3>
        ${group.rules.map(rule => `
          <div class="card-warning" style="background:#FFE8B0; border:2px solid #C8860A; color:#5A3600; padding:14px; border-radius:12px; margin-bottom:10px">
            <div class="bold" style="font-size:18px; margin-bottom:6px; color:#5A3600">${escHtml(rule.hazard_type)}</div>
            <div style="font-size:16px; line-height:1.4; color:#5A3600">${escHtml(rule.rule_text)}</div>
          </div>
        `).join("")}
      </div>
    `).join("");

    safetyHtml = `
      <div style="margin-bottom:24px">
        <h2 style="font-size:22px; margin-bottom:12px">⚠️ ${t("safetyRules")}</h2>
        ${groupCards}
      </div>`;
  }

  // 5. Action area based on status
  let actionHtml = "";
  if (lot.status === "created") {
    actionHtml = `
      <button class="btn btn-primary" onclick="showPlaceholder('buyers', '${lot.uuid}')">${t("findBuyer")}</button>`;
  } else if (lot.status === "offered") {
    const recycler = lot.offer?.recycler;
    actionHtml = `
      <div class="card" style="margin-bottom:16px; border:2px solid var(--primary)">
        <p class="bold" style="font-size:18px; color:var(--primary); margin-bottom:6px">⏳ ${t("waitingQuote")}</p>
        ${recycler ? `
          <div style="margin-top:8px">
            <p class="bold" style="font-size:18px">${escHtml(recycler.name)}</p>
            <p class="small" style="color:#555">📍 ${escHtml(recycler.facility_location)}</p>
          </div>
        ` : ""}
      </div>
      <button class="btn btn-secondary" id="withdraw-btn" onclick="withdrawOffer('${lot.uuid}')">${t("withdraw")}</button>`;
  } else if (lot.status === "quoted") {
    const quotedPrice   = lot.offer?.quoted_price || 0;
    const rateCardTotal = lot.offer?.rate_card_total || 0;
    actionHtml = `
      <div class="card" style="margin-bottom:16px; border:2px solid var(--primary)">
        <p class="small" style="color:#555; margin-bottom:4px">${t("buyerPrice")}</p>
        <div style="display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; margin-bottom:8px">
          <span class="price-big" style="font-size:32px; font-weight:700; color:#1B5E20">₹${inr(quotedPrice)}</span>
          <span class="small" style="color:#666">(${t("rateCardPrice")}: ₹${inr(rateCardTotal)})</span>
        </div>
        ${lot.offer?.recycler ? `
          <div style="margin-top:8px; border-top:1px dashed #ccc; padding-top:8px">
            <p class="bold">${escHtml(lot.offer.recycler.name)}</p>
          </div>
        ` : ""}
      </div>
      <div class="stack">
        <button class="btn btn-primary" onclick="showPlaceholder('agree', '${lot.uuid}')">${t("agree")}</button>
        <button class="btn btn-secondary mb" id="withdraw-btn" onclick="withdrawOffer('${lot.uuid}')">${t("withdraw")}</button>
      </div>`;
  } else if (lot.status === "closed") {
    const auditUuid = lot.audit_uuid || lot.uuid;
    actionHtml = `
      <button class="btn btn-primary" onclick="showPlaceholder('receipt', '${auditUuid}')">${t("viewReceipt")}</button>`;
  }

  section.innerHTML = `
    <button class="btn btn-secondary btn-sm mb" onclick="show('home');renderHome()">${t("back")}</button>

    <div style="margin-bottom:16px">
      ${photoHtml}
      <div style="margin-top:8px; margin-bottom:12px">${statusBadge}</div>
    </div>

    <div style="margin-bottom:20px">
      ${priceHtml}
    </div>

    ${categoriesCard}

    ${safetyHtml}

    <div id="lot-detail-action" style="margin-top:24px">
      ${actionHtml}
    </div>

    <div style="height:60px"></div>`;
}

// ── WITHDRAW OFFER ─────────────────────────────────────────────
async function withdrawOffer(lotUuid) {
  const btn = document.getElementById("withdraw-btn");
  if (btn) { btn.disabled = true; btn.textContent = t("loading"); }

  try {
    const res = await apiFetch(`/lots/${lotUuid}/withdraw`, { method: "POST" });
    if (res.status === 409) {
      showLotDetail(lotUuid);
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(extractDetail(body) || t("error"));
      if (btn) { btn.disabled = false; btn.textContent = t("withdraw"); }
      return;
    }
    showLotDetail(lotUuid);
  } catch (err) {
    alert(t("error"));
    if (btn) { btn.disabled = false; btn.textContent = t("withdraw"); }
  }
}

// ── STAGE 4 PLACEHOLDER ────────────────────────────────────────
function showPlaceholder(type, refId) {
  show("buyers");
  const buyersSec = document.getElementById("buyers");
  buyersSec.innerHTML = `
    <button class="btn btn-secondary btn-sm mb" onclick="showLotDetail('${refId}')">${t("back")}</button>
    <h1>${t("nextStep")}</h1>
    <div class="card" style="margin-top:20px; text-align:center; padding:32px var(--pad)">
      <p style="font-size:36px; margin-bottom:12px">🚀</p>
      <p class="bold" style="font-size:22px">${t("nextStepTitle")}</p>
      <p class="small mt" style="color:#666">(Stage 4 feature — ${escHtml(type)})</p>
    </div>`;
}

// ── SCREEN 7: RECYCLER (stub) ──────────────────────────────────
function renderRecycler() {
  const section = document.getElementById("recycler");
  section.innerHTML = `<h1>${t("tabRecycler")}</h1><p class="small mt">(Stage 4 feature)</p>`;
}
