"""
Добавление всех данных для Gem Signet: модели, паттерны, фоны
"""

import requests
import json

# ID подарка Gem Signet - замени на актуальный
GIFT_ID = "REPLACE_WITH_GEM_SIGNET_ID"
BASE_URL = "https://verbally-bustling-kiwi.cloudpub.ru"

# ============ МОДЕЛИ ============
BASE_MODEL = "https://cdn.changes.tg/gifts/models/Gem%20Signet/lottie/"

models = [
    {"name": "Amethyst", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Amethyst.json", "rarityPermille": 20},
    {"name": "Aquamarine", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Aquamarine.json", "rarityPermille": 20},
    {"name": "Citrine", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Citrine.json", "rarityPermille": 20},
    {"name": "Diamond", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Diamond.json", "rarityPermille": 20},
    {"name": "Emerald", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Emerald.json", "rarityPermille": 20},
    {"name": "Garnet", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Garnet.json", "rarityPermille": 20},
    {"name": "Jade", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Jade.json", "rarityPermille": 20},
    {"name": "Kunzite", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Kunzite.json", "rarityPermille": 20},
    {"name": "Lapis Lazuli", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Lapis%20Lazuli.json", "rarityPermille": 20},
    {"name": "Morganite", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Morganite.json", "rarityPermille": 20},
    {"name": "Obsidian", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Obsidian.json", "rarityPermille": 20},
    {"name": "Onyx", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Onyx.json", "rarityPermille": 20},
    {"name": "Opal", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Opal.json", "rarityPermille": 20},
    {"name": "Pearl", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Pearl.json", "rarityPermille": 20},
    {"name": "Peridot", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Peridot.json", "rarityPermille": 20},
    {"name": "Rose Quartz", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Rose%20Quartz.json", "rarityPermille": 20},
    {"name": "Ruby", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Ruby.json", "rarityPermille": 20},
    {"name": "Sapphire", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Sapphire.json", "rarityPermille": 20},
    {"name": "Tanzanite", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Tanzanite.json", "rarityPermille": 20},
    {"name": "Topaz", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Topaz.json", "rarityPermille": 20},
    {"name": "Tourmaline", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Tourmaline.json", "rarityPermille": 20},
    {"name": "Turquoise", "animationType": "lottie", "animationUrl": f"{BASE_MODEL}Turquoise.json", "rarityPermille": 20},
]

# ============ ПАТТЕРНЫ ============
BASE_PATTERN = "https://cdn.changes.tg/gifts/patterns/Gem%20Signet/lottie/"

patterns = [
    {"name": "Academic Cap", "patternUrl": f"{BASE_PATTERN}Academic%20Cap.json", "rarityPermille": 20},
    {"name": "Acorn", "patternUrl": f"{BASE_PATTERN}Acorn.json", "rarityPermille": 20},
    {"name": "Alarm", "patternUrl": f"{BASE_PATTERN}Alarm.json", "rarityPermille": 20},
    {"name": "Alert Serpent", "patternUrl": f"{BASE_PATTERN}Alert%20Serpent.json", "rarityPermille": 20},
    {"name": "Alkonost", "patternUrl": f"{BASE_PATTERN}Alkonost.json", "rarityPermille": 20},
    {"name": "All-Seeing Eye", "patternUrl": f"{BASE_PATTERN}All-Seeing%20Eye.json", "rarityPermille": 20},
    {"name": "Anchor", "patternUrl": f"{BASE_PATTERN}Anchor.json", "rarityPermille": 20},
    {"name": "Anubis", "patternUrl": f"{BASE_PATTERN}Anubis.json", "rarityPermille": 20},
    {"name": "Apple", "patternUrl": f"{BASE_PATTERN}Apple.json", "rarityPermille": 20},
    {"name": "Arabian Horse", "patternUrl": f"{BASE_PATTERN}Arabian%20Horse.json", "rarityPermille": 20},
    {"name": "Astronaut", "patternUrl": f"{BASE_PATTERN}Astronaut.json", "rarityPermille": 20},
    {"name": "Aztec Falcon", "patternUrl": f"{BASE_PATTERN}Aztec%20Falcon.json", "rarityPermille": 20},
    {"name": "Aztec Totem", "patternUrl": f"{BASE_PATTERN}Aztec%20Totem.json", "rarityPermille": 20},
    {"name": "Bandana", "patternUrl": f"{BASE_PATTERN}Bandana.json", "rarityPermille": 20},
    {"name": "Baphomet", "patternUrl": f"{BASE_PATTERN}Baphomet.json", "rarityPermille": 20},
    {"name": "Bastet", "patternUrl": f"{BASE_PATTERN}Bastet.json", "rarityPermille": 20},
    {"name": "Battle Axe", "patternUrl": f"{BASE_PATTERN}Battle%20Axe.json", "rarityPermille": 20},
    {"name": "Bearskin", "patternUrl": f"{BASE_PATTERN}Bearskin.json", "rarityPermille": 20},
    {"name": "Bee", "patternUrl": f"{BASE_PATTERN}Bee.json", "rarityPermille": 20},
    {"name": "Beetle", "patternUrl": f"{BASE_PATTERN}Beetle.json", "rarityPermille": 20},
    {"name": "Beret", "patternUrl": f"{BASE_PATTERN}Beret.json", "rarityPermille": 20},
    {"name": "Bicorne", "patternUrl": f"{BASE_PATTERN}Bicorne.json", "rarityPermille": 20},
    {"name": "Bike Helmet", "patternUrl": f"{BASE_PATTERN}Bike%20Helmet.json", "rarityPermille": 20},
    {"name": "Birthday Cake", "patternUrl": f"{BASE_PATTERN}Birthday%20Cake.json", "rarityPermille": 20},
    {"name": "Bishop", "patternUrl": f"{BASE_PATTERN}Bishop.json", "rarityPermille": 20},
    {"name": "Boat", "patternUrl": f"{BASE_PATTERN}Boat.json", "rarityPermille": 20},
    {"name": "Bobby Helmet", "patternUrl": f"{BASE_PATTERN}Bobby%20Helmet.json", "rarityPermille": 20},
    {"name": "Bone", "patternUrl": f"{BASE_PATTERN}Bone.json", "rarityPermille": 20},
    {"name": "Bottle", "patternUrl": f"{BASE_PATTERN}Bottle.json", "rarityPermille": 20},
    {"name": "Bow Tie", "patternUrl": f"{BASE_PATTERN}Bow%20Tie.json", "rarityPermille": 20},
    {"name": "Bubble Tea", "patternUrl": f"{BASE_PATTERN}Bubble%20Tea.json", "rarityPermille": 20},
    {"name": "Bucket Hat", "patternUrl": f"{BASE_PATTERN}Bucket%20Hat.json", "rarityPermille": 20},
    {"name": "Bull of Heaven", "patternUrl": f"{BASE_PATTERN}Bull%20of%20Heaven.json", "rarityPermille": 20},
    {"name": "Bunny Ears", "patternUrl": f"{BASE_PATTERN}Bunny%20Ears.json", "rarityPermille": 20},
    {"name": "Cactus", "patternUrl": f"{BASE_PATTERN}Cactus.json", "rarityPermille": 20},
    {"name": "Calm Wolf", "patternUrl": f"{BASE_PATTERN}Calm%20Wolf.json", "rarityPermille": 20},
    {"name": "Candle", "patternUrl": f"{BASE_PATTERN}Candle.json", "rarityPermille": 20},
    {"name": "Candy", "patternUrl": f"{BASE_PATTERN}Candy.json", "rarityPermille": 20},
    {"name": "Cap", "patternUrl": f"{BASE_PATTERN}Cap.json", "rarityPermille": 20},
    {"name": "Car", "patternUrl": f"{BASE_PATTERN}Car.json", "rarityPermille": 20},
    {"name": "Cash", "patternUrl": f"{BASE_PATTERN}Cash.json", "rarityPermille": 20},
    {"name": "Champagne", "patternUrl": f"{BASE_PATTERN}Champagne.json", "rarityPermille": 20},
    {"name": "Cheese", "patternUrl": f"{BASE_PATTERN}Cheese.json", "rarityPermille": 20},
    {"name": "Chest", "patternUrl": f"{BASE_PATTERN}Chest.json", "rarityPermille": 20},
    {"name": "Chili", "patternUrl": f"{BASE_PATTERN}Chili.json", "rarityPermille": 20},
    {"name": "Clubs", "patternUrl": f"{BASE_PATTERN}Clubs.json", "rarityPermille": 20},
    {"name": "Cobra", "patternUrl": f"{BASE_PATTERN}Cobra.json", "rarityPermille": 20},
    {"name": "Coconut", "patternUrl": f"{BASE_PATTERN}Coconut.json", "rarityPermille": 20},
    {"name": "Coffee Bean", "patternUrl": f"{BASE_PATTERN}Coffee%20Bean.json", "rarityPermille": 20},
    {"name": "Coin Purse", "patternUrl": f"{BASE_PATTERN}Coin%20Purse.json", "rarityPermille": 20},
]

# ============ ФОНЫ ============
with open("backdrops.json", "r", encoding="utf-8") as f:
    raw_backdrops = json.load(f)

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

# ============ ОТПРАВКА ============
print(f"Models: {len(models)}")
print(f"Patterns: {len(patterns)}")
print(f"Backdrops: {len(backdrops)}")

data = {
    "canUpgrade": True,
    "upgradePrice": 100,
    "upgradeModels": models,
    "upgradePatterns": patterns,
    "upgradeBackdrops": backdrops,
}

res = requests.patch(
    f"{BASE_URL}/admin/api/gifts/{GIFT_ID}/upgrade-settings",
    json=data,
    cookies={"adminAuth": "Test"}
)

print(f"\nStatus: {res.status_code}")
if res.status_code == 200:
    print("✅ Все данные успешно добавлены!")
else:
    print(f"❌ Ошибка: {res.text[:500]}")
