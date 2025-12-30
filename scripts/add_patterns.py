"""
Добавление паттернов для подарка Durov's Cap
"""

import requests

GIFT_ID = "69500be762aa57b6d6d93ef2"
BASE_URL = "http://localhost:3000"
BASE = "https://cdn.changes.tg/gifts/patterns/Durov%27s%20Cap/lottie/"

patterns = [
    {"name": "Acorn", "patternUrl": f"{BASE}Acorn.json", "rarityPermille": 100},
    {"name": "Alkonost", "patternUrl": f"{BASE}Alkonost.json", "rarityPermille": 100},
    {"name": "Anchor", "patternUrl": f"{BASE}Anchor.json", "rarityPermille": 100},
    {"name": "Apple", "patternUrl": f"{BASE}Apple.json", "rarityPermille": 100},
    {"name": "Arabian Horse", "patternUrl": f"{BASE}Arabian%20Horse.json", "rarityPermille": 100},
    {"name": "Avocado", "patternUrl": f"{BASE}Avocado.json", "rarityPermille": 100},
    {"name": "Baphomet", "patternUrl": f"{BASE}Baphomet.json", "rarityPermille": 50},
    {"name": "Bastet", "patternUrl": f"{BASE}Bastet.json", "rarityPermille": 100},
    {"name": "Bee", "patternUrl": f"{BASE}Bee.json", "rarityPermille": 100},
    {"name": "Beetle", "patternUrl": f"{BASE}Beetle.json", "rarityPermille": 100},
    {"name": "Birthday Cake", "patternUrl": f"{BASE}Birthday%20Cake.json", "rarityPermille": 100},
    {"name": "Bishop", "patternUrl": f"{BASE}Bishop.json", "rarityPermille": 100},
    {"name": "Blood Drop", "patternUrl": f"{BASE}Blood%20Drop.json", "rarityPermille": 100},
    {"name": "Bone", "patternUrl": f"{BASE}Bone.json", "rarityPermille": 100},
    {"name": "Book", "patternUrl": f"{BASE}Book.json", "rarityPermille": 100},
    {"name": "Bottlenose", "patternUrl": f"{BASE}Bottlenose.json", "rarityPermille": 100},
    {"name": "Bow Tie", "patternUrl": f"{BASE}Bow%20Tie.json", "rarityPermille": 100},
    {"name": "Brain", "patternUrl": f"{BASE}Brain.json", "rarityPermille": 100},
    {"name": "Bubble Tea", "patternUrl": f"{BASE}Bubble%20Tea.json", "rarityPermille": 100},
    {"name": "Bubbles", "patternUrl": f"{BASE}Bubbles.json", "rarityPermille": 100},
    {"name": "Bull of Heaven", "patternUrl": f"{BASE}Bull%20of%20Heaven.json", "rarityPermille": 100},
    {"name": "Bunny Ears", "patternUrl": f"{BASE}Bunny%20Ears.json", "rarityPermille": 100},
    {"name": "Bunny", "patternUrl": f"{BASE}Bunny.json", "rarityPermille": 100},
    {"name": "Cactus", "patternUrl": f"{BASE}Cactus.json", "rarityPermille": 100},
    {"name": "Calm Wolf", "patternUrl": f"{BASE}Calm%20Wolf.json", "rarityPermille": 100},
    {"name": "Candle", "patternUrl": f"{BASE}Candle.json", "rarityPermille": 100},
    {"name": "Candy", "patternUrl": f"{BASE}Candy.json", "rarityPermille": 100},
    {"name": "Cap", "patternUrl": f"{BASE}Cap.json", "rarityPermille": 100},
    {"name": "Car", "patternUrl": f"{BASE}Car.json", "rarityPermille": 100},
    {"name": "Carambola", "patternUrl": f"{BASE}Carambola.json", "rarityPermille": 100},
    {"name": "Carrot", "patternUrl": f"{BASE}Carrot.json", "rarityPermille": 100},
    {"name": "Cash", "patternUrl": f"{BASE}Cash.json", "rarityPermille": 100},
    {"name": "Cat Mask", "patternUrl": f"{BASE}Cat%20Mask.json", "rarityPermille": 100},
    {"name": "Celtic Cross", "patternUrl": f"{BASE}Celtic%20Cross.json", "rarityPermille": 100},
    {"name": "Celtic Wolf", "patternUrl": f"{BASE}Celtic%20Wolf.json", "rarityPermille": 100},
    {"name": "Champagne", "patternUrl": f"{BASE}Champagne.json", "rarityPermille": 100},
    {"name": "Cheese", "patternUrl": f"{BASE}Cheese.json", "rarityPermille": 100},
    {"name": "Cherry", "patternUrl": f"{BASE}Cherry.json", "rarityPermille": 100},
    {"name": "Chest", "patternUrl": f"{BASE}Chest.json", "rarityPermille": 100},
    {"name": "Chili Pepper", "patternUrl": f"{BASE}Chili%20Pepper.json", "rarityPermille": 100},
    {"name": "Cicada", "patternUrl": f"{BASE}Cicada.json", "rarityPermille": 100},
    {"name": "Clubs", "patternUrl": f"{BASE}Clubs.json", "rarityPermille": 100},
    {"name": "Coat of Arms", "patternUrl": f"{BASE}Coat%20of%20Arms.json", "rarityPermille": 100},
    {"name": "Cobra", "patternUrl": f"{BASE}Cobra.json", "rarityPermille": 100},
    {"name": "Cocktail", "patternUrl": f"{BASE}Cocktail.json", "rarityPermille": 100},
    {"name": "Coconut", "patternUrl": f"{BASE}Coconut.json", "rarityPermille": 100},
    {"name": "Coffee Bean", "patternUrl": f"{BASE}Coffee%20Bean.json", "rarityPermille": 100},
    {"name": "Coin Purse", "patternUrl": f"{BASE}Coin%20Purse.json", "rarityPermille": 100},
    {"name": "Coin", "patternUrl": f"{BASE}Coin.json", "rarityPermille": 100},
    {"name": "Conch", "patternUrl": f"{BASE}Conch.json", "rarityPermille": 100},
    {"name": "Cone", "patternUrl": f"{BASE}Cone.json", "rarityPermille": 100},
    {"name": "Croissant", "patternUrl": f"{BASE}Croissant.json", "rarityPermille": 100},
    {"name": "Crown", "patternUrl": f"{BASE}Crown.json", "rarityPermille": 50},
    {"name": "Crusader", "patternUrl": f"{BASE}Crusader.json", "rarityPermille": 100},
    {"name": "Cursor", "patternUrl": f"{BASE}Cursor.json", "rarityPermille": 100},
    {"name": "Diamond", "patternUrl": f"{BASE}Diamond.json", "rarityPermille": 50},
    {"name": "Diamonds", "patternUrl": f"{BASE}Diamonds.json", "rarityPermille": 100},
    {"name": "Dice", "patternUrl": f"{BASE}Dice.json", "rarityPermille": 100},
    {"name": "Doberman", "patternUrl": f"{BASE}Doberman.json", "rarityPermille": 100},
    {"name": "Dolphin", "patternUrl": f"{BASE}Dolphin.json", "rarityPermille": 100},
    {"name": "Drug", "patternUrl": f"{BASE}Drug.json", "rarityPermille": 100},
    {"name": "Eagle", "patternUrl": f"{BASE}Eagle.json", "rarityPermille": 100},
    {"name": "Eikthyrnir", "patternUrl": f"{BASE}Eikthyrnir.json", "rarityPermille": 100},
    {"name": "Fehu Rune", "patternUrl": f"{BASE}Fehu%20Rune.json", "rarityPermille": 100},
    {"name": "Fenrir", "patternUrl": f"{BASE}Fenrir.json", "rarityPermille": 100},
    {"name": "Firebird", "patternUrl": f"{BASE}Firebird.json", "rarityPermille": 100},
    {"name": "Fish Skeleton", "patternUrl": f"{BASE}Fish%20Skeleton.json", "rarityPermille": 100},
    {"name": "Flamingo", "patternUrl": f"{BASE}Flamingo.json", "rarityPermille": 100},
    {"name": "Flashlight", "patternUrl": f"{BASE}Flashlight.json", "rarityPermille": 100},
    {"name": "Fleur-de-lis", "patternUrl": f"{BASE}Fleur-de-lis.json", "rarityPermille": 100},
]

def add_patterns():
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
        "upgradeBackdrops": gift.get("upgradeBackdrops", [])
    }
    
    res = requests.patch(
        f"{BASE_URL}/admin/api/gifts/{GIFT_ID}/upgrade-settings",
        json=data,
        cookies={"adminAuth": "Test"}
    )
    
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        print(f"✅ Добавлено {len(patterns)} паттернов")
    else:
        print(f"Error: {res.text}")

if __name__ == "__main__":
    add_patterns()
