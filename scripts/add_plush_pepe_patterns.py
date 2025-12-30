import requests

GIFT_ID = "6950263a89ea581bfbea4359"
BASE_URL = "https://verbally-bustling-kiwi.cloudpub.ru"
BASE = "https://cdn.changes.tg/gifts/patterns/Plush%20Pepe/lottie/"

patterns = [
    {"name": "Acorn", "patternUrl": f"{BASE}Acorn.json", "rarityPermille": 100},
    {"name": "Alarm", "patternUrl": f"{BASE}Alarm.json", "rarityPermille": 100},
    {"name": "Alkonost", "patternUrl": f"{BASE}Alkonost.json", "rarityPermille": 100},
    {"name": "Amour Scoops", "patternUrl": f"{BASE}Amour%20Scoops.json", "rarityPermille": 100},
    {"name": "Anchor", "patternUrl": f"{BASE}Anchor.json", "rarityPermille": 100},
    {"name": "Apple", "patternUrl": f"{BASE}Apple.json", "rarityPermille": 100},
    {"name": "Arabian Horse", "patternUrl": f"{BASE}Arabian%20Horse.json", "rarityPermille": 100},
    {"name": "Aubergine", "patternUrl": f"{BASE}Aubergine.json", "rarityPermille": 100},
    {"name": "Avocado", "patternUrl": f"{BASE}Avocado.json", "rarityPermille": 100},
    {"name": "Bandage", "patternUrl": f"{BASE}Bandage.json", "rarityPermille": 100},
    {"name": "Baphomet", "patternUrl": f"{BASE}Baphomet.json", "rarityPermille": 100},
    {"name": "Bastet", "patternUrl": f"{BASE}Bastet.json", "rarityPermille": 100},
    {"name": "Bee", "patternUrl": f"{BASE}Bee.json", "rarityPermille": 100},
    {"name": "Beetle", "patternUrl": f"{BASE}Beetle.json", "rarityPermille": 100},
    {"name": "Bell Pepper", "patternUrl": f"{BASE}Bell%20Pepper.json", "rarityPermille": 100},
    {"name": "Birthday Cake", "patternUrl": f"{BASE}Birthday%20Cake.json", "rarityPermille": 100},
    {"name": "Bishop", "patternUrl": f"{BASE}Bishop.json", "rarityPermille": 100},
    {"name": "Blood Drop", "patternUrl": f"{BASE}Blood%20Drop.json", "rarityPermille": 100},
    {"name": "Blossom", "patternUrl": f"{BASE}Blossom.json", "rarityPermille": 100},
    {"name": "Boat", "patternUrl": f"{BASE}Boat.json", "rarityPermille": 100},
    {"name": "Bone", "patternUrl": f"{BASE}Bone.json", "rarityPermille": 100},
    {"name": "Book", "patternUrl": f"{BASE}Book.json", "rarityPermille": 100},
    {"name": "Bottle", "patternUrl": f"{BASE}Bottle.json", "rarityPermille": 100},
    {"name": "Bow Tie", "patternUrl": f"{BASE}Bow%20Tie.json", "rarityPermille": 100},
    {"name": "Brain", "patternUrl": f"{BASE}Brain.json", "rarityPermille": 100},
    {"name": "Broken Heart", "patternUrl": f"{BASE}Broken%20Heart.json", "rarityPermille": 100},
    {"name": "Bubble Tea", "patternUrl": f"{BASE}Bubble%20Tea.json", "rarityPermille": 100},
    {"name": "Bubbles", "patternUrl": f"{BASE}Bubbles.json", "rarityPermille": 100},
    {"name": "Bug", "patternUrl": f"{BASE}Bug.json", "rarityPermille": 100},
    {"name": "Bull of Heaven", "patternUrl": f"{BASE}Bull%20of%20Heaven.json", "rarityPermille": 100},
    {"name": "Bunny Ears", "patternUrl": f"{BASE}Bunny%20Ears.json", "rarityPermille": 100},
    {"name": "Bunny", "patternUrl": f"{BASE}Bunny.json", "rarityPermille": 100},
    {"name": "Burger", "patternUrl": f"{BASE}Burger.json", "rarityPermille": 100},
    {"name": "Butterfly", "patternUrl": f"{BASE}Butterfly.json", "rarityPermille": 100},
    {"name": "Cactus", "patternUrl": f"{BASE}Cactus.json", "rarityPermille": 100},
    {"name": "Calm Wolf", "patternUrl": f"{BASE}Calm%20Wolf.json", "rarityPermille": 100},
    {"name": "Candle", "patternUrl": f"{BASE}Candle.json", "rarityPermille": 100},
    {"name": "Candy", "patternUrl": f"{BASE}Candy.json", "rarityPermille": 100},
    {"name": "Cap", "patternUrl": f"{BASE}Cap.json", "rarityPermille": 100},
    {"name": "Car", "patternUrl": f"{BASE}Car.json", "rarityPermille": 100},
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
print(f"Response: {res.text[:500]}")
