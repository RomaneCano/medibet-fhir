#!/usr/bin/env python3
# Génère les planches .dc.html de la soutenance MediBet (template casino repris à l'identique).
# Chiffres relevés sur le board Trello « MediBet - Sprint Backlog Patient » et sur Corrello
# le 09/09 : 18 cartes au Planning, 2 retirées, 16 actives (0 à faire / 2 en cours / 14 terminées),
# 52 points actifs dont 44 terminés, 7 user stories pour 26 points.
import json, pathlib

OUT = pathlib.Path("/home/user/soutenance")

HEAD = """<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
  <style>
    body { margin: 0; }
    a { color: #d9a521; text-decoration: none; }
    a:hover { color: #f0c651; }
    .dsp { font-family: Anton, Impact, "Haettenschweiler", sans-serif; letter-spacing: .01em; }
    .bdy { font-family: Barlow, "Helvetica Neue", Arial, sans-serif; }
    .mno { font-family: "IBM Plex Mono", Menlo, Consolas, monospace; }
  </style>
</helmet>
"""

FOOT = """</x-dc>
</body>
</html>
"""

FELT = ("background:"
        "repeating-linear-gradient(45deg, rgba(255,255,255,.014) 0 2px, transparent 2px 46px),"
        "repeating-linear-gradient(-45deg, rgba(255,255,255,.014) 0 2px, transparent 2px 46px),"
        "radial-gradient(120% 90% at 50% 12%, #14503c 0%, #0d3b2e 46%, #08281e 100%);")
CREAM = "#f3e4b0"
CREAM_SOFT = "#e6dcbe"
BODY = "#cfdfd2"
GOLD = "#d9a521"
RED = "#a02c1e"
PARCH = "#f4e3ab"
INK = "#2a2016"


def shell(eyebrow, title, subtitle, inner, timing, speaker=""):
    sub = ""
    if subtitle:
        sub = (f'<div class="bdy" style="text-align:center;color:{CREAM_SOFT};font-size:18px;'
               f'margin-top:9px;max-width:860px;margin-left:auto;margin-right:auto;">{subtitle}</div>')
    eyeb = (f'<div class="mno" style="text-align:center;color:{GOLD};font-size:12px;'
            f'letter-spacing:.42em;text-transform:uppercase;">{eyebrow}</div>')
    ttl = (f'<div class="dsp" style="text-align:center;color:{CREAM};font-size:48px;'
           f'margin-top:6px;text-shadow:4px 4px 0 {RED};text-transform:uppercase;">{title}</div>')
    spk = (f'<span class="mno" style="color:{GOLD};font-size:11px;letter-spacing:.14em;'
           f'text-transform:uppercase;">{speaker}</span>') if speaker else '<span></span>'
    return (HEAD +
            f'<div style="position:relative;width:1280px;height:720px;overflow:hidden;{FELT}">'
            '<div style="position:absolute;top:0;left:0;right:0;height:12px;background:#061711;"></div>'
            '<div style="position:absolute;bottom:0;left:0;right:0;height:26px;background:#061711;'
            'border-top:2px solid ' + RED + ';display:flex;align-items:center;justify-content:space-between;'
            'padding:0 22px;box-sizing:border-box;">'
            + spk +
            '<span class="mno" style="color:#8fae95;font-size:11px;">'
            'romanecano.github.io/medibet-fhir</span>'
            f'<span class="mno" style="color:#8fae95;font-size:11px;">{timing}</span>'
            '</div>'
            '<div style="position:absolute;top:36px;left:60px;right:60px;bottom:48px;display:flex;'
            'flex-direction:column;">'
            + eyeb + ttl + sub +
            f'<div style="flex-grow:1;margin-top:22px;display:flex;flex-direction:column;'
            f'justify-content:center;">{inner}</div>'
            '</div></div>' + FOOT)


def card(num, title, text):
    return (f'<div style="background:{PARCH};box-shadow:7px 7px 0 {RED};padding:19px 21px;flex-grow:1;">'
            f'<div class="dsp" style="color:#c08b1e;font-size:29px;line-height:1;">{num}</div>'
            f'<div class="mno" style="color:{RED};font-size:12.5px;font-weight:600;letter-spacing:.1em;'
            f'text-transform:uppercase;margin-top:9px;">{title}</div>'
            f'<div class="bdy" style="color:{INK};font-size:14.5px;line-height:1.5;margin-top:8px;">{text}</div>'
            '</div>')


def tile(big, label):
    return (f'<div style="background:{PARCH};box-shadow:5px 5px 0 {RED};padding:12px 15px;display:flex;'
            'align-items:center;justify-content:space-between;gap:12px;">'
            f'<span class="dsp" style="color:{RED};font-size:26px;line-height:1;white-space:nowrap;">{big}</span>'
            f'<span class="mno" style="color:{INK};font-size:10.5px;font-weight:600;letter-spacing:.08em;'
            f'text-transform:uppercase;text-align:right;line-height:1.35;">{label}</span></div>')


def th(txt):
    return (f'<th class="mno" style="text-align:left;color:{GOLD};font-size:11.5px;letter-spacing:.16em;'
            f'text-transform:uppercase;font-weight:600;padding:0 14px 10px 0;'
            f'border-bottom:1px solid rgba(217,165,33,.5);">{txt}</th>')


def table(headers, rows, highlight=None, col_widths=None, fs=15):
    ws = col_widths or []
    head = "".join(th(h) for h in headers)
    body = ""
    for i, r in enumerate(rows):
        bg = "background:rgba(244,227,171,.08);" if highlight is not None and i == highlight else ""
        bd = (f"border-left:3px solid {GOLD};" if highlight is not None and i == highlight
              else "border-left:3px solid transparent;")
        cells = ""
        for j, c in enumerate(r):
            style = (f'padding:10px 14px 10px {"11px" if j == 0 else "0"};color:{BODY};font-size:{fs}px;'
                     'border-bottom:1px solid rgba(255,255,255,.07);vertical-align:top;')
            cls = "bdy"
            if j == 0:
                style += f"color:{CREAM};font-weight:700;font-size:{fs+1}px;"
                cls = "dsp"
            cells += f'<td class="{cls}" style="{style}">{c}</td>'
        body += f'<tr style="{bg}{bd}">{cells}</tr>'
    colgroup = "".join(f'<col style="width:{w}">' for w in ws) if ws else ""
    return (f'<table style="width:100%;border-collapse:collapse;table-layout:fixed;">{colgroup}'
            f'<thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>')


