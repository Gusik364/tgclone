const https = require('https');
const http = require('http');

// Измени ID на правильный если нужно
const GIFT_ID = "695010778cc82b1957814e34";
const BASE_URL = "https://verbally-bustling-kiwi.cloudpub.ru";
const BASE = "https://cdn.changes.tg/gifts/models/Plush%20Pepe/lottie/";

const models = [
  { name: "Amalgam", animationType: "lottie", animationUrl: `${BASE}Amalgam.json`, rarityPermille: 100 },
  { name: "Aqua Plush", animationType: "lottie", animationUrl: `${BASE}Aqua%20Plush.json`, rarityPermille: 100 },
  { name: "Barcelona", animationType: "lottie", animationUrl: `${BASE}Barcelona.json`, rarityPermille: 100 },
  { name: "Bavaria", animationType: "lottie", animationUrl: `${BASE}Bavaria.json`, rarityPermille: 100 },
  { name: "Birmingham", animationType: "lottie", animationUrl: `${BASE}Birmingham.json`, rarityPermille: 100 },
  { name: "Christmas", animationType: "lottie", animationUrl: `${BASE}Christmas.json`, rarityPermille: 100 },
  { name: "Cold Heart", animationType: "lottie", animationUrl: `${BASE}Cold%20Heart.json`, rarityPermille: 100 },
  { name: "Cozy Galaxy", animationType: "lottie", animationUrl: `${BASE}Cozy%20Galaxy.json`, rarityPermille: 100 },
  { name: "Donatello", animationType: "lottie", animationUrl: `${BASE}Donatello.json`, rarityPermille: 100 },
  { name: "Eggplant", animationType: "lottie", animationUrl: `${BASE}Eggplant.json`, rarityPermille: 100 },
  { name: "Emerald Plush", animationType: "lottie", animationUrl: `${BASE}Emerald%20Plush.json`, rarityPermille: 100 },
  { name: "Emo Boi", animationType: "lottie", animationUrl: `${BASE}Emo%20Boi.json`, rarityPermille: 100 },
  { name: "Fifty Shades", animationType: "lottie", animationUrl: `${BASE}Fifty%20Shades.json`, rarityPermille: 100 },
  { name: "Frozen", animationType: "lottie", animationUrl: `${BASE}Frozen.json`, rarityPermille: 100 },
  { name: "Gucci Leap", animationType: "lottie", animationUrl: `${BASE}Gucci%20Leap.json`, rarityPermille: 100 },
  { name: "Gummy Frog", animationType: "lottie", animationUrl: `${BASE}Gummy%20Frog.json`, rarityPermille: 100 },
  { name: "Hothead", animationType: "lottie", animationUrl: `${BASE}Hothead.json`, rarityPermille: 100 },
  { name: "Hue Jester", animationType: "lottie", animationUrl: `${BASE}Hue%20Jester.json`, rarityPermille: 100 },
  { name: "Kung Fu Pepe", animationType: "lottie", animationUrl: `${BASE}Kung%20Fu%20Pepe.json`, rarityPermille: 100 },
  { name: "Leonardo", animationType: "lottie", animationUrl: `${BASE}Leonardo.json`, rarityPermille: 100 },
  { name: "Louis Vuittoad", animationType: "lottie", animationUrl: `${BASE}Louis%20Vuittoad.json`, rarityPermille: 100 },
  { name: "Magnate", animationType: "lottie", animationUrl: `${BASE}Magnate.json`, rarityPermille: 100 },
  { name: "Marble", animationType: "lottie", animationUrl: `${BASE}Marble.json`, rarityPermille: 100 },
  { name: "Midas Pepe", animationType: "lottie", animationUrl: `${BASE}Midas%20Pepe.json`, rarityPermille: 100 },
  { name: "Milano", animationType: "lottie", animationUrl: `${BASE}Milano.json`, rarityPermille: 100 },
  { name: "Ninja Mike", animationType: "lottie", animationUrl: `${BASE}Ninja%20Mike.json`, rarityPermille: 100 },
  { name: "Original", animationType: "lottie", animationUrl: `${BASE}Original.json`, rarityPermille: 200 },
  { name: "Pepe La Rana", animationType: "lottie", animationUrl: `${BASE}Pepe%20La%20Rana.json`, rarityPermille: 100 },
  { name: "Pepemint", animationType: "lottie", animationUrl: `${BASE}Pepemint.json`, rarityPermille: 100 },
  { name: "Pink Galaxy", animationType: "lottie", animationUrl: `${BASE}Pink%20Galaxy.json`, rarityPermille: 100 },
  { name: "Pink Latex", animationType: "lottie", animationUrl: `${BASE}Pink%20Latex.json`, rarityPermille: 100 },
  { name: "Poison Dart", animationType: "lottie", animationUrl: `${BASE}Poison%20Dart.json`, rarityPermille: 100 },
  { name: "Polka Dots", animationType: "lottie", animationUrl: `${BASE}Polka%20Dots.json`, rarityPermille: 100 },
  { name: "Princess", animationType: "lottie", animationUrl: `${BASE}Princess.json`, rarityPermille: 100 },
  { name: "Pumpkin", animationType: "lottie", animationUrl: `${BASE}Pumpkin.json`, rarityPermille: 100 },
  { name: "Puppy Pug", animationType: "lottie", animationUrl: `${BASE}Puppy%20Pug.json`, rarityPermille: 100 },
  { name: "Raphael", animationType: "lottie", animationUrl: `${BASE}Raphael.json`, rarityPermille: 100 },
  { name: "Red Menace", animationType: "lottie", animationUrl: `${BASE}Red%20Menace.json`, rarityPermille: 100 },
  { name: "Red Pepple", animationType: "lottie", animationUrl: `${BASE}Red%20Pepple.json`, rarityPermille: 100 },
  { name: "Santa Pepe", animationType: "lottie", animationUrl: `${BASE}Santa%20Pepe.json`, rarityPermille: 100 },
  { name: "Sketchy", animationType: "lottie", animationUrl: `${BASE}Sketchy.json`, rarityPermille: 100 },
  { name: "Spectrum", animationType: "lottie", animationUrl: `${BASE}Spectrum.json`, rarityPermille: 100 },
  { name: "Steel Frog", animationType: "lottie", animationUrl: `${BASE}Steel%20Frog.json`, rarityPermille: 100 },
  { name: "Stripes", animationType: "lottie", animationUrl: `${BASE}Stripes.json`, rarityPermille: 100 },
  { name: "Sunset", animationType: "lottie", animationUrl: `${BASE}Sunset.json`, rarityPermille: 100 },
  { name: "Toading...", animationType: "lottie", animationUrl: `${BASE}Toading....json`, rarityPermille: 100 },
  { name: "Tropical", animationType: "lottie", animationUrl: `${BASE}Tropical.json`, rarityPermille: 100 },
  { name: "Two Face", animationType: "lottie", animationUrl: `${BASE}Two%20Face.json`, rarityPermille: 100 },
  { name: "X-Ray", animationType: "lottie", animationUrl: `${BASE}X-Ray.json`, rarityPermille: 100 },
  { name: "Yellow Hug", animationType: "lottie", animationUrl: `${BASE}Yellow%20Hug.json`, rarityPermille: 100 },
  { name: "Yellow Purp", animationType: "lottie", animationUrl: `${BASE}Yellow%20Purp.json`, rarityPermille: 100 },
];

const data = JSON.stringify({
  canUpgrade: true,
  upgradePrice: 100,
  upgradeModels: models
});

const url = new URL(`${BASE_URL}/admin/api/gifts/${GIFT_ID}/upgrade-settings`);
const isHttps = url.protocol === 'https:';

const options = {
  hostname: url.hostname,
  port: url.port || (isHttps ? 443 : 80),
  path: url.pathname,
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Cookie': 'adminAuth=Test'
  }
};

const req = (isHttps ? https : http).request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${body}`);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.write(data);
req.end();
