"""
Добавление backdrops для подарка Durov's Cap
"""

import requests

GIFT_ID = "69500be762aa57b6d6d93ef2"
BASE_URL = "http://localhost:3000"

backdrops = [
    {"name": "Black", "centerColor": "#363738", "edgeColor": "#0e0f0f", "patternColor": "#6c6868", "textColor": "#8c8f91", "rarityPermille": 100},
    {"name": "Electric Purple", "centerColor": "#ca70c6", "edgeColor": "#9662d4", "patternColor": "#620fb4", "textColor": "#ebceff", "rarityPermille": 100},
    {"name": "Lavender", "centerColor": "#b789e4", "edgeColor": "#8a5abc", "patternColor": "#5b10ab", "textColor": "#e8d1ff", "rarityPermille": 100},
    {"name": "Cyberpunk", "centerColor": "#858ff3", "edgeColor": "#865fd3", "patternColor": "#4318a6", "textColor": "#e0d9ff", "rarityPermille": 100},
    {"name": "Electric Indigo", "centerColor": "#a980f3", "edgeColor": "#5b62d8", "patternColor": "#3722ab", "textColor": "#d8d8ff", "rarityPermille": 100},
    {"name": "Neon Blue", "centerColor": "#7596f9", "edgeColor": "#6862e4", "patternColor": "#2828bc", "textColor": "#cfddff", "rarityPermille": 100},
    {"name": "Navy Blue", "centerColor": "#6c9edd", "edgeColor": "#5c6ec9", "patternColor": "#1239a2", "textColor": "#d3e1ff", "rarityPermille": 100},
    {"name": "Sapphire", "centerColor": "#58a3c8", "edgeColor": "#5379c2", "patternColor": "#0d45b6", "textColor": "#c1deff", "rarityPermille": 100},
    {"name": "Sky Blue", "centerColor": "#58b4c8", "edgeColor": "#538bc2", "patternColor": "#07609b", "textColor": "#cde8fd", "rarityPermille": 100},
    {"name": "Azure Blue", "centerColor": "#5db1cb", "edgeColor": "#448bab", "patternColor": "#025074", "textColor": "#b5ecff", "rarityPermille": 100},
    {"name": "Pacific Cyan", "centerColor": "#5abea6", "edgeColor": "#3d95ba", "patternColor": "#02648d", "textColor": "#b6efff", "rarityPermille": 100},
    {"name": "Aquamarine", "centerColor": "#60b195", "edgeColor": "#46abb4", "patternColor": "#035f67", "textColor": "#c7fdfe", "rarityPermille": 100},
    {"name": "Pacific Green", "centerColor": "#6fc793", "edgeColor": "#3b9c84", "patternColor": "#006149", "textColor": "#c6fff0", "rarityPermille": 100},
    {"name": "Emerald", "centerColor": "#78c585", "edgeColor": "#42a171", "patternColor": "#006532", "textColor": "#b9f9d9", "rarityPermille": 100},
    {"name": "Mint Green", "centerColor": "#7ecb82", "edgeColor": "#459e5a", "patternColor": "#026b22", "textColor": "#bdffcc", "rarityPermille": 100},
    {"name": "Malachite", "centerColor": "#95b457", "edgeColor": "#3d9755", "patternColor": "#046b06", "textColor": "#c2efbe", "rarityPermille": 100},
    {"name": "Shamrock Green", "centerColor": "#8ab163", "edgeColor": "#559345", "patternColor": "#126b00", "textColor": "#d5fbc8", "rarityPermille": 100},
    {"name": "Lemongrass", "centerColor": "#aeb85a", "edgeColor": "#559345", "patternColor": "#466a07", "textColor": "#d8f2c2", "rarityPermille": 100},
    {"name": "Light Olive", "centerColor": "#c2af64", "edgeColor": "#887e45", "patternColor": "#594c04", "textColor": "#f5ebbc", "rarityPermille": 100},
    {"name": "Satin Gold", "centerColor": "#bf9b47", "edgeColor": "#8d7739", "patternColor": "#5d3b00", "textColor": "#fee4a9", "rarityPermille": 50},
    {"name": "Pure Gold", "centerColor": "#ccab41", "edgeColor": "#987b32", "patternColor": "#703c00", "textColor": "#ffe5ab", "rarityPermille": 50},
    {"name": "Amber", "centerColor": "#dab345", "edgeColor": "#b1802a", "patternColor": "#7a3100", "textColor": "#ffedc7", "rarityPermille": 100},
    {"name": "Caramel", "centerColor": "#d09932", "edgeColor": "#b77431", "patternColor": "#7d3600", "textColor": "#ffd9b3", "rarityPermille": 100},
    {"name": "Orange", "centerColor": "#d19a3a", "edgeColor": "#c06f47", "patternColor": "#9d3907", "textColor": "#ffe1c3", "rarityPermille": 100},
    {"name": "Carrot Juice", "centerColor": "#db9867", "edgeColor": "#c76f4f", "patternColor": "#8e2100", "textColor": "#ffd7ca", "rarityPermille": 100},
    {"name": "Coral Red", "centerColor": "#da896b", "edgeColor": "#c4654f", "patternColor": "#891200", "textColor": "#ffd9d2", "rarityPermille": 100},
    {"name": "Persimmon", "centerColor": "#e7a75a", "edgeColor": "#c5675f", "patternColor": "#ad0e00", "textColor": "#ffe4d7", "rarityPermille": 100},
    {"name": "Strawberry", "centerColor": "#dd8e6f", "edgeColor": "#b75a60", "patternColor": "#a90c0c", "textColor": "#ffd3d3", "rarityPermille": 100},
    {"name": "Raspberry", "centerColor": "#e07b85", "edgeColor": "#b65980", "patternColor": "#890638", "textColor": "#ffd6e6", "rarityPermille": 100},
    {"name": "Mystic Pearl", "centerColor": "#d08b6d", "edgeColor": "#b05770", "patternColor": "#9b0526", "textColor": "#fedde0", "rarityPermille": 100},
    {"name": "Fandango", "centerColor": "#e28ab6", "edgeColor": "#a4588b", "patternColor": "#8e054e", "textColor": "#ffc7eb", "rarityPermille": 100},
    {"name": "Dark Lilac", "centerColor": "#b17da5", "edgeColor": "#8c577a", "patternColor": "#652852", "textColor": "#f0c4e2", "rarityPermille": 100},
    {"name": "English Violet", "centerColor": "#b186bb", "edgeColor": "#875a91", "patternColor": "#54225f", "textColor": "#e6c7ed", "rarityPermille": 100},
    {"name": "Moonstone", "centerColor": "#7eb1b4", "edgeColor": "#588390", "patternColor": "#164552", "textColor": "#daf5fd", "rarityPermille": 100},
    {"name": "Pine Green", "centerColor": "#6ba97c", "edgeColor": "#3e7970", "patternColor": "#0b4833", "textColor": "#d8f5e5", "rarityPermille": 100},
    {"name": "Hunter Green", "centerColor": "#8fae78", "edgeColor": "#4b825b", "patternColor": "#1c491f", "textColor": "#d8f5de", "rarityPermille": 100},
    {"name": "Pistachio", "centerColor": "#97b07c", "edgeColor": "#5c814c", "patternColor": "#28471b", "textColor": "#d9f2c9", "rarityPermille": 100},
    {"name": "Khaki Green", "centerColor": "#adb070", "edgeColor": "#6b7d54", "patternColor": "#39501b", "textColor": "#d3e6bb", "rarityPermille": 100},
    {"name": "Desert Sand", "centerColor": "#b39f82", "edgeColor": "#7e735b", "patternColor": "#504429", "textColor": "#f2e5cd", "rarityPermille": 100},
    {"name": "Cappuccino", "centerColor": "#b1907e", "edgeColor": "#7c6356", "patternColor": "#4a3226", "textColor": "#ebd4c8", "rarityPermille": 100},
    {"name": "Rosewood", "centerColor": "#b77a77", "edgeColor": "#814c52", "patternColor": "#551c22", "textColor": "#edcacd", "rarityPermille": 100},
    {"name": "Ivory White", "centerColor": "#bab6b1", "edgeColor": "#a19d97", "patternColor": "#665f52", "textColor": "#f5f4f2", "rarityPermille": 100},
    {"name": "Platinum", "centerColor": "#b2aea7", "edgeColor": "#88847e", "patternColor": "#3d382d", "textColor": "#e9e7e2", "rarityPermille": 100},
    {"name": "Roman Silver", "centerColor": "#a3a8b5", "edgeColor": "#7c808a", "patternColor": "#3f4550", "textColor": "#dadfe2", "rarityPermille": 100},
    {"name": "Steel Grey", "centerColor": "#97a2ac", "edgeColor": "#63727c", "patternColor": "#334552", "textColor": "#dfe4e8", "rarityPermille": 100},
    {"name": "Silver Blue", "centerColor": "#80a4b8", "edgeColor": "#607c91", "patternColor": "#15374b", "textColor": "#c9e4f4", "rarityPermille": 100},
    {"name": "Burgundy", "centerColor": "#a35e66", "edgeColor": "#6d414a", "patternColor": "#340307", "textColor": "#e7bcc0", "rarityPermille": 100},
    {"name": "Indigo Dye", "centerColor": "#537991", "edgeColor": "#416479", "patternColor": "#031b29", "textColor": "#c2dcee", "rarityPermille": 100},
    {"name": "Midnight Blue", "centerColor": "#5c6985", "edgeColor": "#354057", "patternColor": "#030a18", "textColor": "#bfcce0", "rarityPermille": 100},
    {"name": "Onyx Black", "centerColor": "#4d5254", "edgeColor": "#313638", "patternColor": "#000000", "textColor": "#a9abad", "rarityPermille": 50},
    {"name": "Battleship Grey", "centerColor": "#8c8c85", "edgeColor": "#6c6c66", "patternColor": "#2b2a20", "textColor": "#cfcec4", "rarityPermille": 100},
    {"name": "Purple", "centerColor": "#ae6cae", "edgeColor": "#844784", "patternColor": "#470c47", "textColor": "#f3cbf3", "rarityPermille": 100},
    {"name": "Grape", "centerColor": "#9d74c1", "edgeColor": "#794da0", "patternColor": "#3e0a6b", "textColor": "#e0bdfe", "rarityPermille": 100},
    {"name": "Cobalt Blue", "centerColor": "#6088cf", "edgeColor": "#5162b8", "patternColor": "#13247c", "textColor": "#c2d3f5", "rarityPermille": 100},
    {"name": "French Blue", "centerColor": "#5c9bc4", "edgeColor": "#37739a", "patternColor": "#073b5c", "textColor": "#c1e3f9", "rarityPermille": 100},
    {"name": "Turquoise", "centerColor": "#5ec0b8", "edgeColor": "#3d928e", "patternColor": "#11534c", "textColor": "#bdf8f2", "rarityPermille": 100},
    {"name": "Jade Green", "centerColor": "#55c49c", "edgeColor": "#3b9977", "patternColor": "#044931", "textColor": "#befee7", "rarityPermille": 100},
    {"name": "Copper", "centerColor": "#d08656", "edgeColor": "#9d6531", "patternColor": "#602901", "textColor": "#f4d8be", "rarityPermille": 100},
    {"name": "Chestnut", "centerColor": "#be6f54", "edgeColor": "#994838", "patternColor": "#601508", "textColor": "#fec6b9", "rarityPermille": 100},
    {"name": "Chocolate", "centerColor": "#a46e58", "edgeColor": "#74443b", "patternColor": "#3e0a02", "textColor": "#e4b6ac", "rarityPermille": 100},
    {"name": "Marine Blue", "centerColor": "#4e689c", "edgeColor": "#3b4b7a", "patternColor": "#010821", "textColor": "#bbcbf2", "rarityPermille": 100},
    {"name": "Tactical Pine", "centerColor": "#44826b", "edgeColor": "#2f6369", "patternColor": "#002624", "textColor": "#b7e6d3", "rarityPermille": 100},
    {"name": "Gunship Green", "centerColor": "#558a65", "edgeColor": "#3d6657", "patternColor": "#07261d", "textColor": "#b5e0d4", "rarityPermille": 100},
    {"name": "Dark Green", "centerColor": "#516341", "edgeColor": "#2b452f", "patternColor": "#000501", "textColor": "#bfd1a9", "rarityPermille": 100},
    {"name": "Seal Brown", "centerColor": "#664d45", "edgeColor": "#47362e", "patternColor": "#0a0605", "textColor": "#d4bcb5", "rarityPermille": 100},
    {"name": "Rifle Green", "centerColor": "#64695c", "edgeColor": "#4b5241", "patternColor": "#0f120b", "textColor": "#c3c7bd", "rarityPermille": 100},
    {"name": "Ranger Green", "centerColor": "#5f7849", "edgeColor": "#3c4f3b", "patternColor": "#102209", "textColor": "#b7c4b5", "rarityPermille": 100},
    {"name": "Camo Green", "centerColor": "#75944d", "edgeColor": "#547341", "patternColor": "#163701", "textColor": "#cfe8b9", "rarityPermille": 100},
    {"name": "Feldgrau", "centerColor": "#899288", "edgeColor": "#5e6b63", "patternColor": "#1c261f", "textColor": "#dee9e1", "rarityPermille": 100},
    {"name": "Gunmetal", "centerColor": "#4c5d63", "edgeColor": "#2f3b42", "patternColor": "#04080a", "textColor": "#b6c5cc", "rarityPermille": 100},
    {"name": "Deep Cyan", "centerColor": "#31b5aa", "edgeColor": "#189599", "patternColor": "#004f4f", "textColor": "#d1fffd", "rarityPermille": 100},
    {"name": "Mexican Pink", "centerColor": "#e36692", "edgeColor": "#c9497c", "patternColor": "#750230", "textColor": "#ffd6e6", "rarityPermille": 100},
    {"name": "Tomato", "centerColor": "#e6793e", "edgeColor": "#d44e3f", "patternColor": "#800b00", "textColor": "#ffccbd", "rarityPermille": 100},
    {"name": "Fire Engine", "centerColor": "#f05f4f", "edgeColor": "#c43949", "patternColor": "#690009", "textColor": "#ffb7a6", "rarityPermille": 50},
    {"name": "Celtic Blue", "centerColor": "#45b8ed", "edgeColor": "#3886d9", "patternColor": "#003e85", "textColor": "#c2e7ff", "rarityPermille": 100},
    {"name": "Old Gold", "centerColor": "#b58d38", "edgeColor": "#946925", "patternColor": "#4f3302", "textColor": "#ffdd8c", "rarityPermille": 50},
    {"name": "Burnt Sienna", "centerColor": "#d66f3c", "edgeColor": "#b54b2d", "patternColor": "#6b0902", "textColor": "#ffccb0", "rarityPermille": 100},
    {"name": "Carmine", "centerColor": "#e0574a", "edgeColor": "#a8383b", "patternColor": "#4f0100", "textColor": "#ffb7ad", "rarityPermille": 100},
    {"name": "Mustard", "centerColor": "#d4980d", "edgeColor": "#c47712", "patternColor": "#7a2500", "textColor": "#ffde9c", "rarityPermille": 100},
    {"name": "French Violet", "centerColor": "#c260e6", "edgeColor": "#914ed9", "patternColor": "#4a018a", "textColor": "#ebc7ff", "rarityPermille": 100},
]

def add_backdrops():
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
        "upgradePatterns": gift.get("upgradePatterns", []),
        "upgradeBackdrops": backdrops
    }
    
    res = requests.patch(
        f"{BASE_URL}/admin/api/gifts/{GIFT_ID}/upgrade-settings",
        json=data,
        cookies={"adminAuth": "Test"}
    )
    
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        print(f"✅ Добавлено {len(backdrops)} backdrops")
    else:
        print(f"Error: {res.text}")

if __name__ == "__main__":
    add_backdrops()
