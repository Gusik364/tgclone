import requests

res = requests.get('https://verbally-bustling-kiwi.cloudpub.ru/api/gifts/all')
data = res.json()
gifts = data['data']['gifts']

for g in gifts:
    print(f"{g['_id']} - {g['name']}")
