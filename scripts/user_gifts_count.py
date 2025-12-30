"""
Показать количество подарков у пользователя
"""

import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/telegram")

# ID пользователя
USER_ID = "69502025f1d081d2d702b370"

def show_gifts_count():
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()
    users = db.users
    usergifts = db.usergifts
    
    user = users.find_one({"_id": ObjectId(USER_ID)})
    if not user:
        print("❌ Пользователь не найден")
        return
    
    received = usergifts.count_documents({"to": ObjectId(USER_ID)})
    sent = usergifts.count_documents({"from": ObjectId(USER_ID)})
    
    print(f"👤 {user.get('name', user.get('username'))}")
    print(f"📥 Получено: {received}")
    print(f"📤 Отправлено: {sent}")
    
    client.close()

if __name__ == "__main__":
    show_gifts_count()
