import json
with open('/config/.storage/lovelace.dashboard_calendrier') as f:
    d = json.load(f)
views = d['data']['config']['views']
v = [x for x in views if x.get('path')=='horaires-pro'][0]
found = []
def walk(node):
    if isinstance(node, dict):
        if node.get('type') == 'conditional':
            found.append(node)
        for k,val in node.items():
            walk(val)
    elif isinstance(node, list):
        for item in node:
            walk(item)
walk(v)
print('NUM_CONDITIONAL', len(found))
for i,c in enumerate(found):
    inner = c.get('card', {})
    print('---', i, 'conditions=', json.dumps(c.get('conditions')), 'card_type=', inner.get('type'), 'card_name=', inner.get('name') or inner.get('title'))
print('COND_END')