import requests
import json

# ID подарка Gem Signet - замени на актуальный
GIFT_ID = "69503322b00bafb88fc994db"
BASE_URL = "https://verbally-bustling-kiwi.cloudpub.ru"

# Загружаем фоны из JSON файла
with open("backdrops.json", "r", encoding="utf-8") as f:
    raw_backdrops = json.load(f)

# Преобразуем в нужный формат (используем hex цвета)
backdrops = []
for b in raw_backdrops:
    backdrops.append({
        "name": b["name"],
        "centerColor": b["hex"]["centerColor"],
        "edgeColor": b["hex"]["edgeColor"],
        "patternColor": b["hex"]["patternColor"],
        "textColor": b["hex"]["textColor"],
        "rarityPermille": b["rarityPermille"],
    })

print(f"Loaded {len(backdrops)} backdrops")

# Получаем текущие данные подарка
res = requests.get(
    f"{BASE_URL}/admin/api/gifts/{GIFT_ID}",
    cookies={"adminAuth": "Test"}
)
gift = res.json().get("gift", {})

data = {
    "canUpgrade": gift.get("canUpgrade", True),
    "upgradePrice": gift.get("upgradePrice", 100),
    "upgradeModels": gift.get("upgradeModels", []),
    "upgradePatterns": gift.get("upgradePatterns", []),
    "upgradeBackdrops": backdrops,
}

res = requests.patch(
    f"{BASE_URL}/admin/api/gifts/{GIFT_ID}/upgrade-settings",
    json=data,
    cookies={"adminAuth": "Test"}
)

print(f"Status: {res.status_code}")
print(f"Added {len(backdrops)} backdrops for Gem Signet")
print(f"Response: {res.text[:500]}")
