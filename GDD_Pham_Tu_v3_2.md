# GDD v3.2 — PHÀM TU: VẠN ĐẠO TRANH PHONG
Ngày: 07/11/2026 | Phụ lục mỹ thuật tiến triển cảnh giới: 07/11/2026 | Nền tảng: Windows → TikTok LIVE | Art: 2D 9:16 | Mục tiêu: LIVE thật trong 72 giờ

## 1. Tầm nhìn & scope
Mỗi người xem có một tu sĩ riêng, tu luyện tích lũy tu vi, chủ động độ kiếp, tham gia Quiz, Tranh Linh Mạch và Boss Thế Giới. Không chia phe. Người có tổng tu vi cao nhất trở thành Tông Chủ ngồi trên cao. Gift tăng tu vi trực tiếp; khi có Boss, Gift còn kích hoạt chưởng luôn trúng. Thả tim tích năng lượng cho chưởng do thế giới tạo.

MVP không có PvP, trang bị, túi đồ, 3D, bản đồ mở, offline XP, đổi thưởng hay giao dịch tài nguyên.

## 2. Luồng người chơi
Comment `join` → tạo/khôi phục tu sĩ → tự tu luyện và dùng `tu` → tham gia sự kiện → nhận tu vi → đủ ngưỡng dùng `!do kiep` → thành công tăng cảnh giới và chiến lực → cạnh tranh Top 10/Tông Chủ. Gift tăng tu vi tức thì, không tự độ kiếp.

## 3. Nhân vật và Tông Chủ
Định danh bằng TikTok user ID ổn định, không dùng nickname làm khóa. Lưu: ID, tên, tổng XP, cảnh giới, số lần độ kiếp thất bại liên tiếp, cooldown, tổng Coin Gift, sát thương boss, thời điểm cập nhật. Tông Chủ = người có tổng XP cao nhất toàn bộ dữ liệu; hòa điểm ưu tiên người đạt mốc trước. Tông Chủ ngồi ở ngai phía trên, các tu sĩ khác ở các hàng dưới; đổi ngôi ngay khi có người vượt. Danh hiệu không tăng tốc XP để tránh snowball.

## 4. Cân bằng cảnh giới (giá trị thử nghiệm)
| Cảnh giới | XP tích lũy tối thiểu | Chiến lực nền | Xác suất độ kiếp gốc |
|---|---:|---:|---:|
| Phàm Nhân | 0 | 10 | — |
| Luyện Khí sơ | 100 | 25 | 90% |
| Luyện Khí trung | 300 | 40 | 90% |
| Luyện Khí hậu | 700 | 65 | 85% |
| Trúc Cơ sơ | 1.500 | 110 | 80% |
| Trúc Cơ trung | 3.000 | 160 | 80% |
| Trúc Cơ hậu | 5.500 | 230 | 75% |
| Kết Đan sơ | 9.000 | 330 | 65% |
| Kết Đan trung | 14.000 | 460 | 65% |
| Kết Đan hậu | 21.000 | 640 | 60% |
| Nguyên Anh sơ | 30.000 | 900 | 50% |
| Nguyên Anh trung | 43.000 | 1.250 | 50% |
| Nguyên Anh hậu | 60.000 | 1.700 | 45% |
| Hóa Thần sơ | 85.000 | 2.300 | 35% |
| Hóa Thần trung | 120.000 | 3.100 | 35% |
| Hóa Thần hậu | 170.000 | 4.200 | 30% |

Tu luyện tự động +2 XP/giây khi đang hoạt động; `tu` +20 XP, cooldown 30 giây. XP tích lũy không bị trừ khi độ kiếp thất bại. Khi XP vượt nhiều mốc vẫn cần độ kiếp lần lượt từng tầng. Chiến lực cơ bản lấy theo cảnh giới; chỉ số này là cấu hình cân bằng, chưa kiểm chứng thực tế.

## 5. Độ Kiếp
Lệnh `!do kiep` (chấp nhận `!dokiep`), chỉ hợp lệ khi đủ XP lên tầng kế tiếp, hết cooldown 60 giây, không có lần độ kiếp đang xử lý. Xác suất = min(100%, xác suất gốc của tầng kế tiếp + 20 điểm phần trăm × số lần thất bại liên tiếp). Thành công: lên đúng 1 tầng, reset thất bại = 0, phát hiệu ứng và thông báo. Thất bại: không mất XP/cảnh giới, tăng thất bại lên 1, hiển thị xác suất lần sau. Lưu giao dịch và log kết quả để kiểm thử. Gift không tăng trực tiếp xác suất, chỉ tăng XP.

