import subprocess
import os
import sys
import signal
import time

# Корневая папка проекта (на уровень выше scripts)
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT_DIR = os.path.join(ROOT_DIR, "client")

processes = []

def cleanup(signum=None, frame=None):
    """Завершить все процессы при выходе"""
    print("\n🛑 Останавливаю все процессы...")
    for proc in processes:
        try:
            proc.terminate()
            proc.wait(timeout=5)
        except:
            proc.kill()
    print("👋 Готово!")
    sys.exit(0)

def run_all():
    # Обработка Ctrl+C
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)
    
    print("🚀 Запуск сервера и клиента...")
    print(f"📁 Корневая папка: {ROOT_DIR}")
    print(f"📁 Папка клиента: {CLIENT_DIR}")
    
    # Запуск бэкенда (npm start в корне)
    print("\n▶️  Запуск бэкенда (nodemon index.js)...")
    backend = subprocess.Popen(
        ["npm", "start"],
        cwd=ROOT_DIR,
        shell=True
    )
    processes.append(backend)
    
    # Небольшая пауза чтобы сервер стартанул
    time.sleep(2)
    
    # Запуск фронтенда (npm start в client)
    print("▶️  Запуск фронтенда (react-scripts start)...")
    frontend = subprocess.Popen(
        ["npm", "start"],
        cwd=CLIENT_DIR,
        shell=True
    )
    processes.append(frontend)
    
    print("\n✅ Оба процесса запущены!")
    print("📌 Бэкенд: http://localhost:8080")
    print("📌 Фронтенд: http://localhost:3000")
    print("\n⏹️  Нажми Ctrl+C чтобы остановить всё\n")
    
    # Ждём завершения процессов
    try:
        while True:
            # Проверяем живы ли процессы
            if backend.poll() is not None:
                print("⚠️  Бэкенд остановился!")
            if frontend.poll() is not None:
                print("⚠️  Фронтенд остановился!")
            if backend.poll() is not None and frontend.poll() is not None:
                break
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    run_all()
