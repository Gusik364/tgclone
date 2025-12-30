"""
Отправка "сломанного" подарка (ссылается на несуществующий gift)
"""

import os
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/telegram")

# Конфигурация
TO_USER_ID = "695006c8f4a8a2f605e991aa"
FROM_USER_ID = "695006c8f4a8a2f605e991aa"
MESSAGE = "🎁 Этот подарок сломан"
IS_ANONYMOUS = False

# Фейковый ID подарка (не существует в базе)
FAKE_GIFT_ID = "695108c6ef7659d5edd8974d"

def send_broken_gift():
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()
    usergifts = db.usergifts
    
    user_gift = {
        "gift": ObjectId(FAKE_GIFT_ID),
        "from": ObjectId(FROM_USER_ID),
        "to": ObjectId(TO_USER_ID),
        "message": MESSAGE,
        "isAnonymous": IS_ANONYMOUS,
        "sentAt": datetime.now(),
        "isDisplayed": True,
        "isConverted": False,
    }
    
    usergifts.insert_one(user_gift)
    
    print("✅ Сломанный подарок отправлен!")
    
    client.close()

if __name__ == "__main__":
    send_broken_gift()
