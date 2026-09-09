// Soutenance MediBet — génération du .pptx, fidèle au canvas (grille en pixels 1280x720 = 13,333 x 7,5 pouces).
const pptxgen = require("pptxgenjs");
const P = (px) => px / 96;               // 96 px = 1 pouce
const S = (px) => Math.round(px * 0.75 * 10) / 10;  // px -> points

const CREAM = "F3E4B0", SOFT = "E6DCBE", BODY = "CFDFD2", GOLD = "D9A521",
      RED = "A02C1E", PARCH = "F4E3AB", INK = "2A2016", FAINT = "8FAE95",
      DARK = "061711";
const DSP = "Impact", BDY = "Arial", MNO = "Consolas";
const BG = "felt.jpg";
const LINKS = "romanecano.github.io/medibet-fhir · github.com/RomaneCano/medibet-fhir";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";            // 13,333 x 7,5 pouces
pres.author = "Équipe Patient — MediBet";
pres.title = "Soutenance MediBet";

const shadow = (off = 5) => ({ type: "outer", color: RED, blur: 0, offset: off * 0.75, angle: 45, opacity: 1 });

function base(eyebrow, title, subtitle, timing, notes, speaker) {
  const s = pres.addSlide();
  s.background = { path: BG };
  if (speaker) s.addText(speaker, { x: P(22), y: P(694), w: P(360), h: P(20), fontFace: MNO,
    fontSize: 7.5, color: GOLD, charSpacing: 1.4, isTextBox: true, margin: 0, valign: "middle" });
  s.addText(LINKS, { x: P(420), y: P(694), w: P(440), h: P(20), fontFace: MNO, fontSize: 7.5,
    color: FAINT, align: "center", isTextBox: true, margin: 0, valign: "middle" });
  s.addText(timing, { x: P(1000), y: P(694), w: P(258), h: P(20), fontFace: MNO, fontSize: 7.5,
    color: FAINT, align: "right", isTextBox: true, margin: 0, valign: "middle" });
  if (eyebrow) s.addText(eyebrow.toUpperCase(), { x: P(60), y: P(34), w: P(1160), h: P(20),
    fontFace: MNO, fontSize: 8.5, color: GOLD, bold: true, charSpacing: 4, align: "center",
    isTextBox: true, margin: 0, valign: "middle" });
  if (title) s.addText(title.toUpperCase(), { x: P(60), y: P(54), w: P(1160), h: P(64),
    fontFace: DSP, fontSize: 34, color: CREAM, align: "center", isTextBox: true, margin: 0,
    valign: "middle", shadow: shadow(4) });
  if (subtitle) s.addText(subtitle, { x: P(210), y: P(120), w: P(860), h: P(46), fontFace: BDY,
    fontSize: S(18), color: SOFT, align: "center", isTextBox: true, margin: 0, valign: "top" });
  if (notes) s.addNotes(notes);
  return s;
}

const LINKS_SHORT = "romanecano.github.io/medibet-fhir";

// carte de colonne Trello
function tcard(s, x, y, w, h, label, pts, accent) {
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h), fill: { color: "FDF6E0" } });
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(4), h: P(h), fill: { color: accent } });
  s.addText(label, { x: P(x + 9), y: P(y), w: P(w - 36), h: P(h), fontFace: BDY, fontSize: 8,
    bold: true, color: INK, isTextBox: true, margin: 0, valign: "middle", lineSpacingMultiple: 1 });
  s.addText(pts, { x: P(x + w - 28), y: P(y), w: P(22), h: P(h), fontFace: MNO, fontSize: 7.5,
    color: "7A6A48", align: "right", isTextBox: true, margin: 0, valign: "middle" });
}

// colonne du board
function tcol(s, x, y, w, h, title, count, cards, two) {
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h), fill: { color: PARCH },
    shadow: shadow(6) });
  s.addText(title.toUpperCase(), { x: P(x + 13), y: P(y + 10), w: P(w - 70), h: P(20),
    fontFace: MNO, fontSize: 9, color: RED, bold: true, charSpacing: 1, isTextBox: true,
    margin: 0, valign: "middle" });
  s.addText(count, { x: P(x + w - 55), y: P(y + 6), w: P(42), h: P(26), fontFace: DSP,
    fontSize: 16, color: "C08B1E", align: "right", isTextBox: true, margin: 0, valign: "middle" });
  s.addShape(pres.ShapeType.line, { x: P(x + 13), y: P(y + 36), w: P(w - 26), h: 0,
    line: { color: RED, width: 0.5, transparency: 65 } });
  if (!cards.length) {
    s.addText("aucune carte — tout est engagé", { x: P(x + 13), y: P(y + 46), w: P(w - 26), h: P(22),
      fontFace: BDY, fontSize: 9.5, color: "8A7D5E", italic: true, isTextBox: true, margin: 0 });
    return;
  }
  const ch = 26, gap = 5;
  if (two) {
    const cw = (w - 26 - 8) / 2, half = Math.ceil(cards.length / 2);
    cards.forEach((c, i) => {
      const col = i < half ? 0 : 1, row = i < half ? i : i - half;
      tcard(s, x + 13 + col * (cw + 8), y + 44 + row * (ch + gap), cw, ch, c[0], c[1], c[2]);
    });
  } else {
    cards.forEach((c, i) => tcard(s, x + 13, y + 44 + i * (ch + gap), w - 26, ch, c[0], c[1], c[2]));
  }
}

// emplacement réservé à une capture
function slot(s, x, y, w, h, label) {
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h),
    fill: { color: DARK, transparency: 55 }, line: { color: GOLD, width: 1.25, dashType: "dash" } });
  s.addText("COLLER LA CAPTURE ICI", { x: P(x + 10), y: P(y + h / 2 - 26), w: P(w - 20), h: P(20),
    fontFace: MNO, fontSize: 9, color: GOLD, bold: true, charSpacing: 1.4, align: "center",
    isTextBox: true, margin: 0, valign: "middle" });
  s.addText(label, { x: P(x + 14), y: P(y + h / 2 - 2), w: P(w - 28), h: P(40), fontFace: BDY,
    fontSize: 9.5, color: BODY, align: "center", isTextBox: true, margin: 0, valign: "top" });
}

