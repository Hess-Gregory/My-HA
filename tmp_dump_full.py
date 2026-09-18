import json
with open('/config/.storage/lovelace.dashboard_calendrier') as f:
    d = json.load(f)
views = d['data']['config']['views']
v = [x for x in views if x.get('path')=='horaires-pro'][0]
with open('/config/tmp_view_full.json','w') as f:
    json.dump(v, f, indent=1, ensure_ascii=False)
import subprocess
n = subprocess.run(['wc','-l','/config/tmp_view_full.json'], capture_output=True, text=True).stdout
print('LINES:', n)