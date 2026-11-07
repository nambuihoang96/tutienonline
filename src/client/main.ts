import "./style.css";
import type { Player } from "../server/domain/types.js";
import { REALMS } from "../shared/gameConfig.js";
import { REALM_VISUALS, realmVisualProfile } from "../shared/realmVisuals.js";

type Snapshot = { type: "snapshot"; players: Player[]; leader: Player | null; serverTime: number };
type GameMessage = { type: "game_event"; result: { ok: boolean; message: string; code: string; player?: Player } };

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const ctx = canvas.getContext("2d")!;
const connection = document.querySelector<HTMLDivElement>("#connection")!;
const isDemo = new URLSearchParams(location.search).get("demo") === "1";
const backgroundArt = new Image();
backgroundArt.src = "/backgrounds/background_main.png";
const logoArt = new Image();
logoArt.src = "/logo.svg";
const throneArt = new Image();
throneArt.src = "/throne.svg";
const cauldronArt = new Image();
cauldronArt.src = "/cauldron.svg";
const bossArt = new Image();
bossArt.src = "/bosses/boss_world.png";
const cultivatorArt = [new Image(), new Image()];
cultivatorArt[0]!.src = "/characters/cultivator_01.png";
cultivatorArt[1]!.src = "/characters/cultivator_02.png";
const realmCharacterArt = REALM_VISUALS.map((profile) => {
  const image = new Image();
  image.src = profile.characterAsset;
  return image;
});
const demoPlayers: Player[] = [
  ["demo-01", "Thanh Vân", 18_420, 8], ["demo-02", "Mặc Trần", 14_260, 7],
  ["demo-03", "Lạc Tinh", 11_080, 7], ["demo-04", "Bạch Ly", 8_540, 6],
  ["demo-05", "Huyền Minh", 6_220, 5], ["demo-06", "Vân Chi", 4_160, 4],
  ["demo-07", "Tử Dương", 2_780, 3], ["demo-08", "Thanh Liên", 1_120, 2],
].map(([userId, displayName, totalXp, realmIndex], index) => ({
  userId: String(userId), displayName: String(displayName), totalXp: Number(totalXp), realmIndex: Number(realmIndex),
  consecutiveBreakthroughFailures: 0, cultivateReadyAt: 0, breakthroughReadyAt: 0, miningReadyAt: 0,
  bossAttackReadyAt: 0, totalGiftCoin: 0, bossDamage: [2_800, 1_940, 1_420, 880, 540, 260, 120, 60][index]!,
  createdAt: Date.now(), updatedAt: Date.now(),
}));
let players: Player[] = isDemo ? demoPlayers : [];
let leader: Player | null = isDemo ? demoPlayers[0]! : null;
let statusMessage = "Vạn đạo khai mở";
let statusUntil = 0;
let serverConnected = false;
let breakthroughFx: { userId: string; realmIndex: number; startedAt: number; success: boolean } | null = null;

const wsUrl = new URLSearchParams(location.search).get("ws") ?? "ws://127.0.0.1:3001";
let socket: WebSocket;

function connect() {
  socket = new WebSocket(wsUrl);
  socket.addEventListener("open", () => {
    serverConnected = true;
    connection.textContent = isDemo ? "BẢN XEM THỬ · DỮ LIỆU MẪU" : "MÁY CHỦ ĐANG KẾT NỐI";
    connection.dataset.state = "connected";
  });
  socket.addEventListener("close", () => {
    serverConnected = false;
    connection.textContent = "MẤT KẾT NỐI · ĐANG THỬ LẠI";
    connection.dataset.state = "disconnected";
    setTimeout(connect, 1500);
  });
  socket.addEventListener("message", (message) => {
    const data = JSON.parse(String(message.data)) as Snapshot | GameMessage;
    if (data.type === "snapshot") {
      players = data.players.length > 0 || !isDemo ? data.players : demoPlayers;
      leader = data.leader ?? (isDemo ? demoPlayers[0]! : null);
    } else if (data.type === "game_event") {
      statusMessage = data.result.message;
      statusUntil = Date.now() + 4500;
      if (data.result.player && ["BREAKTHROUGH_SUCCESS", "BREAKTHROUGH_FAILED"].includes(data.result.code)) {
        const success = data.result.code === "BREAKTHROUGH_SUCCESS";
        const targetRealmIndex = success ? data.result.player.realmIndex : data.result.player.realmIndex + 1;
        breakthroughFx = { userId: data.result.player.userId, realmIndex: targetRealmIndex, startedAt: performance.now(), success };
      }
    }
  });
}

