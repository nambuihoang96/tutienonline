import { db } from "./db.js";

const playerCount = (db.prepare("SELECT COUNT(*) AS count FROM players").get() as { count: number }).count;
console.log(`Phàm Tu game server foundation ready. Players in database: ${playerCount}`);
console.log("TikTok adapter and renderer are intentionally separate modules; no LIVE connection has been started.");

