"""
Добавление моделей для подарка
"""

import requests

GIFT_ID = "69500be762aa57b6d6d93ef2"
BASE_URL = "http://localhost:3000"

BASE = "https://cdn.changes.tg/gifts/models/Durov's%20Cap/lottie/"

models = [
    {"name": "Apple Slice", "animationType": "lottie", "animationUrl": f"{BASE}Apple%20Slice.json", "rarityPermille": 100},
    {"name": "Artwork", "animationType": "lottie", "animationUrl": f"{BASE}Artwork.json", "rarityPermille": 100},
    {"name": "Ashen", "animationType": "lottie", "animationUrl": f"{BASE}Ashen.json", "rarityPermille": 100},
    {"name": "Asterix", "animationType": "lottie", "animationUrl": f"{BASE}Asterix.json", "rarityPermille": 100},
    {"name": "Aurora", "animationType": "lottie", "animationUrl": f"{BASE}Aurora.json", "rarityPermille": 100},
    {"name": "Autumn", "animationType": "lottie", "animationUrl": f"{BASE}Autumn.json", "rarityPermille": 100},
    {"name": "Bluebird", "animationType": "lottie", "animationUrl": f"{BASE}Bluebird.json", "rarityPermille": 100},
    {"name": "Bog Moss", "animationType": "lottie", "animationUrl": f"{BASE}Bog%20Moss.json", "rarityPermille": 100},
    {"name": "Bordeaux", "animationType": "lottie", "animationUrl": f"{BASE}Bordeaux.json", "rarityPermille": 100},
    {"name": "Candy Shade", "animationType": "lottie", "animationUrl": f"{BASE}Candy%20Shade.json", "rarityPermille": 100},
    {"name": "Captain", "animationType": "lottie", "animationUrl": f"{BASE}Captain.json", "rarityPermille": 50},
    {"name": "Cartoon", "animationType": "lottie", "animationUrl": f"{BASE}Cartoon.json", "rarityPermille": 100},
    {"name": "Chicago Bulls", "animationType": "lottie", "animationUrl": f"{BASE}Chicago%20Bulls.json", "rarityPermille": 100},
    {"name": "Classic", "animationType": "lottie", "animationUrl": f"{BASE}Classic.json", "rarityPermille": 100},
    {"name": "Corkwood", "animationType": "lottie", "animationUrl": f"{BASE}Corkwood.json", "rarityPermille": 100},
    {"name": "Cotton Candy", "animationType": "lottie", "animationUrl": f"{BASE}Cotton%20Candy.json", "rarityPermille": 100},
    {"name": "Creamsicle", "animationType": "lottie", "animationUrl": f"{BASE}Creamsicle.json", "rarityPermille": 100},
    {"name": "Dipper", "animationType": "lottie", "animationUrl": f"{BASE}Dipper.json", "rarityPermille": 100},
    {"name": "Duck Tales", "animationType": "lottie", "animationUrl": f"{BASE}Duck%20Tales.json", "rarityPermille": 100},
    {"name": "Duskwave", "animationType": "lottie", "animationUrl": f"{BASE}Duskwave.json", "rarityPermille": 100},
    {"name": "Falcon", "animationType": "lottie", "animationUrl": f"{BASE}Falcon.json", "rarityPermille": 100},
    {"name": "Freshwave", "animationType": "lottie", "animationUrl": f"{BASE}Freshwave.json", "rarityPermille": 100},
    {"name": "Frosted Brew", "animationType": "lottie", "animationUrl": f"{BASE}Frosted%20Brew.json", "rarityPermille": 100},
    {"name": "Frosthorn", "animationType": "lottie", "animationUrl": f"{BASE}Frosthorn.json", "rarityPermille": 100},
    {"name": "Fun Time", "animationType": "lottie", "animationUrl": f"{BASE}Fun%20Time.json", "rarityPermille": 100},
    {"name": "Goldrose", "animationType": "lottie", "animationUrl": f"{BASE}Goldrose.json", "rarityPermille": 50},
    {"name": "Honey Bee", "animationType": "lottie", "animationUrl": f"{BASE}Honey%20Bee.json", "rarityPermille": 100},
    {"name": "Ivory", "animationType": "lottie", "animationUrl": f"{BASE}Ivory.json", "rarityPermille": 100},
    {"name": "Jade", "animationType": "lottie", "animationUrl": f"{BASE}Jade.json", "rarityPermille": 100},
    {"name": "Jetspin", "animationType": "lottie", "animationUrl": f"{BASE}Jetspin.json", "rarityPermille": 100},
    {"name": "Krueger", "animationType": "lottie", "animationUrl": f"{BASE}Krueger.json", "rarityPermille": 100},
    {"name": "Macintosh", "animationType": "lottie", "animationUrl": f"{BASE}Macintosh.json", "rarityPermille": 100},
    {"name": "Mossy", "animationType": "lottie", "animationUrl": f"{BASE}Mossy.json", "rarityPermille": 100},
    {"name": "Negative", "animationType": "lottie", "animationUrl": f"{BASE}Negative.json", "rarityPermille": 100},
    {"name": "Neon", "animationType": "lottie", "animationUrl": f"{BASE}Neon.json", "rarityPermille": 100},
    {"name": "Night Ivy", "animationType": "lottie", "animationUrl": f"{BASE}Night%20Ivy.json", "rarityPermille": 100},
    {"name": "Nightshade", "animationType": "lottie", "animationUrl": f"{BASE}Nightshade.json", "rarityPermille": 100},
    {"name": "Original", "animationType": "lottie", "animationUrl": f"{BASE}Original.json", "rarityPermille": 200},
    {"name": "Patriot", "animationType": "lottie", "animationUrl": f"{BASE}Patriot.json", "rarityPermille": 100},
    {"name": "Pink Pop", "animationType": "lottie", "animationUrl": f"{BASE}Pink%20Pop.json", "rarityPermille": 100},
    {"name": "Pinkie Cap", "animationType": "lottie", "animationUrl": f"{BASE}Pinkie%20Cap.json", "rarityPermille": 100},
    {"name": "Pokemon", "animationType": "lottie", "animationUrl": f"{BASE}Pokemon.json", "rarityPermille": 100},
    {"name": "Redrum", "animationType": "lottie", "animationUrl": f"{BASE}Redrum.json", "rarityPermille": 100},
    {"name": "RGB Glitch", "animationType": "lottie", "animationUrl": f"{BASE}RGB%20Glitch.json", "rarityPermille": 50},
    {"name": "Sea Sunset", "animationType": "lottie", "animationUrl": f"{BASE}Sea%20Sunset.json", "rarityPermille": 100},
    {"name": "Seabreeze", "animationType": "lottie", "animationUrl": f"{BASE}Seabreeze.json", "rarityPermille": 100},
    {"name": "Sepium", "animationType": "lottie", "animationUrl": f"{BASE}Sepium.json", "rarityPermille": 100},
    {"name": "Shadeux", "animationType": "lottie", "animationUrl": f"{BASE}Shadeux.json", "rarityPermille": 100},
    {"name": "Shadow", "animationType": "lottie", "animationUrl": f"{BASE}Shadow.json", "rarityPermille": 100},
    {"name": "Sky High", "animationType": "lottie", "animationUrl": f"{BASE}Sky%20High.json", "rarityPermille": 100},
    {"name": "Snowfall", "animationType": "lottie", "animationUrl": f"{BASE}Snowfall.json", "rarityPermille": 100},
    {"name": "Sunrise", "animationType": "lottie", "animationUrl": f"{BASE}Sunrise.json", "rarityPermille": 100},
    {"name": "Toxic Guy", "animationType": "lottie", "animationUrl": f"{BASE}Toxic%20Guy.json", "rarityPermille": 100},
    {"name": "Tron", "animationType": "lottie", "animationUrl": f"{BASE}Tron.json", "rarityPermille": 100},
    {"name": "Villager", "animationType": "lottie", "animationUrl": f"{BASE}Villager.json", "rarityPermille": 100},
    {"name": "Voltage", "animationType": "lottie", "animationUrl": f"{BASE}Voltage.json", "rarityPermille": 100},
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
