import requests

GIFT_ID = "6950263a89ea581bfbea4359"
BASE_URL = "https://verbally-bustling-kiwi.cloudpub.ru"

backdrops = [
    {"name": "English Violet", "centerColor": "#b186bb", "edgeColor": "#875a91", "patternColor": "#54225f", "textColor": "#e6c7ed", "rarityPermille": 10},
    {"name": "Pacific Green", "centerColor": "#6fc793", "edgeColor": "#3b9c84", "patternColor": "#006149", "textColor": "#c6fff0", "rarityPermille": 10},
    {"name": "Chestnut", "centerColor": "#be6f54", "edgeColor": "#994838", "patternColor": "#601508", "textColor": "#fec6b9", "rarityPermille": 15},
    {"name": "Electric Indigo", "centerColor": "#a980f3", "edgeColor": "#5b62d8", "patternColor": "#3722ab", "textColor": "#d8d8ff", "rarityPermille": 20},
    {"name": "Pine Green", "centerColor": "#6ba97c", "edgeColor": "#3e7970", "patternColor": "#0b4833", "textColor": "#d8f5e5", "rarityPermille": 20},
    {"name": "Purple", "centerColor": "#ae6cae", "edgeColor": "#844784", "patternColor": "#470c47", "textColor": "#f3cbf3", "rarityPermille": 10},
    {"name": "Orange", "centerColor": "#d19a3a", "edgeColor": "#c06f47", "patternColor": "#9d3907", "textColor": "#ffe1c3", "rarityPermille": 15},
    {"name": "Indigo Dye", "centerColor": "#537991", "edgeColor": "#416479", "patternColor": "#031b29", "textColor": "#c2dcee", "rarityPermille": 20},
    {"name": "Electric Purple", "centerColor": "#ca70c6", "edgeColor": "#9662d4", "patternColor": "#620fb4", "textColor": "#ebceff", "rarityPermille": 20},
    {"name": "Pure Gold", "centerColor": "#ccab41", "edgeColor": "#987b32", "patternColor": "#703c00", "textColor": "#ffe5ab", "rarityPermille": 10},
    {"name": "Neon Blue", "centerColor": "#7596f9", "edgeColor": "#6862e4", "patternColor": "#2828bc", "textColor": "#cfddff", "rarityPermille": 20},
    {"name": "Rosewood", "centerColor": "#b77a77", "edgeColor": "#814c52", "patternColor": "#551c22", "textColor": "#edcacd", "rarityPermille": 20},
    {"name": "Battleship Grey", "centerColor": "#8c8c85", "edgeColor": "#6c6c66", "patternColor": "#2b2a20", "textColor": "#cfcec4", "rarityPermille": 20},
    {"name": "Pacific Cyan", "centerColor": "#5abea6", "edgeColor": "#3d95ba", "patternColor": "#02648d", "textColor": "#b6efff", "rarityPermille": 15},
    {"name": "Jade Green", "centerColor": "#55c49c", "edgeColor": "#3b9977", "patternColor": "#044931", "textColor": "#befee7", "rarityPermille": 20},
    {"name": "Fandango", "centerColor": "#e28ab6", "edgeColor": "#a4588b", "patternColor": "#8e054e", "textColor": "#ffc7eb", "rarityPermille": 20},
    {"name": "Lavender", "centerColor": "#b789e4", "edgeColor": "#8a5abc", "patternColor": "#5b10ab", "textColor": "#e8d1ff", "rarityPermille": 20},
    {"name": "Aquamarine", "centerColor": "#60b195", "edgeColor": "#46abb4", "patternColor": "#035f67", "textColor": "#c7fdfe", "rarityPermille": 10},
    {"name": "Shamrock Green", "centerColor": "#8ab163", "edgeColor": "#559345", "patternColor": "#126b00", "textColor": "#d5fbc8", "rarityPermille": 10},
    {"name": "Midnight Blue", "centerColor": "#5c6985", "edgeColor": "#354057", "patternColor": "#030a18", "textColor": "#bfcce0", "rarityPermille": 15},
    {"name": "Mint Green", "centerColor": "#7ecb82", "edgeColor": "#459e5a", "patternColor": "#026b22", "textColor": "#bdffcc", "rarityPermille": 15},
    {"name": "Desert Sand", "centerColor": "#b39f82", "edgeColor": "#7e735b", "patternColor": "#504429", "textColor": "#f2e5cd", "rarityPermille": 15},
    {"name": "Strawberry", "centerColor": "#dd8e6f", "edgeColor": "#b75a60", "patternColor": "#a90c0c", "textColor": "#ffd3d3", "rarityPermille": 20},
    {"name": "Cobalt Blue", "centerColor": "#6088cf", "edgeColor": "#5162b8", "patternColor": "#13247c", "textColor": "#c2d3f5", "rarityPermille": 15},
    {"name": "French Blue", "centerColor": "#5c9bc4", "edgeColor": "#37739a", "patternColor": "#073b5c", "textColor": "#c1e3f9", "rarityPermille": 20},
    {"name": "Platinum", "centerColor": "#b2aea7", "edgeColor": "#88847e", "patternColor": "#3d382d", "textColor": "#e9e7e2", "rarityPermille": 20},
    {"name": "Steel Grey", "centerColor": "#97a2ac", "edgeColor": "#63727c", "patternColor": "#334552", "textColor": "#dfe4e8", "rarityPermille": 20},
    {"name": "Amber", "centerColor": "#dab345", "edgeColor": "#b1802a", "patternColor": "#7a3100", "textColor": "#ffedc7", "rarityPermille": 15},
    {"name": "Onyx Black", "centerColor": "#4d5254", "edgeColor": "#313638", "patternColor": "#000000", "textColor": "#a9abad", "rarityPermille": 20},
    {"name": "Satin Gold", "centerColor": "#bf9b47", "edgeColor": "#8d7739", "patternColor": "#5d3b00", "textColor": "#fee4a9", "rarityPermille": 20},
    {"name": "Caramel", "centerColor": "#d09932", "edgeColor": "#b77431", "patternColor": "#7d3600", "textColor": "#ffd9b3", "rarityPermille": 20},
    {"name": "Lemongrass", "centerColor": "#aeb85a", "edgeColor": "#559345", "patternColor": "#466a07", "textColor": "#d8f2c2", "rarityPermille": 20},
    {"name": "Grape", "centerColor": "#9d74c1", "edgeColor": "#794da0", "patternColor": "#3e0a6b", "textColor": "#e0bdfe", "rarityPermille": 20},
    {"name": "Sapphire", "centerColor": "#58a3c8", "edgeColor": "#5379c2", "patternColor": "#0d45b6", "textColor": "#c1deff", "rarityPermille": 20},
    {"name": "Sky Blue", "centerColor": "#58b4c8", "edgeColor": "#538bc2", "patternColor": "#07609b", "textColor": "#cde8fd", "rarityPermille": 10},
    {"name": "Cyberpunk", "centerColor": "#858ff3", "edgeColor": "#865fd3", "patternColor": "#4318a6", "textColor": "#e0d9ff", "rarityPermille": 15},
    {"name": "Coral Red", "centerColor": "#da896b", "edgeColor": "#c4654f", "patternColor": "#891200", "textColor": "#ffd9d2", "rarityPermille": 15},
    {"name": "Burgundy", "centerColor": "#a35e66", "edgeColor": "#6d414a", "patternColor": "#340307", "textColor": "#e7bcc0", "rarityPermille": 15},
    {"name": "Hunter Green", "centerColor": "#8fae78", "edgeColor": "#4b825b", "patternColor": "#1c491f", "textColor": "#d8f5de", "rarityPermille": 15},
    {"name": "Khaki Green", "centerColor": "#adb070", "edgeColor": "#6b7d54", "patternColor": "#39501b", "textColor": "#d3e6bb", "rarityPermille": 20},
    {"name": "Raspberry", "centerColor": "#e07b85", "edgeColor": "#b65980", "patternColor": "#890638", "textColor": "#ffd6e6", "rarityPermille": 10},
    {"name": "Emerald", "centerColor": "#78c585", "edgeColor": "#42a171", "patternColor": "#006532", "textColor": "#b9f9d9", "rarityPermille": 20},
    {"name": "Malachite", "centerColor": "#95b457", "edgeColor": "#3d9755", "patternColor": "#046b06", "textColor": "#c2efbe", "rarityPermille": 20},
    {"name": "Turquoise", "centerColor": "#5ec0b8", "edgeColor": "#3d928e", "patternColor": "#11534c", "textColor": "#bdf8f2", "rarityPermille": 15},
    {"name": "Silver Blue", "centerColor": "#80a4b8", "edgeColor": "#607c91", "patternColor": "#15374b", "textColor": "#c9e4f4", "rarityPermille": 20},
    {"name": "Roman Silver", "centerColor": "#a3a8b5", "edgeColor": "#7c808a", "patternColor": "#3f4550", "textColor": "#dadfe2", "rarityPermille": 10},
    {"name": "Moonstone", "centerColor": "#7eb1b4", "edgeColor": "#588390", "patternColor": "#164552", "textColor": "#daf5fd", "rarityPermille": 15},
    {"name": "Light Olive", "centerColor": "#c2af64", "edgeColor": "#887e45", "patternColor": "#594c04", "textColor": "#f5ebbc", "rarityPermille": 20},
    {"name": "Navy Blue", "centerColor": "#6c9edd", "edgeColor": "#5c6ec9", "patternColor": "#1239a2", "textColor": "#d3e1ff", "rarityPermille": 20},
    {"name": "Mystic Pearl", "centerColor": "#d08b6d", "edgeColor": "#b05770", "patternColor": "#9b0526", "textColor": "#fedde0", "rarityPermille": 20},
    {"name": "Carrot Juice", "centerColor": "#db9867", "edgeColor": "#c76f4f", "patternColor": "#8e2100", "textColor": "#ffd7ca", "rarityPermille": 20},
    {"name": "Cappuccino", "centerColor": "#b1907e", "edgeColor": "#7c6356", "patternColor": "#4a3226", "textColor": "#ebd4c8", "rarityPermille": 15},
    {"name": "Dark Lilac", "centerColor": "#b17da5", "edgeColor": "#8c577a", "patternColor": "#652852", "textColor": "#f0c4e2", "rarityPermille": 15},
    {"name": "Azure Blue", "centerColor": "#5db1cb", "edgeColor": "#448bab", "patternColor": "#025074", "textColor": "#b5ecff", "rarityPermille": 10},
    {"name": "Persimmon", "centerColor": "#e7a75a", "edgeColor": "#c5675f", "patternColor": "#ad0e00", "textColor": "#ffe4d7", "rarityPermille": 15},
    {"name": "Chocolate", "centerColor": "#a46e58", "edgeColor": "#74443b", "patternColor": "#3e0a02", "textColor": "#e4b6ac", "rarityPermille": 15},
    {"name": "Pistachio", "centerColor": "#97b07c", "edgeColor": "#5c814c", "patternColor": "#28471b", "textColor": "#d9f2c9", "rarityPermille": 15},
    {"name": "Ivory White", "centerColor": "#bab6b1", "edgeColor": "#a19d97", "patternColor": "#665f52", "textColor": "#f5f4f2", "rarityPermille": 15},
    {"name": "Black", "centerColor": "#363738", "edgeColor": "#0e0f0f", "patternColor": "#6c6868", "textColor": "#8c8f91", "rarityPermille": 20},
    {"name": "Copper", "centerColor": "#d08656", "edgeColor": "#9d6531", "patternColor": "#602901", "textColor": "#f4d8be", "rarityPermille": 20},
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
    "upgradePatterns": gift.get("upgradePatterns", []),
    "upgradeBackdrops": backdrops,
}

res = requests.patch(
    f"{BASE_URL}/admin/api/gifts/{GIFT_ID}/upgrade-settings",
    json=data,
    cookies={"adminAuth": "Test"}
)

print(f"Status: {res.status_code}")
print(f"Response: {res.text[:500]}")