function roundRect(x: number, y: number, width: number, height: number, radius: number, fill: string, stroke?: string) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function fitText(value: string, maxWidth: number, font: string) {
  ctx.font = font;
  if (ctx.measureText(value).width <= maxWidth) return value;
  let text = value;
  while (text.length > 2 && ctx.measureText(`${text}…`).width > maxWidth) text = text.slice(0, -1);
  return `${text}…`;
}

function rgba(hex: string, alpha: number): string {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

function drawRealmIdleEffect(x: number, y: number, realmIndex: number, now: number, compact = false) {
  const effect = realmVisualProfile(realmIndex).idle;
  const phase = now * 0.001 * effect.motionSpeed;
  const pulse = 0.5 + Math.sin(phase * 2) * 0.5;
  const particleCount = compact ? Math.min(8, Math.max(4, Math.round(effect.particles * 0.35))) : effect.particles;
  const scale = compact ? 0.64 : 1;

  ctx.save();
  ctx.globalAlpha = effect.intensity * (0.78 + pulse * 0.22);
  ctx.lineWidth = compact ? 1 : 1.5;
  ctx.strokeStyle = effect.primary;
  ctx.fillStyle = effect.secondary;
  for (let ring = 0; ring < Math.min(effect.orbitCount, compact ? 2 : 5); ring += 1) {
    ctx.beginPath();
    ctx.ellipse(x, y + 8 * scale, (27 + ring * 5 + pulse * 3) * scale,
      (9 + ring * 2) * scale, phase * (ring % 2 ? -0.12 : 0.12), 0, Math.PI * 2);
    ctx.stroke();
  }

  const style = effect.style;
  if (style === "mist" || style === "water" || style === "wind") {
    for (let stroke = 0; stroke < 3; stroke += 1) {
      const sway = Math.sin(phase + stroke) * 8 * scale;
      ctx.beginPath();
      ctx.moveTo(x - 38 * scale, y + (15 + stroke * 5) * scale);
      ctx.bezierCurveTo(x - 20 * scale, y - 9 * scale + sway, x + 18 * scale, y + 31 * scale - sway,
        x + 38 * scale, y + (2 + stroke * 6) * scale);
      ctx.stroke();
    }
  } else if (style === "runes" || style === "celestial_seal") {
    for (let rune = 0; rune < particleCount; rune += 1) {
      const angle = phase * 0.22 + rune * (Math.PI * 2 / particleCount);
      const px = x + Math.cos(angle) * 39 * scale;
      const py = y + 4 * scale + Math.sin(angle) * 24 * scale;
      ctx.save(); ctx.translate(px, py); ctx.rotate(angle + phase * 0.1);
      ctx.strokeRect(-3.5 * scale, -3.5 * scale, 7 * scale, 7 * scale); ctx.restore();
    }
  } else if (style === "petals" || style === "lotus" || style === "phoenix") {
    for (let petal = 0; petal < particleCount; petal += 1) {
      const angle = phase * 0.32 + petal * (Math.PI * 2 / particleCount);
      const radius = (29 + Math.sin(phase + petal) * 7) * scale;
      const px = x + Math.cos(angle) * radius;
      const py = y + 5 * scale + Math.sin(angle) * radius * 0.55;
      ctx.save(); ctx.translate(px, py); ctx.rotate(angle + Math.PI / 2);
      ctx.beginPath(); ctx.ellipse(0, 0, 2.1 * scale, (style === "phoenix" ? 6 : 4.5) * scale, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
    }
  } else if (style === "golden_flame" || style === "thunder" || style === "qi_sparks") {
    for (let spark = 0; spark < particleCount; spark += 1) {
      const offset = (phase * 18 + spark * 13) % (54 * scale);
      const px = x + Math.sin(phase + spark * 3.1) * (18 + spark % 3 * 8) * scale;
      const py = y + 24 * scale - offset;
      ctx.beginPath(); ctx.moveTo(px, py + (style === "thunder" ? 5 : 8) * scale);
      if (style === "thunder") {
        ctx.lineTo(px - 2 * scale, py + 2 * scale); ctx.lineTo(px + 3 * scale, py + scale); ctx.lineTo(px, py - 6 * scale);
      } else ctx.lineTo(px + Math.sin(phase + spark) * 2 * scale, py - 5 * scale);
      ctx.stroke();
    }
  } else if (style === "starfield" || style === "spirit_orbs" || style === "solar_ring") {
    for (let orb = 0; orb < particleCount; orb += 1) {
      const angle = phase * (style === "solar_ring" ? 0.25 : 0.55) + orb * (Math.PI * 2 / particleCount);
      const radius = (34 + (orb % 3) * 8) * scale;
      const px = x + Math.cos(angle) * radius;
      const py = y + 4 * scale + Math.sin(angle) * radius * 0.48;
      ctx.beginPath(); ctx.arc(px, py, (style === "spirit_orbs" ? 2.7 : 1.8 + pulse) * scale, 0, Math.PI * 2); ctx.fill();
    }
  } else if (style === "dragon_wind") {
    for (let coil = 0; coil < 3; coil += 1) {
      const offset = phase + coil * 2.1;
      ctx.beginPath(); ctx.ellipse(x, y + 4 * scale, 43 * scale, 20 * scale, offset * 0.17, offset, offset + Math.PI * 1.45); ctx.stroke();
    }
  } else {
    ctx.lineWidth = compact ? 1.2 : 2;
    ctx.beginPath(); ctx.ellipse(x, y + 3 * scale, (47 + pulse * 5) * scale, (25 + pulse * 2) * scale, phase * 0.08, 0, Math.PI * 2); ctx.stroke();
    for (let mote = 0; mote < particleCount; mote += 1) {
      const angle = phase * 0.2 + mote * (Math.PI * 2 / particleCount);
      ctx.beginPath(); ctx.arc(x + Math.cos(angle) * 50 * scale, y + 4 * scale + Math.sin(angle) * 27 * scale, (1.6 + pulse) * scale, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

function drawBreakthroughEffect(now: number) {
  if (!breakthroughFx) return;
  const profile = realmVisualProfile(breakthroughFx.realmIndex);
  const effect = profile.breakthrough;
  if (!effect) { breakthroughFx = null; return; }
  const duration = breakthroughFx.success ? effect.durationMs : 620;
  const progress = (now - breakthroughFx.startedAt) / duration;
  if (progress >= 1) { breakthroughFx = null; return; }
  const visibleIndex = players.slice(0, 24).findIndex((player) => player.userId === breakthroughFx?.userId);
  if (visibleIndex < 0) return;
  const col = visibleIndex % 6;
  const row = Math.floor(visibleIndex / 6);
  const x = 92 + col * 179;
  const y = 1192 + row * 145;
  const primary = breakthroughFx.success ? effect.primary : "#d98a89";
  const secondary = breakthroughFx.success ? effect.secondary : "#8d626d";
  const intensity = breakthroughFx.success ? effect.intensity : 0.42;
  const fade = Math.sin(Math.PI * progress) * intensity;
  const rings = breakthroughFx.success ? effect.rings : 2;
  const particles = breakthroughFx.success ? effect.particles : 8;
  const spread = 10 + progress * (breakthroughFx.success ? 72 : 30);

  ctx.save();
  const glow = ctx.createRadialGradient(x, y, 2, x, y, 70);
  glow.addColorStop(0, rgba(primary, fade * 0.34));
  glow.addColorStop(1, rgba(primary, 0));
  ctx.fillStyle = glow; ctx.fillRect(x - 72, y - 72, 144, 144);
  for (let ring = 0; ring < rings; ring += 1) {
    const ringProgress = Math.min(1, progress * 1.45 + ring * 0.12);
    ctx.globalAlpha = fade * (1 - ringProgress * 0.45);
    ctx.strokeStyle = ring % 2 ? secondary : primary;
    ctx.lineWidth = Math.max(1, 2.8 - ringProgress * 2);
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 8 + ringProgress * spread + ring * 3, 5 + ringProgress * 25 + ring * 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = fade;
  for (let mote = 0; mote < particles; mote += 1) {
    const angle = mote * 2.39996 + progress * (effect.style.includes("thunder") || effect.style.includes("dragon") ? 1.35 : 0.42);
    const distance = 8 + ((mote * 17) % 58) * progress;
    const px = x + Math.cos(angle) * distance;
    const py = y + Math.sin(angle) * distance * 0.62;
    ctx.fillStyle = mote % 2 ? secondary : primary;
    if (breakthroughFx.success && (effect.style.includes("petal") || effect.style.includes("lotus") || effect.style.includes("phoenix"))) {
      ctx.save(); ctx.translate(px, py); ctx.rotate(angle);
      ctx.beginPath(); ctx.ellipse(0, 0, 2, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    } else if (breakthroughFx.success && (effect.style.includes("thunder") || effect.style.includes("dragon"))) {
      ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); ctx.moveTo(px, py - 4); ctx.lineTo(px - 2, py); ctx.lineTo(px + 2, py + 3); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(px, py, 1.2 + (1 - progress), 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

function draw() {
  const renderTime = performance.now();
  if (backgroundArt.complete && backgroundArt.naturalWidth > 0) {
    ctx.drawImage(backgroundArt, 0, 0, 1080, 1920);
    ctx.fillStyle = "rgba(8,13,22,.38)";
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    gradient.addColorStop(0, "#171322");
    gradient.addColorStop(0.52, "#222038");
    gradient.addColorStop(1, "#100e18");
    ctx.fillStyle = gradient;
  }
  ctx.fillRect(0, 0, 1080, 1920);

  const activeCount = players.length;
  const totalXp = players.reduce((sum, player) => sum + player.totalXp, 0);
  const realm = leader ? REALMS[leader.realmIndex]?.name ?? "Phàm Nhân" : "Ngai vàng đang chờ";

  // Game title and compact live status bar.
  ctx.textAlign = "center";
  if (logoArt.complete && logoArt.naturalWidth > 0) ctx.drawImage(logoArt, 335, 10, 410, 90);
  else {
    ctx.fillStyle = "#f0d88c";
    ctx.font = "700 38px Georgia, serif";
    ctx.fillText("PHÀM TU", 540, 67);
  }
  roundRect(30, 100, 1020, 88, 28, "rgba(13,20,29,.82)", "rgba(221,194,125,.68)");
  ctx.textAlign = "left";
  ctx.fillStyle = "#e8dfca";
  ctx.font = "600 23px system-ui, sans-serif";
  ctx.fillText("ĐẠO HỮU ĐANG TU LUYỆN", 66, 136);
  ctx.fillStyle = "#d7c17f";
  ctx.font = "700 24px system-ui, sans-serif";
  ctx.fillText(String(activeCount), 66, 168);
  ctx.fillStyle = "#9cabb0";
  ctx.font = "17px system-ui, sans-serif";
  ctx.fillText("tu sĩ", 105, 168);
  ctx.fillStyle = serverConnected ? "#87d8ae" : "#dc9b75";
  ctx.beginPath(); ctx.arc(302, 160, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#b8c2bd";
  ctx.font = "17px system-ui, sans-serif";
  ctx.fillText(serverConnected ? "Đạo trường trực tuyến" : "Đang nối lại đạo trường", 320, 167);
  ctx.textAlign = "right";
  ctx.fillStyle = "#dfc77e";
  ctx.font = "600 18px system-ui, sans-serif";
  ctx.fillText(`${totalXp.toLocaleString("vi-VN")} tu vi tích lũy`, 1015, 156);
  roundRect(810, 169, 205, 5, 3, "rgba(234,219,176,.18)");
  roundRect(810, 169, Math.min(205, 30 + activeCount * 7), 5, 3, "#d7be73");

  // Atmospheric event notice.
  roundRect(46, 215, 988, 112, 22, "rgba(16,25,29,.88)", "rgba(162,194,166,.36)");
  ctx.textAlign = "left";
  ctx.fillStyle = "#e6d39b";
  ctx.font = "700 21px Georgia, serif";
  ctx.fillText("✦  ĐẠO TRƯỜNG PHÀM TU", 75, 255);
  ctx.fillStyle = "#d7ded4";
  ctx.font = "19px system-ui, sans-serif";
  ctx.fillText("Linh khí hội tụ nơi sơn môn. Chư vị hãy nhập đạo và cùng Hàn Lập", 75, 287);
  ctx.fillText("bước lên con đường tu tiên.", 75, 313);

  // Current event banner, with a clear demo state when previewing.
  roundRect(46, 353, 988, 174, 25, isDemo ? "rgba(48,28,31,.92)" : "rgba(25,38,43,.92)", isDemo ? "rgba(217,132,103,.76)" : "rgba(214,190,121,.56)");
  ctx.textAlign = "left";
  ctx.fillStyle = isDemo ? "#e8a578" : "#d7c27d";
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.fillText(isDemo ? "✦  YÊU THÚ ĐỘT KÍCH · SỰ KIỆN MINH HỌA" : "✦  TU LUYỆN TỰ DO", 78, 389);
  ctx.fillStyle = "#fff0d6";
  ctx.font = "700 35px Georgia, serif";
  ctx.fillText(isDemo ? "Yêu thú xuất hiện ngoài sơn môn!" : "Tĩnh tâm hấp thu linh khí", 78, 438);
  ctx.fillStyle = "#c5b8ae";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText(isDemo ? "Chư vị đồng tâm hiệp lực, bảo vệ đạo trường" : "Mỗi bước tu hành đều đưa người đến gần tiên đạo hơn", 78, 475);
  if (isDemo && bossArt.complete && bossArt.naturalWidth > 0) {
    ctx.save(); ctx.globalAlpha = 0.9; ctx.drawImage(bossArt, 812, 350, 145, 145); ctx.restore();
  }
  ctx.textAlign = "right";
  ctx.fillStyle = "#f5d991";
  ctx.font = "700 26px system-ui, sans-serif";
  ctx.fillText(isDemo ? "01:24" : "LIVE", 990, 391);
  ctx.fillStyle = "#e7c987";
  ctx.font = "15px system-ui, sans-serif";
  ctx.fillText(isDemo ? "BẢN XEM THỬ" : "ĐẠO LỮ TỤ HỘI", 990, 417);

  // Side instructions and leader shrine frame the main cultivation relic.
  roundRect(24, 624, 220, 324, 22, "rgba(14,23,25,.88)", "rgba(213,187,118,.7)");
  ctx.textAlign = "left";
  ctx.fillStyle = "#e6d496";
  ctx.font = "700 20px Georgia, serif";
  ctx.fillText("CÁCH NHẬP ĐẠO", 48, 665);
  ctx.fillStyle = "#a9beb0";
  ctx.font = "15px system-ui, sans-serif";
  ctx.fillText("GÕ LỆNH TRONG BÌNH LUẬN", 48, 692);
  const commands = [["1", "join", "Tạo tu sĩ"], ["2", "tu", "+20 tu vi"], ["3", "!do kiep", "Thử đột phá"]];
  commands.forEach(([number, command, description], index) => {
    const y = 744 + index * 64;
    ctx.fillStyle = ["#59baa0", "#d7ae55", "#d47781"][index]!;
    ctx.beginPath(); ctx.arc(61, y - 6, 14, 0, Math.PI * 2); ctx.fill();
    ctx.textAlign = "center"; ctx.fillStyle = "#fff4dc"; ctx.font = "700 15px system-ui, sans-serif";
    ctx.fillText(number!, 61, y);
    ctx.textAlign = "left"; ctx.fillStyle = "#f0d98f"; ctx.font = "700 19px system-ui, sans-serif";
    ctx.fillText(command!, 85, y);
    ctx.fillStyle = "#b9c4bb"; ctx.font = "15px system-ui, sans-serif";
    ctx.fillText(description!, 85, y + 21);
  });

  roundRect(836, 624, 220, 324, 22, "rgba(14,23,25,.88)", "rgba(213,187,118,.7)");
  if (throneArt.complete && throneArt.naturalWidth > 0) {
    ctx.save(); ctx.globalAlpha = 0.58; ctx.drawImage(throneArt, 871, 631, 150, 126); ctx.restore();
  }
  if (leader) {
    drawRealmIdleEffect(946, 716, leader.realmIndex, renderTime, true);
    const leaderArt = realmCharacterArt[leader.realmIndex];
    const portrait = leaderArt?.complete && leaderArt.naturalWidth > 0 ? leaderArt : cultivatorArt[0]!;
    if (portrait.complete && portrait.naturalWidth > 0) ctx.drawImage(portrait, 916, 666, 60, 73);
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "#e8d28f"; ctx.font = "700 18px Georgia, serif";
  ctx.fillText("TÔNG CHỦ", 946, 786);
  ctx.fillStyle = "#f6edd5"; ctx.font = "700 22px system-ui, sans-serif";
  ctx.fillText(fitText(leader?.displayName ?? "Đang chờ", 188, "700 22px system-ui"), 946, 824);
  ctx.fillStyle = "#c1b6a1"; ctx.font = "15px system-ui, sans-serif";
  ctx.fillText(leader ? realm : "Ngai vàng đang chờ chủ", 946, 854);
  ctx.fillStyle = "#e0c775"; ctx.font = "600 16px system-ui, sans-serif";
  ctx.fillText(leader ? `${leader.totalXp.toLocaleString("vi-VN")} tu vi` : "", 946, 882);
  ctx.fillStyle = "#9fb3a7"; ctx.font = "13px system-ui, sans-serif";
  ctx.fillText("Người có tu vi cao nhất", 946, 918);

  // Main alchemy cauldron with a quiet energy ring.
  ctx.save();
  ctx.globalAlpha = 0.32;
  for (let ring = 0; ring < 3; ring += 1) {
    ctx.beginPath(); ctx.ellipse(540, 825, 220 + ring * 35, 47 + ring * 9, 0, 0, Math.PI * 2);
    ctx.strokeStyle = ring === 1 ? "#e3c56f" : "#7cdacb"; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.restore();
  if (cauldronArt.complete && cauldronArt.naturalWidth > 0) ctx.drawImage(cauldronArt, 280, 548, 520, 460);
  ctx.textAlign = "center";
  ctx.fillStyle = "#f1dfa7"; ctx.font = "700 17px system-ui, sans-serif";
  ctx.fillText("LƯ LINH ĐAN", 540, 1007);
  ctx.fillStyle = "#c4c6b7"; ctx.font = "16px system-ui, sans-serif";
  ctx.fillText("Hấp thu linh khí · Bồi dưỡng đạo hạnh", 540, 1032);

  // Cultivators gather in rows around the central altar.
  ctx.fillStyle = "#ead79c"; ctx.font = "700 22px Georgia, serif";
  ctx.fillText("CHÚNG TU ĐỒNG HÀNH", 540, 1090);
  ctx.fillStyle = "#a9b4aa"; ctx.font = "15px system-ui, sans-serif";
  ctx.fillText("ĐẠO HỮU TRONG THIÊN HẠ", 540, 1115);
  for (let index = 0; index < 24; index += 1) {
    const player = players[index];
    const col = index % 6;
    const row = Math.floor(index / 6);
    const x = 92 + col * 179;
    const y = 1192 + row * 145;
    ctx.save();
    ctx.fillStyle = player ? "rgba(214,190,123,.15)" : "rgba(181,195,177,.07)";
    ctx.beginPath(); ctx.ellipse(x, y + 22, 48, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y - 15, 42, 0, Math.PI * 2);
    ctx.fillStyle = player ? "rgba(22,34,37,.66)" : "rgba(22,34,37,.34)";
    ctx.fill(); ctx.strokeStyle = player ? "rgba(222,196,125,.54)" : "rgba(182,194,177,.2)"; ctx.lineWidth = 2; ctx.stroke();
    if (player) drawRealmIdleEffect(x, y, player.realmIndex, renderTime, true);
    const tierArt = player ? realmCharacterArt[player.realmIndex] : undefined;
    const portrait = tierArt?.complete && tierArt.naturalWidth > 0 ? tierArt : cultivatorArt[index % cultivatorArt.length]!;
    if (portrait.complete && portrait.naturalWidth > 0) {
      ctx.globalAlpha = player ? 1 : 0.23;
      ctx.drawImage(portrait, x - 34, y - 59, 68, 83);
      ctx.globalAlpha = 1;
    }
    if (player) {
      roundRect(x - 77, y + 37, 154, 26, 9, "rgba(9,15,18,.84)", "rgba(198,182,133,.28)");
      ctx.textAlign = "center"; ctx.fillStyle = "#f1ead7"; ctx.font = "600 14px system-ui, sans-serif";
      ctx.fillText(fitText(player.displayName, 142, "600 14px system-ui"), x, y + 55);
      ctx.fillStyle = "#e1cd84"; ctx.font = "13px system-ui, sans-serif";
      ctx.fillText(`${player.totalXp.toLocaleString("vi-VN")} tu vi`, x, y + 78);
    } else if (index === 0 && activeCount === 0) {
      ctx.textAlign = "center"; ctx.fillStyle = "#c9c0a3"; ctx.font = "13px system-ui, sans-serif";
      ctx.fillText("Mời nhập đạo", x, y + 57);
    }
    ctx.restore();
  }
  drawBreakthroughEffect(renderTime);

  // Compact footer keeps the stream legible while preserving the full player formation.
  roundRect(34, 1780, 1012, 88, 23, "rgba(12,18,24,.87)", "rgba(204,184,125,.46)");
  ctx.textAlign = "left";
  ctx.fillStyle = "#e8d69a"; ctx.font = "700 16px system-ui, sans-serif";
  ctx.fillText("ĐẠO TRƯỜNG", 64, 1815);
  ctx.fillStyle = "#c4c9bf"; ctx.font = "15px system-ui, sans-serif";
  ctx.fillText(Date.now() < statusUntil ? fitText(statusMessage, 650, "15px system-ui") : isDemo ? "Yêu thú đang quấy nhiễu sơn môn · chat chien để hợp lực" : "join nhập đạo  ·  tu luyện  ·  !do kiep đột phá", 64, 1843);
  ctx.textAlign = "right";
  ctx.fillStyle = serverConnected ? "#91d5a9" : "#dfa17f";
  ctx.font = "600 14px system-ui, sans-serif";
  ctx.fillText(serverConnected ? "● TRỰC TUYẾN" : "● ĐANG KẾT NỐI", 1018, 1830);
  requestAnimationFrame(draw);
}

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(1080 * ratio);
  canvas.height = Math.round(1920 * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resize);
resize();
connect();
draw();