// burndown en points, tracé à la main pour rester éditable
function burndown(s, x, y, w, h) {
  const xs = ["dép.", "lun PM", "mar AM", "mar PM", "mer AM", "mer PM", "jeu AM"];
  const real = [52, 52, 42, 34, 26, 16, 8];
  const L = 56, R = 26, T = 30, B = 46, n = xs.length - 1;
  const PX = i => x + L + i * (w - L - R) / n;
  const PY = v => y + T + (1 - v / 52) * (h - T - B);
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h),
    fill: { color: "0B2C22" }, line: { color: GOLD, width: 0.75, transparency: 60 } });
  [52, 26, 8, 0].forEach(v => {
    s.addShape(pres.ShapeType.line, { x: P(x + L), y: P(PY(v)), w: P(w - L - R), h: 0,
      line: { color: "FFFFFF", width: 0.5, transparency: 88 } });
    s.addText(String(v), { x: P(x + 8), y: P(PY(v) - 10), w: P(L - 18), h: P(20), fontFace: DSP,
      fontSize: 10, color: CREAM, align: "right", isTextBox: true, margin: 0, valign: "middle" });
  });
  xs.forEach((lb, i) => s.addText(lb, { x: P(PX(i) - 40), y: P(y + h - 40), w: P(80), h: P(18),
    fontFace: MNO, fontSize: 8, color: "9FBFA6", align: "center", isTextBox: true, margin: 0 }));
  for (let i = 0; i < n; i++) {
    const y1 = PY(52 - 52 * i / n), y2 = PY(52 - 52 * (i + 1) / n);
    s.addShape(pres.ShapeType.line, { x: P(PX(i)), y: P(Math.min(y1, y2)), w: P(PX(i + 1) - PX(i)),
      h: P(Math.abs(y2 - y1)), line: { color: GOLD, width: 1.5, dashType: "dash",
      beginArrowType: "none", endArrowType: "none" }, flipV: y2 < y1 });
    const r1 = PY(real[i]), r2 = PY(real[i + 1]);
    s.addShape(pres.ShapeType.line, { x: P(PX(i)), y: P(Math.min(r1, r2)), w: P(PX(i + 1) - PX(i)),
      h: P(Math.abs(r2 - r1)), line: { color: CREAM, width: 2.25 }, flipV: r2 < r1 });
  }
  real.forEach((v, i) => s.addShape(pres.ShapeType.ellipse, { x: P(PX(i) - 4), y: P(PY(v) - 4),
    w: P(8), h: P(8), fill: { color: CREAM } }));
  s.addShape(pres.ShapeType.ellipse, { x: P(PX(n) - 9), y: P(PY(8) - 9), w: P(18), h: P(18),
    fill: { color: "0B2C22" }, line: { color: CREAM, width: 2 } });
  s.addText("nous sommes ici · 8 pts restants", { x: P(PX(n) - 250), y: P(y + T - 4), w: P(240),
    h: P(18), fontFace: BDY, fontSize: 9.5, color: CREAM, align: "right", isTextBox: true, margin: 0 });
  s.addText("52 PTS ENGAGÉS", { x: P(x + L + 8), y: P(y + T - 22), w: P(160), h: P(16),
    fontFace: MNO, fontSize: 8, color: GOLD, isTextBox: true, margin: 0 });
}

function card(s, x, y, w, h, num, title, text) {
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h), fill: { color: PARCH },
    shadow: shadow(7) });
  s.addText(num, { x: P(x + 20), y: P(y + 14), w: P(w - 40), h: P(34), fontFace: DSP,
    fontSize: 21, color: "C08B1E", isTextBox: true, margin: 0, valign: "middle" });
  s.addText(title.toUpperCase(), { x: P(x + 20), y: P(y + 50), w: P(w - 40), h: P(20),
    fontFace: MNO, fontSize: 9, color: RED, bold: true, charSpacing: 1, isTextBox: true,
    margin: 0, valign: "middle" });
  s.addText(text, { x: P(x + 20), y: P(y + 74), w: P(w - 40), h: P(h - 88), fontFace: BDY,
    fontSize: 10.5, color: INK, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
}

function tile(s, x, y, w, h, big, label) {
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h), fill: { color: PARCH },
    shadow: shadow(5) });
  s.addText(big, { x: P(x + 14), y: P(y), w: P(w * 0.42), h: P(h), fontFace: DSP, fontSize: 19,
    color: RED, isTextBox: true, margin: 0, valign: "middle" });
  s.addText(label.replace(/<br>/g, "\n"), { x: P(x + w * 0.42), y: P(y), w: P(w * 0.58 - 14),
    h: P(h), fontFace: MNO, fontSize: 7.5, color: INK, bold: true, align: "right",
    isTextBox: true, margin: 0, valign: "middle", lineSpacingMultiple: 1.15 });
}

function tileRow(s, items, y, h, x0 = 60, total = 1160, gap = 13) {
  const w = (total - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => tile(s, x0 + i * (w + gap), y, w, h, it[0], it[1]));
}

function panel(s, x, y, w, h, title, items, accent = GOLD, fs = 11) {
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h),
    fill: { color: "0B2C22" }, line: { color: GOLD, width: 0.75, transparency: 60 } });
  s.addText(title.toUpperCase(), { x: P(x + 20), y: P(y + 14), w: P(w - 40), h: P(18),
    fontFace: MNO, fontSize: 8.5, color: accent, bold: true, charSpacing: 1.6, isTextBox: true,
    margin: 0, valign: "middle" });
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } })),
    { x: P(x + 20), y: P(y + 40), w: P(w - 40), h: P(h - 54), fontFace: BDY, fontSize: fs,
      color: BODY, isTextBox: true, margin: 0, valign: "top", paraSpaceAfter: 6,
      lineSpacingMultiple: 1.15 });
}

function table(s, x, y, w, headers, rows, fracs, opts = {}) {
  const fs = opts.fs || 10.5, rowH = opts.rowH || 40, hl = opts.highlight;
  const cols = fracs.map(f => w * f);
  const cx = i => x + cols.slice(0, i).reduce((a, b) => a + b, 0);
  headers.forEach((hd, i) => {
    if (hd) s.addText(hd.toUpperCase(), { x: P(cx(i) + (i ? 0 : 11)), y: P(y), w: P(cols[i] - 14),
      h: P(20), fontFace: MNO, fontSize: 8, color: GOLD, bold: true, charSpacing: 1.6,
      isTextBox: true, margin: 0, valign: "middle" });
  });
  s.addShape(pres.ShapeType.line, { x: P(x), y: P(y + 24), w: P(w), h: 0,
    line: { color: GOLD, width: 0.75, transparency: 45 } });
  rows.forEach((r, ri) => {
    const ry = y + 30 + ri * rowH;
    if (hl === ri) {
      s.addShape(pres.ShapeType.rect, { x: P(x), y: P(ry), w: P(w), h: P(rowH - 2),
        fill: { color: PARCH, transparency: 92 } });
      s.addShape(pres.ShapeType.rect, { x: P(x), y: P(ry), w: P(3), h: P(rowH - 2),
        fill: { color: GOLD } });
    }
    r.forEach((c, ci) => {
      const isFirst = ci === 0;
      s.addText(c, { x: P(cx(ci) + (isFirst ? 11 : 0)), y: P(ry), w: P(cols[ci] - 14),
        h: P(rowH - 2), fontFace: isFirst ? DSP : BDY, fontSize: isFirst ? fs + 1 : fs,
        color: isFirst ? CREAM : BODY, isTextBox: true, margin: 0, valign: "middle",
        lineSpacingMultiple: 1.1 });
    });
    s.addShape(pres.ShapeType.line, { x: P(x), y: P(ry + rowH - 2), w: P(w), h: 0,
      line: { color: "FFFFFF", width: 0.5, transparency: 88 } });
  });
}

