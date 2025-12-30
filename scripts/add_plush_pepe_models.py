import requests

GIFT_ID = "6950263a89ea581bfbea4359"
BASE_URL = "https://verbally-bustling-kiwi.cloudpub.ru"
BASE = "https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/"

models = [
    {"name": "Amalgam", "animationType": "lottie", "animationUrl": f"{BASE}Amalgam.json", "rarityPermille": 100},
    {"name": "Aqua Plush", "animationType": "lottie", "animationUrl": f"{BASE}Aqua%20Plush.json", "rarityPermille": 100},
    {"name": "Barcelona", "animationType": "lottie", "animationUrl": f"{BASE}Barcelona.json", "rarityPermille": 100},
    {"name": "Bavaria", "animationType": "lottie", "animationUrl": f"{BASE}Bavaria.json", "rarityPermille": 100},
    {"name": "Birmingham", "animationType": "lottie", "animationUrl": f"{BASE}Birmingham.json", "rarityPermille": 100},
    {"name": "Christmas", "animationType": "lottie", "animationUrl": f"{BASE}Christmas.json", "rarityPermille": 100},
    {"name": "Cold Heart", "animationType": "lottie", "animationUrl": f"{BASE}Cold%20Heart.json", "rarityPermille": 100},
    {"name": "Cozy Galaxy", "animationType": "lottie", "animationUrl": f"{BASE}Cozy%20Galaxy.json", "rarityPermille": 100},
    {"name": "Donatello", "animationType": "lottie", "animationUrl": f"{BASE}Donatello.json", "rarityPermille": 100},
    {"name": "Eggplant", "animationType": "lottie", "animationUrl": f"{BASE}Eggplant.json", "rarityPermille": 100},
    {"name": "Emerald Plush", "animationType": "lottie", "animationUrl": f"{BASE}Emerald%20Plush.json", "rarityPermille": 100},
    {"name": "Emo Boi", "animationType": "lottie", "animationUrl": f"{BASE}Emo%20Boi.json", "rarityPermille": 100},
    {"name": "Fifty Shades", "animationType": "lottie", "animationUrl": f"{BASE}Fifty%20Shades.json", "rarityPermille": 100},
    {"name": "Frozen", "animationType": "lottie", "animationUrl": f"{BASE}Frozen.json", "rarityPermille": 100},
    {"name": "Gucci Leap", "animationType": "lottie", "animationUrl": f"{BASE}Gucci%20Leap.json", "rarityPermille": 100},
    {"name": "Gummy Frog", "animationType": "lottie", "animationUrl": f"{BASE}Gummy%20Frog.json", "rarityPermille": 100},
    {"name": "Hothead", "animationType": "lottie", "animationUrl": f"{BASE}Hothead.json", "rarityPermille": 100},
    {"name": "Hue Jester", "animationType": "lottie", "animationUrl": f"{BASE}Hue%20Jester.json", "rarityPermille": 100},
    {"name": "Kung Fu Pepe", "animationType": "lottie", "animationUrl": f"{BASE}Kung%20Fu%20Pepe.json", "rarityPermille": 100},
    {"name": "Leonardo", "animationType": "lottie", "animationUrl": f"{BASE}Leonardo.json", "rarityPermille": 100},
    {"name": "Louis Vuittoad", "animationType": "lottie", "animationUrl": f"{BASE}Louis%20Vuittoad.json", "rarityPermille": 100},
    {"name": "Magnate", "animationType": "lottie", "animationUrl": f"{BASE}Magnate.json", "rarityPermille": 100},
    {"name": "Marble", "animationType": "lottie", "animationUrl": f"{BASE}Marble.json", "rarityPermille": 100},
    {"name": "Midas Pepe", "animationType": "lottie", "animationUrl": f"{BASE}Midas%20Pepe.json", "rarityPermille": 100},
    {"name": "Milano", "animationType": "lottie", "animationUrl": f"{BASE}Milano.json", "rarityPermille": 100},
    {"name": "Ninja Mike", "animationType": "lottie", "animationUrl": f"{BASE}Ninja%20Mike.json", "rarityPermille": 100},
    {"name": "Original", "animationType": "lottie", "animationUrl": f"{BASE}Original.json", "rarityPermille": 200},
    {"name": "Pepe La Rana", "animationType": "lottie", "animationUrl": f"{BASE}Pepe%20La%20Rana.json", "rarityPermille": 100},
    {"name": "Pepemint", "animationType": "lottie", "animationUrl": f"{BASE}Pepemint.json", "rarityPermille": 100},
    {"name": "Pink Galaxy", "animationType": "lottie", "animationUrl": f"{BASE}Pink%20Galaxy.json", "rarityPermille": 100},
    {"name": "Pink Latex", "animationType": "lottie", "animationUrl": f"{BASE}Pink%20Latex.json", "rarityPermille": 100},
    {"name": "Poison Dart", "animationType": "lottie", "animationUrl": f"{BASE}Poison%20Dart.json", "rarityPermille": 100},
    {"name": "Polka Dots", "animationType": "lottie", "animationUrl": f"{BASE}Polka%20Dots.json", "rarityPermille": 100},
    {"name": "Princess", "animationType": "lottie", "animationUrl": f"{BASE}Princess.json", "rarityPermille": 100},
    {"name": "Pumpkin", "animationType": "lottie", "animationUrl": f"{BASE}Pumpkin.json", "rarityPermille": 100},
    {"name": "Puppy Pug", "animationType": "lottie", "animationUrl": f"{BASE}Puppy%20Pug.json", "rarityPermille": 100},
    {"name": "Raphael", "animationType": "lottie", "animationUrl": f"{BASE}Raphael.json", "rarityPermille": 100},
    {"name": "Red Menace", "animationType": "lottie", "animationUrl": f"{BASE}Red%20Menace.json", "rarityPermille": 100},
    {"name": "Red Pepple", "animationType": "lottie", "animationUrl": f"{BASE}Red%20Pepple.json", "rarityPermille": 100},
    {"name": "Santa Pepe", "animationType": "lottie", "animationUrl": f"{BASE}Santa%20Pepe.json", "rarityPermille": 100},
    {"name": "Sketchy", "animationType": "lottie", "animationUrl": f"{BASE}Sketchy.json", "rarityPermille": 100},
    {"name": "Spectrum", "animationType": "lottie", "animationUrl": f"{BASE}Spectrum.json", "rarityPermille": 100},
    {"name": "Steel Frog", "animationType": "lottie", "animationUrl": f"{BASE}Steel%20Frog.json", "rarityPermille": 100},
    {"name": "Stripes", "animationType": "lottie", "animationUrl": f"{BASE}Stripes.json", "rarityPermille": 100},
    {"name": "Sunset", "animationType": "lottie", "animationUrl": f"{BASE}Sunset.json", "rarityPermille": 100},
    {"name": "Toading...", "animationType": "lottie", "animationUrl": f"{BASE}Toading....json", "rarityPermille": 100},
    {"name": "Tropical", "animationType": "lottie", "animationUrl": f"{BASE}Tropical.json", "rarityPermille": 100},
    {"name": "Two Face", "animationType": "lottie", "animationUrl": f"{BASE}Two%20Face.json", "rarityPermille": 100},
    {"name": "X-Ray", "animationType": "lottie", "animationUrl": f"{BASE}X-Ray.json", "rarityPermille": 100},
    {"name": "Yellow Hug", "animationType": "lottie", "animationUrl": f"{BASE}Yellow%20Hug.json", "rarityPermille": 100},
    {"name": "Yellow Purp", "animationType": "lottie", "animationUrl": f"{BASE}Yellow%20Purp.json", "rarityPermille": 100},
]

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
