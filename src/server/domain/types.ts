export interface Player {
  userId: string;
  displayName: string;
  totalXp: number;
  realmIndex: number;
  consecutiveBreakthroughFailures: number;
  cultivateReadyAt: number;
  breakthroughReadyAt: number;
  miningReadyAt: number;
  bossAttackReadyAt: number;
  totalGiftCoin: number;
  bossDamage: number;
  createdAt: number;
  updatedAt: number;
}

export type NormalizedLiveEvent =
  | { kind: "comment"; userId: string; displayName: string; text: string; receivedAt: number }
  | { kind: "like"; userId: string; displayName: string; totalLikes: number; receivedAt: number }
  | {
      kind: "gift";
      userId: string;
      displayName: string;
      giftId: string;
      coinValue: number;
      repeatCount: number;
      eventId: string;
      comboFinal: boolean;
      receivedAt: number;
    };

export interface TikTokAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  onEvent(handler: (event: NormalizedLiveEvent) => void): void;
  onConnectionState(handler: (state: "connecting" | "connected" | "disconnected" | "error") => void): void;
}
