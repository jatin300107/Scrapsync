/* ============================================================
   Kabadiwala Connect — app.js
   Stage 1 + Stage 2: scan, review, create lot
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
    // lot-created screen
    lotCreatedTitle:  "माल दर्ज हो गया! ✅",
    lotCreatedSub:    "आपका माल सफलतापूर्वक दर्ज किया गया।",
    lotCreatedId:     "UUID:",
    goHome:           "होम पर जाएँ",
    // Screen 4 - lot detail
    lotDetail:        "माल की पूरी जानकारी",
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
    distKm:           (km, approx) => approx ? `लगभग ${km} किमी दूर` : `${km} किमी दूर`,
    sendOffer:        "प्रस्ताव भेजें",
    showMore:         "और दिखाएँ",
    breakdown:        "श्रेणी-वार विवरण",
    // Screen 6 - receipt
    receiptTitle:     "सौदे की रसीद",
    rateCardTotal:    "रेट कार्ड की कीमत",
    agreedPrice:      "तय कीमत",
    deviation:        (pct) => `रेट कार्ड से अंतर: ${pct}%`,
    // Screen 7 - recycler
    chooseBuyer:      "खरीदार चुनें",
    refresh:          "नया देखें",
    yourPrice:        "आपकी कीमत (₹)",
    sendQuote:        "कीमत भेजें",
    quoteSent:        (p) => `कीमत भेज दी: ₹${inr(p)}, कबाड़ी के जवाब का इंतज़ार`,
    dealDone:         "सौदा पूरा",
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
    lotCreatedTitle:  "Lot Registered! ✅",
    lotCreatedSub:    "Your lot has been registered successfully.",
    lotCreatedId:     "UUID:",
    goHome:           "Go to Home",
    lotDetail:        "Lot Details",
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
    distKm:           (km, approx) => approx ? `~${km} km away` : `${km} km away`,
    sendOffer:        "Send Offer",
    showMore:         "Show More",
    breakdown:        "Category Breakdown",
    receiptTitle:     "Deal Receipt",
    rateCardTotal:    "Rate Card Price",
    agreedPrice:      "Agreed Price",
    deviation:        (pct) => `Difference from rate card: ${pct}%`,
    chooseBuyer:      "Choose Buyer",
    refresh:          "Refresh",
    yourPrice:        "Your Price (₹)",
    sendQuote:        "Send Price",
    quoteSent:        (p) => `Price sent: ₹${inr(p)}, waiting for collector`,
    dealDone:         "Deal Complete",
    catMobilePhone:   "📱 Mobile Phone",
    catLaptop:        "💻 Laptop",
    catBattery:       "🔋 Battery",
    catCableWire:     "🔌 Cable / Wire",
    catCircuitBoard:  "🖥️ Circuit Board",
    catSmallAppliance:"⚡ Small Appliance",
    catLargeAppliance:"🏠 Large Appliance",
    catOther:         "📦 Other",
  }
};

// Category key → translation key map
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

// ── HELPERS ────────────────────────────────────────────────────
function inr(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString("en-IN");
}

function t(key, ...args) {
  const lang = STATE.lang;
  const val = T[lang][key];
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

// Fix 4: locale-aware date formatting
function formatDate(iso) {
  try {
    const d = new Date(iso);
    if (STATE.lang === "hi") {
      // Hindi: Devanagari numerals + Hindi month names
      return d.toLocaleDateString("hi-IN", {
        day: "numeric", month: "short", year: "numeric"
      });
    } else {
      // English: simple "11 Oct 2026"
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

// ── STATE ──────────────────────────────────────────────────────
const STATE = {
  lang:          "hi",
  activeTab:     "collector",
  currentScreen: "home",

  categories:    [],         // from GET /categories
  lots:          [],         // from GET /lots
  currentLot:    null,

  // Stage 2
  identifyBlob:  null,       // resized JPEG blob — the ONE blob used everywhere
  identifyBlobURL: null,     // object URL for display
  reviewItems:   [],         // editable copy of identify results
  // { id, name, category, box:{x,y,w,h} }

  // Buyers
  buyersPage:    1,
  buyersAll:     [],
  buyersHasMore: false,

  // Recycler tab
  selectedRecyclerId: null,
  recyclerOffers: [],
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
    /* scan re-renders itself via state; just update step text */
    const el = document.querySelector("#scan .step-line");
    if (el) el.textContent = t("step", 1, 4);
  }
  else if (s === "review") renderReview();
}

