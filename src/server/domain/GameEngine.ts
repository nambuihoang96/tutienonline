import { randomInt } from "node:crypto";
import { REALMS, TUNING } from "../../shared/gameConfig.js";
import { db } from "../db.js";
import { bossAttackDamage, breakthroughChance, giftReward, miningPoints, nextRealmIndex } from "./rules.js";
import type { NormalizedLiveEvent, Player } from "./types.js";

export type CommandResult =
  | { ok: true; code: string; message: string; player?: Player; data?: Record<string, unknown> }
  | { ok: false; code: string; message: string; player?: Player; data?: Record<string, unknown> };

type PlayerRow = {
  user_id: string;
  display_name: string;
  total_xp: number;
  realm_index: number;
  breakthrough_failures: number;
  cultivate_ready_at: number;
  breakthrough_ready_at: number;
  mining_ready_at: number;
  boss_attack_ready_at: number;
  total_gift_coin: number;
  boss_damage: number;
  created_at: number;
  updated_at: number;
};

const fromRow = (row: PlayerRow | undefined): Player | null => row ? ({
  userId: row.user_id,
  displayName: row.display_name,
  totalXp: row.total_xp,
  realmIndex: row.realm_index,
  consecutiveBreakthroughFailures: row.breakthrough_failures,
  cultivateReadyAt: row.cultivate_ready_at,
  breakthroughReadyAt: row.breakthrough_ready_at,
  miningReadyAt: row.mining_ready_at,
  bossAttackReadyAt: row.boss_attack_ready_at,
  totalGiftCoin: row.total_gift_coin,
  bossDamage: row.boss_damage,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
}) : null;

const selectPlayer = db.prepare("SELECT * FROM players WHERE user_id = ?");
const updateActivity = db.prepare("UPDATE players SET last_active_at = ?, display_name = ?, updated_at = ? WHERE user_id = ?");

export class GameEngine {
  constructor(private readonly roll = () => randomInt(0, 1_000_000) / 1_000_000) {}

  getPlayer(userId: string): Player | null {
    return fromRow(selectPlayer.get(userId) as PlayerRow | undefined);
  }

  getLeaderboard(limit = 10): Player[] {
    const rows = db.prepare(`SELECT * FROM players
      ORDER BY total_xp DESC, xp_milestone_at ASC, created_at ASC
      LIMIT ?`).all(Math.max(1, Math.min(100, limit))) as PlayerRow[];
    return rows.map((row) => fromRow(row)!);
  }

  getLeader(): Player | null {
    return this.getLeaderboard(1)[0] ?? null;
  }

  handleEvent(event: NormalizedLiveEvent, isBossAlive = false): CommandResult | null {
    if (event.kind === "like") return null;
    const userId = event.userId.trim();
    const displayName = event.displayName.trim().slice(0, 64) || "Tu sĩ";
    if (!userId) return { ok: false, code: "INVALID_USER", message: "Không xác định được tài khoản người xem." };

    if (event.kind === "gift") {
      this.ensurePlayer(userId, displayName, event.receivedAt);
      return this.applyGift({ ...event, userId, displayName }, isBossAlive);
    }

    const text = event.text.trim().toLocaleLowerCase("vi-VN");
    if (text === "join") return this.join(userId, displayName, event.receivedAt);

    const player = this.getPlayer(userId);
    if (!player) return null;
    updateActivity.run(event.receivedAt, displayName, event.receivedAt, userId);

    if (text === "tu") return this.cultivate(userId, event.receivedAt);
    if (text === "!do kiep" || text === "!dokiep") return this.breakthrough(userId, event.receivedAt);
    return null;
  }

  /** Awards passive XP to viewers who have sent an event in the last minute. */
  tickPassiveCultivation(now = Date.now()): number {
    const result = db.prepare(`UPDATE players
      SET total_xp = total_xp + ?, xp_milestone_at = ?, updated_at = ?
      WHERE last_active_at >= ?`).run(
      TUNING.passiveXpPerSecond,
      now,
      now,
      now - 60_000,
    );
    return result.changes;
  }