## 6. Sự kiện (lịch 12 phút, thử nghiệm)
- 00:00: tu luyện tự do.
- 02:00: Quiz 20 giây; chat A/B/C/D; đáp án đầu tiên được tính; đúng +100 XP, sai 0; ngân hàng tối thiểu 20 câu được duyệt.
- 04:00: Tranh Linh Mạch 90 giây, **không có phe**. Chat `dao` mỗi 10 giây; điểm đào = min(100, 10 + floor(sqrt(chiến lực))). Mọi người có đóng góp +50 XP; chia thêm quỹ 3.000 XP theo tỷ lệ điểm đào, làm tròn và giới hạn mỗi người; vinh danh Top đào.
- 07:00: Quiz thứ hai.
- 09:00: Boss Thế Giới 120 giây; chat `chien` mỗi 10 giây gây min(500, max(5, floor(chiến lực×0,25))) sát thương. HP boss thử nghiệm = clamp(5.000 + 500×số người hoạt động, 5.000, 50.000). Boss chết: người tham gia +100 XP; boss sống: +30 XP; Top 3 sát thương thêm 300/200/100 XP.
- 11:30: tổng kết, BXH; vòng lặp lại.
Chỉ một event chủ đạo hoạt động cùng lúc. Host có thể tạm dừng/bỏ qua/khởi động event. Thưởng chỉ được cộng một lần theo event ID và user ID.

## 7. Thiên Đạo Chưởng — do thế giới tạo
Trong Boss, hệ thống tự mở cửa sổ tích tim 15 giây mỗi 30 giây (cấu hình thử nghiệm). Tất cả Like hợp lệ tăng thanh năng lượng chung. Ngưỡng thử nghiệm 100 tim: đạt ngưỡng → HIT, gây 1.000 sát thương; hết giờ thiếu tim → MISS, 0 sát thương. Like phải cộng theo delta số tim thực, không tính mỗi callback là 1 tim. Thanh tim vẫn tích lũy khi có Gift/VFX khác xuất hiện.

## 8. Chân Linh Chưởng — kích hoạt bằng Gift
**Quy tắc khóa:** Gift hợp lệ luôn cộng tu vi trực tiếp cho chủ nhân. Trong Boss, Gift tạo Chân Linh Chưởng **100% HIT**, không phụ thuộc tim. Gift Coin lớn hơn **ngắt/đè VFX** Gift Coin nhỏ hơn đang hiển thị; so sánh giá trị Coin thực tế, không chỉ theo tier. Gift bị đè hoặc không kịp hiện **vẫn cộng đủ XP và sát thương đúng một lần**. Gift cùng giá trị xếp theo thời gian nhận. Khi không có Boss, Gift vẫn tăng XP, không gây boss damage.

| Gift Coin | XP/Coin | Damage/Coin khi Boss | VFX | Thời lượng |
|---|---:|---:|---|---:|
| 1–9 | 100 | 5 | Linh Khí Chưởng | 0,7 giây |
| 10–99 | 80 | 6 | Kim Quang Chưởng | 1,2 giây |
| 100–999 | 60 | 7 | Đại La Chưởng | 2 giây |
| 1.000+ | 40 | 8 | Diệt Thế Thần Chưởng | 3 giây |

Ví dụ Gift 100 Coin → +6.000 XP và 700 damage khi Boss đang sống. Đây là thông số game thử nghiệm, không phải tỷ giá doanh thu. Mặc định MVP: tim **không** tăng damage Gift Chưởng; chỉ dùng cho Thiên Đạo Chưởng. Nếu muốn bonus damage theo tim thì phải duyệt thành thay đổi scope sau MVP.

Xử lý Gift: chuẩn hóa userId, giftId, coinValue, repeatCount, eventId, comboFinal; xác định chiến lược chốt combo theo connector thực tế; ghi receipt có unique key → cộng XP → gây boss damage (nếu đang có Boss) → cập nhật BXH → phát VFX. Reconnect không được cộng trùng. VFX queue có giới hạn, gộp hiệu ứng nhỏ nhưng không gộp/mất reward.