def panel(title, items, accent=GOLD, fs=15):
    lis = "".join(f'<li style="margin-bottom:8px;">{i}</li>' for i in items)
    return (f'<div style="border:1px solid rgba(217,165,33,.35);padding:16px 20px;flex-grow:1;'
            'background:rgba(6,23,17,.35);">'
            f'<div class="mno" style="color:{accent};font-size:11.5px;letter-spacing:.16em;'
            f'text-transform:uppercase;font-weight:600;">{title}</div>'
            f'<ul class="bdy" style="color:{BODY};font-size:{fs}px;line-height:1.5;margin:12px 0 0;'
            'padding-left:18px;">' + lis + '</ul></div>')


def shot(src, caption, height=330):
    """Une capture d'écran réelle, encadrée comme une pièce à conviction."""
    return (f'<div style="display:flex;flex-direction:column;gap:8px;flex-grow:1;min-width:0;">'
            f'<div style="background:{PARCH};box-shadow:6px 6px 0 {RED};padding:8px;">'
            f'<img src="{src}" style="display:block;width:100%;height:{height}px;object-fit:contain;'
            'background:#10221b;">'
            '</div>'
            f'<div class="bdy" style="color:#8fae95;font-size:13px;">{caption}</div></div>')


def slot(label, height=300):
    """Cadre réservé à une capture que l'équipe collera elle-même."""
    return (f'<div style="border:2px dashed {GOLD};background:rgba(6,23,17,.45);height:{height}px;'
            'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;'
            'flex-grow:1;min-width:0;padding:0 14px;box-sizing:border-box;">'
            f'<div class="mno" style="color:{GOLD};font-size:12px;font-weight:600;letter-spacing:.12em;'
            'text-transform:uppercase;text-align:center;">Coller la capture ici</div>'
            f'<div class="bdy" style="color:{BODY};font-size:13px;text-align:center;line-height:1.4;">{label}</div>'
            '</div>')


def shot_todo(label, height=330):
    """Emplacement réservé à une capture pas encore déposée dans le Drive."""
    return (f'<div style="display:flex;flex-direction:column;gap:8px;flex-grow:1;min-width:0;">'
            f'<div style="border:2px dashed {GOLD};background:rgba(6,23,17,.5);height:{height+16}px;'
            'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;">'
            f'<div class="dsp" style="color:{GOLD};font-size:22px;">CAPTURE À INSÉRER</div>'
            f'<div class="bdy" style="color:{BODY};font-size:14px;text-align:center;max-width:80%;">{label}</div>'
            '</div></div>')



def column(title, count, cards, grow=1, two=False):
    """Une colonne du board Trello, reprise carte par carte."""
    item = ('<div style="background:#fdf6e0;border-left:4px solid {c2};padding:5px 8px;">'
            '<span class="bdy" style="color:' + INK + ';font-size:11.5px;font-weight:600;">{c0}</span>'
            '<span class="mno" style="color:#7a6a48;font-size:10.5px;float:right;">{c1}</span></div>')
    items = "".join(item.format(c0=c[0], c1=c[1], c2=c[2]) for c in cards) or (
        '<div class="bdy" style="color:#8a7d5e;font-size:13px;font-style:italic;padding:10px 2px;">'
        'aucune carte — tout est engagé</div>')
    wrap = ('display:grid;grid-template-columns:1fr 1fr;gap:5px;' if two
            else 'display:flex;flex-direction:column;gap:5px;')
    return (f'<div style="background:{PARCH};box-shadow:6px 6px 0 {RED};padding:12px 13px;'
            f'flex:{grow} 1 0;display:flex;flex-direction:column;min-width:0;">'
            '<div style="display:flex;justify-content:space-between;align-items:baseline;'
            'border-bottom:1px solid rgba(160,44,30,.3);padding-bottom:7px;margin-bottom:9px;">'
            f'<span class="mno" style="color:{RED};font-size:12px;font-weight:600;letter-spacing:.09em;'
            f'text-transform:uppercase;">{title}</span>'
            f'<span class="dsp" style="color:#c08b1e;font-size:22px;line-height:1;">{count}</span></div>'
            f'<div style="{wrap}">{items}</div></div>')


def corrello_svg():
    """Burndown du sprint en points, sur les six demi-journées. Dernier relevé : jeudi matin,
       avant la Sprint Review — 8 points restants (US-P4 et SPIKE-P16)."""
    xs = ["dép.", "lun PM", "mar AM", "mar PM", "mer AM", "mer PM", "jeu AM"]
    real = [52, 52, 42, 34, 26, 16, 8]
    W, H, L, R, T, B = 720, 320, 56, 26, 26, 46
    n = len(xs) - 1
    def px(i): return L + i * (W - L - R) / n
    def py(v): return T + (1 - v / 52) * (H - T - B)
    ideal = " ".join(f"{px(i):.1f},{py(52 - 52 * i / n):.1f}" for i in range(n + 1))
    realp = " ".join(f"{px(i):.1f},{py(v):.1f}" for i, v in enumerate(real))
    dots = "".join(f'<circle cx="{px(i):.1f}" cy="{py(v):.1f}" r="4" fill="{CREAM}"></circle>'
                   for i, v in enumerate(real))
    grid = "".join(
        f'<line x1="{L}" y1="{py(v):.1f}" x2="{W - R}" y2="{py(v):.1f}" stroke="rgba(255,255,255,.09)"></line>'
        f'<text x="{L - 12}" y="{py(v) + 5:.1f}" text-anchor="end" font-size="13" fill="{CREAM}" '
        f'font-family="Anton, sans-serif">{v}</text>' for v in [52, 26, 8, 0])
    labels = "".join(
        f'<text x="{px(i):.1f}" y="{H - 22}" text-anchor="middle" font-size="11.5" fill="#9fbfa6" '
        f'font-family="IBM Plex Mono, monospace">{x}</text>' for i, x in enumerate(xs))
    lx, ly = px(n), py(8)
    return (f'<svg viewBox="0 0 {W} {H}" style="width:100%;height:auto;" role="img" '
            'aria-label="Burndown en points : 52 engagés, 44 terminés, 8 restants jeudi matin">'
            + grid + labels +
            f'<polyline points="{ideal}" fill="none" stroke="{GOLD}" stroke-width="2" stroke-dasharray="7 6"></polyline>'
            f'<polyline points="{realp}" fill="none" stroke="{CREAM}" stroke-width="3"></polyline>' + dots +
            f'<circle cx="{lx:.1f}" cy="{ly:.1f}" r="7.5" fill="none" stroke="{CREAM}" stroke-width="3"></circle>'
            f'<line x1="{lx:.1f}" y1="{ly - 12:.1f}" x2="{lx:.1f}" y2="{py(52) + 4:.1f}" '
            f'stroke="{CREAM}" stroke-width="1" stroke-dasharray="3 4" opacity=".55"></line>'
            f'<text x="{lx - 8:.1f}" y="{py(52) + 16:.1f}" text-anchor="end" font-size="12.5" fill="{CREAM}" '
            'font-family="Barlow, sans-serif">nous sommes ici · 8 pts restants</text>'
            f'<text x="{px(0) + 8:.1f}" y="{py(52) - 8:.1f}" font-size="11.5" fill="{GOLD}" '
            'font-family="IBM Plex Mono, monospace">52 PTS ENGAGÉS</text>'
            '</svg>')


