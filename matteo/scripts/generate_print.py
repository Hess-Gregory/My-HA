#!/usr/bin/env python3
# /config/matteo/scripts/generate_print.py — page imprimable du planning Matteo (calendrier mensuel ou liste)
# Écrit /config/www/matteo/imprimer_<jeton>.html (même jeton que l'agenda .ics)
import os, sys, json
from datetime import datetime, timedelta
sys.path.insert(0, "/config/matteo/scripts")
from matteo_common import load, lieu_label

TOKEN_FILE = "/config/matteo/data/ics_token"
OUT_DIR = "/config/www/matteo"
NOM = {"A": "Grégory", "B": "Élodie / Olivier", "C": "Grégory (non respecté)", "D": "Élodie / Olivier (rattrapage)"}


# 'JJ/MM/AAAA' -> date.
def d(s):
    return datetime.strptime(s, "%d/%m/%Y").date()


# Écrit la page imprimable HTML (données injectées en JSON) et le CSV Excel ; renvoie l'URL de la page.
def build():
    token = open(TOKEN_FILE).read().strip()
    c = load(); data = c["data"]
    act = {k: e for k, e in data.items() if e.get("date_du") and e.get("date_au") and not e.get("hide") and e.get("visible_in_ui", True)}
    parts = [(d(e["date_du"]), d(e["date_au"])) for k, e in act.items() if k.startswith("VAC_")]
    per = []
    for k, e in act.items():
        du, au = d(e["date_du"]), d(e["date_au"]); tc = e.get("type_action_code", "")
        if tc in ("WEEKEND_GREGORY", "WEEKEND_ELODIE") and any(a <= du and au <= b for a, b in parts):
            continue
        papa = e.get("code_aller") in ("A", "B") or "GREGORY" in tc
        cat = {"WEEKEND_GREGORY": "WG", "WEEKEND_ELODIE": "WE", "VAC_GREGORY": "VG", "VAC_ELODIE": "VE"}.get(tc, "AG" if papa else "AE")
        per.append({"k": k, "du": du.isoformat(), "au": au.isoformat(), "cat": cat, "papa": papa,
                    "t": e.get("vac_nom") if k.startswith("VAC_") else e.get("type_action", ""),
                    "a": NOM.get(e.get("code_aller"), "") + ((" à " + lieu_label(e.get("lieu_aller"))) if e.get("code_aller") == "A" and (e.get("lieu_aller") or "MAURAGE") != "MAURAGE" else ""), "r": NOM.get(e.get("code_retour"), "") + ((" à " + lieu_label(e.get("lieu_retour"))) if e.get("code_retour") in ("A", "C") and (e.get("lieu_retour") or "MAURAGE") != "MAURAGE" else ""), "cr": e.get("code_retour", "")})
    per.sort(key=lambda p: p["du"])
    payload = {"per": per, "vac": c.get("vacances", []), "ev": c.get("evenements", []), "gen": datetime.now().strftime("%d/%m/%Y %H:%M")}
    html = TEMPLATE.replace("__DATA__", json.dumps(payload, ensure_ascii=False))
    os.makedirs(OUT_DIR, exist_ok=True)
    for f in os.listdir(OUT_DIR):
        if f.startswith("imprimer_") and f != "imprimer_%s.html" % token:
            os.remove(os.path.join(OUT_DIR, f))
    with open(os.path.join(OUT_DIR, "imprimer_%s.html" % token), "w", encoding="utf-8") as f:
        f.write(html)
    # Export Excel (.csv ; séparateur « ; », UTF-8 avec BOM pour Excel)
    import csv
    for f in os.listdir(OUT_DIR):
        if f.startswith("planning_") and f.endswith(".csv") and f != "planning_%s.csv" % token:
            os.remove(os.path.join(OUT_DIR, f))
    J = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."]
    CATN = {"WG": "Week-end", "WE": "Week-end", "VG": "Congé", "VE": "Congé", "AG": "Autre date", "AE": "Autre date"}
    with open(os.path.join(OUT_DIR, "planning_%s.csv" % token), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["Du", "Jour", "Au", "Jour", "Nuits", "Chez", "Catégorie", "Période", "Aller", "Retour", "Banque"])
        for p in per:
            du = datetime.fromisoformat(p["du"]).date(); au = datetime.fromisoformat(p["au"]).date(); e = data[p["k"]]
            w.writerow([du.strftime("%d/%m/%Y"), J[du.weekday()], au.strftime("%d/%m/%Y"), J[au.weekday()], (au - du).days,
                        "Papa" if p["papa"] else "Maman", CATN[p["cat"]], p["t"], p["a"], p["r"], e.get("bank_delta", 0)])
    return "/local/matteo/imprimer_%s.html" % token