  private ensurePlayer(userId: string, displayName: string, now: number): Player {
    db.prepare(`INSERT INTO players (user_id, display_name, total_xp, xp_milestone_at, realm_index, created_at, updated_at, last_active_at)
      VALUES (?, ?, 0, ?, 0, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET display_name = excluded.display_name, updated_at = excluded.updated_at, last_active_at = excluded.last_active_at`)
      .run(userId, displayName, now, now, now, now);
    return this.getPlayer(userId)!;
  }

  private join(userId: string, displayName: string, now: number): CommandResult {
    const player = this.ensurePlayer(userId, displayName, now);
    return { ok: true, code: "JOINED", message: `${player.displayName} đã nhập đạo.`, player };
  }

  private cultivate(userId: string, now: number): CommandResult {
    const player = this.getPlayer(userId);
    if (!player) return { ok: false, code: "NOT_JOINED", message: "Hãy chat join trước." };
    if (now < player.cultivateReadyAt) {
      return { ok: false, code: "COOLDOWN", message: `Tu luyện đang hồi; còn ${Math.ceil((player.cultivateReadyAt - now) / 1000)} giây.`, player };
    }
    db.prepare(`UPDATE players SET total_xp = total_xp + ?, xp_milestone_at = ?, cultivate_ready_at = ?, updated_at = ?, last_active_at = ? WHERE user_id = ?`)
      .run(TUNING.cultivateXp, now, now + TUNING.cultivateCooldownMs, now, now, userId);
    const updated = this.getPlayer(userId)!;
    return { ok: true, code: "CULTIVATED", message: `${updated.displayName} tu luyện +${TUNING.cultivateXp} tu vi.`, player: updated };
  }

  private breakthrough(userId: string, now: number): CommandResult {
    const player = this.getPlayer(userId);
    if (!player) return { ok: false, code: "NOT_JOINED", message: "Hãy chat join trước." };
    const targetIndex = nextRealmIndex(player.realmIndex);
    if (targetIndex === null) return { ok: false, code: "MAX_REALM", message: "Đã đạt cảnh giới tối đa hiện có.", player };
    const target = REALMS[targetIndex]!;
    if (player.totalXp < target.minXp) {
      return { ok: false, code: "INSUFFICIENT_XP", message: `Cần ${target.minXp} tu vi để độ kiếp ${target.name}.`, player };
    }
    if (now < player.breakthroughReadyAt) {
      return { ok: false, code: "COOLDOWN", message: `Độ kiếp đang hồi; còn ${Math.ceil((player.breakthroughReadyAt - now) / 1000)} giây.`, player };
    }

    const chance = breakthroughChance(targetIndex, player.consecutiveBreakthroughFailures);
    const success = this.roll() < chance;
    const fromIndex = player.realmIndex;
    const tx = db.transaction(() => {
      db.prepare(`UPDATE players SET realm_index = ?, breakthrough_failures = ?, breakthrough_ready_at = ?, updated_at = ?, last_active_at = ? WHERE user_id = ?`)
        .run(success ? targetIndex : fromIndex, success ? 0 : player.consecutiveBreakthroughFailures + 1,
          now + TUNING.breakthroughCooldownMs, now, now, userId);
      db.prepare(`INSERT INTO breakthrough_log (user_id, from_realm, to_realm, chance, success, created_at)
        VALUES (?, ?, ?, ?, ?, ?)`)
        .run(userId, fromIndex, targetIndex, chance, success ? 1 : 0, now);
    });
    tx();

    const updated = this.getPlayer(userId)!;
    if (success) {
      return { ok: true, code: "BREAKTHROUGH_SUCCESS", message: `${updated.displayName} độ kiếp thành công, đạt ${target.name}!`, player: updated,
        data: { chance, realmIndex: targetIndex } };
    }
    const nextChance = breakthroughChance(targetIndex, updated.consecutiveBreakthroughFailures);
    return { ok: false, code: "BREAKTHROUGH_FAILED", message: `Độ kiếp thất bại. Lần sau: ${Math.round(nextChance * 100)}%.`, player: updated,
      data: { chance, nextChance, realmIndex: fromIndex } };
  }