function shot(s, img, x, y, w, h, caption) {
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h), fill: { color: PARCH },
    shadow: shadow(6) });
  s.addImage({ path: img, x: P(x + 8), y: P(y + 8), w: P(w - 16), h: P(h - 16), sizing:
    { type: "contain", w: P(w - 16), h: P(h - 16) } });
  if (caption) s.addText(caption, { x: P(x), y: P(y + h + 6), w: P(w), h: P(22), fontFace: BDY,
    fontSize: 9.5, color: FAINT, isTextBox: true, margin: 0, valign: "middle" });
}

function shotTodo(s, x, y, w, h, label) {
  s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h),
    fill: { color: DARK, transparency: 30 }, line: { color: GOLD, width: 1.5, dashType: "dash" } });
  s.addText("CAPTURE À INSÉRER", { x: P(x), y: P(y + h / 2 - 34), w: P(w), h: P(28),
    fontFace: DSP, fontSize: 16, color: GOLD, align: "center", isTextBox: true, margin: 0,
    valign: "middle" });
  s.addText(label, { x: P(x + 30), y: P(y + h / 2 - 2), w: P(w - 60), h: P(48), fontFace: BDY,
    fontSize: 10.5, color: BODY, align: "center", isTextBox: true, margin: 0, valign: "top" });
}

/* ============================ 01 · titre ============================ */
{
  const s = pres.addSlide();
  s.background = { path: BG };
  s.addText("MEDIBET", { x: P(60), y: P(196), w: P(1160), h: P(120), fontFace: DSP, fontSize: 84,
    color: CREAM, align: "center", isTextBox: true, margin: 0, valign: "middle", shadow: shadow(7) });
  s.addText("ÉQUIPE PATIENT", { x: P(60), y: P(322), w: P(1160), h: P(48), fontFace: DSP,
    fontSize: 26, color: GOLD, align: "center", charSpacing: 2, isTextBox: true, margin: 0,
    valign: "middle" });
  s.addShape(pres.ShapeType.line, { x: P(560), y: P(396), w: P(160), h: 0,
    line: { color: CREAM, width: 0.75, transparency: 50 } });
  s.addText("NEIROUZ ATTIA · PRODUCT OWNER          RÉMI DELARUE · SCRUM MASTER          ROMANE CANO · DÉVELOPPEUSE",
    { x: P(60), y: P(420), w: P(1160), h: P(24), fontFace: MNO, fontSize: 9.5, color: BODY,
      align: "center", isTextBox: true, margin: 0, valign: "middle" });
  s.addText("Maîtrise des technologies de l'interopérabilité — session 2026",
    { x: P(60), y: P(460), w: P(1160), h: P(24), fontFace: BDY, fontSize: 10.5, color: FAINT,
      align: "center", isTextBox: true, margin: 0, valign: "middle" });
  s.addText(LINKS, { x: P(22), y: P(694), w: P(700), h: P(20), fontFace: MNO, fontSize: 7.5,
    color: FAINT, isTextBox: true, margin: 0, valign: "middle" });
  s.addText("≈20 s · 0:20", { x: P(1000), y: P(694), w: P(258), h: P(20), fontFace: MNO,
    fontSize: 7.5, color: FAINT, align: "right", isTextBox: true, margin: 0, valign: "middle" });
  s.addNotes("RÉMI — Bonjour à tous. Nous sommes l'équipe Patient du projet MediBet. Je m'appelle Rémi Delarue, je suis Scrum Master. Neirouz Attia est Product Owner, Romane Cano est développeuse. Nous allons vous présenter notre application, la façon dont nous l'avons construite, et surtout la manière dont elle échange des données avec l'application de l'équipe Médecin, à travers FHIR.");
}

