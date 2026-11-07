# Phàm Tu — việc có thể chạy song song và yêu cầu bàn giao

## Các nhánh công việc song song

| Nhánh | Người làm | Đầu ra | Có thể bắt đầu khi |
|---|---|---|---|
| A. Nền game và luật | Mình | Engine, lưu dữ liệu, lệnh, lịch event, WebSocket, renderer, host panel | Ngay; đã khởi tạo project |
| B. Bộ câu hỏi Quiz | Bạn hoặc người biên soạn | Tối thiểu 20 câu đã duyệt; nên chuẩn bị 40 câu để chạy thử nhiều vòng | Ngay; dùng JSON mẫu dưới đây |
| C. Art 2D | Bạn/artist | Logo, nền, ngai, boss, tu sĩ, icon và VFX theo spec bên dưới | Ngay; dùng asset placeholder trước cũng được |
| D. Xác minh TikTok LIVE | Bạn trên tài khoản/PC sẽ phát | Xác nhận có thể đọc comment, Like, Gift; ảnh/log mẫu payload và cách chốt combo Gift | Ngay, ưu tiên trước các nhánh khác vì là rủi ro P0 |
| E. Nội dung/điều phối LIVE | Bạn | Tên tài khoản phát, cách host muốn pause/skip event, câu chữ thông báo | Có thể chuẩn bị song song |

