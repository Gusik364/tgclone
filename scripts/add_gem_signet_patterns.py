import requests

# ID подарка Gem Signet - замени на актуальный
GIFT_ID = "69503322b00bafb88fc994db"
BASE_URL = "https://verbally-bustling-kiwi.cloudpub.ru"
BASE = "https://cdn.changes.tg/gifts/patterns/Gem%20Signet/lottie/"

patterns = [
    {"name": "Academic Cap", "patternUrl": f"{BASE}Academic%20Cap.json", "rarityPermille": 20},
    {"name": "Acorn", "patternUrl": f"{BASE}Acorn.json", "rarityPermille": 20},
    {"name": "Alarm", "patternUrl": f"{BASE}Alarm.json", "rarityPermille": 20},
    {"name": "Alert Serpent", "patternUrl": f"{BASE}Alert%20Serpent.json", "rarityPermille": 20},
    {"name": "Alkonost", "patternUrl": f"{BASE}Alkonost.json", "rarityPermille": 20},
    {"name": "All-Seeing Eye", "patternUrl": f"{BASE}All-Seeing%20Eye.json", "rarityPermille": 20},
    {"name": "Anchor", "patternUrl": f"{BASE}Anchor.json", "rarityPermille": 20},
    {"name": "Anubis", "patternUrl": f"{BASE}Anubis.json", "rarityPermille": 20},
    {"name": "Apple", "patternUrl": f"{BASE}Apple.json", "rarityPermille": 20},
    {"name": "Arabian Horse", "patternUrl": f"{BASE}Arabian%20Horse.json", "rarityPermille": 20},
    {"name": "Astronaut", "patternUrl": f"{BASE}Astronaut.json", "rarityPermille": 20},
    {"name": "Aztec Falcon", "patternUrl": f"{BASE}Aztec%20Falcon.json", "rarityPermille": 20},
    {"name": "Aztec Totem", "patternUrl": f"{BASE}Aztec%20Totem.json", "rarityPermille": 20},
    {"name": "Bandana", "patternUrl": f"{BASE}Bandana.json", "rarityPermille": 20},
    {"name": "Baphomet", "patternUrl": f"{BASE}Baphomet.json", "rarityPermille": 20},
    {"name": "Bastet", "patternUrl": f"{BASE}Bastet.json", "rarityPermille": 20},
    {"name": "Battle Axe", "patternUrl": f"{BASE}Battle%20Axe.json", "rarityPermille": 20},
    {"name": "Bearskin", "patternUrl": f"{BASE}Bearskin.json", "rarityPermille": 20},
    {"name": "Bee", "patternUrl": f"{BASE}Bee.json", "rarityPermille": 20},
    {"name": "Beetle", "patternUrl": f"{BASE}Beetle.json", "rarityPermille": 20},
    {"name": "Beret", "patternUrl": f"{BASE}Beret.json", "rarityPermille": 20},
    {"name": "Bicorne", "patternUrl": f"{BASE}Bicorne.json", "rarityPermille": 20},
    {"name": "Bike Helmet", "patternUrl": f"{BASE}Bike%20Helmet.json", "rarityPermille": 20},
    {"name": "Birthday Cake", "patternUrl": f"{BASE}Birthday%20Cake.json", "rarityPermille": 20},
    {"name": "Bishop", "patternUrl": f"{BASE}Bishop.json", "rarityPermille": 20},
    {"name": "Boat", "patternUrl": f"{BASE}Boat.json", "rarityPermille": 20},
    {"name": "Bobby Helmet", "patternUrl": f"{BASE}Bobby%20Helmet.json", "rarityPermille": 20},
    {"name": "Bone", "patternUrl": f"{BASE}Bone.json", "rarityPermille": 20},
    {"name": "Bottle", "patternUrl": f"{BASE}Bottle.json", "rarityPermille": 20},
    {"name": "Bow Tie", "patternUrl": f"{BASE}Bow%20Tie.json", "rarityPermille": 20},
    {"name": "Bubble Tea", "patternUrl": f"{BASE}Bubble%20Tea.json", "rarityPermille": 20},
    {"name": "Bucket Hat", "patternUrl": f"{BASE}Bucket%20Hat.json", "rarityPermille": 20},
    {"name": "Bull of Heaven", "patternUrl": f"{BASE}Bull%20of%20Heaven.json", "rarityPermille": 20},
    {"name": "Bunny Ears", "patternUrl": f"{BASE}Bunny%20Ears.json", "rarityPermille": 20},
    {"name": "Cactus", "patternUrl": f"{BASE}Cactus.json", "rarityPermille": 20},
    {"name": "Calm Wolf", "patternUrl": f"{BASE}Calm%20Wolf.json", "rarityPermille": 20},
    {"name": "Candle", "patternUrl": f"{BASE}Candle.json", "rarityPermille": 20},
    {"name": "Candy", "patternUrl": f"{BASE}Candy.json", "rarityPermille": 20},
    {"name": "Cap", "patternUrl": f"{BASE}Cap.json", "rarityPermille": 20},
    {"name": "Car", "patternUrl": f"{BASE}Car.json", "rarityPermille": 20},
    {"name": "Cash", "patternUrl": f"{BASE}Cash.json", "rarityPermille": 20},
    {"name": "Champagne", "patternUrl": f"{BASE}Champagne.json", "rarityPermille": 20},
    {"name": "Cheese", "patternUrl": f"{BASE}Cheese.json", "rarityPermille": 20},
    {"name": "Chest", "patternUrl": f"{BASE}Chest.json", "rarityPermille": 20},
    {"name": "Chili", "patternUrl": f"{BASE}Chili.json", "rarityPermille": 20},
    {"name": "Clubs", "patternUrl": f"{BASE}Clubs.json", "rarityPermille": 20},
    {"name": "Cobra", "patternUrl": f"{BASE}Cobra.json", "rarityPermille": 20},
    {"name": "Coconut", "patternUrl": f"{BASE}Coconut.json", "rarityPermille": 20},
    {"name": "Coffee Bean", "patternUrl": f"{BASE}Coffee%20Bean.json", "rarityPermille": 20},
    {"name": "Coin Purse", "patternUrl": f"{BASE}Coin%20Purse.json", "rarityPermille": 20},
]

# Сначала получаем текущие данные подарка
res = requests.get(
    f"{BASE_URL}/admin/api/gifts/{GIFT_ID}",
    cookies={"adminAuth": "Test"}
)
gift = res.json().get("gift", {})

data = {
    "canUpgrade": gift.get("canUpgrade", True),
    "upgradePrice": gift.get("upgradePrice", 100),
    "upgradeModels": gift.get("upgradeModels", []),
    "upgradePatterns": patterns,
    "upgradeBackdrops": gift.get("upgradeBackdrops", []),
}

res = requests.patch(
    f"{BASE_URL}/admin/api/gifts/{GIFT_ID}/upgrade-settings",
    json=data,
    cookies={"adminAuth": "Test"}
)

print(f"Status: {res.status_code}")
print(f"Added {len(patterns)} patterns for Gem Signet")
print(f"Response: {res.text[:500]}")