// ── TOP BAR ────────────────────────────────────────────────────
function renderTopBar() {
  document.getElementById("app-name").textContent = t("appName");
  document.getElementById("lang-toggle").textContent = t("langToggle");
}

// ── TABS ───────────────────────────────────────────────────────
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

function extractDetail(body) {
  if (!body || !body.detail) return null;
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.detail)) {
    return body.detail.map(e => e.msg || JSON.stringify(e)).join("; ");
  }
  return JSON.stringify(body.detail);
}

// ── BOOT ───────────────────────────────────────────────────────
async function loadCategories() {
  try {
    const res = await apiFetch("/categories");
    if (res.ok) STATE.categories = await res.json();
  } catch (_) {}
}

// ── SCREEN 1: HOME ─────────────────────────────────────────────
async function renderHome() {
  const section = document.getElementById("home");

  // Update button labels (Fix 2: gallery button uses secondary class, already done in HTML)
  section.querySelector(".photo-btn-camera .photo-btn-label").textContent     = t("photoBtn");
  section.querySelector(".photo-btn-gallery .photo-btn-label-secondary").textContent = t("galleryBtn");
  section.querySelector(".my-lots-heading").textContent = t("myLots");

  const listEl = section.querySelector(".lots-list");
  listEl.innerHTML = `<div class="loading-box">
    <div class="spinner" aria-hidden="true"></div>
    <p class="loading-text">${t("loading")}</p>
  </div>`;

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
      listEl.innerHTML = `<div class="error-box"><p>⚠️ CORS ERROR — the backend is not sending the right CORS headers. This is a backend setting. Please fix it there.</p></div>`;
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

    btn.addEventListener("click", () => openLotDetail(lot));
    container.appendChild(btn);
  });
}

function openLotDetail(lot) {
  STATE.currentLot = lot;
  show("lot-detail");
  renderLotDetail();
}

// ── SCREEN 4: LOT DETAIL (stub — Stage 3 will complete) ───────
function renderLotDetail() {
  const section = document.getElementById("lot-detail");
  if (!STATE.currentLot) { show("home"); return; }
  const lot = STATE.currentLot;

  const priceHtml = (lot.estimated_min != null && lot.estimated_max != null)
    ? `<p class="price-range">${t("priceRange", lot.estimated_min, lot.estimated_max)}</p>`
    : `<p class="price-range" style="font-size:24px">${t("noPrice")}</p>`;

  const catsHtml = lot.categories.map(c =>
    `<div class="row-between card">
      <span class="bold">${escHtml(catLabel(c.category))}</span>
      <span>${c.weight_kg} kg</span>
    </div>`
  ).join("");

  section.innerHTML = `
    <button class="btn btn-secondary btn-sm mb" onclick="show('home');renderHome()">← ${t("back")}</button>
    <h1>${t("lotDetail")}</h1>
    <span class="${statusBadgeClass(lot.status)}">${escHtml(statusLabel(lot.status))}</span>
    <img src="${escHtml(lot.image_url)}" alt="माल की फोटो"
         style="width:100%;max-height:240px;object-fit:cover;border-radius:8px;border:2px solid #ccc;margin:12px 0"
         loading="lazy">
    ${priceHtml}
    <div class="stack">${catsHtml}</div>
    <p class="small mt" style="color:#444">🗓️ ${formatDate(lot.created_at)}</p>
    <p class="small" style="color:#888;margin-top:4px;font-style:italic">(पूरी जानकारी Stage 3 में)</p>`;
}