## 9. Lệnh chat
| Lệnh | Chức năng | Giới hạn |
|---|---|---|
| `join` | Tạo/khôi phục tu sĩ | 1 nhân vật / user ID |
| `tu` | +20 XP | 30 giây |
| `!do kiep`, `!dokiep` | Độ kiếp tầng tiếp theo | Đủ XP, 60 giây |
| `A`, `B`, `C`, `D` | Trả lời Quiz | 1 đáp án đầu tiên/câu |
| `dao` | Đào linh mạch | 10 giây, đúng event |
| `chien` | Đánh Boss | 10 giây, đúng event |

## 10. UI/UX
Khung dọc 9:16. Trên cùng: ngai Tông Chủ (tên, cảnh giới, tổng XP). Giữa: tu sĩ nhỏ ngồi theo hàng, khi có boss hiển thị boss lớn, HP và thanh tim; quiz hiển thị overlay chữ rõ. Dưới: Top 10, đồng hồ sự kiện, lệnh chat. VFX độ kiếp và chưởng hiển thị trên lớp riêng, không che HP boss hay câu hỏi. Cần xem được trên điện thoại; hạn chế nhấp nháy toàn màn hình. Không cần nhân vật 3D, rig hay animation phức tạp.

### 10.1 Tạo hình và hiệu ứng riêng cho từng cảnh giới — yêu cầu bắt buộc

Mỗi trong 16 cảnh giới có **một tạo hình tu sĩ riêng**. Khi độ kiếp thành công và đổi cảnh giới, hình tu sĩ đổi sang sprite của cảnh giới mới; không chỉ đổi màu áo hay thêm một biểu tượng nhỏ. Cần giữ nhận diện khuôn mặt/khí chất của cùng một tu sĩ xuyên suốt, đồng thời làm trang phục, tóc, họa tiết, thần thái và dáng aura tiến triển rõ rệt. Đây là thay đổi mỹ thuật, không tạo hệ thống trang bị hoặc chỉ số mới.

#### Bộ sprite tu sĩ

- Bắt buộc 16 PNG trong suốt, mỗi bậc một file, theo đúng tên và thứ tự ở bảng dưới. Đường dẫn gốc: `assets/characters/realms/`.
- Canvas gốc **384×480 px**, PNG RGBA, sRGB, nền trong suốt thật. Nhân vật ngồi thiền toàn thân, chính diện hoặc xoay nhẹ 3/4, căn giữa; chừa lề trong suốt ít nhất 8% quanh tóc, tay áo và chân.
- Giữ cùng tỷ lệ đầu/thân, góc máy, vùng chân và đường nền để thay sprite không nhảy vị trí. Nét chính phải đọc được khi thu còn khoảng 68×83 px trên LIVE.
- Không vẽ chữ, tên cảnh giới, nền, ngai, vòng aura, hạt sáng hay sét vào sprite nhân vật. Renderer vẽ idle/VFX riêng để giữ rõ UI và có thể thay palette.
- Hai ảnh `assets/characters/cultivator_01.png` và `cultivator_02.png` chỉ là ảnh tham khảo/placeholder cho bố cục hiện tại; không đáp ứng yêu cầu 16 tạo hình cuối.

