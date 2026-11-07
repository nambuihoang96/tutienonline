import { GIFT_BANDS, REALMS, TUNING } from "../../shared/gameConfig.js";

export function realmIndexForXp(xp: number): number {
  let index = 0;
  for (let i = 1; i < REALMS.length; i += 1) {
    if (xp < REALMS[i]!.minXp) break;
    index = i;
  }
  return index;
}

export function nextRealmIndex(currentIndex: number): number | null {
  return currentIndex + 1 < REALMS.length ? currentIndex + 1 : null;
}

export function breakthroughChance(nextIndex: number, consecutiveFailures: number): number {
  const base = REALMS[nextIndex]?.breakthroughChance;
  if (base === undefined || base === null) return 0;
  return Math.min(1, base + TUNING.breakthroughBonusPerFailure * consecutiveFailures);
}

export function miningPoints(power: number): number {
  return Math.min(100, 10 + Math.floor(Math.sqrt(power)));
}

export function bossAttackDamage(power: number): number {
  return Math.min(
    TUNING.bossAttackMaxDamage,
    Math.max(TUNING.bossAttackMinDamage, Math.floor(power * TUNING.bossAttackPowerRate)),
  );
}

export function bossStartingHp(activePlayers: number): number {
  return Math.max(5_000, Math.min(50_000, 5_000 + 500 * activePlayers));
}

export function giftBand(coinValue: number) {
  if (!Number.isSafeInteger(coinValue) || coinValue < 1) return null;
  return [...GIFT_BANDS].reverse().find((band) => coinValue >= band.minCoin) ?? null;
}

export function giftReward(coinValue: number, bossAlive: boolean) {
  const band = giftBand(coinValue);
  if (!band) return null;
  return {
    xp: coinValue * band.xpPerCoin,
    bossDamage: bossAlive ? coinValue * band.damagePerCoin : 0,
    vfx: band.vfx,
    durationMs: band.durationMs,
    priorityCoinValue: coinValue,
  };
}
