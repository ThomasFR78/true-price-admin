const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Thomas Chartrain';
pres.title = 'True Price Authority - Demo Technique POC';

// Color palette - Teal Trust (tech, clean, trustworthy)
const COLORS = {
  primary: "028090",      // teal
  secondary: "00A896",    // seafoam
  accent: "02C39A",       // mint
  dark: "0A192F",         // dark blue-black
  light: "F8FAFC",        // off-white
  code: "1E293B",         // code bg
  text: "334155",
  muted: "64748B"
};

// ============ SLIDE 1: Title ============
let slide1 = pres.addSlide();
slide1.background = { color: COLORS.dark };

slide1.addText("TRUE PRICE AUTHORITY", {
  x: 0.5, y: 1.5, w: 9, h: 0.8,
  fontSize: 44, fontFace: "Arial Black", color: COLORS.accent
});

slide1.addText("Demo Technique - POC", {
  x: 0.5, y: 2.3, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Arial", color: "FFFFFF"
});

slide1.addText("Architecture • Stack • Fonctionnalités", {
  x: 0.5, y: 3.2, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.muted
});

slide1.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 4.5, w: 2.5, h: 0.5, fill: { color: COLORS.primary }
});
slide1.addText("Vercel", {
  x: 0.5, y: 4.55, w: 2.5, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: "FFFFFF", align: "center"
});

slide1.addShape(pres.shapes.RECTANGLE, {
  x: 3.2, y: 4.5, w: 2.5, h: 0.5, fill: { color: COLORS.secondary }
});
slide1.addText("Supabase", {
  x: 3.2, y: 4.55, w: 2.5, h: 0.4,
  fontSize: 14, fontFace: "Arial", color: "FFFFFF", align: "center"
});

slide1.addShape(pres.shapes.RECTANGLE, {
  x: 5.9, y: 4.5, w: 2.5, h: 0.5, fill: { color: COLORS.accent }
});
slide1.addText("React", {
  x: 5.9, y: 4.55, w: 2.5, h: 0.4,
  fontSize: 14, fontFace: "FFFFFF", color: COLORS.dark, align: "center"
});

// ============ SLIDE 2: Architecture ============
let slide2 = pres.addSlide();
slide2.background = { color: COLORS.light };

slide2.addText("Architecture Technique", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.dark
});

// Architecture boxes
const arch = [
  { name: "Frontend", tech: "React + TailwindCSS", x: 0.5, color: COLORS.accent },
  { name: "API", tech: "Vercel Serverless", x: 3.4, color: COLORS.primary },
  { name: "Database", tech: "Supabase PostgreSQL", x: 6.3, color: COLORS.secondary }
];

arch.forEach(a => {
  slide2.addShape(pres.shapes.RECTANGLE, {
    x: a.x, y: 1.2, w: 2.7, h: 1.5, fill: { color: a.color }
  });
  slide2.addText(a.name, {
    x: a.x, y: 1.4, w: 2.7, h: 0.5,
    fontSize: 18, fontFace: "Arial Black", color: "FFFFFF", align: "center"
  });
  slide2.addText(a.tech, {
    x: a.x, y: 2, w: 2.7, h: 0.5,
    fontSize: 12, fontFace: "Arial", color: "FFFFFF", align: "center"
  });
});

// Arrows
slide2.addShape(pres.shapes.LINE, {
  x: 3.2, y: 1.95, w: 0.2, h: 0, line: { color: COLORS.muted, width: 2 }
});
slide2.addShape(pres.shapes.LINE, {
  x: 6.1, y: 1.95, w: 0.2, h: 0, line: { color: COLORS.muted, width: 2 }
});

// Data model
slide2.addText("Modèle de Données", {
  x: 0.5, y: 3, w: 9, h: 0.5,
  fontSize: 20, fontFace: "Arial", color: COLORS.dark, bold: true
});

const tables = [
  { name: "offers", fields: "id, url, name, store, region, displayed_price" },
  { name: "price_checks", fields: "id, offer_id, price_paypal, price_card, price_ggdeals, price_aks" },
  { name: "screenshots", fields: "id, check_id, type, url, created_at" }
];

tables.forEach((t, i) => {
  const y = 3.5 + i * 0.7;
  slide2.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 9, h: 0.6, fill: { color: COLORS.code }
  });
  slide2.addText(t.name, {
    x: 0.7, y: y + 0.15, w: 2, h: 0.3,
    fontSize: 14, fontFace: "Consolas", color: COLORS.accent, bold: true
  });
  slide2.addText(t.fields, {
    x: 2.8, y: y + 0.15, w: 6.5, h: 0.3,
    fontSize: 11, fontFace: "Consolas", color: COLORS.muted
  });
});

