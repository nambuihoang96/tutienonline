import { db } from "./db.js";
import { WebSocketServer, WebSocket } from "ws";
import { GameEngine } from "./domain/GameEngine.js";
import type { NormalizedLiveEvent } from "./domain/types.js";

const port = Number(process.env.GAME_WS_PORT ?? 3001);
const simulatorEnabled = process.env.ENABLE_SIMULATOR === "1";
const engine = new GameEngine();
const wss = new WebSocketServer({ port, host: "127.0.0.1" });

function snapshot() {
  const players = engine.getLeaderboard(10);
  return { type: "snapshot", players, leader: players[0] ?? null, serverTime: Date.now() };
}

function broadcast(payload: unknown) {
  const encoded = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(encoded);
  }
}

function parseLiveEvent(input: unknown): NormalizedLiveEvent | null {
  if (!input || typeof input !== "object") return null;
  const event = input as Record<string, unknown>;
  if (typeof event.kind !== "string" || typeof event.userId !== "string" || typeof event.displayName !== "string") return null;
  const receivedAt = typeof event.receivedAt === "number" ? event.receivedAt : Date.now();
  if (event.kind === "comment" && typeof event.text === "string") {
    return { kind: "comment", userId: event.userId, displayName: event.displayName, text: event.text, receivedAt };
  }
  if (event.kind === "like" && typeof event.totalLikes === "number") {
    return { kind: "like", userId: event.userId, displayName: event.displayName, totalLikes: event.totalLikes, receivedAt };
  }
  if (event.kind === "gift" && typeof event.giftId === "string" && typeof event.eventId === "string"
    && typeof event.coinValue === "number" && typeof event.repeatCount === "number" && typeof event.comboFinal === "boolean") {
    return { kind: "gift", userId: event.userId, displayName: event.displayName, giftId: event.giftId,
      eventId: event.eventId, coinValue: event.coinValue, repeatCount: event.repeatCount,
      comboFinal: event.comboFinal, receivedAt };
  }
  return null;
}

wss.on("connection", (socket) => {
  socket.send(JSON.stringify(snapshot()));
  socket.on("message", (data) => {
    if (!simulatorEnabled) return;
    try {
      const message = JSON.parse(data.toString()) as Record<string, unknown>;
      if (message.type !== "simulator_event") return;
      const event = parseLiveEvent(message.event);
      if (!event) return;
      const result = engine.handleEvent(event);
      if (result) broadcast({ type: "game_event", result });
      broadcast(snapshot());
    } catch (error) {
      console.error("Rejected malformed WebSocket message", error);
    }
  });
});

setInterval(() => {
  engine.tickPassiveCultivation();
  broadcast(snapshot());
}, 1_000).unref();

const playerCount = (db.prepare("SELECT COUNT(*) AS count FROM players").get() as { count: number }).count;
console.log(`Phàm Tu game server listening on ws://127.0.0.1:${port}; ${playerCount} players saved.`);
console.log(`Simulator ${simulatorEnabled ? "enabled" : "disabled"}; no TikTok LIVE connection has been started.`);

process.on("SIGINT", () => { wss.close(); db.close(); process.exit(0); });
process.on("SIGTERM", () => { wss.close(); db.close(); process.exit(0); });
