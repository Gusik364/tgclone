const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let serverProcess;

// Функция для запуска сервера
function startServer() {
  // В собранном приложении нужно использовать правильные пути
  let serverPath;
  let serverCwd;
  
  if (isDev) {
    serverPath = path.join(__dirname, 'server.js');
    serverCwd = __dirname;
  } else {
    // В собранном приложении файлы находятся в resources/app.asar или resources/app.asar.unpacked
    const appPath = app.getAppPath();
    serverPath = path.join(appPath, 'server.js');
    serverCwd = appPath;
  }
  
  // Используем встроенный Node.js из Electron
  const nodePath = process.execPath;
  const execPath = isDev ? 'node' : nodePath;
  
  serverProcess = spawn(execPath, [serverPath], {
    cwd: serverCwd,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: process.env.PORT || '4000',
      // Важно: указываем правильный путь для .env файла
      ...(isDev ? {} : { 
        ENV_PATH: path.join(path.dirname(process.execPath), '.env')
      })
    },
    stdio: isDev ? 'inherit' : 'pipe'
  });
  
  if (!isDev) {
    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });
  }

  serverProcess.on('error', (error) => {
    console.error('Ошибка запуска сервера:', error);
  });

  serverProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Сервер завершился с кодом ${code}`);
    }
  });
}

// Функция для создания окна
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    icon: path.join(__dirname, 'client', 'build', 'logo192.png'),
    show: false, // Не показывать окно до загрузки
    titleBarStyle: 'default'
  });

  // Показываем окно когда оно готово
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Фокус на окне
    if (process.platform === 'win32') {
      mainWindow.focus();
    }
  });

  // Загружаем приложение
  const port = process.env.PORT || 4000;
  const url = `http://localhost:${port}`;
  
  // Открываем DevTools для отладки (можно закомментировать в production)
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  
  // Горячая клавиша для открытия DevTools (Ctrl+Shift+I)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.shift && input.key.toLowerCase() === 'i') {
      mainWindow.webContents.toggleDevTools();
    }
  });
  
  // Функция для проверки доступности сервера
  function tryLoadApp(attempts = 0) {
    const maxAttempts = 30; // 30 попыток = 15 секунд
    
    const req = http.get(`http://localhost:${port}`, (res) => {
      // Сервер готов, загружаем приложение
      mainWindow.loadURL(url).catch(err => {
        console.error('Ошибка загрузки URL:', err);
      });
      req.destroy();
    });
    
    req.on('error', () => {
      // Сервер еще не готов, пробуем снова
      if (attempts < maxAttempts) {
        setTimeout(() => tryLoadApp(attempts + 1), 500);
      } else {
        console.error('Сервер не запустился за отведенное время');
        mainWindow.loadURL('data:text/html,<h1>Ошибка запуска сервера</h1><p>Проверьте логи в консоли</p>');
      }
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      if (attempts < maxAttempts) {
        setTimeout(() => tryLoadApp(attempts + 1), 500);
      }
    });
  }
  
  // Начинаем попытки загрузки через 1 секунду
  setTimeout(() => tryLoadApp(), 1000);

  // Открываем DevTools в режиме разработки (можно убрать в production)
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Когда приложение готово
app.whenReady().then(() => {
  // Запускаем сервер
  startServer();
  
  // Создаем окно
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Закрываем все окна
app.on('window-all-closed', () => {
  // Останавливаем сервер
  if (serverProcess) {
    serverProcess.kill();
  }
  
  // На macOS приложения обычно остаются активными
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Выходим из приложения
app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Обработка ошибок
process.on('uncaughtException', (error) => {
  console.error('Необработанная ошибка:', error);
});