// ============ SLIDE 3: Dashboard Features ============
let slide3 = pres.addSlide();
slide3.background = { color: COLORS.light };

slide3.addText("Dashboard Public", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.dark
});

slide3.addText("true-price-authority.vercel.app", {
  x: 0.5, y: 0.8, w: 9, h: 0.3,
  fontSize: 14, fontFace: "Consolas", color: COLORS.primary
});

// Features grid
const features = [
  { icon: "📊", title: "Baromètre des Menteurs", desc: "Gauge animée en temps réel du taux de mensonge global" },
  { icon: "🏆", title: "Classement Vendeurs", desc: "Ranking avec badges: Most Honest, Fiable, Attention, Scam Alert" },
  { icon: "📈", title: "Statistiques Live", desc: "Prix vérifiés, vendeurs audités, écart moyen" },
  { icon: "🔍", title: "Détail par Offre", desc: "Historique complet avec screenshots de preuve" }
];

features.forEach((f, i) => {
  const x = (i % 2) * 4.7 + 0.5;
  const y = Math.floor(i / 2) * 1.8 + 1.3;

  slide3.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 4.4, h: 1.5, fill: { color: "FFFFFF" }, line: { color: "E2E8F0", width: 1 }
  });
  slide3.addText(f.icon, {
    x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.6,
    fontSize: 28
  });
  slide3.addText(f.title, {
    x: x + 0.9, y: y + 0.2, w: 3.3, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: COLORS.dark, bold: true
  });
  slide3.addText(f.desc, {
    x: x + 0.9, y: y + 0.6, w: 3.3, h: 0.7,
    fontSize: 11, fontFace: "Arial", color: COLORS.muted
  });
});

// ============ SLIDE 4: Admin Interface ============
let slide4 = pres.addSlide();
slide4.background = { color: COLORS.light };

slide4.addText("Interface Admin", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.dark
});

slide4.addText("Page Checker - Outil d'audit manuel", {
  x: 0.5, y: 0.8, w: 9, h: 0.3,
  fontSize: 14, fontFace: "Arial", color: COLORS.muted, italic: true
});

// Workflow
const steps = [
  { num: "1", title: "Créer Offre", desc: "URL, nom, store, prix affiché" },
  { num: "2", title: "Price Check", desc: "Prix réel PayPal/CB + comparateurs" },
  { num: "3", title: "Screenshots", desc: "Ctrl+V pour coller les preuves" },
  { num: "4", title: "Export", desc: "CSV avec toutes les données" }
];

steps.forEach((s, i) => {
  const x = 0.5 + i * 2.4;

  slide4.addShape(pres.shapes.OVAL, {
    x: x + 0.8, y: 1.3, w: 0.6, h: 0.6, fill: { color: COLORS.primary }
  });
  slide4.addText(s.num, {
    x: x + 0.8, y: 1.4, w: 0.6, h: 0.4,
    fontSize: 18, fontFace: "Arial Black", color: "FFFFFF", align: "center"
  });
  slide4.addText(s.title, {
    x: x, y: 2.1, w: 2.2, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: COLORS.dark, bold: true, align: "center"
  });
  slide4.addText(s.desc, {
    x: x, y: 2.5, w: 2.2, h: 0.6,
    fontSize: 11, fontFace: "Arial", color: COLORS.muted, align: "center"
  });
});

// API endpoints
slide4.addText("Endpoints API", {
  x: 0.5, y: 3.3, w: 9, h: 0.4,
  fontSize: 18, fontFace: "Arial", color: COLORS.dark, bold: true
});

const endpoints = [
  "GET  /api/offers              → Liste des offres",
  "POST /api/offers              → Créer offre",
  "POST /api/offers/:id/checks   → Ajouter price check",
  "POST /api/upload-base64       → Upload screenshot",
  "GET  /api/export-csv          → Export données"
];

endpoints.forEach((e, i) => {
  slide4.addText(e, {
    x: 0.5, y: 3.8 + i * 0.35, w: 9, h: 0.3,
    fontSize: 11, fontFace: "Consolas", color: COLORS.code
  });
});

// ============ SLIDE 5: Métriques Calculées ============
let slide5 = pres.addSlide();
slide5.background = { color: COLORS.dark };

slide5.addText("Métriques & Algorithmes", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.accent
});

// Lie Rate formula
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.1, w: 4.3, h: 2.2, fill: { color: COLORS.code }
});
slide5.addText("Taux de Mensonge", {
  x: 0.7, y: 1.3, w: 4, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.accent, bold: true
});
slide5.addText("lie_rate = (displayed - real) / displayed * 100", {
  x: 0.7, y: 1.8, w: 4, h: 0.3,
  fontSize: 10, fontFace: "Consolas", color: "FFFFFF"
});
slide5.addText("Moyenne pondérée sur tous les checks\nd'un vendeur pour son score final", {
  x: 0.7, y: 2.3, w: 4, h: 0.8,
  fontSize: 11, fontFace: "Arial", color: COLORS.muted
});

