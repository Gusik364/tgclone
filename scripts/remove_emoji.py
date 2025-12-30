"""
Удаление emoji из подарка
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/telegram")

# Имя подарка для обновления
GIFT_NAME = "Plush Pepe"

def remove_emoji():
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()
    gifts = db.gifts
    
    result = gifts.update_one(
        {"name": GIFT_NAME},
        {"$set": {"emoji": ""}}
    )
    
    if result.matched_count > 0:
        print(f"✅ Emoji удалён из подарка '{GIFT_NAME}'")
    else:
        print(f"⚠️ Подарок '{GIFT_NAME}' не найден")
    
    client.close()

if __name__ == "__main__":
    remove_emoji()
