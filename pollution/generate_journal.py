#!/usr/bin/env python3
# /config/pollution/generate_journal.py — journal imprimable de la qualité de l'air à Engis
# Lit les statistiques horaires long terme du recorder (SQLite, lecture seule) et écrit :
#   /config/www/pollution/journal.html  (page : dates, filtres, impression / PDF, export Excel)
#   /config/www/pollution/journal.csv   (tout l'historique, un pic par ligne)
import os, json, csv, sqlite3
from datetime import datetime
from zoneinfo import ZoneInfo

DB = "/config/home-assistant_v2.db"
OUT = "/config/www/pollution"
TZ = ZoneInfo("Europe/Brussels")
IDS = {
    "aqi": ["sensor.engis_belgium_indice_de_qualite_de_l_air"],
    "pm25": ["sensor.engis_belgium_pm2_5"], "pm10": ["sensor.engis_belgium_pm10"],
    "no2": ["sensor.engis_belgium_dioxyde_d_azote"], "so2": ["sensor.engis_belgium_dioxyde_de_soufre"],
    "o3": ["sensor.engis_belgium_ozone"],
    "t": ["sensor.engis_temperature", "sensor.engis_belgium_temperature"],
    "h": ["sensor.engis_humidite", "sensor.engis_belgium_humidite"],
    "p": ["sensor.engis_pression_atmospherique", "sensor.engis_belgium_pression"],
    "w": ["sensor.engis_vitesse_du_vent", "sensor.engis_vent", "sensor.maison_vitesse_du_vent"],
    "r": ["sensor.engis_precipitation"],
    "d": ["sensor.engis_direction_vent", "sensor.maison_direction_du_vent"],
}
PK = ["pm25", "pm10", "no2", "so2", "o3"]


# Séries horaires {timestamp: (moyenne, min, max)} par grandeur, avec capteurs de secours fusionnés.
def series():
    con = sqlite3.connect("file:%s?mode=ro" % DB, uri=True, timeout=60)
    ids = sorted({s for v in IDS.values() for s in v})
    meta = dict(con.execute("SELECT statistic_id, id FROM statistics_meta WHERE statistic_id IN (%s)" % ",".join("?" * len(ids)), ids).fetchall())
    S = {}
    for k, lst in IDS.items():
        S[k] = {}
        for sid in lst:
            if sid not in meta:
                continue
            for ts, mean, mn, mx in con.execute("SELECT start_ts, mean, min, max FROM statistics WHERE metadata_id=? ORDER BY start_ts", (meta[sid],)):
                S[k].setdefault(int(ts), (mean, mn, mx))
    con.close()
    return S


def r1(v, n=1):
    return None if v is None else round(v, n)


# Jours (du plus récent au plus ancien) avec jusqu'à 3 pics : polluants à l'heure du pic et météo à Engis.
def jours(S):
    val = lambda k, t, i=0: (S[k].get(t) or (None, None, None))[i] if S[k].get(t) else None
    mx = lambda t: (S["aqi"][t][2] if S["aqi"][t][2] is not None else S["aqi"][t][0]) or 0
    days = {}
    for t in sorted(S["aqi"]):
        days.setdefault(datetime.fromtimestamp(t, TZ).date().isoformat(), []).append(t)
    out = []
    for d in sorted(days, reverse=True):
        hs = days[d]; peaks = []
        for t in sorted(hs, key=mx, reverse=True):
            if len(peaks) >= 3 or (peaks and mx(t) < 51) or any(abs(p - t) < 3 * 3600 for p in peaks):
                continue
            peaks.append(t)
        pk = []
        for t in sorted(peaks):
            x = {"hr": datetime.fromtimestamp(t, TZ).strftime("%Hh"), "aqi": round(mx(t))}
            for k in PK:
                v = val(k, t, 2) if val(k, t, 2) is not None else val(k, t)
                x[k] = None if v is None else round(v)
            dd = [k for k in PK if x[k] is not None]
            x["dom"] = max(dd, key=lambda k: x[k]) if dd else ""
            for k in ("t", "h", "p", "w", "r", "d"):
                x[k] = r1(val(k, t), 0 if k in ("h", "p", "d") else 1)
            pk.append(x)
        means = [S["aqi"][t][0] for t in hs if S["aqi"][t][0] is not None]
        tn = [S["t"][t][1] for t in hs if t in S["t"] and S["t"][t][1] is not None]
        tx = [S["t"][t][2] for t in hs if t in S["t"] and S["t"][t][2] is not None]
        out.append({"d": d, "avg": round(sum(means) / len(means)) if means else None, "dmax": max(p["aqi"] for p in pk) if pk else 0,
                    "tmin": r1(min(tn)) if tn else None, "tmax": r1(max(tx)) if tx else None, "pk": pk})
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    D = jours(series())
    gen = datetime.now(TZ).strftime("%d/%m/%Y %H:%M")
    html = open(os.path.join(os.path.dirname(__file__), "journal_template.html"), encoding="utf-8").read()
    with open(os.path.join(OUT, "journal.html"), "w", encoding="utf-8") as f:
        f.write(html.replace("__DATA__", json.dumps({"days": D, "gen": gen}, ensure_ascii=False)))
    with open(os.path.join(OUT, "journal.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["Date", "Heure du pic", "AQI", "Polluant dominant", "PM2.5", "PM10", "NO2", "SO2", "O3",
                    "Température (°C)", "Humidité (%)", "Pression (hPa)", "Vent (km/h)", "Direction du vent (°)", "Précipitations (mm)", "AQI moyen du jour"])
        for x in D:
            for p in x["pk"]:
                w.writerow([datetime.fromisoformat(x["d"]).strftime("%d/%m/%Y"), p["hr"], p["aqi"], p["dom"].upper().replace("PM25", "PM2.5"),
                            p["pm25"], p["pm10"], p["no2"], p["so2"], p["o3"], p["t"], p["h"], p["p"], p["w"], p["d"], p["r"], x["avg"]])
    print("Journal : %d jours (%s)" % (len(D), gen))


if __name__ == "__main__":
    main()