TEMPLATE = r"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Planning de Matteo</title><style>
:root{--WG:#2196F3;--WE:#4CAF50;--VG:#7E57C2;--VE:#C0CA33;--AG:#EC407A;--AE:#FF7043;--und:#FFB300}
*{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;color:#1d1d1f;background:#f4f4f6}
.bar{position:sticky;top:0;display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:12px 18px;background:#1f1830;color:#fff}
.bar h1{font-size:17px;margin:0 12px 0 0;color:#f6d68a}.bar select,.bar input,.bar button{font:inherit;padding:7px 10px;border-radius:8px;border:1px solid #555;background:#2c2342;color:#fff}
.bar button{background:#f6d68a;color:#1f1830;border:0;font-weight:700;cursor:pointer}
main{max-width:1100px;margin:0 auto;padding:18px}.page{background:#fff;border-radius:12px;padding:18px 20px;margin-bottom:18px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
h2{margin:0 0 12px;font-size:20px}table{width:100%;border-collapse:collapse}
.cal th{font-size:11px;text-transform:uppercase;color:#777;padding:4px}.cal td{border:1px solid #e3e3e8;height:86px;vertical-align:top;padding:4px 5px;width:14.28%;position:relative}
.n{font-weight:700;font-size:13px}.lab{font-size:10.5px;line-height:1.25;margin-top:2px}.out{background:#fafafa;color:#bbb}
.und{border-bottom:3px solid var(--und)!important}.fri{border-bottom:3px dotted var(--und)!important}.today .n{color:#c0392b}
.list td,.list th{border-bottom:1px solid #e3e3e8;padding:7px 6px;font-size:13px;text-align:left}.list th{font-size:11px;text-transform:uppercase;color:#777}
.dot{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.leg{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:11.5px;margin-top:12px;color:#444}.foot{font-size:11px;color:#888;margin-top:8px}
@media print{.bar{display:none}body{background:#fff}main{padding:0;max-width:none}.page{box-shadow:none;border-radius:0;padding:0;margin:0 0 0;page-break-after:always}
@page{size:A4 landscape;margin:12mm}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="bar"><h1>🖨️ Planning de Matteo</h1>
<label>À partir de <input type="month" id="m"></label>
<select id="n"><option value="1">1 mois</option><option value="3">3 mois</option><option value="6">6 mois</option><option value="12">12 mois</option></select>
<select id="v"><option value="cal">Calendrier</option><option value="list">Liste</option><option value="both">Calendrier + liste</option></select>
<button onclick="window.print()">Imprimer / PDF</button><button onclick="location.href=location.pathname.replace('imprimer_','planning_').replace('.html','.csv')">Excel (.csv)</button></div><main id="out"></main>
<script>
const D=__DATA__;const MO=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const CAT={WG:'Week-end chez papa',WE:'Week-end chez maman',VG:'Congé chez papa',VE:'Congé chez maman',AG:'Autre date chez papa',AE:'Autre date chez maman'};
const iso=d=>d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();const P=s=>new Date(s+'T00:00:00');
const fr=d=>String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();
const JJ=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'];
const hex2=(h,a)=>'rgba('+parseInt(h.slice(1,3),16)+','+parseInt(h.slice(3,5),16)+','+parseInt(h.slice(5,7),16)+','+a+')';
const COL={};Object.keys(CAT).forEach(k=>COL[k]=getComputedStyle(document.documentElement).getPropertyValue('--'+k).trim());
const day={};D.per.forEach(p=>{const pr=['WG','WE'].includes(p.cat)?1:2;for(let x=P(p.du);x<=P(p.au);x.setDate(x.getDate()+1)){const k=iso(x);if(day[k]&&day[k].pr>pr)continue;day[k]={pr,p,first:k===iso(P(p.du)),last:k===iso(P(p.au))};}});
const off={},fri={};D.vac.forEach(v=>(v.segments||[]).forEach(s=>{if(!s.debut)return;const a=P(s.debut),b=P(s.fin);for(let x=new Date(a);x<=b;x.setDate(x.getDate()+1))off[iso(x)]=v.nom;const f=new Date(a);f.setDate(f.getDate()-({1:3,6:1,0:2}[a.getDay()]||0));if(f<a)fri[iso(f)]=1;}));
function evs(y){const r={};D.ev.forEach(e=>{let d=null;if(e.jour){d=new Date(y,+e.jour.slice(0,2)-1,+e.jour.slice(3,5));}else if(e.regle){const mo=e.nom.includes('Mères')?4:5;d=new Date(y,mo,1);d.setDate(1+((7-d.getDay())%7)+7);}if(d){const k=iso(d);(r[k]=r[k]||[]).push((e.icone||'🎂')+' '+e.nom);}});return r;}
function month(Y,M){const ev=evs(Y);const f=new Date(Y,M,1),n=new Date(Y,M+1,0).getDate(),lead=(f.getDay()+6)%7;let h='<div class="page"><h2>'+MO[M].charAt(0).toUpperCase()+MO[M].slice(1)+' '+Y+'</h2><table class="cal"><tr>'+['lun.','mar.','mer.','jeu.','ven.','sam.','dim.'].map(j=>'<th>'+j+'</th>').join('')+'</tr><tr>';
let c=0;for(let i=0;i<lead;i++){h+='<td class="out"></td>';c++;}const today=iso(new Date());
for(let d=1;d<=n;d++){const k=Y*10000+(M+1)*100+d,o=day[k];let st='',cl=[];const isv=o&&o.p.k.startsWith('VAC_');
if(o){const col=COL[o.p.cat];st=o.first?'background:repeating-linear-gradient(135deg,'+hex2(col,.55)+' 0 5px,'+hex2(col,.12)+' 5px 10px)':'background:'+hex2(col,.35);}else if(off[k])st='background:rgba(255,179,0,.12)';
if(off[k]&&!isv)cl.push('und');else if(fri[k]&&!isv)cl.push('fri');if(k===today)cl.push('today');
let lab='';if(o&&o.first)lab+='<div class="lab"><b>'+(o.p.papa?'Papa':'Maman')+'</b> · '+o.p.t+(o.p.a?'<br>↗ '+o.p.a:'')+'</div>';if(o&&o.last&&o.p.r)lab+='<div class="lab">↘ '+o.p.r+'</div>';
if(off[k]&&(!day[k-1]||!off[k-1]))lab+='<div class="lab">📚 '+off[k]+'</div>';(ev[k]||[]).forEach(t=>lab+='<div class="lab">'+t+'</div>');
h+='<td class="'+cl.join(' ')+'" style="'+st+'"><div class="n">'+d+'</div>'+lab+'</td>';c++;if(c%7===0&&d<n)h+='</tr><tr>';}
while(c%7){h+='<td class="out"></td>';c++;}h+='</tr></table>'+legend()+'</div>';return h;}
function legend(){return '<div class="leg">'+Object.keys(CAT).map(k=>'<span><span class="dot" style="background:'+hex2(COL[k],.6)+'"></span>'+CAT[k]+'</span>').join('')+'<span><span class="dot" style="background:rgba(255,179,0,.2);border-bottom:3px solid #FFB300"></span>Congé officiel non défini</span><span>hachuré = 1er jour (arrivée le soir)</span><span>🎂 anniversaire · 🎉 fête · ❤️ Saint-Valentin</span></div><div class="foot">Planning de Matteo — généré le '+D.gen+'</div>';}
function list(a,b){const rows=D.per.filter(p=>P(p.au)>=a&&P(p.du)<=b);let h='<div class="page"><h2>Liste des périodes — '+fr(a)+' au '+fr(b)+'</h2><table class="list"><tr><th>Du</th><th>Au</th><th>Chez</th><th>Période</th><th>Aller</th><th>Retour</th></tr>';
rows.forEach(p=>{const x=P(p.du),y=P(p.au);h+='<tr><td>'+JJ[x.getDay()]+' '+fr(x)+'</td><td>'+JJ[y.getDay()]+' '+fr(y)+'</td><td><span class="dot" style="background:'+hex2(COL[p.cat],.6)+'"></span>'+(p.papa?'Papa':'Maman')+'</td><td>'+p.t+'</td><td>'+p.a+'</td><td>'+p.r+'</td></tr>';});
return h+'</table>'+legend()+'</div>';}
function render(){const [y,m]=document.getElementById('m').value.split('-').map(Number);const n=+document.getElementById('n').value,v=document.getElementById('v').value;let h='';
if(v!=='list')for(let i=0;i<n;i++){const d=new Date(y,m-1+i,1);h+=month(d.getFullYear(),d.getMonth());}
if(v!=='cal')h+=list(new Date(y,m-1,1),new Date(y,m-1+n,0));document.getElementById('out').innerHTML=h;}
const q=new URLSearchParams(location.search);const t=new Date();document.getElementById('m').value=q.get('m')||(t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0'));
if(q.get('n'))document.getElementById('n').value=q.get('n');if(q.get('v'))document.getElementById('v').value=q.get('v');
['m','n','v'].forEach(i=>document.getElementById(i).onchange=render);render();
</script></body></html>"""

if __name__ == "__main__":
    print(build())