/* ============================ 02 · cadrage ============================ */
{
  const s = base("00 · Cadrage", "Le TP et notre plan",
    "Ce qui était demandé, et l'ordre dans lequel nous allons y répondre.", "≈30 s · 0:50",
    "RÉMI — Le sujet demandait quatre choses : une équipe agile, un rôle entre Patient et Médecin, une application autour de FHIR, et une démonstration avec l'équipe binôme. Nous suivrons exactement le plan de restitution demandé.",
    "RÉMI · SCRUM MASTER");
  panel(s, 60, 200, 564, 300, "La consigne", [
    "Créer une application interopérable en équipe agile de 2 à 3 personnes.",
    "Choisir un rôle : Patient ou Médecin. Nous sommes l'équipe Patient.",
    "Construire l'application autour de la plateforme FHIR fournie.",
    "Restituer : organisation, démarche, analyse métier, FHIR, démonstration."]);
  s.addShape(pres.ShapeType.rect, { x: P(656), y: P(200), w: P(564), h: P(300),
    fill: { color: "0B2C22" }, line: { color: GOLD, width: 0.75, transparency: 60 } });
  s.addText("NOTRE PLAN", { x: P(676), y: P(214), w: P(524), h: P(18), fontFace: MNO,
    fontSize: 8.5, color: GOLD, bold: true, charSpacing: 1.6, isTextBox: true, margin: 0 });
  [["01", "Organisation de l'équipe"], ["02", "Démarche projet — Scrum"], ["03", "Analyse métier"],
   ["04", "Utilisation de FHIR"], ["05", "Démonstration avec l'équipe Médecin"]].forEach((r, i) => {
    const y = 246 + i * 46;
    s.addText(r[0], { x: P(676), y: P(y), w: P(44), h: P(26), fontFace: DSP, fontSize: 15,
      color: RED, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(r[1], { x: P(722), y: P(y), w: P(478), h: P(26), fontFace: BDY, fontSize: 11.5,
      color: BODY, isTextBox: true, margin: 0, valign: "middle" });
  });
}

/* ============================ 03 · équipe ============================ */
{
  const s = base("01 · Organisation de l'équipe", "Trois rôles, trois responsabilités",
    "Une équipe de trois personnes, un rôle Scrum chacun, tenus du début à la fin du sprint.",
    "≈50 s · 1:40",
    "RÉMI — Neirouz est PO : elle porte la valeur produit, rédige et priorise le backlog, valide ce qui est livré. Je suis Scrum Master : cérémonies, board à jour, blocages, burndown. Romane est développeuse : les deux applications, les appels FHIR, le déploiement, la documentation. Côté outils : deux boards Trello avec Corrello, le Drive, GitHub. Claude a servi de copilote ; les décisions produit sont restées les nôtres.",
    "RÉMI · SCRUM MASTER");
  const cw = (1160 - 48) / 3;
  card(s, 60, 190, cw, 168, "PO", "Neirouz Attia", "Porte la valeur produit : rédige et priorise le backlog, définit les critères d'acceptation, valide ce qui est livré.");
  card(s, 60 + cw + 24, 190, cw, 168, "SM", "Rémi Delarue", "Garant du cadre : anime les cérémonies, tient le board à jour, lève les blocages, suit le burndown.");
  card(s, 60 + 2 * (cw + 24), 190, cw, 168, "DEV", "Romane Cano", "Réalise : développe les deux applications, teste les appels FHIR, déploie et documente.");
  tileRow(s, [["Trello", "2 boards :<br>produit et sprint"], ["Corrello", "Burndown<br>et vélocité"],
    ["Drive", "Documents<br>d'équipe"], ["GitHub", "Code et<br>déploiement"]], 400, 62);
  s.addText("Claude a servi de copilote de développement et de rédaction. Les décisions produit sont restées celles de l'équipe.",
    { x: P(60), y: P(490), w: P(1160), h: P(24), fontFace: BDY, fontSize: 10.5, color: FAINT,
      align: "center", isTextBox: true, margin: 0, valign: "middle" });
}

/* ============================ 04 · scrum ============================ */
{
  const s = base("02 · Démarche projet", "Scrum sur un sprint unique",
    "Un sprint de trois jours, du lundi après-midi au jeudi matin.", "≈45 s · 2:25",
    "RÉMI — Scrum sur un sprint unique de trois jours. Un Sprint Planning lundi, six Daily de moins de quinze minutes, une session de Planning Poker, et ce matin la Review et la rétrospective. Précision : au Planning Poker, l'estimation est un vote de l'équipe de dev ; le PO clarifie le besoin, il ne tranche pas les points.",
    "RÉMI · SCRUM MASTER");
  table(s, 60, 190, 1160, ["Cérémonie", "Quand", "Ce qu'on y a fait"], [
    ["Sprint Planning", "Lundi PM", "Cadrage du concept, découpage en user stories, priorisation par le Product Owner"],
    ["Daily Meeting", "Chaque demi-journée", "Tour de table de moins de 15 minutes : fait, à faire, blocages"],
    ["Planning Poker", "Mercredi", "Estimation collective en points ; le PO clarifie le besoin, l'équipe vote"],
    ["Sprint Review", "Jeudi AM", "Démonstration en conditions réelles avec l'équipe Médecin, sur deux postes"],
    ["Rétrospective", "Jeudi AM", "Bilan à froid animé par le Scrum Master"]],
    [0.21, 0.20, 0.59], { rowH: 52 });
  s.addText("Six Daily Meetings sur les six demi-journées du sprint. Sur trois jours, le Sprint Backlog représente presque tout le projet.",
    { x: P(60), y: P(500), w: P(1160), h: P(24), fontFace: BDY, fontSize: 10.5, color: FAINT,
      isTextBox: true, margin: 0, valign: "middle" });
}

/* ============================ 05 · Product Backlog ============================ */
{
  const s = base("02 · Démarche projet", "Le Product Backlog",
    "Priorisé par la valeur pour le patient, puis typé carte par carte.", "≈60 s · 3:25",
    "NEIROUZ — Le Product Backlog contient tout ce que MediBet pourrait devenir : je l'ai rédigé et priorisé par la valeur pour le patient. Le Sprint Backlog, lui, ne contient que ce que l'équipe s'engage à livrer cette semaine. Au Sprint Planning nous avions dix-huit cartes ; deux ont été retirées en cours de sprint parce qu'elles faisaient doublon, il en reste seize actives pour cinquante-deux points. Sur ces seize cartes, sept seulement sont de vraies user stories, pour vingt-six points : annoncer cinquante-deux points de valeur produit serait faux. Le reste, ce sont une story technique, deux spikes d'analyse et six tâches d'organisation — nécessaires, mais elles ne se voient pas par le patient.",
    "NEIROUZ · PRODUCT OWNER");
  shot(s, "storymap.jpg", 60, 186, 560, 250,
    "Notre story map : les cartes classées par type, pas par ordre d'arrivée.");
  slot(s, 640, 186, 580, 250, "Board « Product Backlog » en vue tableau : type, points, priorité");
  tileRow(s, [["7", "User stories<br>26 pts · valeur patient"], ["1", "Story technique<br>5 pts · console FHIR"],
    ["2", "Spikes<br>5 pts · analyse"], ["6", "Tâches<br>16 pts · organisation"]], 480, 56);
  s.addShape(pres.ShapeType.rect, { x: P(60), y: P(556), w: P(3), h: P(60), fill: { color: GOLD } });
  s.addText("Le Product Backlog contient tout ce que MediBet pourrait devenir ; le Sprint Backlog, seulement ce que nous nous engageons à livrer cette semaine. 16 cartes actives, 52 points — dont 26 seulement de vraie valeur produit.",
    { x: P(76), y: P(556), w: P(1144), h: P(60), fontFace: BDY, fontSize: 11, color: SOFT,
      isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.25 });
}

/* ============================ 06 · board Trello ============================ */
{
  const s = base("02 · Démarche projet", "Le Sprint Backlog, colonne par colonne",
    "Les 16 cartes engagées, tenues à jour au fil de l'eau.", "≈50 s · 4:15",
    "RÉMI — Voici les seize cartes engagées, colonne par colonne, telles qu'elles sont ce matin : zéro à faire, deux en cours, quatorze terminées. La colonne « à faire » est vide parce que tout ce qui restait a été tiré ; les deux cartes en cours sont US-P4, la lecture FHIR du diagnostic, dont la checklist Definition of Done est à dix sur dix — il ne lui manque que le test croisé que vous allez voir en démonstration — et SPIKE-P16, la validation du cycle Patient via Postman. Le board a été tenu au fil de l'eau, à chaque Daily : il n'a pas été reconstitué la veille.",
    "RÉMI · SCRUM MASTER");
  const GREEN = "2F6F4F", BLUE = "2B4F8F", ORANGE = "B5761F", OCHRE = "8A6A1F";
  tcol(s, 60, 178, 282, 330, "À faire", "0", []);
  tcol(s, 358, 178, 282, 330, "En cours", "2", [
    ["US-P4 · lecture FHIR du diagnostic", "5", GREEN],
    ["SPIKE-P16 · cycle Patient (Postman)", "3", ORANGE]]);
  tcol(s, 656, 178, 564, 330, "Terminé", "14", [
    ["US-P1 · consulter les dossiers", "5", GREEN],
    ["US-P2 · placer un pari", "5", GREEN],
    ["US-P3 · inviter des proches", "3", GREEN],
    ["US-P5 · demande de rendez-vous", "3", GREEN],
    ["US-P6 · authentification par profil", "2", GREEN],
    ["ST-P7 · console de traçabilité FHIR", "5", BLUE],
    ["US-P8 · habillage casino", "3", GREEN],
    ["TACHE-P9 · tests d'interopérabilité", "3", OCHRE],
    ["TACHE-P10 · support de soutenance", "5", OCHRE],
    ["SPIKE-P11 · relecture INVEST", "2", ORANGE],
    ["TACHE-P12 · responsive mobile", "3", OCHRE],
    ["TACHE-P14 · Planning Poker", "2", OCHRE],
    ["TACHE-P17 · Kanban à jour", "1", OCHRE],
    ["TACHE-P18 · cérémonies Scrum", "2", OCHRE]], true);
  slot(s, 60, 524, 584, 110, "Capture du board « MediBet — Sprint Backlog Patient »");
  const gx = 660, gw = 274, gh = 50;
  [["0 · 2 · 14", "À faire · en cours<br>· terminées"], ["44 pts", "Terminés sur<br>les 52 engagés"],
   ["2", "Cartes retirées<br>en cours de sprint"], ["10/10", "Checklist DoD<br>sur US-P4"]]
    .forEach((t, i) => tile(s, gx + (i % 2) * (gw + 12), 524 + Math.floor(i / 2) * (gh + 10),
      gw, gh, t[0], t[1]));
}

/* ============================ 07 · qualité ============================ */
{
  const s = base("02 · Démarche projet", "Ce que veut dire « terminé »",
    "Les critères d'acceptation décrivent une fonctionnalité ; la Definition of Done fixe le niveau de qualité.",
    "≈60 s · 5:15",
    "NEIROUZ — Deux notions différentes, souvent confondues. Les critères d'acceptation sont propres à une story et c'est moi qui les rédige : Given une Observation publiée par le médecin, When MediBet interroge le serveur, Then le diagnostic s'affiche et le pari est résolu. Ils répondent à la question « qu'est-ce que cette story doit faire ? ». La Definition of Done, elle, est la même pour toutes les cartes et c'est l'équipe entière qui s'y engage : sept critères, dont aucun appel FHIR en erreur pendant le scénario, relecture de code, et test croisé Patient-Médecin dès qu'une story touche à l'interopérabilité. Ces sept critères sont dupliqués en checklist sur chaque carte : c'est ce qui me permet, en tant que PO, de valider ou de refuser une carte sans discuter.",
    "NEIROUZ · PRODUCT OWNER");
  panel(s, 60, 200, 564, 296, "Critères d'acceptation — US-P4", [
    "GIVEN une Observation publiée par le médecin,",
    "WHEN MediBet interroge le serveur FHIR,",
    "THEN le diagnostic s'affiche et le pari est résolu automatiquement.",
    "Propres à cette story : « qu'est-ce qu'elle doit faire ? »"]);
  panel(s, 656, 200, 564, 296, "Definition of Done — toutes les cartes", [
    "Critères d'acceptation validés",
    "Test manuel réussi",
    "Aucun appel FHIR en erreur pendant le scénario",
    "Pas de régression connue · relecture de code faite",
    "Test croisé Patient / Médecin si la story touche l'interopérabilité",
    "Documentation à jour"], GOLD, 10.5);
  s.addText("Les sept critères sont dupliqués en checklist sur chaque carte. Sur US-P4, la checklist ajoute ses trois critères d'acceptation : elle affiche donc 10/10.",
    { x: P(60), y: P(516), w: P(1160), h: P(24), fontFace: BDY, fontSize: 10.5, color: FAINT,
      align: "center", isTextBox: true, margin: 0, valign: "middle" });
}

/* ============================ 08 · pilotage Corrello ============================ */
{
  const s = base("02 · Démarche projet", "Pilotage : le burndown du sprint",
    "Nous sommes jeudi matin : le sprint se termine après cette soutenance.", "≈70 s · 6:25",
    "RÉMI — Voici notre burndown, en points restants, relevé à chaque Daily. Le pointillé doré est la trajectoire idéale, de cinquante-deux à zéro ; la ligne pleine est le réel. Nous avons pris huit points de retard dès le premier après-midi, consacré au cadrage, et nous les avons gardés jusqu'au bout : la courbe est parallèle à l'idéale, ce qui veut dire que le rythme était bon, mais que nous nous étions engagés sur un peu trop. Ce matin il reste huit points, exactement les deux cartes en cours. Elles ne disparaissent pas : elles repartent au Product Backlog. Notre vélocité est donc de quarante-quatre points sur cinquante-deux engagés, soit quatre-vingt-cinq pour cent de prédictabilité. Une précision importante : Corrello compte des cartes, pas des points — sa vélocité affiche quatorze. Les deux chiffres sont justes, ils ne mesurent simplement pas la même chose. Je passe la parole à Neirouz.",
    "RÉMI · SCRUM MASTER");
  burndown(s, 60, 182, 880, 322);
  s.addText("Pointillé doré : la trajectoire idéale, 52 vers 0. Ligne pleine : le réel, en points restants, relevé à chaque Daily.",
    { x: P(60), y: P(508), w: P(880), h: P(22), fontFace: BDY, fontSize: 10, color: FAINT,
      isTextBox: true, margin: 0, valign: "middle" });
  [["44 pts", "Vélocité du sprint<br>points terminés"], ["14", "Vélocité Corrello<br>en cartes"],
   ["8 pts", "Restants ce matin<br>US-P4 · SPIKE-P16"], ["85 %", "Prédictabilité<br>44 sur 52"]]
    .forEach((t, i) => tile(s, 960, 182 + i * 82, 260, 70, t[0], t[1]));
  s.addShape(pres.ShapeType.rect, { x: P(60), y: P(548), w: P(3), h: P(68), fill: { color: GOLD } });
  s.addText("Huit points de retard pris dès le premier après-midi — consacré au cadrage — et gardés jusqu'au bout. Le sprint se termine donc avec deux cartes non finies : elles repartent au Product Backlog. Corrello compte des cartes (vélocité 14), nous comptons des points (vélocité 44).",
    { x: P(76), y: P(548), w: P(1144), h: P(68), fontFace: BDY, fontSize: 11, color: SOFT,
      isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.25 });
}

/* ============================ 09 · produit ============================ */
{
  const s = base("03 · Analyse métier", "Le principe",
    "Un jeu où le patient parie sur son propre diagnostic — et où le diagnostic réel arrive par FHIR.",
    "≈50 s · 7:15",
    "NEIROUZ — Le patient décrit ses symptômes ; l'application croise avec soixante-trois pathologies et propose les cinq diagnostics les plus probables avec une cote. Le médecin, sur une application séparée, pose le vrai diagnostic dans une ressource FHIR. MediBet le relit et résout le pari. Deux garde-fous : l'application ne diagnostique pas, et les CoinPot n'ont aucune valeur réelle.",
    "NEIROUZ · PRODUCT OWNER");
  const cw = (1160 - 48) / 3;
  card(s, 60, 200, cw, 190, "01", "Le patient mise", "Il décrit ses symptômes, l'application lui propose les diagnostics les plus probables avec une cote, il engage ses CoinPot sur l'un d'eux.");
  card(s, 60 + cw + 24, 200, cw, 190, "02", "Le médecin publie", "Sur une application totalement séparée, il pose le vrai diagnostic et l'écrit dans une ressource Observation FHIR.");
  card(s, 60 + 2 * (cw + 24), 200, cw, 190, "03", "MediBet résout", "L'application relit le diagnostic sur le serveur FHIR et résout le pari toute seule : gain ou perte.");
  s.addText("Deux garde-fous assumés : l'application ne pose jamais de diagnostic, elle propose des probabilités ; et les CoinPot n'ont aucune valeur réelle.",
    { x: P(190), y: P(430), w: P(900), h: P(48), fontFace: BDY, fontSize: 11.5, color: SOFT,
      align: "center", isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
}

/* ============================ 10 · diagramme de cas d'usage ============================ */
{
  const s = base("03 · Analyse métier", "Diagramme de cas d'usage",
    "Trois acteurs, quatre cas d'usage, une frontière d'application.", "≈40 s · 7:55",
    "NEIROUZ — Le Patient déclenche trois des quatre cas d'usage. Le Proche n'entre que par UC2, sans identité FHIR : c'est un invité, pas un dossier médical. Le Médecin est dessiné à l'extérieur de la frontière : il agit depuis sa propre application. UC3 est le seul cas d'usage qui traverse cette frontière.",
    "NEIROUZ · PRODUCT OWNER");
  shot(s, "usecase.jpg", 60, 190, 720, 330, "");
  panel(s, 812, 220, 408, 270, "Ce que le diagramme dit", [
    "Le Patient déclenche trois des quatre cas d'usage.",
    "Le Proche n'entre que par UC2, sans identité FHIR.",
    "Le Médecin est un acteur extérieur : il agit depuis une autre application.",
    "UC3 est le seul cas d'usage à cheval sur les deux applications."], GOLD, 10.5);
}

/* ============================ 11 · cas d'usage ============================ */
{
  const s = base("03 · Analyse métier", "Nos quatre cas d'usage",
    "Numérotation propre au projet Patient : l'équipe Médecin a la sienne.", "≈60 s · 8:55",
    "NEIROUZ — UC1 : consulter son dossier et miser, avec création d'une vraie ressource Patient. UC2 : un proche rejoint le pari avec un code, sans ressource FHIR. UC3, notre cas vitrine : le pari se résout par une vraie lecture FHIR, deux applications, deux postes. UC4 : le patient demande son rendez-vous de suivi.",
    "NEIROUZ · PRODUCT OWNER");
  table(s, 60, 196, 1160, ["", "Cas d'usage", "Acteur", "Ressource FHIR", "Story"], [
    ["UC1", "Consulter son dossier et miser sur son pronostic", "Patient", "Patient — POST puis GET", "US-P1, US-P2"],
    ["UC2", "Un proche rejoint le pari à distance, avec un code", "Proche", "aucune — pari social", "US-P3"],
    ["UC3", "Le pari se résout par une vraie lecture FHIR", "Patient", "Observation — GET", "US-P4"],
    ["UC4", "Le patient demande son rendez-vous de suivi", "Patient", "Appointment — POST", "US-P5"]],
    [0.08, 0.38, 0.13, 0.24, 0.17], { rowH: 50, highlight: 2, fs: 10 });
  s.addShape(pres.ShapeType.rect, { x: P(60), y: P(432), w: P(3), h: P(72), fill: { color: GOLD } });
  s.addText("UC3 est notre cas d'usage vitrine : le seul qui exige deux applications, sur deux postes, sans aucun canal direct entre elles. Chaque cas d'usage est rédigé en détail dans le Drive : préconditions, scénario nominal, exceptions, postcondition.",
    { x: P(76), y: P(432), w: P(1144), h: P(72), fontFace: BDY, fontSize: 11, color: SOFT,
      isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.25 });
}

/* ============================ 12 · processus BPMN ============================ */
{
  const s = base("03 · Analyse métier", "Le processus métier",
    "Le parcours complet, et l'endroit précis où il sort de notre application.", "≈55 s · 9:50",
    "NEIROUZ — À gauche ce qui nous appartient : les symptômes, la mise, le proche. Au centre ce qui ne nous appartient pas : le diagnostic officiel, l'acte du médecin sur son application — nous ne savons pas quand il arrive. À droite le retour : nous interrogeons le serveur pour découvrir si une Observation existe. Romane va vous montrer comment c'est implémenté.",
    "NEIROUZ · PRODUCT OWNER");
  shot(s, "bpmn.jpg", 60, 186, 700, 340, "");
  panel(s, 792, 186, 428, 160, "Ce qui est à nous", [
    "Le dossier, les cotes, la mise, la résolution, la demande de rendez-vous.",
    "Aucune décision médicale : nous proposons des probabilités."], GOLD, 10.5);
  panel(s, 792, 366, 428, 160, "Ce qui ne l'est pas", [
    "Le diagnostic officiel : l'acte du médecin, sur son application.",
    "Nous ne savons pas quand il arrive — nous interrogeons le serveur."], GOLD, 10.5);
}

/* ============================ 13 · architecture ============================ */
{
  const s = base("04 · Utilisation de FHIR", "Deux applications, un serveur",
    "Deux dépôts, deux déploiements, deux postes. Aucun canal direct.", "≈55 s · 10:45",
    "ROMANE — Deux dépôts, deux déploiements, deux postes, aucun canal direct : si le serveur FHIR tombe, plus rien ne circule. C'est notre principale correction du sprint : au départ les deux rôles vivaient dans le même fichier, l'application marchait mais ne démontrait rien. Le test de bout en bout est passé.",
    "ROMANE · DÉVELOPPEUSE");
  const box = (x, w, y, h, fill, stroke, t1, t2, l3, l4, c1, c2) => {
    s.addShape(pres.ShapeType.rect, { x: P(x), y: P(y), w: P(w), h: P(h), fill: { color: fill },
      line: { color: stroke, width: 1.5 } });
    s.addText(t1, { x: P(x), y: P(y + 16), w: P(w), h: P(26), fontFace: DSP, fontSize: 13,
      color: c1, align: "center", isTextBox: true, margin: 0, valign: "middle" });
    s.addText(t2, { x: P(x), y: P(y + 44), w: P(w), h: P(20), fontFace: MNO, fontSize: 9,
      color: c2, align: "center", isTextBox: true, margin: 0, valign: "middle" });
    s.addText(l3 + "\n" + l4, { x: P(x + 12), y: P(y + 70), w: P(w - 24), h: P(48), fontFace: BDY,
      fontSize: 10.5, color: c1 === CREAM ? BODY : INK, align: "center", isTextBox: true,
      margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  };
  box(60, 300, 200, 150, PARCH, RED, "APPLICATION PATIENT", "medibet-fhir",
      "Crée le Patient, place le pari,", "lit l'Observation, demande le RDV", RED, "6B5A3E");
  box(490, 300, 182, 186, DARK, GOLD, "SERVEUR FHIR DU TP", "fhir.alliance4u.io",
      "Patient · Practitioner", "Observation · Appointment", CREAM, GOLD);
  box(920, 300, 200, 150, PARCH, RED, "APPLICATION MÉDECIN", "medibet-medecin-fhir",
      "Lit le dossier, publie", "l'Observation du diagnostic", RED, "6B5A3E");
  s.addText("seul canal d'échange", { x: P(490), y: P(336), w: P(300), h: P(20), fontFace: BDY,
    fontSize: 9.5, color: FAINT, align: "center", isTextBox: true, margin: 0, valign: "middle" });
  [[366, 484], [796, 914]].forEach(([x1, x2]) => {
    s.addShape(pres.ShapeType.line, { x: P(x1), y: P(275), w: P(x2 - x1), h: 0,
      line: { color: GOLD, width: 2, beginArrowType: "triangle", endArrowType: "triangle" } });
  });
  panel(s, 60, 400, 1160, 128, "Notre principale correction du sprint", [
    "Au départ, les deux rôles vivaient dans le même fichier : l'application marchait, mais elle ne démontrait rien.",
    "Nous avons séparé les deux codebases en cours de sprint — ça se voit sur le burndown, et c'est notre meilleure décision.",
    "Test de bout en bout passé : un dossier créé chez nous apparaît dans la file du médecin."], GOLD, 10.5);
}

/* ============================ 14 · ressources ============================ */
{
  const s = base("04 · Utilisation de FHIR", "Les trois étapes du TP",
    "L'énoncé demandait trois échanges. Voici comment chacun se traduit chez nous.", "≈65 s · 11:50",
    "ROMANE — Étape 1 : nous créons une ressource Patient avec un POST puis la relisons avec un GET à chaque mise ; l'application Médecin lit le Practitioner. Étape 2 : le médecin publie une Observation, et nous la relisons avec un GET filtré par patient — c'est cette lecture qui résout le pari. Étape 3 : nous créons un Appointment. L'état du jeu, lui, passe par la ressource générique Basic.",
    "ROMANE · DÉVELOPPEUSE");
  table(s, 60, 196, 1160, ["Étape", "Ressource", "Méthode", "Ce que ça fait chez nous"], [
    ["Step 1", "Patient", "POST puis GET", "L'identité FHIR du joueur, créée une fois puis relue à chaque mise"],
    ["Step 1", "Practitioner", "GET", "Le médecin, lu par son application avant de statuer"],
    ["Step 2", "Observation", "POST côté Médecin", "Le diagnostic officiel, écrit sur le serveur"],
    ["Step 2", "Observation", "GET côté Patient", "La relecture qui résout notre pari, depuis un autre poste"],
    ["Step 3", "Appointment", "POST", "La demande de rendez-vous de suivi, après le verdict"]],
    [0.11, 0.18, 0.22, 0.49], { rowH: 48, highlight: 3, fs: 10.5 });
  s.addText("Aucune autre ressource clinique n'est appelée. L'état de jeu — dossiers, paris, CoinPot — passe par la ressource générique Basic, prévue par le standard pour ce qui n'a pas de type dédié.",
    { x: P(60), y: P(482), w: P(1160), h: P(44), fontFace: BDY, fontSize: 10.5, color: FAINT,
      isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
}

/* ============================ 15 · Observation ============================ */
{
  const s = base("04 · Utilisation de FHIR", "L'Observation, attribut par attribut",
    "La ressource centrale du projet : le diagnostic qui fait autorité.", "≈80 s · 13:10",
    "ROMANE — status vaut final : le constat est définitif, c'est ce qui autorise à trancher un pari dessus. subject.reference est l'attribut pivot : c'est par lui que nous retrouvons le diagnostic. code porte le diagnostic codé, avec le system qui dit dans quelle nomenclature le lire — le nôtre est maison, assumé. effectiveDateTime date le constat. performer référence le Practitioner : la traçabilité de l'acte.",
    "ROMANE · DÉVELOPPEUSE");
  s.addShape(pres.ShapeType.rect, { x: P(60), y: P(190), w: P(536), h: P(316), fill: { color: DARK },
    line: { color: GOLD, width: 0.75, transparency: 60 } });
  const json = [
    "{", '  "resourceType": "Observation",', '  "status": "final",', '  "code": { "coding": [{',
    '      "system": "http://medibet.local/diagnostics",', '      "code": "angine",',
    '      "display": "Angine" }],', '    "text": "Angine" },',
    '  "subject": { "reference": "Patient/6a9ec7b5…" },',
    '  "effectiveDateTime": "2026-09-09T13:11:04Z",',
    '  "performer": [{ "reference": "Practitioner/6a9eb9f8…",', '      "display": "Alexandre Desoutter" }],',
    '  "valueCodeableConcept": { "text": "Angine" }', "}"];
  s.addText(json.map((l, i) => ({ text: l, options: { breakLine: i < json.length - 1 } })),
    { x: P(76), y: P(202), w: P(504), h: P(292), fontFace: MNO, fontSize: 8.5, color: BODY,
      isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.25 });
  const attrs = [
    ["status : final", "Le constat est définitif, pas une ébauche. C'est ce qui autorise le pari à se trancher dessus."],
    ["subject.reference", "L'attribut pivot : c'est par lui que le patient retrouve son diagnostic, avec un GET filtré."],
    ["code.coding", "Le diagnostic codé. Notre system est une nomenclature maison, assumée : un vrai déploiement mettrait SNOMED CT ou la CIM-10."],
    ["effectiveDateTime", "Le moment du constat. S'il y a plusieurs Observations, on garde la plus récente."],
    ["performer", "Qui a posé le diagnostic, référencé comme Practitioner : la traçabilité de l'acte."]];
  attrs.forEach((a, i) => {
    const y = 190 + i * 64;
    s.addText(a[0], { x: P(628), y: P(y), w: P(592), h: P(18), fontFace: MNO, fontSize: 9.5,
      color: CREAM, bold: true, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(a[1], { x: P(628), y: P(y + 18), w: P(592), h: P(42), fontFace: BDY, fontSize: 10,
      color: BODY, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  });
}

/* ============================ 16 · démonstration ============================ */
{
  const s = base("05 · Démonstration", "Démonstration en direct",
    "Deux postes, deux applications, un serveur. Avec l'équipe Médecin.", "≈2 min 30 · 15:40",
    "ROMANE — À gauche notre application, à droite celle du binôme, et les deux consoles FHIR ouvertes. Je décris mes symptômes : création d'un vrai Patient. Je mise. Le dossier apparaît chez le médecin, arrivé par le serveur. Il pose le diagnostic : POST Observation. Je relis : GET Observation filtré, le pari se résout. Et je récupère mon rendez-vous : POST Appointment. La boucle est bouclée uniquement à travers le standard.",
    "ROMANE · DÉVELOPPEUSE");
  const steps = [
    ["01", "Poste patient", "Je décris mes symptômes, l'application crée un vrai Patient FHIR et propose les cotes."],
    ["02", "Poste patient", "Je mise, puis un proche rejoint le pari avec le code du dossier."],
    ["03", "Poste médecin", "Le dossier apparaît dans leur file d'attente, arrivé par le serveur FHIR."],
    ["04", "Poste médecin", "Le médecin pose le diagnostic : POST Observation, visible dans leur console."],
    ["05", "Poste patient", "Je relis l'Observation : le pari se résout, puis je demande mon rendez-vous."]];
  const w = (1160 - 4 * 16) / 5;
  steps.forEach((st, i) => {
    const x = 60 + i * (w + 16);
    s.addShape(pres.ShapeType.rect, { x: P(x), y: P(196), w: P(w), h: P(178), fill: { color: PARCH },
      shadow: shadow(6) });
    s.addText(st[0], { x: P(x + 14), y: P(208), w: P(w - 28), h: P(26), fontFace: DSP, fontSize: 17,
      color: "C08B1E", isTextBox: true, margin: 0, valign: "middle" });
    s.addText(st[1].toUpperCase(), { x: P(x + 14), y: P(238), w: P(w - 28), h: P(16), fontFace: MNO,
      fontSize: 7.5, color: RED, bold: true, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(st[2], { x: P(x + 14), y: P(258), w: P(w - 28), h: P(104), fontFace: BDY,
      fontSize: 9.5, color: INK, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
  });
  panel(s, 60, 400, 564, 132, "Ce qu'il faut regarder", [
    "La console FHIR, en bas à droite : chaque ligne est un appel réseau réel.",
    "Les deux écrans ne se parlent jamais : tout passe par fhir.alliance4u.io.",
    "Le verdict tombe côté patient sans aucune action du médecin sur notre poste."], CREAM, 10.5);
  panel(s, 656, 400, 564, 132, "Si le réseau lâche", [
    "Repli prévu : captures d'écran du même scénario, déjà rejoué ce matin.",
    "Les ressources créées restent vérifiables directement sur le serveur."], CREAM, 10.5);
}

/* ============================ 17 · bilan ============================ */
{
  const s = base("06 · Bilan", "Rétrospective et suites",
    "Ce que le sprint nous a appris, et ce que nous ferions ensuite.", "≈55 s · 16:35",
    "RÉMI — Je referme sur la rétrospective, que j'anime en tant que Scrum Master. Ce qui a bien marché : les appels FHIR ont fonctionné dès les premiers essais, et le copilote nous a fait gagner du temps. Ce qui a été difficile : plusieurs bugs ne sont apparus qu'en test croisé avec l'équipe Médecin, c'est-à-dire tard ; et séparer les deux applications en cours de sprint nous a coûté une demi-journée. Ce que nous ferions autrement : séparer les deux applications dès le premier jour, et écrire les critères d'acceptation au Sprint Planning plutôt qu'après coup. Et si nous avions un sprint de plus, trois améliorations dans cet ordre : coder les diagnostics en SNOMED CT ou en CIM-10, pour être compris par un autre système que le nôtre ; authentifier les échanges avec SMART on FHIR ; et remplacer notre interrogation du serveur toutes les sept secondes par une Subscription FHIR.",
    "RÉMI · SCRUM MASTER");
  const pw = (1160 - 36) / 3;
  panel(s, 60, 190, pw, 150, "Ce qui a bien marché", [
    "Les appels FHIR ont fonctionné dès les premiers essais.",
    "Le copilote a accéléré le développement et le déploiement."], "9FD6A8", 10.5);
  panel(s, 60 + pw + 18, 190, pw, 150, "Ce qui a été difficile", [
    "Des bugs découverts seulement en test croisé avec l'équipe Médecin.",
    "Séparer les deux applications en cours de route a coûté du temps."], "E8B06A", 10.5);
  panel(s, 60 + 2 * (pw + 18), 190, pw, 150, "Ce qu'on ferait autrement", [
    "Séparer les deux applications dès le premier jour.",
    "Écrire les critères d'acceptation au Sprint Planning."], "E88A7A", 10.5);
  panel(s, 60, 362, 1160, 172, "Les trois améliorations du prochain sprint", [
    "Coder les diagnostics en SNOMED CT ou CIM-10 — notre nomenclature est maison : c'est le principal frein à une interopérabilité sémantique réelle.",
    "Authentifier avec SMART on FHIR — le serveur du TP est ouvert ; impensable sur de la donnée réelle.",
    "Remplacer le sondage par une Subscription FHIR — nous interrogeons le serveur toutes les 7 secondes faute de notification."], GOLD, 10.5);
}

/* ============================ 18 · merci ============================ */
{
  const s = pres.addSlide();
  s.background = { path: BG };
  s.addText("MERCI POUR\nVOTRE ATTENTION", { x: P(60), y: P(190), w: P(1160), h: P(180),
    fontFace: DSP, fontSize: 54, color: CREAM, align: "center", isTextBox: true, margin: 0,
    valign: "middle", lineSpacingMultiple: 1.05, shadow: shadow(6) });
  s.addText("Vos questions", { x: P(60), y: P(392), w: P(1160), h: P(32), fontFace: BDY,
    fontSize: 16, color: GOLD, align: "center", isTextBox: true, margin: 0, valign: "middle" });
  s.addShape(pres.ShapeType.line, { x: P(560), y: P(444), w: P(160), h: 0,
    line: { color: CREAM, width: 0.75, transparency: 50 } });
  s.addText("romanecano.github.io/medibet-fhir\nromanecano.github.io/medibet-fhir/fhir-medibet.html — le dossier FHIR détaillé\ngithub.com/RomaneCano/medibet-fhir",
    { x: P(60), y: P(468), w: P(1160), h: P(80), fontFace: MNO, fontSize: 9.5, color: BODY,
      align: "center", isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.5 });
  s.addText("≈15 s · 16:50", { x: P(1000), y: P(694), w: P(258), h: P(20), fontFace: MNO,
    fontSize: 7.5, color: FAINT, align: "right", isTextBox: true, margin: 0, valign: "middle" });
  s.addNotes("LES TROIS — Merci de votre attention. Le code, l'application et le dossier technique FHIR sont accessibles aux adresses affichées. Nous sommes à votre disposition pour vos questions.");
}

pres.writeFile({ fileName: "Soutenance-MediBet.pptx" }).then(f => console.log("écrit :", f));