| Bậc | File nhân vật | Hướng tạo hình | Idle khi tu luyện | Độ kiếp thành công để vào bậc này |
|---:|---|---|---|---|
| 0 | `realm_00_pham_nhan.png` | Phàm nhân, áo vải giản dị, ít trang sức, thần thái bình ổn | Sương khí mỏng, nhịp thở chậm, vài đốm sáng bạc | Chưa có; đây là hình khởi đầu |
| 1 | `realm_01_luyen_khi_so.png` | Áo tu hành xanh nhạt, đai vải đơn, ánh mắt bắt đầu có thần | Linh khí xanh ngọc tụ thành một vòng nhỏ | Khí tụ: luồng khí hút vào thân rồi lóe sáng xanh dịu |
| 2 | `realm_02_luyen_khi_trung.png` | Thêm đai ngọc và đường viền tay áo; dáng ngồi vững hơn | Phù văn ngọc xoay chậm quanh thân | Khai mạch: xung lực ngọc lan qua các kinh mạch dạng vòng |
| 3 | `realm_03_luyen_khi_hau.png` | Tay áo dài, tua lụa và phù giấy nhỏ; silhouette rộng hơn bậc 2 | Tua áo/linh khí lượn thành cánh hoa | Linh triều: gió cuốn cánh sáng xoáy lên rồi tan |
| 4 | `realm_04_truc_co_so.png` | Áo nhiều lớp có đường nét nền móng, màu lam ngọc | Gợn nước lam chạy thành hai quỹ đạo | Lập cơ: vòng nền móng mở rộng dưới chân tu sĩ |
| 5 | `realm_05_truc_co_trung.png` | Ngoại bào và họa tiết mạch sáng rõ hơn; giữ nét mặt quen thuộc | Dải khí như dòng nước đổi chiều liên tục | Địa mạch: nhiều vòng lam ngọc đồng tâm bung ra |
| 6 | `realm_06_truc_co_hau.png` | Họa tiết liên hoa trên áo, tua áo và tóc bay nhẹ | Cánh sen hồng/ngọc mở khép quanh thân | Liên khai: một đóa sen lớn nở thành nhiều cánh sáng |
| 7 | `realm_07_ket_dan_so.png` | Áo có điểm nhấn vàng ấm ở đan điền, cổ tay và trâm | Hỏa quang vàng cam bốc nhẹ quanh đan điền | Kết đan: quang cầu vàng hình thành rồi phát xung |
| 8 | `realm_08_ket_dan_trung.png` | Họa tiết tinh tú trên ngoại bào; ánh nhìn tự tin, trang phục tinh luyện | Tinh điểm tím lam quay theo các quỹ đạo riêng | Tinh lạc: sao sáng rơi vào tâm rồi nở thành vòng sáng |
| 9 | `realm_09_ket_dan_hau.png` | Pháp bào vàng ngà có vầng văn sau lưng, không biến thành giáp | Nhật hoàn vàng và nhiều vòng quỹ đạo | Đan minh: quang hoàn mở theo lớp, tâm sáng co lại rồi bùng nở |
| 10 | `realm_10_nguyen_anh_so.png` | Áo có lớp linh ảnh mờ sau vai, dáng người vẫn là chủ thể | Linh châu xanh lam/tím bay quanh | Nguyên anh hiện: linh ảnh tách bóng rồi nhập lại vào thân |
| 11 | `realm_11_nguyen_anh_trung.png` | Viền áo đỏ-vàng như phượng hỏa, tay áo rực hơn bậc 10 | Vệt phượng hỏa bay lên theo vòng | Hồn đăng: linh ảnh bừng sáng, cánh lửa vút lên |
| 12 | `realm_12_nguyen_anh_hau.png` | Ngoại bào tím sâu, đường sét mảnh chạy dọc viền áo | Hồ quang tím lam lóe theo nhịp, không nhấp nháy toàn màn | Thiên lôi: sét hội tụ quanh nhân vật rồi đánh thành vòng |
| 13 | `realm_13_hoa_than_so.png` | Pháp bào sáng, ấn văn sau đầu/vai, dáng vẻ thần thánh nhưng vẫn là tu sĩ | Thiên ấn xoay chậm cùng bụi sao trắng vàng | Thần quang giáng: cột sáng hẹp và thiên ấn mở sau lưng |
| 14 | `realm_14_hoa_than_trung.png` | Họa tiết long văn trừu tượng, dải bào tạo silhouette lớn và uy nghi | Long khí xanh ngọc uốn quanh thành nhiều lớp | Long môn: long khí cuộn vòng, cổng sáng mở rồi khép |
| 15 | `realm_15_hoa_than_hau.png` | Tạo hình tối cao, pháp bào nhiều lớp, vầng sáng vương miện; vẫn giữ silhouette người | Tiên hoàn nhiều tầng, hạt sao và dải khí chuyển động chậm | Siêu phàm: thiên môn mở nhiều lớp, quang hoàn lớn nhất và tĩnh lại ở đỉnh |

#### Quy tắc hiệu ứng và triển khai

