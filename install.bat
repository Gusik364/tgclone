curl -L -o node-lts.msi https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi && ^
curl -L -o mongodb.msi https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi && ^
msiexec /i node-lts.msi /quiet /norestart && ^
msiexec /i mongodb.msi /quiet /norestart && ^
shutdown /r && ^
npm install && ^
rmdir /s /q node_modules && ^
del /f /q package-lock.json && ^
npm install && ^
npm start
