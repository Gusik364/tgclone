const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const catchAsyncError = require("../utilities/catchAsyncError");
const ReqError = require("../utilities/ReqError.js");

// Папка для загрузок
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// Создаём папки если не существуют
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(UPLOADS_DIR);
ensureDir(path.join(UPLOADS_DIR, "images"));
ensureDir(path.join(UPLOADS_DIR, "audio"));
ensureDir(path.join(UPLOADS_DIR, "video"));

module.exports = catchAsyncError(async (req, res, next) => {
  const fileBase64 = req.body.data;
  const fileType = req.body.fileType || "image";

  if (!fileBase64) {
    return next(new ReqError(400, "No file data provided"));
  }

  // Определяем тип файла и расширение
  let extension = "png";
  let folder = "images";
  let mimeMatch = fileBase64.match(/^data:([^;]+);base64,/);
  
  if (mimeMatch) {
    const mime = mimeMatch[1];
    if (mime.includes("jpeg") || mime.includes("jpg")) extension = "jpg";
    else if (mime.includes("png")) extension = "png";
    else if (mime.includes("gif")) extension = "gif";
    else if (mime.includes("webp")) extension = "webp";
    else if (mime.includes("audio")) {
      extension = "webm";
      folder = "audio";
    }
    else if (mime.includes("video")) {
      extension = "mp4";
      folder = "video";
    }
  }

  if (fileType === "video") {
    folder = "audio"; // голосовые сообщения
    extension = "webm";
  }

  // Генерируем уникальное имя файла
  const fileName = `${crypto.randomBytes(16).toString("hex")}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, folder, fileName);

  // Убираем data:...;base64, префикс
  const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, "");
  
  // Сохраняем файл
  fs.writeFileSync(filePath, base64Data, "base64");

  // URL для доступа к файлу
  const fileUrl = `/uploads/${folder}/${fileName}`;

  res.status(200).json({
    status: "success",
    data: {
      uploadData: {
        secure_url: fileUrl,
        url: fileUrl,
        public_id: fileName,
        resource_type: fileType,
      },
    },
  });
});