SLIDES = {}

# ---------------------------------------------------------------- 01 titre
SLIDES["Main"] = (HEAD +
    f'<div style="position:relative;width:1280px;height:720px;overflow:hidden;{FELT}">'
    '<div style="position:absolute;top:0;left:0;right:0;height:12px;background:#061711;"></div>'
    '<svg viewBox="0 0 100 100" style="position:absolute;top:96px;left:74px;width:132px;height:132px;opacity:.85;">'
    '<circle cx="50" cy="50" r="48" fill="#0d3b2e"></circle>'
    '<path d="M50 50 L50 2 A48 48 0 0 1 84 16 Z" fill="#7f8f3a"></path>'
    '<path d="M50 50 L84 84 A48 48 0 0 1 50 98 Z" fill="#7f8f3a"></path>'
    '<path d="M50 50 L98 50 A48 48 0 0 1 84 84 Z" fill="#4a5c22"></path>'
    '<path d="M50 50 L16 84 A48 48 0 0 1 2 50 Z" fill="#4a5c22"></path>'
    '<path d="M50 50 L2 50 A48 48 0 0 1 16 16 Z" fill="#7f8f3a"></path>'
    '<circle cx="50" cy="50" r="9" fill="#061711"></circle></svg>'
    '<svg viewBox="0 0 100 100" style="position:absolute;bottom:126px;right:86px;width:104px;height:104px;opacity:.8;">'
    '<circle cx="50" cy="50" r="48" fill="#3a1512"></circle>'
    '<path d="M50 50 L50 2 A48 48 0 0 1 84 16 Z" fill="#7d241b"></path>'
    '<path d="M50 50 L84 84 A48 48 0 0 1 50 98 Z" fill="#7d241b"></path>'
    '<path d="M50 50 L2 50 A48 48 0 0 1 16 16 Z" fill="#7d241b"></path>'
    '<circle cx="50" cy="50" r="9" fill="#061711"></circle></svg>'
    '<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;'
    'align-items:center;justify-content:center;">'
    f'<div class="dsp" style="color:{CREAM};font-size:118px;line-height:.95;text-shadow:7px 7px 0 {RED};">MEDIBET</div>'
    f'<div class="dsp" style="color:{GOLD};font-size:36px;margin-top:8px;letter-spacing:.06em;">ÉQUIPE PATIENT</div>'
    '<div style="width:160px;height:1px;background:rgba(244,227,171,.5);margin:26px 0 22px;"></div>'
    '<div class="mno" style="display:flex;gap:40px;color:#cfdfd2;font-size:13.5px;letter-spacing:.08em;">'
    '<span>NEIROUZ ATTIA · PRODUCT OWNER</span><span>RÉMI DELARUE · SCRUM MASTER</span>'
    '<span>ROMANE CANO · DÉVELOPPEUSE</span></div>'
    '<div class="bdy" style="color:#8fae95;font-size:14px;margin-top:30px;">'
    'Maîtrise des technologies de l\'interopérabilité — session 2026</div>'
    '</div>'
    '<div style="position:absolute;bottom:0;left:0;right:0;height:26px;background:#061711;'
    f'border-top:2px solid {RED};display:flex;align-items:center;justify-content:space-between;'
    'padding:0 22px;box-sizing:border-box;">'
    '<span class="mno" style="color:#8fae95;font-size:11px;">romanecano.github.io/medibet-fhir · github.com/RomaneCano/medibet-fhir</span>'
    '<span class="mno" style="color:#8fae95;font-size:11px;">≈20 s · 0:20</span></div>'
    '</div>' + FOOT)

# ---------------------------------------------------------------- 02 cadrage
SLIDES["Cadrage"] = shell(
    "00 · Cadrage", "Le TP et notre plan",
    "Ce qui était demandé, et l'ordre dans lequel nous allons y répondre.",
    '<div style="display:flex;gap:32px;height:100%;">'
    + panel("La consigne", [
        "Créer une <b>application interopérable</b> en équipe agile de 2 à 3 personnes.",
        "Choisir un rôle : <b>Patient</b> ou <b>Médecin</b>. Nous sommes l'équipe Patient.",
        "Construire l'application <b>autour de la plateforme FHIR</b> fournie.",
        "Restituer : organisation, démarche, analyse métier, FHIR, démonstration.",
    ])
    + '<div style="border:1px solid rgba(217,165,33,.35);padding:16px 20px;flex-grow:1;background:rgba(6,23,17,.35);">'
      f'<div class="mno" style="color:{GOLD};font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;">Notre plan</div>'
      + "".join(
        '<div style="display:flex;gap:14px;align-items:baseline;margin-top:13px;">'
        f'<span class="dsp" style="color:{RED};font-size:21px;min-width:30px;">{n}</span>'
        f'<span class="bdy" style="color:{BODY};font-size:15.5px;">{t}</span></div>'
        for n, t in [("01", "Organisation de l'équipe"), ("02", "Démarche projet — Scrum"),
                     ("03", "Analyse métier"), ("04", "Utilisation de FHIR"),
                     ("05", "Démonstration en direct avec l'équipe Médecin")])
      + '</div></div>',
    "≈30 s · 0:50", "RÉMI · SCRUM MASTER")

