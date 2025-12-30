"""
Восстановление аватара пользователя
"""

import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/telegram")

# ID пользователя user (Tester)
USER_ID = "694fb21fec8be88dcf81d693"

# Дефолтный аватар
DEFAULT_AVATAR = "https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg"

# Или укажи конкретный URL аватара если есть
# NEW_AVATAR = "https://example.com/avatar.jpg"

def fix_avatar():
    client = MongoClient(MONGO_URI)
    db = client.get_default_database()
    users = db.users
    
    # Получаем пользователя
    user = users.find_one({"_id": ObjectId(USER_ID)})
    if not user:
        print("❌ Пользователь не найден")
        return
    
    print(f"👤 Пользователь: {user.get('name')} (@{user.get('username')})")
    print(f"📷 Текущий аватар: {user.get('avatar')}")
    
    # Обновляем аватар
    users.update_one(
        {"_id": ObjectId(USER_ID)},
        {"$set": {"avatar": DEFAULT_AVATAR}}
    )
    
    print(f"✅ Аватар обновлён на: {DEFAULT_AVATAR}")
    
    client.close()

if __name__ == "__main__":
    fix_avatar()
