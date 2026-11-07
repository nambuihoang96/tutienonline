export interface Realm {
  name: string;
  minXp: number;
  power: number;
  breakthroughChance: number | null;
}

export const REALMS: readonly Realm[] = [
  { name: "Phàm Nhân", minXp: 0, power: 10, breakthroughChance: null },
  { name: "Luyện Khí sơ", minXp: 100, power: 25, breakthroughChance: 0.9 },
  { name: "Luyện Khí trung", minXp: 300, power: 40, breakthroughChance: 0.9 },
  { name: "Luyện Khí hậu", minXp: 700, power: 65, breakthroughChance: 0.85 },
  { name: "Trúc Cơ sơ", minXp: 1_500, power: 110, breakthroughChance: 0.8 },
  { name: "Trúc Cơ trung", minXp: 3_000, power: 160, breakthroughChance: 0.8 },
  { name: "Trúc Cơ hậu", minXp: 5_500, power: 230, breakthroughChance: 0.75 },
  { name: "Kết Đan sơ", minXp: 9_000, power: 330, breakthroughChance: 0.65 },
  { name: "Kết Đan trung", minXp: 14_000, power: 460, breakthroughChance: 0.65 },
  { name: "Kết Đan hậu", minXp: 21_000, power: 640, breakthroughChance: 0.6 },
  { name: "Nguyên Anh sơ", minXp: 30_000, power: 900, breakthroughChance: 0.5 },
  { name: "Nguyên Anh trung", minXp: 43_000, power: 1_250, breakthroughChance: 0.5 },
  { name: "Nguyên Anh hậu", minXp: 60_000, power: 1_700, breakthroughChance: 0.45 },
  { name: "Hóa Thần sơ", minXp: 85_000, power: 2_300, breakthroughChance: 0.35 },
  { name: "Hóa Thần trung", minXp: 120_000, power: 3_100, breakthroughChance: 0.35 },
  { name: "Hóa Thần hậu", minXp: 170_000, power: 4_200, breakthroughChance: 0.3 },
];

export const TUNING = {
  passiveXpPerSecond: 2,
  cultivateXp: 20,
  cultivateCooldownMs: 30_000,
  breakthroughCooldownMs: 60_000,
  breakthroughBonusPerFailure: 0.2,
  miningCooldownMs: 10_000,
  miningRewardPoolXp: 3_000,
  bossAttackCooldownMs: 10_000,
  bossAttackPowerRate: 0.25,
  bossAttackMinDamage: 5,
  bossAttackMaxDamage: 500,
  likeWindowMs: 15_000,
  likeWindowIntervalMs: 30_000,
  likeHitThreshold: 100,
  heavenlyPalmDamage: 1_000,
} as const;

export interface GiftBand {
  minCoin: number;
  xpPerCoin: number;
  damagePerCoin: number;
  vfx: string;
  durationMs: number;
}

export const GIFT_BANDS: readonly GiftBand[] = [
  { minCoin: 1, xpPerCoin: 100, damagePerCoin: 5, vfx: "Linh Khí Chưởng", durationMs: 700 },
  { minCoin: 10, xpPerCoin: 80, damagePerCoin: 6, vfx: "Kim Quang Chưởng", durationMs: 1_200 },
  { minCoin: 100, xpPerCoin: 60, damagePerCoin: 7, vfx: "Đại La Chưởng", durationMs: 2_000 },
  { minCoin: 1_000, xpPerCoin: 40, damagePerCoin: 8, vfx: "Diệt Thế Thần Chưởng", durationMs: 3_000 },
];

export const EVENT_CYCLE_MS = 12 * 60_000;