# ---------------------------------------------------------------- 03 équipe
SLIDES["Equipe"] = shell(
    "01 · Organisation de l'équipe", "Trois rôles, trois responsabilités",
    "Une équipe de trois personnes, un rôle Scrum chacun, tenus du début à la fin du sprint.",
    '<div style="display:flex;gap:24px;">'
    + card("PO", "Neirouz Attia", "Porte la valeur produit : rédige et priorise le backlog, "
           "définit les critères d'acceptation, valide ce qui est livré.")
    + card("SM", "Rémi Delarue", "Garant du cadre : anime les cérémonies, tient le board à jour, "
           "lève les blocages, suit le burndown.")
    + card("DEV", "Romane Cano", "Réalise : développe les deux applications, teste les appels FHIR, "
           "déploie et documente.")
    + '</div>'
    + '<div style="display:flex;gap:13px;margin-top:30px;">'
    + "".join(tile(b, l) for b, l in [
        ("Trello", "2 boards :<br>produit et sprint"), ("Corrello", "Burndown<br>et vélocité"),
        ("Drive", "Documents<br>d'équipe"), ("GitHub", "Code et<br>déploiement")])
    + '</div>'
    + '<div class="bdy" style="color:#8fae95;font-size:14px;margin-top:22px;text-align:center;">'
      'Claude a servi de copilote de développement et de rédaction. Les décisions produit '
      'sont restées celles de l\'équipe.</div>',
    "≈50 s · 1:40", "RÉMI · SCRUM MASTER")

# ---------------------------------------------------------------- 04 scrum
SLIDES["Scrum"] = shell(
    "02 · Démarche projet", "Scrum sur un sprint unique",
    "Un sprint de trois jours, du lundi après-midi au jeudi matin.",
    table(["Cérémonie", "Quand", "Ce qu'on y a fait"],
          [["Sprint Planning", "Lundi PM", "Cadrage du concept, découpage en user stories, priorisation par le Product Owner"],
           ["Daily Meeting", "Chaque demi-journée", "Tour de table de moins de 15 minutes : fait, à faire, blocages"],
           ["Planning Poker", "Mercredi", "Estimation collective en points ; le PO clarifie le besoin, l'équipe vote"],
           ["Sprint Review", "Jeudi AM", "Démonstration en conditions réelles avec l'équipe Médecin, sur deux postes"],
           ["Rétrospective", "Jeudi AM", "Bilan à froid animé par le Scrum Master"]],
          col_widths=["21%", "20%", "59%"])
    + '<div class="bdy" style="color:#8fae95;font-size:14px;margin-top:18px;">'
      'Six Daily Meetings sur les six demi-journées du sprint. Sur trois jours, le Sprint Backlog '
      'représente presque tout le projet.</div>',
    "≈45 s · 2:25", "RÉMI · SCRUM MASTER")

# ---------------------------------------------------------------- 05 backlog
SLIDES["Backlog"] = shell(
    "02 · Démarche projet", "Le Product Backlog",
    "Priorisé par la valeur pour le patient, puis typé carte par carte.",
    '<div style="display:flex;gap:22px;align-items:stretch;">'
    + shot("storymap.jpg", "Notre story map : les cartes classées par type, pas par ordre d\'arrivée.", 268)
    + slot("Capture du board « Product Backlog »<br>(vue tableau : type, points, priorité)", 268)
    + '</div>'
    + '<div style="display:flex;gap:13px;margin-top:22px;">'
    + "".join(tile(b, l) for b, l in [
        ("7", "User stories<br>26 pts · valeur patient"),
        ("1", "Story technique<br>5 pts · console FHIR"),
        ("2", "Spikes<br>5 pts · analyse"),
        ("6", "Tâches<br>16 pts · organisation")])
    + '</div>'
    + f'<div class="bdy" style="color:{CREAM_SOFT};font-size:14.5px;margin-top:20px;'
      f'border-left:3px solid {GOLD};padding-left:14px;">'
      'Le Product Backlog contient tout ce que MediBet pourrait devenir ; le Sprint Backlog, '
      'seulement ce que nous nous engageons à livrer cette semaine. <b>16 cartes actives, 52 points</b> '
      '— dont 26 seulement de vraie valeur produit.</div>',
    "≈60 s · 3:25", "NEIROUZ · PRODUCT OWNER")

# ---------------------------------------------------------------- 06 le board en vrai
SLIDES["BoardTrello"] = shell(
    "02 · Démarche projet", "Le Sprint Backlog, colonne par colonne",
    "Les 16 cartes engagées, tenues à jour au fil de l\'eau.",
    '<div style="display:flex;gap:16px;height:330px;">'
    + column("À faire", "0", [])
    + column("En cours", "2", [
        ("US-P4 · lecture FHIR du diagnostic", "5", "#2f6f4f"),
        ("SPIKE-P16 · cycle Patient via Postman", "3", "#b5761f")])
    + column("Terminé", "14", grow=2, two=True, cards=[
        ("US-P1 · consulter les dossiers", "5", "#2f6f4f"),
        ("US-P2 · placer un pari", "5", "#2f6f4f"),
        ("US-P3 · inviter des proches", "3", "#2f6f4f"),
        ("US-P5 · demande de rendez-vous", "3", "#2f6f4f"),
        ("US-P6 · authentification par profil", "2", "#2f6f4f"),
        ("ST-P7 · console de traçabilité FHIR", "5", "#2b4f8f"),
        ("US-P8 · habillage casino", "3", "#2f6f4f"),
        ("TACHE-P9 · tests d\'interopérabilité", "3", "#8a6a1f"),
        ("TACHE-P10 · support de soutenance", "5", "#8a6a1f"),
        ("SPIKE-P11 · relecture INVEST", "2", "#b5761f"),
        ("TACHE-P12 · responsive mobile", "3", "#8a6a1f"),
        ("TACHE-P14 · Planning Poker", "2", "#8a6a1f"),
        ("TACHE-P17 · Kanban à jour", "1", "#8a6a1f"),
        ("TACHE-P18 · cérémonies Scrum", "2", "#8a6a1f")])
    + '</div>'
    + '<div style="display:flex;gap:16px;margin-top:18px;align-items:stretch;">'
    + slot("Capture du board « MediBet — Sprint Backlog Patient »", 96)
    + '<div style="width:520px;display:grid;grid-template-columns:1fr 1fr;gap:11px;">'
    + tile("0 · 2 · 14", "À faire · en cours<br>· terminées") + tile("44 pts", "Terminés sur<br>les 52 engagés")
    + tile("2", "Cartes retirées<br>en cours de sprint") + tile("10/10", "Checklist DoD<br>sur US-P4")
    + '</div></div>',
    "≈50 s · 4:15", "RÉMI · SCRUM MASTER")

