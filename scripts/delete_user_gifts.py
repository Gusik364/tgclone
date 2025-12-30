from pymongo import MongoClient
from bson import ObjectId

# === НАСТРОЙКИ ===
MONGO_URI = "mongodb://127.0.0.1:27017/telegram"

# ID пользователя у которого удаляем подарки
USER_ID = "694ed9dabea9adbdfa6c6ec8"


def main():
    client = MongoClient(MONGO_URI)
    db = client.get_database()
    
    usergifts = db["usergifts"]
    users = db["users"]
    
    # Считаем сколько подарков
    count = usergifts.count_documents({"to": ObjectId(USER_ID)})
    print(f"Найдено {count} подарков у пользователя {USER_ID}")
    
    if count == 0:
        print("Нечего удалять!")
        return
    
    # Снимаем надетый подарок если есть
    users.update_one(
        {"_id": ObjectId(USER_ID)},
        {"$set": {"wornGift": None}}
    )
    
    # Удаляем все подарки
    result = usergifts.delete_many({"to": ObjectId(USER_ID)})
    
    print(f"✅ Удалено {result.deleted_count} подарков")
    
    client.close()


if __name__ == "__main__":
    main()
