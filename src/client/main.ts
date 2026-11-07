import "./style.css";
import type { Player } from "../server/domain/types.js";
import { REALMS } from "../shared/gameConfig.js";

type Snapshot = { type: "snapshot"; players: Player[]; leader: Player | null; serverTime: number };
type GameMessage = { type: "game_event"; result: { ok: boolean; message: string; code: string } };

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const ctx = canvas.getContext("2d")!;
const connection = document.querySelector<HTMLDivElement>("#connection")!;
let players: Player[] = [];
let leader: Player | null = null;
let statusMessage = "Vạn đạo khai mở";
let statusUntil = 0;
let serverConnected = false;

const wsUrl = new URLSearchParams(location.search).get("ws") ?? "ws://127.0.0.1:3001";
let socket: WebSocket;

function connect() {
  socket = new WebSocket(wsUrl);
  socket.addEventListener("open", () => {
    serverConnected = true;
    connection.textContent = "MÁY CHỦ ĐANG KẾT NỐI";
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
      players = data.players;
      leader = data.leader;
    } else if (data.type === "game_event") {
      statusMessage = data.result.message;
      statusUntil = Date.now() + 4500;
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

function draw() {
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
  gradient.addColorStop(0, "#171322");
  gradient.addColorStop(0.52, "#222038");
  gradient.addColorStop(1, "#100e18");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);

  // Decorative celestial rings are temporary art placeholders.
  ctx.save();
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.arc(540, 710, 245 + i * 44, 0, Math.PI * 2);
    ctx.strokeStyle = i % 2 ? "#d5b776" : "#8c78bb";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = "#e9d7a2";
  ctx.font = "700 34px Georgia, serif";
  ctx.fillText("PHÀM TU", 540, 86);
  ctx.fillStyle = "#b6aacd";
  ctx.font = "22px Georgia, serif";
  ctx.fillText("VẠN ĐẠO TRANH PHONG", 540, 122);

  roundRect(64, 165, 952, 250, 28, "rgba(18,16,27,.78)", "rgba(218,188,119,.58)");
  ctx.fillStyle = "#d6bd7e";
  ctx.font = "600 24px Georgia, serif";
  ctx.fillText("TÔNG CHỦ", 540, 210);
  ctx.fillStyle = "#f7edcf";
  ctx.font = "700 42px system-ui, sans-serif";
  ctx.fillText(fitText(leader?.displayName ?? "Chưa có tu sĩ", 820, "700 42px system-ui"), 540, 270);
  ctx.fillStyle = "#c5b9d5";
  ctx.font = "26px system-ui, sans-serif";
  const realm = leader ? REALMS[leader.realmIndex]?.name ?? "Phàm Nhân" : "Ngai vàng đang chờ";
  ctx.fillText(leader ? `${realm}  ·  ${leader.totalXp.toLocaleString("vi-VN")} tu vi` : realm, 540, 325);
  ctx.fillStyle = "#b59658";
  ctx.fillRect(390, 364, 300, 2);
  ctx.fillStyle = "#d7c28c";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("NGÔI VỊ THUỘC VỀ NGƯỜI CÓ TỔNG TU VI CAO NHẤT", 540, 392);

  // Placeholder cultivator silhouettes.
  ctx.textAlign = "center";
  ctx.fillStyle = "#d9c18a";
  ctx.font = "600 24px system-ui, sans-serif";
  ctx.fillText("THIÊN HẠ TU LUYỆN", 540, 525);
  const visible = players.slice(0, 8);
  visible.forEach((player, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = 190 + col * 235;
    const y = 650 + row * 205;
    ctx.save();
    ctx.fillStyle = "rgba(154,135,196,.16)";
    ctx.beginPath();
    ctx.ellipse(x, y + 34, 62, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#54486f";
    ctx.beginPath();
    ctx.ellipse(x, y, 30, 40, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#87739c";
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 52, 18, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e9dfc1";
    ctx.font = "500 18px system-ui, sans-serif";
    ctx.fillText(fitText(player.displayName, 190, "500 18px system-ui"), x, y + 70);
    ctx.fillStyle = "#cbb57c";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText(`${player.totalXp.toLocaleString("vi-VN")} tu vi`, x, y + 96);
    ctx.restore();
  });

  roundRect(64, 1120, 952, 510, 28, "rgba(14,13,22,.82)", "rgba(160,144,190,.35)");
  ctx.fillStyle = "#e3d19d";
  ctx.font = "600 28px Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText("BẢNG THIÊN MỆNH", 104, 1172);
  ctx.textAlign = "right";
  ctx.fillStyle = "#9f94ad";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("TOP 10", 976, 1170);
  for (let i = 0; i < 10; i += 1) {
    const player = players[i];
    const y = 1226 + i * 37;
    ctx.textAlign = "left";
    ctx.fillStyle = i === 0 ? "#d6ba71" : "#716a82";
    ctx.font = "600 19px system-ui, sans-serif";
    ctx.fillText(String(i + 1).padStart(2, "0"), 104, y);
    ctx.fillStyle = player ? "#eee6d4" : "#625b70";
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillText(fitText(player?.displayName ?? "—", 460, "18px system-ui"), 162, y);
    ctx.fillStyle = "#aa9fb9";
    ctx.textAlign = "right";
    ctx.fillText(player ? (REALMS[player.realmIndex]?.name ?? "Phàm Nhân") : "", 720, y);
    ctx.fillStyle = "#d4bb80";
    ctx.font = "600 18px system-ui, sans-serif";
    ctx.fillText(player ? player.totalXp.toLocaleString("vi-VN") : "", 976, y);
    ctx.strokeStyle = "rgba(196,184,213,.09)";
    ctx.beginPath(); ctx.moveTo(104, y + 13); ctx.lineTo(976, y + 13); ctx.stroke();
  }

  roundRect(64, 1680, 952, 120, 24, "rgba(167,132,75,.16)", "rgba(211,180,113,.4)");
  ctx.textAlign = "center";
  ctx.fillStyle = "#dfcc9c";
  ctx.font = "600 22px system-ui, sans-serif";
  ctx.fillText(Date.now() < statusUntil ? statusMessage : "Chat join để nhập đạo · tu để tăng tu vi · !do kiep để đột phá", 540, 1747);
  ctx.fillStyle = "#a59aaf";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("Lịch sự kiện 12 phút · Live đang kết nối", 540, 1784);

  ctx.fillStyle = serverConnected ? "#8dd2aa" : "#d87f77";
  ctx.beginPath(); ctx.arc(492, 1852, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#8f879f";
  ctx.font = "16px system-ui, sans-serif";
  ctx.fillText(serverConnected ? "SERVER CONNECTED" : "RECONNECTING", 572, 1858);
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