- `src/shared/realmVisuals.ts` là catalog dữ liệu chuẩn: mỗi `realmIndex` ghép `characterAsset`, palette, kiểu chuyển động idle, số hạt/vòng, cường độ và profile độ kiếp thành công.
- Idle VFX được Canvas vẽ theo profile của tu sĩ trong từng frame. Mỗi bậc phải khác ít nhất ở **màu + hình/chuyển động + mật độ/cường độ**; càng cao càng rõ và uy nghi, nhưng không che tên, XP, boss HP hoặc câu Quiz. Không cần xuất 16 sprite sheet idle cho MVP.
- Khi thành công, dùng profile của **cảnh giới đích** để phát hiệu ứng đến riêng tu sĩ đó. 15 lần lên bậc có màu, hình vòng/hạt, mật độ và thời lượng riêng theo catalog. Thất bại dùng cùng profile đích nhưng biến thể ngắn, tối/đỏ và vỡ vụn; giữ nguyên cảnh giới và tu vi.
- Mọi hiệu ứng nằm trên layer Canvas riêng, chỉ quanh nhân vật mục tiêu; không rung camera, không flash trắng toàn màn hình. Tôn trọng thời lượng profile và tự dọn animation khi kết thúc.
- Artist chỉ cần bàn giao 16 sprite nhân vật để hệ thống hoạt động. Nếu muốn thay procedural VFX bằng artwork riêng, có thể bàn giao thêm overlay PNG/SVG alpha ở `assets/vfx/realms/`, tên `idle_<realm_id>.*` và `breakthrough_<realm_id>.*`; đây là nâng cấp tùy chọn, không thay tên/format của sprite nhân vật.

IDs cảnh giới và mã profile nằm trong `src/shared/realmVisuals.ts`; không tự đổi tên file nếu chưa cập nhật catalog. Tạo hình không lấy từ tác phẩm hay nhân vật có bản quyền.

## 11. Kiến trúc
TypeScript + Canvas 2D frontend; Node.js authoritative game engine; SQLite WAL lưu người chơi, độ kiếp, receipt Gift và kết quả sự kiện; WebSocket nội bộ cập nhật renderer. `src/shared/realmVisuals.ts` là catalog tạo hình/VFX theo cảnh giới, được renderer dùng để tải sprite riêng và vẽ idle/độ kiếp; khi thay cảnh giới, game state gửi `realmIndex` mới để renderer đổi form. TikTok adapter chuẩn hóa comment, like, gift, connect/disconnect. Có simulator riêng để QA nhưng **simulator không thay thế kiểm thử LIVE thật**. Phát qua cửa sổ game/Browser Source trên TikTok LIVE Studio hoặc OBS; host panel riêng không hiện trên LIVE. Cần kiểm tra quyền LIVE và tính ổn định/chính sách của bridge sự kiện ngay giờ đầu.

## 12. Chống lỗi, vận hành và chính sách
Cooldown chống spam theo user, escape nickname, giới hạn số sprite hiện đồng thời, log latency và reconnect exponential backoff. Gift/XP xử lý idempotent trong transaction; sao lưu SQLite và thử restore. Gift là tùy chọn, không hứa hẹn lợi ích tài chính, không đặt cược, không quy đổi XP ra tiền. Doanh thu thực nhận chỉ đối chiếu báo cáo TikTok, không tự suy Coin thành VND. Tránh sao chép hình ảnh, âm thanh, nhân vật có bản quyền từ Phàm Nhân Tu Tiên.

## 13. KPI
Người tham gia LIVE, người quay lại, XP miễn phí/Gift, số Gift và Coin hợp lệ, tỷ lệ Gift sender, thời gian phản hồi Gift, số lần chuyển Tông Chủ, số lần độ kiếp và tỷ lệ thành công, tỷ lệ tham gia Quiz/Linh Mạch/Boss, tỷ lệ Boss bị hạ, tỷ lệ Thiên Đạo Chưởng HIT, số lần Gift VFX bị đè, số event trùng bị loại.

