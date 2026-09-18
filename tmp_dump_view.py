import json
with open('/config/.storage/lovelace.dashboard_calendrier') as f:
    d = json.load(f)
views = d['data']['config']['views']
v = [x for x in views if x.get('path')=='horaires-pro'][0]
def walk(node, depth=0):
    if isinstance(node, dict):
        t = node.get('type')
        ta = node.get('tap_action')
        nm = node.get('name') or node.get('title')
        if t:
            line = '  '*depth + 'type=' + str(t) + ' name=' + str(nm)
            if ta:
                line += ' TAP=' + json.dumps(ta)[:200]
            print(line)
        for k,val in node.items():
            if k in ('cards','sections'):
                walk(val, depth+1)
    elif isinstance(node, list):
        for item in node:
            walk(item, depth)
walk(v)
print('CARDCOUNT_END')