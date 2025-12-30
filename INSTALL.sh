bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && \
sudo apt-get install -y nodejs wget gnupg && \
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add - && \
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
sudo apt-get update && \
sudo apt-get install -y mongodb-org=7.0.5 mongodb-org-server=7.0.5 mongodb-org-shell=7.0.5 mongodb-org-mongos=7.0.5 mongodb-org-tools=7.0.5 && \
sudo systemctl start mongod && \
sudo systemctl enable mongod && \
npm install && \
rm -rf node_modules package-lock.json && \
npm install && \
npm start