## 14. Backlog P0 (ước tính lạc quan)
| ID | Task | Giờ | Acceptance criteria |
|---|---|---:|---|
| 01 | TikTok LIVE connector spike | 4 | Comment, Like, Gift thật ghi log đúng sender |
| 02 | Server + SQLite + dedupe | 5 | Restart giữ XP, receipt Gift không trùng |
| 03 | Join, tu luyện, Gift XP | 4 | XP cộng đúng, cooldown đúng |
| 04 | Cảnh giới và Độ Kiếp | 5 | +20 điểm % mỗi thất bại, reset thành công |
| 05 | UI 2D, tạo hình 16 bậc, Tông Chủ, Top 10 | 6 + art | Đổi đúng sprite theo cảnh giới; mỗi tier có idle VFX riêng; đổi ngôi cập nhật ngay |
| 06 | Quiz | 3 | Chấm đúng, cộng thưởng một lần |
| 07 | Linh Mạch | 4 | `dao`, cooldown, thưởng đóng góp |
| 08 | Boss | 5 | HP, `chien`, damage, thưởng |
| 09 | Like Thiên Đạo Chưởng | 4 | Đủ tim HIT, thiếu tim MISS |
| 10 | Gift Chưởng và VFX priority | 6 | Auto HIT; Gift lớn đè nhỏ; không mất reward |
| 11 | Scheduler và host panel | 4 | Chạy vòng 12 phút, pause/skip |
| 12 | Idle, độ kiếp và VFX cơ bản | 4 + art | 16 idle profile khác nhau; độ kiếp thành công/thất bại có VFX theo tier; UI dễ đọc |
| 13 | QA LIVE thật và đóng gói | 8 | 30 phút LIVE không lỗi nghiêm trọng |
| | **Tổng** | **62 giờ công** | |

## 15. Timeline 72 giờ
- **Giờ 0–4:** kiểm chứng LIVE thật và payload comment/Like/Gift. Nếu không kết nối được phải xử lý ngay, không đợi ngày 3.
- **Giờ 4–24:** server, DB, tu sĩ, Gift→XP, độ kiếp, UI Tông Chủ.
- **Giờ 24–48:** Quiz, Linh Mạch, Boss, hai loại chưởng, ưu tiên Gift VFX; kiểm thử xuyên hệ thống.
- **Giờ 48–72:** sửa lỗi, reconnect/dedupe, hoàn thiện UI, kiểm thử LIVE 30 phút, đóng gói.
62 giờ công trong 72 giờ lịch là kế hoạch rất sát, không phải cam kết chắc chắn. Nếu trễ, cắt audio và VFX phụ, lệnh tùy chọn, số câu quiz; không cắt kết nối LIVE, Gift→XP, Độ Kiếp, Tông Chủ, Boss/chưởng hoặc lưu dữ liệu nếu vẫn gọi là MVP v3.2.

## 16. Definition of Done
1. Hai tài khoản thật comment `join` và xuất hiện đúng.
2. Gift thật cộng XP đúng một lần cho đúng tu sĩ.
3. Tông Chủ chuyển khi người khác vượt tổng XP.
4. `!do kiep` đúng ngưỡng, đúng xác suất, thất bại +20 điểm %, dữ liệu tồn tại sau restart.
5. Quiz, Linh Mạch, Boss hoạt động trong một vòng 12 phút.
6. Thiên Đạo Chưởng: đủ Like HIT, thiếu MISS.
7. Gift Chưởng: luôn HIT, Gift lớn đè VFX Gift nhỏ, tất cả vẫn nhận XP và damage.
8. LIVE thật ổn định tối thiểu 30 phút, không có lỗi P0.
9. Mỗi trong 16 cảnh giới tải đúng sprite riêng; idle VFX khác nhau theo catalog; 15 hiệu ứng độ kiếp thành công và biến thể thất bại hiển thị đúng bậc, không che UI.

## 17. Quyết định đã khóa và phần chưa khóa
**Đã khóa:** không chia phe; Tông Chủ theo tổng XP; Gift tăng XP trực tiếp; chủ động `!do kiep` và +20 điểm % mỗi lần fail; Quiz/Linh Mạch/Boss; chưởng thế giới cần đủ tim; chưởng Gift auto HIT; Gift lớn đè VFX Gift nhỏ; 2D; deadline mục tiêu 72h; 16 cảnh giới có tạo hình nhân vật riêng, idle VFX riêng và VFX độ kiếp theo cảnh giới đích.
**Thông số tạm:** XP/cảnh giới, base chance, cooldown, Gift XP/Coin, boss HP, damage, ngưỡng tim, lịch event. Cần test balance, nhưng không thay đổi nguyên tắc gameplay đã chốt.
