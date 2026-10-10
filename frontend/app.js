/* ============================================================
   Kabadiwala Connect — app.js
   Stage 1 + Stage 2 + Stage 3 + Stage 4 (Buyers & Receipt)
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
    step3of4:         "चरण 3 / 4",
    step4of4:         "चरण 4 / 4",
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
    // Screen 5 - buyers
    buyersTitle:      "खरीदार",
    bestPrice:        "सबसे अच्छी कीमत",
    authorized:       "CPCB से अधिकृत",
    distKm:           (km, approx) => `${approx ? "लगभग " : ""}${km} किमी दूर`,
    sendOffer:        "प्रस्ताव भेजें",
    sendingOffer:     "प्रस्ताव भेजा जा रहा है...",
    showMore:         "और दिखाएँ",
    breakdown:        "श्रेणी-वार विवरण",
    buyerUnavailable: "यह खरीदार इस माल के लिए उपलब्ध नहीं",
    noBuyers:         "कोई खरीदार उपलब्ध नहीं है",
    // Screen 6 - receipt
    receiptTitle:     "सौदे की रसीद",
    rateCardTotal:    "रेट कार्ड की कीमत",
    agreedPrice:      "तय कीमत",
    deviation:        (pct) => `रेट कार्ड से अंतर: ${pct}%`,
    goHome:           "होम पर जाएँ",
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
    step3of4:         "Step 3 of 4",
    step4of4:         "Step 4 of 4",
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
    buyersTitle:      "Buyers",
    bestPrice:        "Best Price",
    authorized:       "CPCB Authorized",
    distKm:           (km, approx) => `${approx ? "Approx. " : ""}${km} km away`,
    sendOffer:        "Send Offer",
    sendingOffer:     "Sending Offer...",
    showMore:         "Show More",
    breakdown:        "Category Breakdown",
    buyerUnavailable: "This buyer is not available for this lot",
    noBuyers:         "No buyers available",
    receiptTitle:     "Deal Receipt",
    rateCardTotal:    "Rate Card Total",
    agreedPrice:      "Agreed Price",
    deviation:        (pct) => `Difference from rate card: ${pct}%`,
    goHome:           "Go to Home",
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
  currentAudit:  null,

  // Stage 2
  identifyBlob:  null,       // resized JPEG blob
  identifyBlobURL: null,     // object URL for display
  reviewItems:   [],         // editable copy of identify results

  // Stage 4 Buyers state
  buyersLotUuid: null,
  buyersPage:    1,
  buyersList:    [],
  buyersHasMore: false,
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
  else if (s === "buyers" && STATE.buyersList.length) renderBuyersList();
  else if (s === "receipt" && STATE.currentAudit) renderReceipt(STATE.currentAudit);
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
  if (listEl) {
    listEl.innerHTML = `<div class="loading-box"><div class="spinner" aria-hidden="true"></div><p class="loading-text">${t("loading")}</p></div>`;
  }

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

  const camLbl = document.getElementById("camera-label");
  const galLbl = document.getElementById("gallery-label");
  const titleLbl = document.getElementById("my-lots-title");

  if (camLbl) camLbl.textContent = t("photoBtn");
  if (galLbl) galLbl.textContent = t("galleryBtn");
  if (titleLbl) titleLbl.textContent = t("myLots");

  const cameraInput  = document.getElementById("camera-input");
  const galleryInput = document.getElementById("gallery-input");

  if (cameraInput) cameraInput.onchange  = e => { if (e.target.files[0]) handlePhotoSelected(e.target.files[0]); };
  if (galleryInput) galleryInput.onchange = e => { if (e.target.files[0]) handlePhotoSelected(e.target.files[0]); };

  if (listEl) {
    listEl.innerHTML = `<div class="loading-box"><div class="spinner" aria-hidden="true"></div><p class="loading-text">${t("loading")}</p></div>`;
  }

  try {
    const res = await apiFetch("/lots");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (listEl) renderLotsError(listEl, extractDetail(body));
      return;
    }
    const data = await res.json();
    STATE.lots = data.lots || [];
    if (listEl) renderLotsList(listEl);
  } catch (err) {
    if (err instanceof TypeError && /fetch|network|cors/i.test(err.message)) {
      if (listEl) listEl.innerHTML = `<div class="error-box"><p>⚠️ CORS ERROR — backend failed.</p></div>`;
      return;
    }
    if (listEl) renderLotsError(listEl, null);
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
      <button class="btn btn-primary" onclick="showBuyersList('${lot.uuid}')">${t("findBuyer")}</button>`;
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
        <button class="btn btn-primary" id="agree-btn" onclick="agreeLot('${lot.uuid}')">${t("agree")}</button>
        <button class="btn btn-secondary mb" id="withdraw-btn" onclick="withdrawOffer('${lot.uuid}')">${t("withdraw")}</button>
      </div>`;
  } else if (lot.status === "closed") {
    const auditUuid = lot.audit_uuid || lot.uuid;
    actionHtml = `
      <button class="btn btn-primary" onclick="showReceipt('${auditUuid}')">${t("viewReceipt")}</button>`;
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

// ── AGREE LOT (Stage 4) ────────────────────────────────────────
async function agreeLot(lotUuid) {
  const btn = document.getElementById("agree-btn");
  if (btn) { btn.disabled = true; btn.textContent = t("loading"); }

  try {
    const res = await apiFetch(`/lots/${lotUuid}/agree`, { method: "POST" });
    if (res.status === 409) {
      showLotDetail(lotUuid);
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(extractDetail(body) || t("error"));
      if (btn) { btn.disabled = false; btn.textContent = t("agree"); }
      return;
    }
    const audit = await res.json();
    showReceipt(audit.uuid);
  } catch (err) {
    alert(t("error"));
    if (btn) { btn.disabled = false; btn.textContent = t("agree"); }
  }
}

// ── SCREEN 5: BUYERS LIST (Stage 4) ────────────────────────────
async function showBuyersList(lotUuid, page = 1, append = false) {
  show("buyers");
  const section = document.getElementById("buyers");

  if (!append) {
    STATE.buyersLotUuid = lotUuid;
    STATE.buyersPage    = 1;
    STATE.buyersList    = [];
    STATE.buyersHasMore = false;

    section.innerHTML = `
      <div class="step-line">${t("step3of4")}</div>
      <button class="btn btn-secondary btn-sm mb" onclick="showLotDetail('${lotUuid}')">${t("back")}</button>
      <h1>${t("buyersTitle")}</h1>
      <div class="loading-box">
        <div class="spinner" aria-hidden="true"></div>
        <p class="loading-text">${t("loading")}</p>
      </div>`;
  } else {
    const moreBtn = document.getElementById("show-more-btn");
    if (moreBtn) { moreBtn.disabled = true; moreBtn.textContent = t("loading"); }
  }

  try {
    const res = await apiFetch(`/lots/${lotUuid}/recyclers?page=${page}`);
    if (res.status === 409) {
      showLotDetail(lotUuid);
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      renderBuyersError(section, lotUuid, extractDetail(body) || t("error"));
      return;
    }

    const data = await res.json();
    const newItems = data.recyclers || [];

    if (append) {
      STATE.buyersList = [...STATE.buyersList, ...newItems];
    } else {
      STATE.buyersList = newItems;
    }

    STATE.buyersHasMore = !!data.has_more;
    STATE.buyersPage    = page;

    renderBuyersList();

  } catch (err) {
    if (err instanceof TypeError && /fetch|network|cors/i.test(err.message)) {
      section.innerHTML = `
        <button class="btn btn-secondary btn-sm mb" onclick="showLotDetail('${lotUuid}')">${t("back")}</button>
        <div class="error-box"><p>⚠️ CORS ERROR — backend failed.</p></div>`;
      return;
    }
    renderBuyersError(section, lotUuid, t("error"));
  }
}

function renderBuyersError(container, lotUuid, msg) {
  container.innerHTML = `
    <div class="step-line">${t("step3of4")}</div>
    <button class="btn btn-secondary btn-sm mb" onclick="showLotDetail('${lotUuid}')">${t("back")}</button>
    <h1>${t("buyersTitle")}</h1>
    <div class="error-box">
      <p>${escHtml(msg)}</p>
      <div class="stack mt">
        <button class="btn btn-primary" onclick="showBuyersList('${lotUuid}', 1)">${t("retry")}</button>
      </div>
    </div>`;
}

function renderBuyersList() {
  const section = document.getElementById("buyers");
  const lotUuid = STATE.buyersLotUuid;

  let cardsHtml = "";
  if (STATE.buyersList.length === 0) {
    cardsHtml = `<div class="empty-state">${t("noBuyers")}</div>`;
  } else {
    cardsHtml = STATE.buyersList.map((item, i) => {
      const rc = item.recycler;
      const isBest = (i === 0);
      const isAuth = rc.is_authorized;
      const distText = (item.distance_km != null) ? t("distKm", item.distance_km, item.distance_is_approximate) : "";

      const breakdownRows = (item.breakdown || []).map(b => `
        <div class="row-between" style="padding:6px 0; border-bottom:1px solid #e0e0e0; font-size:15px">
          <span>${escHtml(catLabel(b.category))} (${b.weight_kg} kg)</span>
          <span class="bold">₹${b.rate_per_kg}/kg = ₹${inr(b.price)}</span>
        </div>
      `).join("");

      return `
        <div class="card buyer-card" id="buyer-card-${rc.id}" style="margin-bottom:16px; position:relative">
          ${isBest ? `<div style="background:#1B5E20; color:#fff; font-weight:700; font-size:14px; padding:4px 12px; border-radius:12px; display:inline-block; margin-bottom:8px">⭐ ${t("bestPrice")}</div>` : ""}

          <div class="row-between" style="align-items:flex-start; margin-bottom:8px">
            <div style="flex:1; padding-right:12px">
              <div class="bold" style="font-size:20px; line-height:1.2; margin-bottom:4px">${escHtml(rc.name)}</div>
              <div class="small" style="color:#555">📍 ${escHtml(rc.facility_location)}</div>
              ${isAuth ? `<span class="badge badge-auth" style="margin-top:6px; display:inline-block; font-size:14px; padding:2px 8px">${t("authorized")}</span>` : ""}
              ${distText ? `<div style="font-size:18px; font-weight:700; color:#444; margin-top:8px">🚗 ${escHtml(distText)}</div>` : ""}
            </div>

            <div style="text-align:right; flex-shrink:0">
              <div class="price-big" style="font-size:40px; font-weight:700; color:#1B5E20; line-height:1">₹${inr(item.rate_card_total)}</div>
            </div>
          </div>

          <!-- Breakdown Toggle -->
          <div style="margin-top:12px; margin-bottom:12px">
            <button class="btn btn-secondary btn-sm" onclick="toggleBreakdown(${rc.id})" style="font-size:14px; padding:6px 12px; width:auto">
              📊 ${t("breakdown")} <span id="bd-arrow-${rc.id}">▼</span>
            </button>
            <div id="breakdown-${rc.id}" style="display:none; margin-top:10px; background:#f9f9f9; padding:12px; border-radius:8px; border:1px solid #eee">
              ${breakdownRows}
            </div>
          </div>

          <button class="btn btn-primary" id="offer-btn-${rc.id}" onclick="sendOfferToRecycler(${rc.id})">${t("sendOffer")}</button>
        </div>`;
    }).join("");
  }

  const moreBtnHtml = STATE.buyersHasMore
    ? `<button class="btn btn-secondary mt mb" id="show-more-btn" onclick="showBuyersList('${lotUuid}', ${STATE.buyersPage + 1}, true)">${t("showMore")}</button>`
    : "";

  section.innerHTML = `
    <div class="step-line">${t("step3of4")}</div>
    <button class="btn btn-secondary btn-sm mb" onclick="showLotDetail('${lotUuid}')">${t("back")}</button>
    <h1 style="margin-bottom:16px">${t("buyersTitle")}</h1>

    <div id="buyers-cards">${cardsHtml}</div>
    ${moreBtnHtml}
    <div style="height:60px"></div>`;
}

function toggleBreakdown(rcId) {
  const bd = document.getElementById(`breakdown-${rcId}`);
  const arrow = document.getElementById(`bd-arrow-${rcId}`);
  if (!bd) return;
  if (bd.style.display === "none" || !bd.style.display) {
    bd.style.display = "block";
    if (arrow) arrow.textContent = "▲";
  } else {
    bd.style.display = "none";
    if (arrow) arrow.textContent = "▼";
  }
}

async function sendOfferToRecycler(recyclerId) {
  const btn = document.getElementById(`offer-btn-${recyclerId}`);
  if (btn) { btn.disabled = true; btn.textContent = t("sendingOffer"); }

  const lotUuid = STATE.buyersLotUuid;

  try {
    const res = await apiFetch(`/lots/${lotUuid}/offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recycler_id: recyclerId }),
    });

    if (res.status === 409) {
      showLotDetail(lotUuid);
      return;
    }

    if (res.status === 422) {
      alert(t("buyerUnavailable"));
      if (btn) { btn.disabled = false; btn.textContent = t("sendOffer"); }
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(extractDetail(body) || t("error"));
      if (btn) { btn.disabled = false; btn.textContent = t("sendOffer"); }
      return;
    }

    // Success -> go to lot detail screen reloaded
    showLotDetail(lotUuid);

  } catch (err) {
    alert(t("error"));
    if (btn) { btn.disabled = false; btn.textContent = t("sendOffer"); }
  }
}

// ── SCREEN 6: RECEIPT (Stage 4) ────────────────────────────────
async function showReceipt(auditUuid) {
  show("receipt");
  const section = document.getElementById("receipt");

  section.innerHTML = `
    <div class="step-line">${t("step4of4")}</div>
    <div class="loading-box">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-text">${t("loading")}</p>
    </div>`;

  try {
    const res = await apiFetch(`/audits/${auditUuid}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      renderReceiptError(section, auditUuid, extractDetail(body) || t("error"));
      return;
    }
    const audit = await res.json();
    STATE.currentAudit = audit;
    renderReceipt(audit);
  } catch (err) {
    if (err instanceof TypeError && /fetch|network|cors/i.test(err.message)) {
      section.innerHTML = `
        <div class="error-box"><p>⚠️ CORS ERROR — backend failed.</p></div>`;
      return;
    }
    renderReceiptError(section, auditUuid, t("error"));
  }
}

function renderReceiptError(container, auditUuid, msg) {
  container.innerHTML = `
    <div class="step-line">${t("step4of4")}</div>
    <div class="error-box">
      <p>${escHtml(msg)}</p>
      <div class="stack mt">
        <button class="btn btn-primary" onclick="showReceipt('${auditUuid}')">${t("retry")}</button>
        <button class="btn btn-secondary" onclick="show('home');renderHome()">${t("goHome")}</button>
      </div>
    </div>`;
}

function renderReceipt(audit) {
  const section = document.getElementById("receipt");

  const recycler = audit.recycler;
  const recyclerCard = `
    <div class="card" style="margin-bottom:16px; border:2px solid var(--primary)">
      <div class="bold" style="font-size:20px; margin-bottom:4px">${escHtml(recycler?.name)}</div>
      <div class="small" style="color:#555">📍 ${escHtml(recycler?.facility_location)}</div>
      ${recycler?.is_authorized ? `<span class="badge badge-auth mt" style="display:inline-block; margin-top:8px">${t("authorized")}</span>` : ""}
    </div>`;

  const catRows = (audit.categories || []).map(c => `
    <div class="row-between" style="padding:6px 0; border-bottom:1px solid #eee; font-size:16px">
      <span class="bold">${escHtml(catLabel(c.category))}</span>
      <span class="bold">${c.weight_kg} kg</span>
    </div>
  `).join("");

  const totalWeight = audit.total_weight_kg || (audit.categories || []).reduce((a, b) => a + (b.weight_kg || 0), 0);

  const categoriesCard = `
    <div class="card" style="margin-bottom:16px">
      <h3 style="font-size:18px; margin-bottom:8px">${t("itemCategory")}</h3>
      ${catRows}
      <div class="row-between bold" style="padding-top:10px; font-size:18px; color:#1B5E20">
        <span>${t("totalWeightLabel")}</span>
        <span>${totalWeight} kg</span>
      </div>
    </div>`;

  const devPercent = audit.deviation_percent;
  const deviationHtml = (devPercent != null)
    ? `<div style="font-size:16px; font-weight:700; color:#2E7D32; margin-top:8px">📊 ${t("deviation", devPercent)}</div>`
    : "";

  const priceCard = `
    <div class="card" style="margin-bottom:20px; background:#E8F5E9; border:2px solid #1B5E20; text-align:center; padding:20px var(--pad)">
      <div class="small" style="color:#555; margin-bottom:4px">${t("rateCardTotal")}: ₹${inr(audit.rate_card_total)}</div>
      <div class="small" style="color:#1B5E20; font-weight:700; margin-bottom:6px; font-size:18px">${t("agreedPrice")}</div>
      <div class="price-big" style="font-size:44px; font-weight:700; color:#1B5E20; line-height:1.1">
        ₹${inr(audit.agreed_price)}
      </div>
      ${deviationHtml}
    </div>`;

  const confirmDate = formatDate(audit.collector_confirmed_at || audit.created_at);

  section.innerHTML = `
    <div class="step-line">${t("step4of4")}</div>
    <h1 style="margin-bottom:16px">${t("receiptTitle")}</h1>

    ${recyclerCard}
    ${categoriesCard}
    ${priceCard}

    <p class="small text-center" style="color:#666; margin-bottom:24px; text-align:center">🗓️ ${confirmDate}</p>

    <button class="btn btn-primary" onclick="show('home');renderHome()">${t("goHome")}</button>
    <div style="height:60px"></div>`;
}

// ── SCREEN 7: RECYCLER (stub) ──────────────────────────────────
function renderRecycler() {
  const section = document.getElementById("recycler");
  section.innerHTML = `<h1>${t("tabRecycler")}</h1><p class="small mt">(Stage 5 feature)</p>`;
}