// ── SCREEN 7: RECYCLER (stub) ──────────────────────────────────
function renderRecycler() {
  const section = document.getElementById("recycler");
  section.innerHTML = `<h1>${t("tabRecycler")}</h1><p class="small mt">(यह भाग Stage 3 में बनेगा)</p>`;
}

// ═══════════════════════════════════════════════════════════════
// STAGE 2: PHOTO → SCAN → REVIEW → POST /lots
// ═══════════════════════════════════════════════════════════════

// ── PHOTO INPUT HANDLERS ───────────────────────────────────────
function setupPhotoInputs() {
  document.getElementById("camera-input").addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) handlePhotoSelected(file);
    e.target.value = "";
  });
  document.getElementById("gallery-input").addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) handlePhotoSelected(file);
    e.target.value = "";
  });
}

// ── STEP 1: RESIZE IMAGE ───────────────────────────────────────
async function resizeImage(file) {
  const MAX = 1024;

  // Create ImageBitmap respecting EXIF orientation
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
  // Immediately show the scan screen with a loading state
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

  // Revoke previous object URL to avoid memory leaks
  if (STATE.identifyBlobURL) URL.revokeObjectURL(STATE.identifyBlobURL);
  STATE.identifyBlob    = blob;
  STATE.identifyBlobURL = URL.createObjectURL(blob);

  // Show photo preview while waiting for identify
  scan.innerHTML = `
    <div class="step-line">${t("step", 1, 4)}</div>
    <h1>${t("scanHeading")}</h1>
    <img src="${STATE.identifyBlobURL}" alt="फोटो का पूर्वावलोकन" class="scan-preview">
    <div class="loading-box">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-text">${t("scanLoading")}</p>
    </div>`;

  // Call POST /identify
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

    // Build editable review items with stable ids
    STATE.reviewItems = items.map((item, i) => ({
      id:       i,
      name:     item.name,
      category: item.category,
      box:      item.box,
    }));

    show("review");
    renderReview();

  } catch (err) {
    // CORS check
    if (err instanceof TypeError && /fetch|network|cors/i.test(err.message)) {
      scan.innerHTML = `<div class="error-box"><p>⚠️ CORS ERROR — please fix on the backend.</p></div>`;
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

  // ── Empty state ───────────────────────────────────────────
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

  // ── Build boxes overlay ───────────────────────────────────
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

  // ── Build category options ────────────────────────────────
  const catOptions = STATE.categories.map(c =>
    `<option value="${escHtml(c.key)}">${escHtml(catLabel(c.key))}</option>`
  ).join("");

  // ── Build item cards ──────────────────────────────────────
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

  // ── Compute weight rows (one per category present) ────────
  const catGroups = computeCatGroups();
  let weightRows = "";
  catGroups.forEach(cg => {
    weightRows += `
      <div class="weight-row" id="weight-row-${cg.key}">
        <label for="weight-${cg.key}">${catLabel(cg.key)} — ${t("weightLabel", "").replace(" — ", "").trim()}</label>
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
          aria-label="${catLabel(cg.key)} ${t("weightLabel", "")}"
        >
        <div class="hint small">${t("weightHint")}</div>
        <div class="field-error" id="weight-err-${cg.key}" style="display:none"></div>
      </div>`;
  });

  // ── Address field ─────────────────────────────────────────
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

  // ── Compose full screen ───────────────────────────────────
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

  // Restore saved weights
  catGroups.forEach(cg => {
    if (cg.weight) {
      const el = document.getElementById(`weight-${cg.key}`);
      if (el) el.value = cg.weight;
    }
  });
}

// ── WEIGHT STATE ───────────────────────────────────────────────
// Persists weights across re-renders
const _weights = {}; // key → string value

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

// ── ITEM MUTATIONS ─────────────────────────────────────────────
function updateItemName(id, val) {
  const item = STATE.reviewItems.find(i => i.id === id);
  if (item) item.name = val;
}

function updateItemCategory(id, val) {
  const item = STATE.reviewItems.find(i => i.id === id);
  if (!item) return;
  const oldCat = item.category;
  item.category = val;

  // Re-render only the weight rows section (avoid full re-render which loses input focus)
  const catGroups = computeCatGroups();
  const weightContainer = document.getElementById("weight-rows");
  if (!weightContainer) return;

  // Remove weight row for old category if no more items in it
  const oldGroup = catGroups.find(cg => cg.key === oldCat);
  if (!oldGroup) {
    const oldRow = document.getElementById(`weight-row-${oldCat}`);
    if (oldRow) oldRow.remove();
  }
  // Add weight row for new category if it wasn't there
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
        aria-label="${catLabel(val)} weight kg"
      >
      <div class="hint small">${t("weightHint")}</div>
      <div class="field-error" id="weight-err-${val}" style="display:none"></div>`;
    weightContainer.appendChild(div);
  }
}

function removeItem(id) {
  STATE.reviewItems = STATE.reviewItems.filter(i => i.id !== id);
  // Re-render the whole review to update boxes + renumber
  renderReview();
}

// ── SUBMIT LOT ─────────────────────────────────────────────────
async function submitLot() {
  // Collect current weight values from DOM (in case user typed without triggering oninput)
  document.querySelectorAll("[data-cat]").forEach(el => {
    _weights[el.dataset.cat] = el.value;
  });

  const address = (document.getElementById("review-address")?.value || "").trim();
  STATE._reviewAddress = address;

  // ── Validation ────────────────────────────────────────────
  let valid = true;
  const catGroups = computeCatGroups();

  // Weights
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

  // Address
  const addrErr = document.getElementById("address-err");
  if (!address) {
    if (addrErr) { addrErr.textContent = t("addressRequired"); addrErr.style.display = "block"; }
    valid = false;
  } else {
    if (addrErr) addrErr.style.display = "none";
  }

  if (!valid) return;

  // ── Disable button, show spinner ──────────────────────────
  const btn = document.getElementById("submit-lot-btn");
  if (btn) { btn.disabled = true; btn.textContent = t("submitting"); }
  const globalErr = document.getElementById("submit-err");
  if (globalErr) globalErr.style.display = "none";

  // ── Build multipart body ──────────────────────────────────
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

    // Add to local lots list so it appears on Home immediately
    STATE.lots = [lot, ...STATE.lots.filter(l => l.uuid !== lot.uuid)];

    // Clear review state
    STATE.reviewItems = [];
    STATE._reviewAddress = "";
    Object.keys(_weights).forEach(k => delete _weights[k]);

    // Navigate to temporary success screen
    show("lot-created");
    renderLotCreated(lot);

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

// ── LOT-CREATED SCREEN ─────────────────────────────────────────
function renderLotCreated(lot) {
  const section = document.getElementById("lot-created");
  const priceHtml = (lot.estimated_min != null && lot.estimated_max != null)
    ? `<p class="price-big" style="margin:16px 0">${t("priceRange", lot.estimated_min, lot.estimated_max)}</p>`
    : `<p style="font-size:20px;margin:16px 0;color:#555">${t("noPrice")}</p>`;

  section.innerHTML = `
    <div class="success-box">
      <span class="success-icon">✅</span>
      <h1>${t("lotCreatedTitle")}</h1>
      <p>${t("lotCreatedSub")}</p>
      ${priceHtml}
      <p class="small" style="color:#555;margin-top:4px">${t("lotCreatedId")}</p>
      <div class="success-uuid">${escHtml(lot.uuid)}</div>
      <button class="btn btn-primary mt" onclick="goHomeFromSuccess()">${t("goHome")}</button>
    </div>`;
}

function goHomeFromSuccess() {
  show("home");
  renderHome();
}

// ── INIT ───────────────────────────────────────────────────────
async function init() {
  renderTopBar();
  renderTabs();

  document.getElementById("lang-toggle").addEventListener("click", toggleLang);
  document.getElementById("tab-collector").addEventListener("click", () => switchTab("collector"));
  document.getElementById("tab-recycler").addEventListener("click",  () => switchTab("recycler"));

  setupPhotoInputs();

  await loadCategories();

  show("home");
  await renderHome();
}

document.addEventListener("DOMContentLoaded", init);