# ---------------------------------------------------------------- 07 qualité
SLIDES["Qualite"] = shell(
    "02 · Démarche projet", "Ce que veut dire « terminé »",
    "Deux notions différentes, souvent confondues : les critères d'acceptation décrivent une "
    "fonctionnalité, la Definition of Done fixe le niveau de qualité.",
    '<div style="display:flex;gap:24px;">'
    + panel("Critères d'acceptation — US-P4", [
        "<b>GIVEN</b> une Observation publiée par le médecin,",
        "<b>WHEN</b> MediBet interroge le serveur FHIR,",
        "<b>THEN</b> le diagnostic s'affiche et le pari est résolu automatiquement.",
        "Propres à <i>cette</i> story : ils répondent à « qu'est-ce qu'elle doit faire ? »",
    ])
    + panel("Definition of Done — commune à toutes les cartes", [
        "Critères d'acceptation validés",
        "Test manuel réussi",
        "Aucun appel FHIR en erreur pendant le scénario",
        "Pas de régression connue · relecture de code faite",
        "Test croisé Patient / Médecin si la story touche l'interopérabilité",
        "Documentation à jour",
    ])
    + '</div>'
    + f'<div class="bdy" style="color:#8fae95;font-size:14px;margin-top:20px;text-align:center;">'
      'Les sept critères sont dupliqués en checklist sur chaque carte. Sur US-P4, la checklist '
      "ajoute ses trois critères d'acceptation : elle affiche donc 10/10.</div>",

    "≈60 s · 5:15", "NEIROUZ · PRODUCT OWNER")

# ---------------------------------------------------------------- 08 pilotage / corrello
SLIDES["Pilotage"] = shell(
    "02 · Démarche projet", "Pilotage : le burndown du sprint",
    "Nous sommes jeudi matin : le sprint se termine après cette soutenance.",
    '<div style="display:flex;gap:22px;align-items:stretch;">'
    '<div style="flex-grow:1;border:1px solid rgba(217,165,33,.35);background:rgba(6,23,17,.35);'
    'padding:14px 16px;">' + corrello_svg() +
    f'<div class="bdy" style="color:#8fae95;font-size:12.5px;margin-top:4px;">'
    'Pointillé doré : la trajectoire idéale, 52 vers 0. Ligne pleine : le réel, en <b>points restants</b>, '
    'relevé à chaque Daily.</div></div>'
    '<div style="width:300px;display:flex;flex-direction:column;gap:11px;">'
    + tile("44 pts", "Vélocité du sprint<br>points terminés")
    + tile("14", "Vélocité Corrello<br>en cartes")
    + tile("8 pts", "Restants ce matin<br>US-P4 · SPIKE-P16")
    + tile("85 %", "Prédictabilité<br>44 sur 52")
    + '</div></div>'
    + f'<div class="bdy" style="color:{CREAM_SOFT};font-size:14px;margin-top:18px;'
      f'border-left:3px solid {GOLD};padding-left:14px;">'
      'Nous avons pris huit points de retard dès le premier après-midi — consacré au cadrage — et nous '
      'les avons gardés jusqu\'au bout. Le sprint se termine donc avec <b>deux cartes non finies</b> : '
      'elles ne disparaissent pas, elles repartent au Product Backlog. <b>Corrello compte des cartes</b> '
      '(vélocité 14), <b>nous comptons des points</b> (vélocité 44).</div>',
    "≈70 s · 6:25", "RÉMI · SCRUM MASTER")

# ---------------------------------------------------------------- 09 produit
SLIDES["Produit"] = shell(
    "03 · Analyse métier", "Le principe",
    "Un jeu où le patient parie sur son propre diagnostic — et où le diagnostic réel arrive par FHIR.",
    '<div style="display:flex;gap:24px;">'
    + card("01", "Le patient mise", "Il décrit ses symptômes, l'application lui propose les diagnostics "
           "les plus probables avec une cote, il engage ses CoinPot sur l'un d'eux.")
    + card("02", "Le médecin publie", "Sur une application totalement séparée, il pose le vrai "
           "diagnostic et l'écrit dans une ressource Observation FHIR.")
    + card("03", "MediBet résout", "L'application relit le diagnostic sur le serveur FHIR et résout "
           "le pari toute seule : gain ou perte.")
    + '</div>'
    + f'<div class="bdy" style="color:{CREAM_SOFT};font-size:15px;margin-top:28px;text-align:center;'
      'max-width:900px;margin-left:auto;margin-right:auto;">'
      'Deux garde-fous assumés : l\'application ne pose jamais de diagnostic, elle propose des '
      'probabilités ; et les CoinPot n\'ont aucune valeur réelle.</div>',
    "≈50 s · 7:15", "NEIROUZ · PRODUCT OWNER")

