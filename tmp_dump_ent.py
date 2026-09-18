import json
with open('/config/.storage/lovelace.dashboard_calendrier') as f:
    d = json.load(f)
views = d['data']['config']['views']
v = [x for x in views if x.get('path')=='horaires-pro'][0]
found = []
def walk(node):
    if isinstance(node, dict):
        if node.get('type') == 'entities':
            found.append(node)
        for k,val in node.items():
            walk(val)
    elif isinstance(node, list):
        for item in node:
            walk(item)
walk(v)
print(json.dumps(found, indent=1, ensure_ascii=False))
print('ENT_END')