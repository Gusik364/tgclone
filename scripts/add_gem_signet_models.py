"""
Добавление моделей для подарка Gem Signet
"""

import requests

GIFT_ID = "69503322b00bafb88fc994db"
BASE_URL = "http://localhost:3000"

BASE = "https://cdn.changes.tg/gifts/models/Gem%20Signet/lottie/"

models = [
    {"name": "8 Bit Diamond", "animationType": "lottie", "animationUrl": f"{BASE}8%20Bit%20Diamond.json", "rarityPermille": 100},
    {"name": "Amethyst", "animationType": "lottie", "animationUrl": f"{BASE}Amethyst.json", "rarityPermille": 100},
    {"name": "Arabica", "animationType": "lottie", "animationUrl": f"{BASE}Arabica.json", "rarityPermille": 100},
    {"name": "Arc Reactor", "animationType": "lottie", "animationUrl": f"{BASE}Arc%20Reactor.json", "rarityPermille": 100},
    {"name": "Atomic Bomb", "animationType": "lottie", "animationUrl": f"{BASE}Atomic%20Bomb.json", "rarityPermille": 100},
    {"name": "Black Lotus", "animationType": "lottie", "animationUrl": f"{BASE}Black%20Lotus.json", "rarityPermille": 100},
    {"name": "Blood Opal", "animationType": "lottie", "animationUrl": f"{BASE}Blood%20Opal.json", "rarityPermille": 100},
    {"name": "Bloodstone", "animationType": "lottie", "animationUrl": f"{BASE}Bloodstone.json", "rarityPermille": 100},
    {"name": "Brass Zircon", "animationType": "lottie", "animationUrl": f"{BASE}Brass%20Zircon.json", "rarityPermille": 100},
    {"name": "Bubble Queen", "animationType": "lottie", "animationUrl": f"{BASE}Bubble%20Queen.json", "rarityPermille": 100},
    {"name": "Cold Flame", "animationType": "lottie", "animationUrl": f"{BASE}Cold%20Flame.json", "rarityPermille": 100},
    {"name": "Dark Violet", "animationType": "lottie", "animationUrl": f"{BASE}Dark%20Violet.json", "rarityPermille": 100},
    {"name": "Death Star", "animationType": "lottie", "animationUrl": f"{BASE}Death%20Star.json", "rarityPermille": 100},
    {"name": "Dragon Soul", "animationType": "lottie", "animationUrl": f"{BASE}Dragon%20Soul.json", "rarityPermille": 100},
    {"name": "El Dorado", "animationType": "lottie", "animationUrl": f"{BASE}El%20Dorado.json", "rarityPermille": 100},
    {"name": "Elven Shade", "animationType": "lottie", "animationUrl": f"{BASE}Elven%20Shade.json", "rarityPermille": 100},
    {"name": "Eternal Life", "animationType": "lottie", "animationUrl": f"{BASE}Eternal%20Life.json", "rarityPermille": 100},
    {"name": "Event Horizon", "animationType": "lottie", "animationUrl": f"{BASE}Event%20Horizon.json", "rarityPermille": 100},
    {"name": "Fading Crown", "animationType": "lottie", "animationUrl": f"{BASE}Fading%20Crown.json", "rarityPermille": 100},
    {"name": "Feral Rage", "animationType": "lottie", "animationUrl": f"{BASE}Feral%20Rage.json", "rarityPermille": 100},
    {"name": "Fire Stone", "animationType": "lottie", "animationUrl": f"{BASE}Fire%20Stone.json", "rarityPermille": 100},
    {"name": "Fleur de Mer", "animationType": "lottie", "animationUrl": f"{BASE}Fleur%20de%20Mer.json", "rarityPermille": 100},
    {"name": "Green Beryl", "animationType": "lottie", "animationUrl": f"{BASE}Green%20Beryl.json", "rarityPermille": 100},
    {"name": "Helios", "animationType": "lottie", "animationUrl": f"{BASE}Helios.json", "rarityPermille": 100},
    {"name": "Hot Cherry", "animationType": "lottie", "animationUrl": f"{BASE}Hot%20Cherry.json", "rarityPermille": 100},
    {"name": "Jet Black", "animationType": "lottie", "animationUrl": f"{BASE}Jet%20Black.json", "rarityPermille": 100},
    {"name": "Love Seal", "animationType": "lottie", "animationUrl": f"{BASE}Love%20Seal.json", "rarityPermille": 100},
    {"name": "Malachite", "animationType": "lottie", "animationUrl": f"{BASE}Malachite.json", "rarityPermille": 100},
    {"name": "Malibu Pink", "animationType": "lottie", "animationUrl": f"{BASE}Malibu%20Pink.json", "rarityPermille": 100},
    {"name": "Molten Core", "animationType": "lottie", "animationUrl": f"{BASE}Molten%20Core.json", "rarityPermille": 100},
    {"name": "Moonstone", "animationType": "lottie", "animationUrl": f"{BASE}Moonstone.json", "rarityPermille": 100},
    {"name": "Neon Signet", "animationType": "lottie", "animationUrl": f"{BASE}Neon%20Signet.json", "rarityPermille": 100},
    {"name": "Night King", "animationType": "lottie", "animationUrl": f"{BASE}Night%20King.json", "rarityPermille": 100},
    {"name": "Nuclear Core", "animationType": "lottie", "animationUrl": f"{BASE}Nuclear%20Core.json", "rarityPermille": 100},
    {"name": "Ogre's Kiss", "animationType": "lottie", "animationUrl": f"{BASE}Ogre's%20Kiss.json", "rarityPermille": 100},
    {"name": "Old Bronze", "animationType": "lottie", "animationUrl": f"{BASE}Old%20Bronze.json", "rarityPermille": 100},
    {"name": "Original", "animationType": "lottie", "animationUrl": f"{BASE}Original.json", "rarityPermille": 200},
    {"name": "Paper Topaz", "animationType": "lottie", "animationUrl": f"{BASE}Paper%20Topaz.json", "rarityPermille": 100},
    {"name": "Pearl Eye", "animationType": "lottie", "animationUrl": f"{BASE}Pearl%20Eye.json", "rarityPermille": 100},
    {"name": "Pink Quartz", "animationType": "lottie", "animationUrl": f"{BASE}Pink%20Quartz.json", "rarityPermille": 100},
    {"name": "Pixel Emerald", "animationType": "lottie", "animationUrl": f"{BASE}Pixel%20Emerald.json", "rarityPermille": 100},
    {"name": "Render", "animationType": "lottie", "animationUrl": f"{BASE}Render.json", "rarityPermille": 100},
    {"name": "Sapphire", "animationType": "lottie", "animationUrl": f"{BASE}Sapphire.json", "rarityPermille": 100},
    {"name": "Sentry Turret", "animationType": "lottie", "animationUrl": f"{BASE}Sentry%20Turret.json", "rarityPermille": 100},
    {"name": "Silver Gold", "animationType": "lottie", "animationUrl": f"{BASE}Silver%20Gold.json", "rarityPermille": 100},
    {"name": "Snake Ruby", "animationType": "lottie", "animationUrl": f"{BASE}Snake%20Ruby.json", "rarityPermille": 100},
    {"name": "Spinny Boi", "animationType": "lottie", "animationUrl": f"{BASE}Spinny%20Boi.json", "rarityPermille": 100},
    {"name": "Sunstone", "animationType": "lottie", "animationUrl": f"{BASE}Sunstone.json", "rarityPermille": 100},
    {"name": "Tanzanite", "animationType": "lottie", "animationUrl": f"{BASE}Tanzanite.json", "rarityPermille": 100},
    {"name": "Timekeeper", "animationType": "lottie", "animationUrl": f"{BASE}Timekeeper.json", "rarityPermille": 100},
    {"name": "Water Lily", "animationType": "lottie", "animationUrl": f"{BASE}Water%20Lily.json", "rarityPermille": 100},
]

def add_models():
    data = {
        "canUpgrade": True,
        "upgradePrice": 100,
        "upgradeModels": models
    }
    
    res = requests.patch(
        f"{BASE_URL}/admin/api/gifts/{GIFT_ID}/upgrade-settings",
        json=data,
        cookies={"adminAuth": "Test"}
    )
    
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}")

if __name__ == "__main__":
    add_models()
