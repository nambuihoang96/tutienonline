# Phàm Tu: Vạn Đạo Tranh Phong

TypeScript game foundation based on `GDD_Pham_Tu_v3_2.md`.

## Current foundation

- Game progression, breakthrough, mining, boss, and gift balance rules are represented in `src/shared/gameConfig.ts` and `src/server/domain/rules.ts`.
- Normalized TikTok event and adapter interfaces are in `src/server/domain/types.ts`.
- SQLite WAL schema and idempotency keys for Gift receipts / event rewards are in `src/server/db.ts`.
- No platform connector is enabled yet. TikTok LIVE connectivity must be verified against the actual account and runtime before relying on it.

## Local development

Requires Node.js 22 or newer.

```powershell
npm install
npm run dev
```

The database is created at `data/pham-tu.sqlite` by default. Set `GAME_DB_PATH` to use another local path.

## Next implementation milestones

1. Validate live comments, cumulative like deltas, and Gift combo finalization with a real LIVE session.
2. Add transactional player commands and event scheduler against SQLite.
3. Add WebSocket state publication and the 9:16 Canvas renderer.
4. Add host controls, simulator, and operating/recovery flows.

