#!/usr/bin/env python3
# Indeksira data/kb/*.md u data/kb-data.js (window.EB_KB) za AI asistenta.
# Pokrenite nakon dodavanja/izmjene znanja:  python data/build-kb.py
import os, re, json, glob

HERE = os.path.dirname(os.path.abspath(__file__))
KBDIR = os.path.join(HERE, "kb")

def parse(path):
    raw = open(path, encoding="utf-8").read()
    title = os.path.splitext(os.path.basename(path))[0].replace("-", " ").title()
    tags, lang = [], "sr"
    body = raw
    # toleriši BOM i prazne/uvučene redove prije frontmatter bloka (čest kod web-uploada)
    m = re.match(r"^﻿?\s*---\s*\n(.*?)\n---\s*\n?(.*)$", raw, re.S)
    if m:
        fm, body = m.group(1), m.group(2)
        for line in fm.splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                k, v = k.strip().lower(), v.strip()
                if k == "title": title = v
                elif k == "tags": tags = [t.strip() for t in v.split(",") if t.strip()]
                elif k == "lang": lang = v or "sr"
    # Podijeli tijelo na sekcije po naslovima (## ...); svaki naslov -> nova sekcija.
    # Time se dugi dokumenti (npr. zakon po članovima) cijepaju na pretražive dijelove.
    sections = []          # (naslov_sekcije, tekst)
    cur_head, cur_lines = "", []
    def flush():
        txt = "\n".join(cur_lines).strip()
        if txt:
            sections.append((cur_head, txt))
    ART = re.compile(r"^\s*Član\s+[0-9][\w.\-]*\.?\s*$")   # npr. "Član 13", "Član 12d"
    for line in body.split("\n"):
        hm = re.match(r"^#{1,6}\s+(.*)$", line)
        if hm:
            flush()
            cur_head, cur_lines = hm.group(1).strip(), []
        elif ART.match(line):
            flush()
            cur_head, cur_lines = line.strip(), []
        else:
            cur_lines.append(line)
    flush()

    entries = []
    for head, txt in sections:
        # unutar sekcije dodatno razdvoji po praznim redovima (pasusi)
        parts = [p.strip() for p in re.split(r"\n\s*\n", txt) if p.strip()] or [txt]
        for p in parts:
            text = re.sub(r"\s+", " ", re.sub(r"^#{1,6}\s+", "", p)).strip()
            if len(text) < 15:
                continue
            full_title = title + (" — " + head if head else "")
            entries.append({
                "title": full_title, "doc": title, "section": head,
                "tags": tags, "lang": lang, "text": text,
                "source": os.path.basename(path)
            })
    return entries

def main():
    files = [f for f in sorted(glob.glob(os.path.join(KBDIR, "*.md")))
             if os.path.basename(f).lower() != "readme.md"]
    kb = []
    for f in files:
        kb.extend(parse(f))
    out = os.path.join(HERE, "kb-data.js")
    with open(out, "w", encoding="utf-8") as fh:
        fh.write("/* AUTOGENERISANO iz data/kb/*.md — ne uređujte ručno. */\n")
        fh.write("/* Regenerišite sa: python data/build-kb.py */\n")
        fh.write("window.EB_KB = ")
        fh.write(json.dumps(kb, ensure_ascii=False, indent=1))
        fh.write(";\n")
    print("Napisano:", out)
    print("Fajlova:", len(files), "| unosa (odgovora):", len(kb))

if __name__ == "__main__":
    main()
