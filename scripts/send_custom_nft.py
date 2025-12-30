"""
Отправка обычных подарков пользователю
"""

import os
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/telegram")

# Конфигурация
GIFT_ID = "695108c6ef7659d5edd8974d"
TO_USER_ID = "69511247dad91d4b3e212fac"
FROM_USER_ID = "695006c8f4a8a2f605e991aa"
MESSAGE = "delete"
IS_ANONYMOUS = False

# Количество подарков
NUM_GIFTS = 3

def send_gifts():
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()
    gifts = db.gifts
    usergifts = db.usergifts
    
    # Получаем подарок
    gift = gifts.find_one({"_id": ObjectId(GIFT_ID)})
    if not gift:
        print("❌ Подарок не найден")
        return
    
    print(f"🎁 Подарок: {gift['name']}")
    
    # Проверяем лимит
    total_supply = gift.get("totalSupply")
    sold_count = gift.get("soldCount", 0)
    
    if total_supply:
        available = total_supply - sold_count
        print(f"📊 Доступно: {available}/{total_supply}")
        
        if available <= 0:
            print("❌ Gift sold out!")
            return
        
        if NUM_GIFTS > available:
            print(f"⚠️ Запрошено {NUM_GIFTS}, но доступно только {available}")
            return
    
    print(f"📦 Отправляем {NUM_GIFTS} подарков...\n")
    
    for i in range(NUM_GIFTS):
        user_gift = {
            "gift": ObjectId(GIFT_ID),
            "from": ObjectId(FROM_USER_ID),
            "to": ObjectId(TO_USER_ID),
            "message": MESSAGE,
            "isAnonymous": IS_ANONYMOUS,
            "sentAt": datetime.now(),
            "isDisplayed": True,
            "isConverted": False,
        }
        
        usergifts.insert_one(user_gift)
        
        if (i + 1) % 50 == 0 or i == NUM_GIFTS - 1:
            print(f"✅ Отправлено {i + 1}/{NUM_GIFTS}")
    
    # Увеличиваем счётчик проданных
    gifts.update_one({"_id": ObjectId(GIFT_ID)}, {"$inc": {"soldCount": NUM_GIFTS}})
    
    print(f"\n🎉 Отправлено {NUM_GIFTS} подарков!")
    
    client.close()

if __name__ == "__main__":
    send_gifts()
