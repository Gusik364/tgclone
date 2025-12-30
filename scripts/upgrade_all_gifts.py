from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import random

# === НАСТРОЙКИ ===
MONGO_URI = "mongodb://127.0.0.1:27017/telegram"

# ID пользователя которому апгрейдим подарки
USER_ID = "6950224c1e27c60459487f0c"


def select_random(items):
    """Выбор случайного элемента с учётом веса (rarityPermille)"""
    if not items:
        return None
    
    total_weight = sum(item.get("rarityPermille", 100) for item in items)
    r = random.random() * total_weight
    
    for item in items:
        r -= item.get("rarityPermille", 100)
        if r <= 0:
            return item
    
    return items[0]


def main():
    client = MongoClient(MONGO_URI)
    db = client.get_database()
    
    usergifts = db["usergifts"]
    gifts = db["gifts"]
    
    # Находим все НЕ апгрейднутые подарки пользователя
    user_gifts = list(usergifts.find({
        "to": ObjectId(USER_ID),
        "isUpgraded": {"$ne": True},
        "isConverted": {"$ne": True}
    }))
    
    print(f"Найдено {len(user_gifts)} подарков для апгрейда")
    
    if not user_gifts:
        print("Нет подарков для апгрейда!")
        return
    
    upgraded_count = 0
    skipped_count = 0
    
    for ug in user_gifts:
        gift_id = ug["gift"]
        gift = gifts.find_one({"_id": gift_id})
        
        if not gift:
            print(f"⚠️  Подарок {gift_id} не найден в каталоге")
            skipped_count += 1
            continue
        
        if not gift.get("canUpgrade", False):
            print(f"⏭️  {gift.get('name', 'Unknown')} - апгрейд недоступен")
            skipped_count += 1
            continue
        
        models = gift.get("upgradeModels", [])
        patterns = gift.get("upgradePatterns", [])
        backdrops = gift.get("upgradeBackdrops", [])
        
        if not models and not patterns and not backdrops:
            print(f"⏭️  {gift.get('name', 'Unknown')} - нет данных для апгрейда")
            skipped_count += 1
            continue
        
        # Считаем уникальный номер
        total_upgraded = usergifts.count_documents({"gift": gift_id, "isUpgraded": True})
        unique_num = total_upgraded + 1
        
        # Генерируем slug
        slug = f"{str(gift_id)[-6:]}-{unique_num}-{hex(int(datetime.now().timestamp()))[2:]}"
        
        # Апгрейдим
        update_data = {
            "isUpgraded": True,
            "uniqueNum": unique_num,
            "slug": slug,
            "upgradeModel": select_random(models),
            "upgradePattern": select_random(patterns),
            "upgradeBackdrop": select_random(backdrops),
            "upgradedAt": datetime.now()
        }
        
        usergifts.update_one({"_id": ug["_id"]}, {"$set": update_data})
        
        model_name = update_data["upgradeModel"].get("name", "?") if update_data["upgradeModel"] else "-"
        pattern_name = update_data["upgradePattern"].get("name", "?") if update_data["upgradePattern"] else "-"
        backdrop_name = update_data["upgradeBackdrop"].get("name", "?") if update_data["upgradeBackdrop"] else "-"
        
        print(f"✅ #{unique_num} {gift.get('name', 'Unknown')} | Model: {model_name} | Pattern: {pattern_name} | Backdrop: {backdrop_name}")
        upgraded_count += 1
    
    print(f"\n{'='*50}")
    print(f"✅ Апгрейднуто: {upgraded_count}")
    print(f"⏭️  Пропущено: {skipped_count}")
    print('='*50)
    
    client.close()


if __name__ == "__main__":
    main()