# ---------------------------------------------------------------- 10 diagramme de cas d'usage
SLIDES["CasUsageUML"] = shell(
    "03 · Analyse métier", "Diagramme de cas d'usage",
    "Trois acteurs, quatre cas d'usage, une frontière d'application.",
    '<div style="display:flex;gap:24px;align-items:stretch;">'
    + shot("usecase.jpg", "", 340)
    + '<div style="width:360px;display:flex;flex-direction:column;justify-content:center;">'
    + panel("Ce que le diagramme dit", [
        "Le <b>Patient</b> déclenche trois des quatre cas d'usage.",
        "Le <b>Proche</b> n'entre que par UC2, et sans identité FHIR.",
        "Le <b>Médecin</b> est un acteur <i>extérieur</i> : il agit depuis une autre application.",
        "UC3 est le seul cas d'usage à cheval sur les deux applications.",
    ], fs=14.5)
    + '</div></div>',
    "≈40 s · 7:55", "NEIROUZ · PRODUCT OWNER")

# ---------------------------------------------------------------- 11 cas d'usage détaillés
SLIDES["CasUsage"] = shell(
    "03 · Analyse métier", "Nos quatre cas d'usage",
    "Numérotation propre au projet Patient : l'équipe Médecin a la sienne.",
    table(["", "Cas d'usage", "Acteur", "Ressource FHIR", "Story"],
          [["UC1", "Consulter son dossier et miser sur son pronostic", "Patient", "Patient — POST puis GET", "US-P1, US-P2"],
           ["UC2", "Un proche rejoint le pari à distance, avec un code", "Proche", "aucune — pari social", "US-P3"],
           ["UC3", "Le pari se résout par une vraie lecture FHIR", "Patient", "Observation — GET", "US-P4"],
           ["UC4", "Le patient demande son rendez-vous de suivi", "Patient", "Appointment — POST", "US-P5"]],
          highlight=2, col_widths=["8%", "38%", "13%", "24%", "17%"], fs=14.5)
    + f'<div class="bdy" style="color:{CREAM_SOFT};font-size:15px;margin-top:22px;'
      f'border-left:3px solid {GOLD};padding-left:16px;">'
      'UC3 est notre cas d\'usage vitrine : le seul qui exige deux applications, sur deux postes, '
      'sans aucun canal direct entre elles. Chaque cas d\'usage est rédigé en détail dans le Drive : '
      'préconditions, scénario nominal, exceptions, postcondition.</div>',
    "≈60 s · 8:55", "NEIROUZ · PRODUCT OWNER")

# ---------------------------------------------------------------- 12 processus (BPMN réel)
SLIDES["Processus"] = shell(
    "03 · Analyse métier", "Le processus métier",
    "Le parcours complet, et l'endroit précis où il sort de notre application.",
    '<div style="display:flex;gap:24px;align-items:stretch;">'
    + shot("bpmn.jpg", "", 350)
    + '<div style="width:360px;display:flex;flex-direction:column;gap:14px;justify-content:center;">'
    + panel("Ce qui est à nous", [
        "Le dossier, les cotes, la mise, la résolution, la demande de rendez-vous.",
        "Aucune décision médicale : nous proposons des probabilités.",
    ], fs=14.5)
    + panel("Ce qui ne l'est pas", [
        "Le diagnostic officiel : l'acte du médecin, sur son application.",
        "Nous ne savons pas quand il arrive — nous interrogeons le serveur pour le découvrir.",
    ], fs=14.5)
    + '</div></div>',
    "≈55 s · 9:50", "NEIROUZ · PRODUCT OWNER")

# ---------------------------------------------------------------- 13 architecture
def archi_svg():
    return ('<svg viewBox="0 0 1120 230" style="width:100%;height:auto;" role="img" '
            'aria-label="Les deux applications ne communiquent qu\'à travers le serveur FHIR du TP">'
            '<defs><marker id="aa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
            f'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{GOLD}"></path></marker></defs>'
            f'<rect x="0" y="34" width="300" height="146" rx="5" fill="{PARCH}" stroke="{RED}" stroke-width="2"></rect>'
            f'<text x="150" y="70" text-anchor="middle" font-size="17" font-family="Anton, sans-serif" fill="{RED}">APPLICATION PATIENT</text>'
            f'<text x="150" y="97" text-anchor="middle" font-size="13" font-family="IBM Plex Mono, monospace" fill="#6b5a3e">medibet-fhir</text>'
            f'<text x="150" y="126" text-anchor="middle" font-size="14" font-family="Barlow, sans-serif" fill="{INK}">Crée le Patient, place le pari,</text>'
            f'<text x="150" y="146" text-anchor="middle" font-size="14" font-family="Barlow, sans-serif" fill="{INK}">lit l\'Observation, demande le RDV</text>'
            f'<rect x="410" y="16" width="300" height="182" rx="5" fill="#061711" stroke="{GOLD}" stroke-width="2"></rect>'
            f'<text x="560" y="62" text-anchor="middle" font-size="19" font-family="Anton, sans-serif" fill="{CREAM}">SERVEUR FHIR DU TP</text>'
            f'<text x="560" y="90" text-anchor="middle" font-size="13" font-family="IBM Plex Mono, monospace" fill="{GOLD}">fhir.alliance4u.io</text>'
            f'<text x="560" y="122" text-anchor="middle" font-size="14.5" font-family="Barlow, sans-serif" fill="{BODY}">Patient · Practitioner</text>'
            f'<text x="560" y="144" text-anchor="middle" font-size="14.5" font-family="Barlow, sans-serif" fill="{BODY}">Observation · Appointment</text>'
            f'<text x="560" y="172" text-anchor="middle" font-size="13" font-family="Barlow, sans-serif" fill="#8fae95">seul canal d\'échange</text>'
            f'<rect x="820" y="34" width="300" height="146" rx="5" fill="{PARCH}" stroke="{RED}" stroke-width="2"></rect>'
            f'<text x="970" y="70" text-anchor="middle" font-size="17" font-family="Anton, sans-serif" fill="{RED}">APPLICATION MÉDECIN</text>'
            f'<text x="970" y="97" text-anchor="middle" font-size="13" font-family="IBM Plex Mono, monospace" fill="#6b5a3e">medibet-medecin-fhir</text>'
            f'<text x="970" y="126" text-anchor="middle" font-size="14" font-family="Barlow, sans-serif" fill="{INK}">Lit le dossier, publie</text>'
            f'<text x="970" y="146" text-anchor="middle" font-size="14" font-family="Barlow, sans-serif" fill="{INK}">l\'Observation du diagnostic</text>'
            f'<line x1="306" y1="107" x2="404" y2="107" stroke="{GOLD}" stroke-width="2.5" marker-end="url(#aa)" marker-start="url(#aa)"></line>'
            f'<line x1="716" y1="107" x2="814" y2="107" stroke="{GOLD}" stroke-width="2.5" marker-end="url(#aa)" marker-start="url(#aa)"></line>'
            '</svg>')

