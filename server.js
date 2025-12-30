const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = require("./app");

// Определяем путь к .env файлу
// В Electron приложении .env должен быть рядом с .exe файлом
let envPath = "./.env";
if (process.env.ENV_PATH) {
  envPath = process.env.ENV_PATH;
} else if (process.pkg) {
  // Для pkg приложений
  envPath = path.join(path.dirname(process.execPath), ".env");
} else if (process.resourcesPath) {
  // Для Electron приложений
  envPath = path.join(path.dirname(process.execPath), ".env");
}

dotenv.config({ path: envPath });

// Connect database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected..."))
  .catch((error) => console.log("An error occured..."));

// Serve client folder
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

//   Listen to port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Database connected...");
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${port} is already in use!`);
    console.error(`Please either:`);
    console.error(`1. Stop the process using port ${port}`);
    console.error(`2. Change PORT in .env file to another port (e.g., 4001, 4002, etc.)`);
    console.error(`\nTo find and stop the process:`);
    console.error(`  netstat -ano | findstr :${port}`);
    console.error(`  taskkill /PID <PID> /F`);
    process.exit(1);
  } else {
    throw err;
  }
});

exports.expressServer = server;