Các nhánh A–C và E không cần chờ nhau. Nhánh D phải được xác minh sớm: connector Node.js phổ biến hiện được công bố là thư viện **không chính thức**, trong khi tài liệu TikTok mô tả API/Webhook theo quyền truy cập và sự kiện được hỗ trợ; chưa thấy endpoint công khai tổng quát cho luồng comment/Like/Gift LIVE. Vì vậy không nên coi kết nối thật là đã đảm bảo trước khi thử trên đúng tài khoản phát. [TikTok LIVE Connector](https://github.com/zerodytrash/TikTok-Live-Connector), [TikTok Webhook Events](https://developers.tiktok.com/docs/en/webhooks-events), [TikTok Developer Guidelines](https://developers.tiktok.com/docs/en/our-guidelines-developer-guidelines)

## Câu hỏi Quiz

Chuẩn bị UTF-8 JSON, bốn lựa chọn, một đáp án đúng, câu hỏi không cần dựa vào tác phẩm có bản quyền. Tránh câu có nhiều cách hiểu hoặc cần kiến thức cập nhật theo thời gian.

```json
[
  {
    "id": "quiz-001",
    "question": "Trong ngũ hành, hành nào sinh Thủy?",
    "choices": { "A": "Kim", "B": "Mộc", "C": "Hỏa", "D": "Thổ" },
    "answer": "A",
    "explanation": "Kim sinh Thủy.",
    "difficulty": "easy",
    "category": "tu-tien"
  }
]
```

Mỗi câu nên ngắn để đọc trên màn hình điện thoại; tối đa khoảng 100 ký tự cho câu hỏi và 45 ký tự mỗi lựa chọn. Gửi ít nhất 20 câu, mỗi câu có `id` duy nhất. Mình sẽ kiểm tra schema và tạo loader; câu trả lời đúng là A/B/C/D.

## Asset hình ảnh

**Canvas phát:** dọc 9:16, thiết kế gốc 1080×1920 px. UI sẽ co theo kích thước Browser Source. Để dễ đọc trên điện thoại, nội dung quan trọng nằm trong vùng an toàn: cách mép trái/phải tối thiểu 60 px, cách mép trên/dưới tối thiểu 100 px. Asset raster dùng PNG sRGB; nền trong suốt phải có alpha thật. Không gửi ảnh chụp màn hình có nền caro giả transparency.

| Ưu tiên | Asset | Yêu cầu bàn giao |
|---|---|---|
| P0 | Nền chính | `background.png`, 1080×1920, có thể dùng nền tĩnh; để vùng giữa đủ tối/ít chi tiết cho nhân vật và boss |
| P0 | Tu sĩ đại diện | 1–3 nhân vật PNG nền trong suốt, mỗi ảnh khoảng 256×320 px; tư thế ngồi/thiền, hướng nhìn rõ, không cần rig |
| P0 | Boss | `boss.png`, nền trong suốt, khung khoảng 700×700 px; dáng nhận biết được ở kích thước hiển thị 350–500 px |
| P0 | Logo/tên game | SVG ưu tiên, hoặc PNG trong suốt chiều ngang 800 px trở lên |
| P1 | Ngai Tông Chủ | PNG alpha khoảng 500×400 px; nếu ngai và nhân vật tách layer thì gửi riêng |
| P1 | VFX độ kiếp | 2–4 ảnh PNG alpha, canvas 512×512 px; hiệu ứng viền/sét/hào quang, tránh nền đặc |
| P1 | VFX chưởng | Một ảnh cho mỗi cấp gift (4 cấp) và một ảnh Thiên Đạo Chưởng; PNG alpha 512×512 hoặc 768×512 px |
| P1 | Icon nhỏ | PNG alpha 64×64 hoặc 128×128 px cho XP, cảnh giới, tim, boss, đồng hồ/sự kiện |
| P2 | Chân dung tu sĩ thêm | Có thể gửi thêm tối đa 8 biến thể 256×320 px để giảm lặp hình; MVP vẫn chạy được chỉ với 1 hình |
| P2 | Âm thanh | Tùy chọn; WAV 48 kHz, 16-bit PCM, mono/stereo, ngắn dưới 2 giây; không cần chuẩn bị để bắt đầu |

Quy ước tên: chữ thường không dấu, dùng `_`, ví dụ `background_main.png`, `boss_world.png`, `vfx_gift_1000.png`, `cultivator_01.png`. Xin giữ riêng file gốc có layer (PSD/Krita/PNG tách lớp) nếu artist có; bản game vẫn cần PNG/SVG đã xuất. Không dùng logo, nhân vật, nhạc hoặc hình ảnh trích từ tác phẩm khác.

### Cách bàn giao asset

Đặt file trong `assets/` theo nhóm `backgrounds/`, `characters/`, `bosses/`, `vfx/`, `icons/`, `audio/`. Có thể gửi từng nhóm hoặc file nén `.zip`; kèm ghi chú font/chữ cần dùng nếu asset chứa chữ. Font giao diện cần hỗ trợ tiếng Việt đầy đủ dấu; nếu có font riêng, gửi `.ttf`/`.otf` kèm giấy phép sử dụng.

## Nội dung và quyết định cần bạn chuẩn bị

- TikTok `@username` của tài khoản sẽ phát LIVE và xác nhận tài khoản có quyền phát từ PC.
- Kết quả thử connector: comment `join`, một comment thường, một Gift combo (nếu có), Like tăng theo đợt; không gửi cookie/token/mật khẩu. Chỉ cần log đã che thông tin nhạy cảm hoặc quay màn hình thao tác.
- Tên hiển thị cuối cùng của game và cách viết các cảnh giới nếu muốn khác nguyên văn GDD.
- Bộ câu hỏi theo JSON trên. Nếu chưa kịp, có thể chạy bằng bộ câu placeholder trong quá trình phát triển.
- Ưu tiên thẩm mỹ: tiên hiệp cổ phong, hoạt hình, pixel art hay phong cách khác; gửi 1–3 hình tham khảo tự tạo/được phép dùng nếu có.

## Nền đã khởi tạo

Hiện có cấu hình cảnh giới/cân bằng, các hàm luật cốt lõi, kiểu sự kiện chuẩn hóa cho connector, schema SQLite WAL có receipt Gift/event để chống cộng trùng, và lệnh chạy Node/TypeScript. Việc tiếp theo là nối luật vào transaction và scheduler, phát state qua WebSocket, rồi dựng renderer 9:16 và host panel. Project hiện chưa nối TikTok LIVE và chưa có giao diện cuối.