  private applyGift(event: Extract<NormalizedLiveEvent, { kind: "gift" }>, isBossAlive: boolean): CommandResult {
    const repeatCount = Math.max(1, Math.floor(event.repeatCount));
    const totalCoin = Math.max(0, Math.floor(event.coinValue)) * repeatCount;
    const reward = giftReward(totalCoin, isBossAlive);
    if (!reward || !event.eventId.trim() || !event.giftId.trim()) {
      return { ok: false, code: "INVALID_GIFT", message: "Gift không hợp lệ." };
    }
    if (!event.comboFinal) {
      return { ok: true, code: "GIFT_COMBO_PENDING", message: "Đang chờ Gift combo kết thúc." };
    }

    const receiptKey = `${event.userId}:${event.eventId}:${event.giftId}`;
    const transaction = db.transaction(() => {
      const inserted = db.prepare(`INSERT OR IGNORE INTO gift_receipts
        (receipt_key, user_id, event_id, gift_id, coin_value, repeat_count, received_at, xp_awarded, boss_damage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(receiptKey, event.userId, event.eventId, event.giftId, totalCoin, repeatCount, event.receivedAt, reward.xp, reward.bossDamage);
      if (inserted.changes === 0) return false;
      db.prepare(`UPDATE players SET total_xp = total_xp + ?, xp_milestone_at = ?, total_gift_coin = total_gift_coin + ?,
        boss_damage = boss_damage + ?, updated_at = ?, last_active_at = ? WHERE user_id = ?`)
        .run(reward.xp, event.receivedAt, totalCoin, reward.bossDamage, event.receivedAt, event.receivedAt, event.userId);
      return true;
    });

    if (!transaction()) return { ok: true, code: "GIFT_DUPLICATE", message: "Gift trùng đã được bỏ qua." };
    const player = this.getPlayer(event.userId)!;
    return { ok: true, code: "GIFT_REWARDED", message: `${player.displayName} nhận +${reward.xp} tu vi${reward.bossDamage ? `, gây ${reward.bossDamage} sát thương` : ""}.`, player,
      data: { ...reward, totalCoin, repeatCount } };
  }

  /** Event actions used by the scheduler when their event window is active. */
  awardMining(userId: string, now = Date.now()): CommandResult {
    const player = this.getPlayer(userId);
    if (!player) return { ok: false, code: "NOT_JOINED", message: "Hãy chat join trước." };
    if (now < player.miningReadyAt) return { ok: false, code: "COOLDOWN", message: "Đào linh mạch đang hồi.", player };
    const points = miningPoints(REALMS[player.realmIndex]!.power);
    db.prepare("UPDATE players SET mining_ready_at = ?, updated_at = ?, last_active_at = ? WHERE user_id = ?")
      .run(now + TUNING.miningCooldownMs, now, now, userId);
    return { ok: true, code: "MINED", message: `${player.displayName} đào được ${points} điểm.`, player: this.getPlayer(userId)!, data: { points } };
  }

  attackBoss(userId: string, now = Date.now()): CommandResult {
    const player = this.getPlayer(userId);
    if (!player) return { ok: false, code: "NOT_JOINED", message: "Hãy chat join trước." };
    if (now < player.bossAttackReadyAt) return { ok: false, code: "COOLDOWN", message: "Đang hồi chiêu chiến đấu.", player };
    const damage = bossAttackDamage(REALMS[player.realmIndex]!.power);
    db.prepare("UPDATE players SET boss_attack_ready_at = ?, boss_damage = boss_damage + ?, updated_at = ?, last_active_at = ? WHERE user_id = ?")
      .run(now + TUNING.bossAttackCooldownMs, damage, now, now, userId);
    return { ok: true, code: "BOSS_ATTACK", message: `${player.displayName} gây ${damage} sát thương.`, player: this.getPlayer(userId)!, data: { damage } };
  }
}