SLIDES["Architecture"] = shell(
    "04 · Utilisation de FHIR", "Deux applications, un serveur",
    "Deux dépôts, deux déploiements, deux postes. Aucun canal direct : si le serveur FHIR tombe, "
    "plus rien ne circule.",
    archi_svg()
    + '<div style="display:flex;gap:24px;margin-top:22px;">'
    + panel("Notre principale correction du sprint", [
        "Au départ, les deux rôles vivaient dans le même fichier : l'application marchait, mais elle ne démontrait rien.",
        "Nous avons séparé les deux codebases en cours de sprint — ça se voit sur le burndown, et c'est notre meilleure décision.",
        "Test de bout en bout passé : un dossier créé chez nous apparaît dans la file du médecin.",
    ])
    + '</div>',
    "≈55 s · 10:45", "ROMANE · DÉVELOPPEUSE")

# ---------------------------------------------------------------- 14 ressources
SLIDES["Ressources"] = shell(
    "04 · Utilisation de FHIR", "Les trois étapes du TP",
    "L'énoncé demandait trois échanges. Voici comment chacun se traduit chez nous.",
    table(["Étape", "Ressource", "Méthode", "Ce que ça fait chez nous"],
          [["Step 1", "Patient", "POST puis GET", "L'identité FHIR du joueur, créée une fois puis relue à chaque mise"],
           ["Step 1", "Practitioner", "GET", "Le médecin, lu par son application avant de statuer"],
           ["Step 2", "Observation", "POST côté Médecin", "Le diagnostic officiel, écrit sur le serveur"],
           ["Step 2", "Observation", "GET côté Patient", "La relecture qui résout notre pari, depuis un autre poste"],
           ["Step 3", "Appointment", "POST", "La demande de rendez-vous de suivi, après le verdict"]],
          highlight=3, col_widths=["11%", "18%", "22%", "49%"], fs=14.5)
    + '<div class="bdy" style="color:#8fae95;font-size:14px;margin-top:18px;">'
      'Aucune autre ressource clinique n\'est appelée. L\'état de jeu (dossiers, paris, CoinPot) passe '
      'par la ressource générique <b>Basic</b>, prévue par le standard pour ce qui n\'a pas de type dédié.</div>',
    "≈65 s · 11:50", "ROMANE · DÉVELOPPEUSE")

# ---------------------------------------------------------------- 15 observation
SLIDES["Observation"] = shell(
    "04 · Utilisation de FHIR", "L'Observation, attribut par attribut",
    "La ressource centrale du projet : le diagnostic qui fait autorité.",
    '<div style="display:flex;gap:24px;">'
    '<div style="width:46%;background:#061711;border:1px solid rgba(217,165,33,.35);padding:14px 16px;">'
    f'<pre class="mno" style="margin:0;color:{BODY};font-size:12px;line-height:1.6;white-space:pre;">'
    '{\n'
    f'  <span style="color:{GOLD}">"resourceType"</span>: "Observation",\n'
    f'  <span style="color:{GOLD}">"status"</span>: "final",\n'
    f'  <span style="color:{GOLD}">"code"</span>: {{ "coding": [{{\n'
    '      "system": "http://medibet.local/diagnostics",\n'
    '      "code": "angine", "display": "Angine" }],\n'
    '    "text": "Angine" },\n'
    f'  <span style="color:{GOLD}">"subject"</span>: {{ "reference": "Patient/6a9ec7b5…" }},\n'
    f'  <span style="color:{GOLD}">"effectiveDateTime"</span>: "2026-09-09T13:11:04Z",\n'
    f'  <span style="color:{GOLD}">"performer"</span>: [{{ "reference": "Practitioner/6a9eb9f8…",\n'
    '      "display": "Alexandre Desoutter" }],\n'
    f'  <span style="color:{GOLD}">"valueCodeableConcept"</span>: {{ "text": "Angine" }}\n'
    '}</pre></div>'
    '<div style="flex-grow:1;">'
    + "".join(
        '<div style="margin-bottom:14px;">'
        f'<div class="mno" style="color:{CREAM};font-size:13px;font-weight:600;">{k}</div>'
        f'<div class="bdy" style="color:{BODY};font-size:14px;line-height:1.45;">{v}</div></div>'
        for k, v in [
            ("status : final", "Le constat est définitif, pas une ébauche. C'est ce qui autorise le pari à se trancher dessus."),
            ("subject.reference", "L'attribut pivot : c'est par lui que le patient retrouve son diagnostic, avec un GET filtré."),
            ("code.coding", "Le diagnostic codé. Notre <i>system</i> est une nomenclature maison, assumée : un vrai déploiement mettrait SNOMED CT ou la CIM-10."),
            ("effectiveDateTime", "Le moment du constat. S'il y a plusieurs Observations, on garde la plus récente."),
            ("performer", "Qui a posé le diagnostic, référencé comme ressource Practitioner : la traçabilité de l'acte."),
        ])
    + '</div></div>',
    "≈80 s · 13:10", "ROMANE · DÉVELOPPEUSE")

