import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const dbPath = resolve(process.env.GAME_DB_PATH ?? "data/pham-tu.sqlite");
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    user_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    total_xp INTEGER NOT NULL DEFAULT 0,
    xp_milestone_at INTEGER NOT NULL,
    realm_index INTEGER NOT NULL DEFAULT 0,
    breakthrough_failures INTEGER NOT NULL DEFAULT 0,
    cultivate_ready_at INTEGER NOT NULL DEFAULT 0,
    breakthrough_ready_at INTEGER NOT NULL DEFAULT 0,
    mining_ready_at INTEGER NOT NULL DEFAULT 0,
    boss_attack_ready_at INTEGER NOT NULL DEFAULT 0,
    total_gift_coin INTEGER NOT NULL DEFAULT 0,
    boss_damage INTEGER NOT NULL DEFAULT 0,
    last_active_at INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gift_receipts (
    receipt_key TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES players(user_id),
    event_id TEXT NOT NULL,
    gift_id TEXT NOT NULL,
    coin_value INTEGER NOT NULL,
    repeat_count INTEGER NOT NULL,
    received_at INTEGER NOT NULL,
    xp_awarded INTEGER NOT NULL,
    boss_damage INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS event_rewards (
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES players(user_id),
    reward_kind TEXT NOT NULL,
    xp_awarded INTEGER NOT NULL,
    PRIMARY KEY (event_id, user_id, reward_kind)
  );

  CREATE TABLE IF NOT EXISTS breakthrough_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES players(user_id),
    from_realm INTEGER NOT NULL,
    to_realm INTEGER NOT NULL,
    chance REAL NOT NULL,
    success INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