// Vendor Score
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.1, w: 4.3, h: 2.2, fill: { color: COLORS.code }
});
slide5.addText("Score Vendeur", {
  x: 5.4, y: 1.3, w: 4, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: COLORS.accent, bold: true
});
slide5.addText("score = 100 - avg(lie_rate)", {
  x: 5.4, y: 1.8, w: 4, h: 0.3,
  fontSize: 10, fontFace: "Consolas", color: "FFFFFF"
});
slide5.addText("Badges attribués:\n≥95% MOST_HONEST, ≥85% GOLD\n≥75% SILVER, ≥60% WARNING\n<60% SCAM_ALERT", {
  x: 5.4, y: 2.2, w: 4, h: 1,
  fontSize: 10, fontFace: "Arial", color: COLORS.muted
});

// Current stats
slide5.addText("Données Actuelles", {
  x: 0.5, y: 3.6, w: 9, h: 0.4,
  fontSize: 18, fontFace: "Arial", color: "FFFFFF", bold: true
});

const stats = [
  { label: "Offres trackées", value: "6" },
  { label: "Price checks", value: "19" },
  { label: "Screenshots", value: "3" },
  { label: "Lie rate moyen", value: "26.9%" }
];

stats.forEach((s, i) => {
  const x = 0.5 + i * 2.4;
  slide5.addText(s.value, {
    x: x, y: 4.1, w: 2.2, h: 0.6,
    fontSize: 32, fontFace: "Arial Black", color: COLORS.accent, align: "center"
  });
  slide5.addText(s.label, {
    x: x, y: 4.7, w: 2.2, h: 0.3,
    fontSize: 11, fontFace: "Arial", color: COLORS.muted, align: "center"
  });
});

// ============ SLIDE 6: Roadmap Tech ============
let slide6 = pres.addSlide();
slide6.background = { color: COLORS.light };

slide6.addText("Roadmap Technique", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: COLORS.dark
});

const roadmap = [
  { phase: "Phase 1", title: "POC Manuel", items: ["Dashboard démo", "Admin page-checker", "Export CSV"], status: "done" },
  { phase: "Phase 2", title: "Automatisation", items: ["Scraping Allkeyshop", "Scraping GGdeals", "Cron jobs"], status: "current" },
  { phase: "Phase 3", title: "API MCP", items: ["Endpoint Trust Score", "Best Price API", "Docs Swagger"], status: "future" }
];

roadmap.forEach((r, i) => {
  const x = 0.5 + i * 3.2;
  const borderColor = r.status === "done" ? "27AE60" : (r.status === "current" ? COLORS.primary : COLORS.muted);

  slide6.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.1, w: 2.9, h: 3.8, fill: { color: "FFFFFF" }, line: { color: borderColor, width: 3 }
  });

  slide6.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.1, w: 2.9, h: 0.5, fill: { color: borderColor }
  });
  slide6.addText(r.phase, {
    x: x, y: 1.15, w: 2.9, h: 0.4,
    fontSize: 14, fontFace: "Arial Black", color: "FFFFFF", align: "center"
  });

  slide6.addText(r.title, {
    x: x + 0.2, y: 1.7, w: 2.5, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: COLORS.dark, bold: true
  });

  r.items.forEach((item, j) => {
    slide6.addText("✓ " + item, {
      x: x + 0.2, y: 2.2 + j * 0.4, w: 2.5, h: 0.35,
      fontSize: 12, fontFace: "Arial", color: COLORS.text
    });
  });
});

// ============ SLIDE 7: Live Demo ============
let slide7 = pres.addSlide();
slide7.background = { color: COLORS.primary };

slide7.addText("LIVE DEMO", {
  x: 0.5, y: 1.8, w: 9, h: 0.8,
  fontSize: 56, fontFace: "Arial Black", color: "FFFFFF", align: "center"
});

slide7.addText("true-price-authority.vercel.app", {
  x: 0.5, y: 3, w: 9, h: 0.5,
  fontSize: 24, fontFace: "Consolas", color: COLORS.dark, align: "center"
});

slide7.addText("Dashboard Public + Interface Admin", {
  x: 0.5, y: 3.8, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: "FFFFFF", align: "center", italic: true
});

// Save
pres.writeFile({ fileName: "/sessions/great-eager-brahmagupta/mnt/Lprojects/True Price Authority/slides/TruePriceAuthority-Demo-Technique.pptx" })
  .then(() => console.log("✅ Demo Technique créé!"))
  .catch(err => console.error(err));
