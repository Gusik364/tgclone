import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

# === НАСТРОЙКИ ===
BASE_URL = "https://verbally-bustling-kiwi.cloudpub.ru/api"

# Аккаунт отправителя
SENDER_USERNAME = "test"
SENDER_PASSWORD = "123456"

# ID получателя (testtstt)
RECIPIENT_USER_ID = "6950224c1e27c60459487f0c"

# Сколько подарков отправить
GIFTS_COUNT = 500

# ID подарка (Gem Signet)
GIFT_ID = "69503322b00bafb88fc994db"

# Сообщение к подарку (опционально)
MESSAGE = "123"

# Анонимно?
IS_ANONYMOUS = False

# Количество потоков (чем больше - тем быстрее, но сервер может не выдержать)
MAX_WORKERS = 50

# Счётчики
success_count = 0
fail_count = 0
lock = threading.Lock()
stop_flag = False


def send_gift(session, gift_num):
    """Отправка одного подарка"""
    global success_count, fail_count, stop_flag
    
    if stop_flag:
        return None
    
    try:
        resp = session.post(f"{BASE_URL}/gifts/send", json={
            "giftId": GIFT_ID,
            "toUserId": RECIPIENT_USER_ID,
            "message": MESSAGE,
            "isAnonymous": IS_ANONYMOUS
        }, timeout=30)
        
        with lock:
            if resp.status_code == 201:
                success_count += 1
                print(f"✓ [{success_count}/{GIFTS_COUNT}] Подарок отправлен!")
                return True
            else:
                fail_count += 1
                error_msg = resp.json().get('message', resp.text)
                print(f"✗ Ошибка: {error_msg}")
                if "Not enough Stars" in str(error_msg):
                    stop_flag = True
                return False
    except Exception as e:
        with lock:
            fail_count += 1
            print(f"✗ Ошибка сети: {e}")
        return False


def main():
    global success_count, fail_count, stop_flag
    
    session = requests.Session()
    
    # Увеличиваем пул соединений для скорости
    adapter = requests.adapters.HTTPAdapter(
        pool_connections=MAX_WORKERS,
        pool_maxsize=MAX_WORKERS,
        max_retries=0
    )
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    # 1. Логинимся
    print(f"Логинимся как {SENDER_USERNAME}...")
    login_resp = session.post(f"{BASE_URL}/user/login", json={
        "username": SENDER_USERNAME,
        "password": SENDER_PASSWORD
    })
    
    if login_resp.status_code != 200:
        print(f"Ошибка логина: {login_resp.text}")
        return
    
    print("Успешно залогинились!")
    
    # 2. Проверяем баланс
    balance_resp = session.get(f"{BASE_URL}/gifts/stars")
    if balance_resp.status_code == 200:
        stars = balance_resp.json()["data"]["stars"]
        print(f"Баланс Stars: {stars}")
    
    # 3. Отправляем подарки параллельно
    print(f"\n🚀 Запуск отправки {GIFTS_COUNT} подарков ({MAX_WORKERS} потоков)...\n")
    
    import time
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            executor.submit(send_gift, session, i) 
            for i in range(GIFTS_COUNT)
        ]
        
        # Ждём завершения всех
        for future in as_completed(futures):
            if stop_flag:
                break
    
    elapsed = time.time() - start_time
    
    print(f"\n{'='*50}")
    print(f"✅ Отправлено: {success_count}")
    print(f"❌ Ошибок: {fail_count}")
    print(f"⏱️  Время: {elapsed:.2f} сек")
    print(f"📊 Скорость: {success_count/elapsed:.1f} подарков/сек")
    print('='*50)


if __name__ == "__main__":
    main()
