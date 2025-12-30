"""
Добавление подарка из внешнего API
"""

import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/telegram")

# URL подарка (Lottie JSON)
GIFT_URL = "https://cdn.changes.tg/gifts/originals/5936013938331222567/Original.json"

# Данные подарка
GIFT_CONFIG = {
    "name": "Plush Pepe",
    "emoji": "🐸",
    "price": 2000,           # Первоначальная цена 2000 Stars
    "totalSupply": 3000,     # Изначальное количество 3000
    "releaseDate": "2024-12-01",  # Дата выхода 1 декабря 2024
}

def add_gift():
    # Подключаемся к MongoDB
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()
    gifts = db.gifts
    
    # Создаём подарок
    gift_data = {
        "name": GIFT_CONFIG["name"],
        "emoji": GIFT_CONFIG["emoji"],
        "animationType": "lottie",
        "animationUrl": GIFT_URL,
        "tgsUrl": None,
        "price": GIFT_CONFIG["price"],
        "totalSupply": GIFT_CONFIG["totalSupply"],
        "soldCount": 0,
        "convertRate": 0.85,
        "isActive": True,
        "canUpgrade": True,
        "upgradePrice": 50,
        "upgradeModels": [],
        "upgradePatterns": [],
        "upgradeBackdrops": [],
        "createdAt": datetime.strptime(GIFT_CONFIG["releaseDate"], "%Y-%m-%d"),
    }
    
    # Проверяем существует ли уже
    existing = gifts.find_one({"name": gift_data["name"]})
    if existing:
        print(f"⚠️ Подарок '{gift_data['name']}' уже существует (ID: {existing['_id']})")
        return
    
    result = gifts.insert_one(gift_data)
    
    print(f"\n✅ Подарок добавлен!")
    print(f"   ID: {result.inserted_id}")
    print(f"   Name: {gift_data['name']}")
    print(f"   Price: {gift_data['price']} ⭐")
    print(f"   Animation: {gift_data['animationUrl']}")
    
    client.close()

if __name__ == "__main__":
    add_gift()