# ---------------------------------------------------------------- 16 démonstration
SLIDES["Demonstration"] = shell(
    "05 · Démonstration", "Démonstration en direct",
    "Deux postes, deux applications, un serveur. Avec l'équipe Médecin.",
    '<div style="display:flex;gap:16px;">'
    + "".join(
        f'<div style="flex-grow:1;background:{PARCH};box-shadow:6px 6px 0 {RED};padding:15px 15px;">'
        f'<div class="dsp" style="color:#c08b1e;font-size:23px;line-height:1;">{n}</div>'
        f'<div class="mno" style="color:{RED};font-size:11px;font-weight:600;letter-spacing:.09em;'
        f'text-transform:uppercase;margin-top:7px;">{who}</div>'
        f'<div class="bdy" style="color:{INK};font-size:13.5px;line-height:1.45;margin-top:6px;">{t}</div></div>'
        for n, who, t in [
            ("01", "Poste patient", "Je décris mes symptômes, l'application crée un vrai Patient FHIR et propose les cotes."),
            ("02", "Poste patient", "Je mise, puis un proche rejoint le pari avec le code du dossier."),
            ("03", "Poste médecin", "Le dossier apparaît dans leur file d'attente, arrivé par le serveur FHIR."),
            ("04", "Poste médecin", "Le médecin pose le diagnostic : POST Observation, visible dans leur console."),
            ("05", "Poste patient", "Je relis l'Observation : le pari se résout, puis je demande mon rendez-vous."),
        ])
    + '</div>'
    + '<div style="display:flex;gap:24px;margin-top:28px;">'
    + panel("Ce qu'il faut regarder", [
        "La <b>console FHIR</b>, en bas à droite : chaque ligne est un appel réseau réel.",
        "Les deux écrans ne se parlent jamais : tout passe par fhir.alliance4u.io.",
        "Le verdict tombe côté patient sans aucune action du médecin sur notre poste.",
    ], accent=CREAM)
    + panel("Si le réseau lâche", [
        "Repli prévu : captures d'écran du même scénario, déjà rejoué ce matin.",
        "Les ressources créées restent vérifiables directement sur le serveur, hors de l'application.",
    ], accent=CREAM)
    + '</div>',
    "≈2 min 30 · 15:40", "ROMANE · DÉVELOPPEUSE")

# ---------------------------------------------------------------- 17 bilan
SLIDES["Bilan"] = shell(
    "06 · Bilan", "Rétrospective et suites",
    "Ce que le sprint nous a appris, et ce que nous ferions ensuite.",
    '<div style="display:flex;gap:18px;">'
    + panel("Ce qui a bien marché", [
        "Les appels FHIR ont fonctionné dès les premiers essais.",
        "Le copilote a accéléré le développement et le déploiement.",
    ], accent="#9fd6a8", fs=14.5)
    + panel("Ce qui a été difficile", [
        "Des bugs découverts seulement en test croisé avec l'équipe Médecin.",
        "Séparer les deux applications en cours de route a coûté du temps.",
    ], accent="#e8b06a", fs=14.5)
    + panel("Ce qu'on ferait autrement", [
        "Séparer les deux applications dès le premier jour.",
        "Écrire les critères d'acceptation au Sprint Planning, pas après coup.",
    ], accent="#e88a7a", fs=14.5)
    + '</div>'
    + '<div style="margin-top:24px;">'
    + panel("Les trois améliorations du prochain sprint", [
        "<b>Coder les diagnostics en SNOMED CT ou CIM-10</b> — notre nomenclature est maison : c'est le principal frein à une interopérabilité sémantique réelle.",
        "<b>Authentifier avec SMART on FHIR</b> — le serveur du TP est ouvert ; impensable sur de la donnée réelle.",
        "<b>Remplacer le sondage par une Subscription FHIR</b> — nous interrogeons le serveur toutes les 7 secondes faute de notification.",
    ], fs=14.5)
    + '</div>',
    "≈55 s · 16:35", "RÉMI · SCRUM MASTER")

# ---------------------------------------------------------------- 18 merci
SLIDES["Merci"] = (HEAD +
    f'<div style="position:relative;width:1280px;height:720px;overflow:hidden;{FELT}">'
    '<div style="position:absolute;top:0;left:0;right:0;height:12px;background:#061711;"></div>'
    '<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;'
    'align-items:center;justify-content:center;">'
    f'<div class="dsp" style="color:{CREAM};font-size:74px;line-height:1;text-shadow:6px 6px 0 {RED};'
    'text-align:center;">MERCI POUR<br>VOTRE ATTENTION</div>'
    f'<div class="bdy" style="color:{GOLD};font-size:22px;margin-top:26px;">Vos questions</div>'
    '<div style="width:160px;height:1px;background:rgba(244,227,171,.5);margin:26px 0;"></div>'
    '<div class="mno" style="display:flex;flex-direction:column;gap:8px;align-items:center;'
    'color:#cfdfd2;font-size:13.5px;">'
    '<span>romanecano.github.io/medibet-fhir</span>'
    '<span>romanecano.github.io/medibet-fhir/fhir-medibet.html — le dossier FHIR détaillé</span>'
    '<span>github.com/RomaneCano/medibet-fhir</span></div></div>'
    '<div style="position:absolute;bottom:0;left:0;right:0;height:26px;background:#061711;'
    f'border-top:2px solid {RED};display:flex;align-items:center;justify-content:flex-end;'
    'padding:0 22px;box-sizing:border-box;">'
    '<span class="mno" style="color:#8fae95;font-size:11px;">≈15 s · 16:50</span></div>'
    '</div>' + FOOT)

# ---------------------------------------------------------------- écriture
ORDER = ["Main", "Cadrage", "Equipe", "Scrum", "Backlog", "BoardTrello", "Qualite", "Pilotage",
         "Produit", "CasUsageUML", "CasUsage", "Processus", "Architecture", "Ressources",
         "Observation", "Demonstration", "Bilan", "Merci"]
TITLES = ["01 · Titre", "02 · Cadrage", "03 · Équipe", "04 · Scrum", "05 · Backlog",
          "06 · Board Trello", "07 · Qualité", "08 · Pilotage Corrello", "09 · Produit",
          "10 · Diagramme cas d'usage", "11 · Cas d'usage", "12 · Processus BPMN",
          "13 · Architecture", "14 · Ressources FHIR", "15 · Observation", "16 · Démonstration",
          "17 · Bilan", "18 · Merci"]

for name in ORDER:
    (OUT / f"{name}.dc.html").write_text(SLIDES[name], encoding="utf-8")

artboards = []
for i, name in enumerate(ORDER):
    col, row = i % 4, i // 4
    artboards.append({"file": f"{name}.dc.html", "x": col * 1400, "y": row * 900,
                      "w": 1280, "h": 720, "title": TITLES[i]})
(OUT / "canvas.json").write_text(json.dumps(
    {"artboards": artboards, "launch": {"view": "canvas"}}, ensure_ascii=False, indent=2),
    encoding="utf-8")

print("planches écrites :", len(ORDER))
