#!/usr/bin/env python3
# Generiše data/sheets-data.js (window.EB_DATA) iz CSV fajlova u data/gsheet/.
# Pokrenite nakon svake izmjene CSV-a:  python build-sheets-data.py
import csv, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
GDIR = os.path.join(HERE, "gsheet")
MAP = {
    "stranice": "stranice.csv",
    "cjenovnik": "cjenovnik.csv",
    "urednickiPlan": "urednicki-plan.csv",
    "planAnalize": "urednicki-plan-analize.csv",
    "planVodici": "urednicki-plan-vodici.csv",
    "planWebinari": "urednicki-plan-webinari.csv",
    "segmenti": "segmenti.csv",
    "klasifikacija": "klasifikacija.csv",
    "faq": "faq.csv",
    "drustvo": "drustvo.csv",
    "kpi": "kpi.csv",
    "dokumenti": "dokumenti.csv",
    "dokumentiRegistar": "dokumenti-registar.csv",
    "publikacije": "publikacije.csv",
}
def load(fn):
    with open(os.path.join(GDIR, fn), encoding="utf-8-sig", newline="") as f:
        return [row for row in csv.DictReader(f)]
data = {k: load(v) for k, v in MAP.items()}
out = os.path.join(HERE, "sheets-data.js")
with open(out, "w", encoding="utf-8") as f:
    f.write("/* AUTOGENERISANO iz data/gsheet/*.csv — ne uređujte ručno. */\n")
    f.write("/* Regenerišite sa: python data/build-sheets-data.py */\n")
    f.write("window.EB_DATA = ")
    f.write(json.dumps(data, ensure_ascii=False, indent=1))
    f.write(";\n")
print("Napisano:", out)
for k, v in data.items():
    print(f"  {k}: {len(v)} redova")
