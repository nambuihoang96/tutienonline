# Phàm Tu: Vạn Đạo Tranh Phong

TypeScript game foundation based on `GDD_Pham_Tu_v3_2.md`.

## Current foundation

- Game progression and balance rules are represented in `src/shared/gameConfig.ts` and `src/server/domain/rules.ts`.
- `GameEngine` implements join, `tu`, `!do kiep`, Gift rewards with idempotent receipts, passive cultivation, and the first mining / boss attack actions.
- Normalized TikTok event and adapter interfaces are in `src/server/domain/types.ts`.
- SQLite WAL schema and idempotency keys for Gift receipts / event rewards are in `src/server/db.ts`.
- No platform connector is enabled yet. TikTok LIVE connectivity must be verified against the actual account and runtime before relying on it.

## Local development

Requires Node.js 22 or newer.

```powershell
npm install
npm run dev
```

Vite serves the renderer at `http://localhost:5173`; the game server listens on `ws://127.0.0.1:3001`. The database is created at `data/pham-tu.sqlite` by default. Set `GAME_DB_PATH` to use another local path. Set `ENABLE_SIMULATOR=1` only when you want the local WebSocket simulator to accept normalized test events.

## Next implementation milestones

1. Validate live comments, cumulative like deltas, and Gift combo finalization with a real LIVE session.
2. Complete transactional event commands and the 12-minute scheduler against SQLite.
3. Replace placeholder Canvas art, add the active event/boss overlays, and build the host panel.
4. Add host controls, simulator, and operating/recovery flows.

