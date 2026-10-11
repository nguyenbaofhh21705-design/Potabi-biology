# Kế Hoạch Tích Hợp Supabase – Potabi Sinh Học (Học Viện Khám Phá 2D)

Kế hoạch này thiết kế kiến trúc tích hợp **Supabase Auth** và **Supabase PostgreSQL (kèm Row Level Security)** vào dự án **Potabi Sinh Học – Học Viện Khám Phá 2D**, giúp học sinh đăng ký/đăng nhập, đồng bộ tiến trình học tập lên đám mây đa thiết bị, bảo toàn 100% dữ liệu `localStorage` hiện có và sẵn sàng mở rộng cho bảng xếp hạng trực tuyến.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Dưới đây là 3 quyết định cốt lõi đã được chốt dựa trên lựa chọn của bạn:

- **Quyết định 1 – Phương thức xác thực (Authentication)**:
  - Hỗ trợ song song **Email & Mật khẩu** (dành cho học sinh không dùng tài khoản Google cá nhân) và **Đăng nhập bằng Google OAuth** thông qua Supabase Auth.
  - Do ứng dụng chạy trong môi trường preview iframe, luồng Google OAuth sẽ hỗ trợ chế độ cửa sổ bật lên (`skipBrowserRedirect: true` + `window.open` popup) để không bị chặn chuyển hướng trong khung nhúng.
- **Quyết định 2 – Chiến lược hợp nhất dữ liệu khi có xung đột (Deterministic Smart Merge)**:
  - Khi người chơi đăng nhập mà cả thiết bị cục bộ (`localStorage`) và đám mây (`Supabase`) đều có tiến trình khác nhau, hệ thống tự động thực hiện **Hợp nhất thông minh bảo toàn thành tựu (Union + Max)**:
    - Giữ **tập hợp hợp (Union)** của tất cả trang phục đã sở hữu, các trạm đã hoàn thành, tiêu bản đã mở khóa, các màn đã mở khóa và nhiệm vụ tuần đã làm.
    - Giữ **giá trị cao nhất (`Math.max`)** đối với EXP, Kim cương và phần trăm tiến độ từng chặng (kèm cộng bù phần thưởng từ các trạm/nhiệm vụ mới chỉ hoàn thành ở bản cục bộ mà chưa có trên mây), đảm bảo **không bao giờ mất vật phẩm và không cộng trùng EXP/Kim cương**.
- **Quyết định 3 – Vị trí cổng đăng nhập (Authentication Gate)**:
  - Người chơi vẫn có thể xem Intro Story, tham quan Bản Đồ Hành Trình, xem Sổ tay và Nhiệm vụ tuần ở chế độ khách (lưu tạm vào `localStorage`).
  - **Bắt buộc đăng nhập trước khi bước vào Màn chơi 2D (`StomachStageScreen`)** và cung cấp nút Đăng nhập / Quản lý tài khoản trực tiếp trên Thanh điều hướng & màn hình Hồ sơ.

---

## 1. Phân Tích Kiến Trúc & Dữ Liệu Thực Tế Hiện Tại

Qua kiểm tra toàn bộ mã nguồn hiện tại của dự án, trạng thái dữ liệu đang được phân bổ như sau:

### 1.1. Bảng phân loại dữ liệu hiện có (LocalStorage vs React State tạm thời)

| Nhóm dữ liệu | Các trường chi tiết | Nơi lưu trữ hiện tại | Nơi cập nhật trạng thái | Kế hoạch đồng bộ Supabase |
| :--- | :--- | :--- | :--- | :--- |
| **Chỉ số & Tiền tệ** | `exp`, `diamonds` (cấp độ `level` được tính động từ `exp`) | `localStorage` (`potabi_biology_save_v1`) | Component điều phối gốc khi hoàn thành trạm, giải đố chặng, làm nhiệm vụ tuần hoặc mua trang phục | Lưu thành cột số nguyên (`integer`) riêng biệt trong bảng tiến trình để vừa đồng bộ vừa phục vụ truy vấn Bảng xếp hạng (Leaderboard). |
| **Tủ đồ & Trang phục** | `equippedOutfitId`, `ownedOutfitIds` | `localStorage` (`potabi_biology_save_v1`) | Màn hình Tủ đồ (mua/mặc trang phục) & Nhiệm vụ tuần (mở rương nhận áo Blouse) | Đồng bộ trực tiếp lên đám mây; hợp nhất danh sách `ownedOutfitIds` không trùng lặp. |
| **Tiến trình Bản đồ & Chặng** | `unlockedStageIds`, `completedStageIds`, `stageProgress` (`tieu-hoa`, `tuan-hoan`, `ho-hap`, `than-kinh`, `van-dong`) | `localStorage` (`potabi_biology_save_v1`) | Khi hoàn thành đủ 3 trạm Dạ dày hoặc hoàn thành câu hỏi phản xạ trên Bản đồ | Đồng bộ toàn bộ; tự động tính lại điều kiện mở khóa chặng tiếp theo sau khi gộp. |
| **Trạm 2D & Sổ tay Tiêu bản** | `completedStations` (`tram-1`, `tram-2`, `tram-3`), `unlockedSpecimens` (8 mẫu tiêu bản Sinh học 8) | `localStorage` (`potabi_biology_save_v1`) | Màn chơi 2D Dạ dày khi hoàn thành câu hỏi cuối của mỗi trạm | Đồng bộ danh sách ID đã mở khóa; bảo toàn vĩnh viễn các tiêu bản đã thu thập. |
| **Nhiệm vụ tuần & Trạng thái cốt truyện** | `weeklyQuests` (`enzymeQuizDone`, `bloodCellMatchDone`, `oxygenPathDone`, `chestClaimed`), `cutsceneSeen`, `microscopeInspected` | `localStorage` (`potabi_biology_save_v1`) | Màn hình Nhiệm vụ tuần & khi hoàn tất/bỏ qua Intro Story 5 cảnh | Đồng bộ trong cấu trúc JSONB có kiểm tra kiểu dữ liệu; giữ `cutsceneSeen = true` nếu một trong hai nơi đã xem. |
| **Tiến trình dở dang trong phiên 2D** | `stationProgressMap` (bước hội thoại/câu hỏi đang làm dở của trạm), `amylaseInspected`, `playerPos`, `health`, `isVoiceOn` | **Chỉ nằm trong React State nội bộ** của màn chơi 2D và màn Cốt truyện | Mất khi tải lại trang (F5) hoặc chuyển màn hình | Đưa `stationProgressMap` và `amylaseInspected` vào đối tượng tiến trình mở rộng để học sinh đang làm dở câu hỏi 1/2 ở Trạm 1 có thể tiếp tục trên thiết bị khác; giữ `playerPos` và `health` ở state phiên chơi. |

### 1.2. Hiện trạng cấu hình Build & Runtime
- Ứng dụng là **React 19 SPA chạy trên Vite 8** (`"type": "module"`, cổng `3000`).
- Các biến môi trường phía trình duyệt được truy cập qua `import.meta.env.VITE_*`.
- Mọi thay đổi tiến trình hiện đang đi qua một điểm tập trung duy nhất là `gameState` ở component gốc và tự động ghi xuống `localStorage` qua `useEffect`. Đây là kiến trúc rất thuận lợi để gắn thêm tầng đồng bộ đám mây (Cloud Sync Adapter) mà không phải sửa lại logic bên trong từng màn hình con.

---

## 2. Đề Xuất Kiến Trúc Supabase (Auth + PostgreSQL + RLS)

### 2.1. Đánh giá mô hình dữ liệu: 1 Bảng Lai (Hybrid JSONB) vs Nhiều Bảng Quan Hệ

| Tiêu chí | Phương án 1: Chỉ 1 cột JSON duy nhất | Phương án 2: Tách nhỏ 6–7 bảng quan hệ (`user_outfits`, `user_stations`, `user_specimens`...) | Phương án 3 (Đề xuất): Kiến trúc 2 Bảng Lai (`profiles` + `player_progress` kết hợp Cột chuẩn & JSONB) |
| :--- | :--- | :--- | :--- |
| **Độ phức tạp truy vấn & Tốc độ tải** | Rất nhanh (1 truy vấn), nhưng khó truy vấn bảng xếp hạng hoặc lọc theo cấp độ. | Phức tạp quá mức cần thiết: mỗi lần mở game hoặc hoàn thành 1 trạm phải thực hiện 5–6 truy vấn `JOIN` / `UPSERT` đồng thời. | **Tối ưu nhất**: Chỉ cần 1 lần đọc/ghi khi đồng bộ toàn bộ `GameProgressState`, đồng thời vẫn tách riêng cột `exp`, `diamonds`, `explorer_level` để truy vấn Bảng xếp hạng cực nhanh. |
| **Tương thích với `GameProgressState` hiện tại** | Tương thích cao. | Phải viết lại toàn bộ cấu trúc state trong ứng dụng. | **Tương thích 100%** với `GameProgressState` hiện có và dễ dàng mở rộng khi thêm Màn 2, Màn 3 ở dạng 2D. |

### 2.2. Thiết kế Schema 2 bảng chuẩn hóa (`public.profiles` và `public.player_progress`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           auth.users (Supabase Auth)                        │
│  • id (UUID, Primary Key)                                                   │
│  • email, encrypted_password, raw_user_meta_data (Google / Email)           │
└───────────────────┬───────────────────────────────────────┬─────────────────┘
                    │ 1:1 (ON DELETE CASCADE)               │ 1:1 (ON DELETE CASCADE)
                    ▼                                       ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────────┐
│            public.profiles            │ │      public.player_progress       │
│───────────────────────────────────────│ │───────────────────────────────────│
│ • id (UUID, PK, FK -> auth.users.id)  │ │ • user_id (UUID, PK, FK -> users) │
│ • display_name (TEXT, NOT NULL)       │ │ • exp (INTEGER, DEFAULT 2370)     │
│ • avatar_variant (TEXT: yellow/blue)  │ │ • diamonds (INTEGER, DEFAULT 420) │
│ • grade_class (TEXT, Optional)        │ │ • explorer_level (INTEGER)        │
│ • created_at (TIMESTAMPTZ)            │ │ • equipped_outfit_id (TEXT)       │
│ • updated_at (TIMESTAMPTZ)            │ │ • cutscene_seen (BOOLEAN)         │
└───────────────────────────────────────┘ │ • progress_data (JSONB)           │
                                          │   ├─ ownedOutfitIds: string[]     │
                                          │   ├─ unlockedStageIds: string[]   │
                                          │   ├─ completedStageIds: string[]  │
                                          │   ├─ stageProgress: Record<...>   │
                                          │   ├─ completedStations: string[]  │
                                          │   ├─ unlockedSpecimens: string[]  │
                                          │   ├─ weeklyQuests: {...}          │
                                          │   ├─ microscopeInspected: boolean │
                                          │   └─ stationProgressMap: {...}    │
                                          │ • schema_version (INT, DEFAULT 1) │
                                          │ • updated_at (TIMESTAMPTZ)        │
                                          └───────────────────────────────────┘
```

- **Vì sao tách `profiles` và `player_progress`?**
  - Bảng `profiles` chứa thông tin định danh công khai tối thiểu (Tên hiển thị, Avatar vàng/xanh, Cấp lớp) để sau này hiển thị trên **Bảng Xếp Hạng (Leaderboard)** mà không làm lộ dữ liệu chi tiết.
  - Bảng `player_progress` lưu trữ toàn bộ trạng thái tiến trình riêng tư của học sinh, chỉ chính chủ tài khoản (`auth.uid() = user_id`) mới có quyền đọc và cập nhật.

---

## 3. Bảo Mật Dữ Liệu, Biến Môi Trường & Row Level Security (RLS)

### 3.1. Phân tách nghiêm ngặt thông tin Frontend và Bí mật Backend

> [!WARNING]
> Tuyệt đối tuân thủ nguyên tắc bảo mật khóa API và dữ liệu người chơi:

| Loại thông tin | Tên biến / Khóa | Được phép đặt ở Frontend? | Mục đích & Quy tắc bảo vệ |
| :--- | :--- | :---: | :--- |
| **Supabase Project URL** | `VITE_SUPABASE_URL` | **CÓ** | Địa chỉ kết nối REST & Auth công khai của dự án Supabase. Cấu hình qua biến môi trường, không gán cứng trong code. |
| **Supabase Publishable / Anon Key** | `VITE_SUPABASE_ANON_KEY` | **CÓ** | Khóa định danh client công khai. Chỉ hoạt động trong phạm vi cho phép của các chính sách **Row Level Security (RLS)**. |
| **Supabase Service Role Key** | `SUPABASE_SERVICE_ROLE_KEY` | **TUYỆT ĐỐI KHÔNG** | Khóa quyền tối cao bỏ qua mọi chính sách RLS. Không bao giờ khai báo biến `VITE_...` cho khóa này và không đưa vào mã nguồn. |
| **Database Admin Password / JWT Secret** | `POSTGRES_PASSWORD` / `JWT_SECRET` | **TUYỆT ĐỐI KHÔNG** | Chỉ lưu nội bộ trên Supabase Dashboard; không xuất hiện trong code, file cấu hình hay thông báo lỗi. |

### 3.2. Chính sách Row Level Security (RLS) & Ràng buộc toàn vẹn dữ liệu

1. **Kích hoạt RLS bắt buộc trên mọi bảng**:
   - `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`
   - `ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;`
2. **Chính sách quyền truy cập (`Policies`)**:
   - **Trên bảng `public.player_progress`**:
     - `SELECT`: Chỉ cho phép khi `auth.uid() = user_id`.
     - `INSERT`: Chỉ cho phép khi `auth.uid() = user_id`.
     - `UPDATE`: Chỉ cho phép khi `auth.uid() = user_id` (`USING` và `WITH CHECK` đều kiểm tra `auth.uid() = user_id`).
     - `DELETE`: Không mở quyền xóa từ phía client để tránh người chơi hoặc script xóa nhầm bản lưu.
   - **Trên bảng `public.profiles`**:
     - `SELECT`: Cho phép người dùng đã đăng nhập đọc thông tin cơ bản để phục vụ Bảng xếp hạng.
     - `INSERT` / `UPDATE`: Chỉ cho phép chính chủ `auth.uid() = id`.
3. **Ràng buộc chống gian lận cơ bản từ tầng Database (`CHECK Constraints` & Trigger)**:
   - Ràng buộc `CHECK (exp >= 0 AND exp <= 100000)` và `CHECK (diamonds >= 0 AND diamonds <= 50000)` để ngăn việc chỉnh sửa số âm hoặc số vô lý.
   - Trigger tự động cập nhật `updated_at = now()` ở phía máy chủ PostgreSQL (không tin tưởng đồng hồ của trình duyệt client).
4. **Làm sạch thông báo lỗi (Error Sanitization)**:
   - Mọi lỗi trả về từ Supabase Auth/Database được chuyển đổi sang thông báo tiếng Việt thân thiện với học sinh (ví dụ: *"Email hoặc mật khẩu chưa chính xác"*, *"Đang lưu tạm trên máy do kết nối mạng yếu"*), không bao giờ in chuỗi lỗi SQL hoặc token ra giao diện hay console.

---

## 4. Chiến Lược Chuyển Đổi & Đồng Bộ Giữa `localStorage` và Supabase

### 4.1. Sơ đồ luồng khởi động, Cổng đăng nhập 2D và Đồng bộ 2 chiều

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        KHỞI ĐỘNG ỨNG DỤNG (App Load)                       │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                    1. Đọc ngay 'potabi_biology_save_v1' từ localStorage
                       để giao diện phản hồi tức thì (0ms delay)
                    2. Kiểm tra phiên Supabase Auth (supabase.auth.getSession)
                                       │
             ┌─────────────────────────┴─────────────────────────┐
             ▼ (Chưa đăng nhập - Chế độ Khách)                   ▼ (Đã có phiên đăng nhập)
┌──────────────────────────────────────────┐       ┌──────────────────────────────────────────┐
│ • Xem Intro 5 cảnh (nếu mở lần đầu)      │       │ • Tải player_progress từ Supabase        │
│ • Tham quan Bản đồ, Sổ tay, Tủ đồ        │       │ • Chạy thuật toán Smart Merge giữa       │
│ • Lưu mọi thay đổi vào localStorage      │       │   bản lưu Local và bản lưu Cloud         │
└────────────────────┬─────────────────────┘       │ • Cập nhật cả React State, localStorage  │
                     │                             │   và đẩy bản hợp nhất lên Supabase       │
                     ▼                             └────────────────────┬─────────────────────┘
      [Người chơi bấm vào "Màn 2D Dạ Dày"                               │
       hoặc "BẮT ĐẦU HÀNH TRÌNH" ở Cảnh 5]                              │
                     │                                                  │
                     ▼                                                  ▼
┌──────────────────────────────────────────┐       ┌──────────────────────────────────────────┐
│   HIỂN THỊ CỔNG ĐĂNG NHẬP / ĐĂNG KÝ      │──────▶│      VÀO MÀN CHƠI 2D DẠ DÀY              │
│   (Email/Password hoặc Google OAuth)     │ (Sau  │ • Chơi mượt 60fps trên State cục bộ      │
│   + Nút "Tiếp tục thử nghiệm ngoại tuyến"│  khi  │ • Tự động đồng bộ ngầm (Debounced 1.5s)  │
│     nếu mất mạng / chưa cấu hình biến MT │  Auth)│   lên Supabase khi hoàn thành Trạm       │
└──────────────────────────────────────────┘       └──────────────────────────────────────────┘
```

### 4.2. Kịch bản xử lý chi tiết cho 5 trường hợp thực tế

#### Trường hợp A – Người chơi hoàn toàn mới
- Khi mở ứng dụng lần đầu tiên, ứng dụng tự động phát **Intro Story 5 cảnh** như hiện tại và lưu trạng thái vào `localStorage`.
- Khi kết thúc Cảnh 5 và nhấn **“BẮT ĐẦU HÀNH TRÌNH”** (để vào màn 2D Dạ Dày), hệ thống mở **Hộp thoại Đăng nhập / Đăng ký Học Viện Potabi** để người chơi tạo tài khoản lưu trữ đám mây trước khi bước vào Hang động Dạ Dày.

#### Trường hợp B – Người chơi cũ đã có tiến trình trong `localStorage` nhưng chưa có tài khoản
- Toàn bộ EXP, Kim cương, Trang phục đã mua, Tiêu bản và các Trạm đã hoàn thành trong `potabi_biology_save_v1` được **giữ nguyên 100%**, không bao giờ bị reset.
- Ngay khi người chơi đăng ký tài khoản mới (hoặc đăng nhập lần đầu vào tài khoản chưa có dữ liệu trên mây), hệ thống tự động nâng cấp (migrate) toàn bộ dữ liệu từ `localStorage` lên bảng `player_progress` của tài khoản đó.

#### Trường hợp C – Người chơi đăng nhập trên thiết bị mới hoặc trình duyệt mới
- Trên thiết bị mới, `localStorage` đang ở trạng thái mặc định (`DEFAULT_GAME_STATE`).
- Khi người chơi đăng nhập thành công, hệ thống tải bản lưu từ Supabase về. Vì bản lưu cục bộ chưa có thành tựu mới ngoài mặc định, trạng thái trên đám mây được khôi phục nguyên vẹn xuống máy mà **không bị dữ liệu mặc định ghi đè**.

#### Trường hợp D – Xung đột dữ liệu giữa `localStorage` và Đám mây (Thuật toán Smart Merge không cộng trùng)
Để giải quyết bài toán: *"Không đơn giản chọn bản lưu mới hơn làm mất vật phẩm, và không tự ý cộng gộp EXP/Kim cương gây nhân đôi điểm số"*, thuật toán `mergeGameProgress(local, cloud)` hoạt động theo nguyên tắc **Định danh nguồn thưởng (Idempotent Achievement Merge)**:

1. **Hợp nhất các tập hợp thành tựu (Set Union)**:
   - `ownedOutfitIds` = `Union(local.ownedOutfitIds, cloud.ownedOutfitIds)`
   - `completedStations` = `Union(local.completedStations, cloud.completedStations)`
   - `unlockedSpecimens` = `Union(local.unlockedSpecimens, cloud.unlockedSpecimens)`
   - `completedStageIds` = `Union(local.completedStageIds, cloud.completedStageIds)`
   - `unlockedStageIds` = `Union(local.unlockedStageIds, cloud.unlockedStageIds)` (kèm mở khóa tự động chặng kế tiếp nếu chặng trước đã nằm trong `completedStageIds`).
   - `weeklyQuests`: Mỗi nhiệm vụ (`enzymeQuizDone`, `bloodCellMatchDone`, `oxygenPathDone`, `chestClaimed`) nhận giá trị `local.flag || cloud.flag`.
   - `cutsceneSeen`: `local.cutsceneSeen || cloud.cutsceneSeen`.
2. **Tính toán EXP và Kim cương an toàn (Không mất điểm, không cộng trùng)**:
   - Lấy nền tảng từ bản lưu có tổng tiến trình cao hơn (`baseExp = Math.max(local.exp, cloud.exp)`).
   - Kiểm tra xem bản lưu kia có **thành tựu định danh nào mới hoàn thành riêng** (ví dụ: người chơi vừa hoàn thành thêm `tram-3` khi chơi ngoại tuyến trên máy này mà trên mây chưa có `tram-3`) hay không.
   - Chỉ cộng bù phần thưởng cố định của đúng thành tựu chưa từng có trong bản nền tảng (ví dụ `+250 EXP`, `+15 Kim cương` cho `tram-3`), nhờ đó vừa không làm mất điểm vừa chống tuyệt đối việc đăng nhập đi đăng nhập lại để nhân đôi EXP/Kim cương.

#### Trường hợp E – Mất kết nối Internet hoặc lỗi mạng giữa chừng (Offline-First & Sync Queue)
- Mọi thao tác trong game luôn cập nhật tức thì vào React State và `localStorage` (`potabi_biology_save_v1`) trước tiên.
- Nếu việc gửi dữ liệu lên Supabase thất bại do đứt mạng, hệ thống đánh dấu cờ `pendingCloudSync = true` kèm dấu thời gian trong `localStorage` mà **không làm gián đoạn màn chơi 2D**.
- Khi trình duyệt phát sự kiện `window.addEventListener('online', ...)` hoặc trong lần mở ứng dụng kế tiếp khi có mạng, hệ thống tự động chạy lại bước `mergeGameProgress` và đẩy bản cập nhật lên Supabase.

---

## 5. Lộ Trình Triển Khai 6 Giai Đoạn (Step-by-Step Roadmap)

### Giai đoạn 1: Chuẩn bị dự án Supabase, cấu hình biến môi trường & kết nối an toàn
- **Mục tiêu**: Thiết lập client kết nối Supabase an toàn qua biến môi trường Vite, có chế độ tự động lùi về `localStorage` (Graceful Fallback) nếu chưa cấu hình khóa để ứng dụng không bao giờ bị màn hình trắng.
- **Thay đổi dự kiến**:
  - Khai báo biến mẫu `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong cấu hình môi trường mẫu.
  - Khởi tạo module client Supabase duy nhất (Singleton) kiểm tra sự tồn tại của biến môi trường trước khi kết nối.
- **Rủi ro & Phòng tránh**:
  - *Rủi ro*: Ứng dụng báo lỗi crash khi chạy ở môi trường chưa điền biến môi trường.
  - *Phòng tránh*: Bọc khởi tạo trong hàm kiểm tra `isSupabaseConfigured()`; nếu chưa có khóa, ứng dụng vẫn chạy hoàn chỉnh với `localStorage`.
- **Tiêu chí kiểm thử hoàn thành**:
  - Build thành công 100% cả khi có và chưa có biến môi trường Supabase; kiểm tra kết nối thử nghiệm trả về phản hồi hợp lệ mà không lộ khóa bí mật.

### Giai đoạn 2: Xây dựng Hệ thống Tài khoản (Supabase Auth), Cổng đăng nhập 2D & Hồ sơ người chơi
- **Mục tiêu**: Cho phép học sinh Đăng ký / Đăng nhập bằng Email & Mật khẩu hoặc Google OAuth, tự động khởi tạo hồ sơ `profiles` và áp dụng Cổng đăng nhập trước khi vào màn chơi 2D.
- **Thay đổi dự kiến**:
  - Xây dựng hộp thoại **Đăng nhập / Đăng ký Học Viện Potabi** theo đúng phong cách *Bio Blossom Tactile* (bo tròn, tông màu hồng đào – rượu vang – vàng hổ phách).
  - Tích hợp cổng kiểm tra đăng nhập khi người chơi nhấn vào **Màn 2D Dạ Dày** (từ thanh điều hướng, từ Bản đồ hành trình, hoặc từ nút *"BẮT ĐẦU HÀNH TRÌNH"* ở cuối Intro Story).
  - Hiển thị thông tin tài khoản, tên hiển thị và trạng thái đồng bộ đám mây trong màn hình **Hồ sơ (`ProfileScreen`)**.
- **Rủi ro & Phòng tránh**:
  - *Rủi ro*: Google OAuth bị chặn bởi chính sách `X-Frame-Options` bên trong iframe preview.
  - *Phòng tránh*: Sử dụng luồng mở cửa sổ popup (`window.open`) cho OAuth hoặc đăng nhập trực tiếp bằng Email/Mật khẩu ngay trong modal.
- **Tiêu chí kiểm thử hoàn thành**:
  - Đăng ký tài khoản mới, đăng nhập Email/Mật khẩu, đăng nhập Google và kiểm tra bản ghi tự động xuất hiện trong bảng `public.profiles`.

### Giai đoạn 3: Đồng bộ Tiến trình Đám mây & Bảo toàn `localStorage`
- **Mục tiêu**: Đồng bộ toàn bộ `GameProgressState` (EXP, cấp độ, kim cương, trang phục, tiêu bản, các trạm, nhiệm vụ tuần, trạng thái `cutsceneSeen` và tiến trình trạm dở dang) lên bảng `public.player_progress`.
- **Thay đổi dự kiến**:
  - Triển khai hàm đọc/ghi `player_progress` có cơ chế giảm tải (debounce `1500ms` cho các thay đổi liên tục và ghi tức thì khi hoàn thành trạm/mua vật phẩm).
  - Tự động chuyển dữ liệu `localStorage` hiện có của người chơi cũ lên tài khoản ngay trong lần đăng nhập đầu tiên.
- **Rủi ro & Phòng tránh**:
  - *Rủi ro*: Ghi đè dữ liệu mặc định (`DEFAULT_GAME_STATE`) lên tài khoản đám mây khi vừa mở trang.
  - *Phòng tránh*: Thêm cờ khóa `isInitialCloudHydrated`: tuyệt đối không đẩy dữ liệu lên Supabase cho đến khi đã tải xong dữ liệu đám mây về và chạy qua bước hợp nhất.
- **Tiêu chí kiểm thử hoàn thành**:
  - Hoàn thành Trạm 1/2/3 hoặc mua trang phục ➔ tải lại trang hoặc đăng nhập trên trình duyệt ẩn danh (Incognito) ➔ toàn bộ EXP, Kim cương, Trang phục và Tiêu bản được khôi phục chính xác 100%.

### Giai đoạn 4: Xử lý Xung đột thông minh (Smart Merge), Mất mạng (Offline Queue) & Đăng xuất
- **Mục tiêu**: Đảm bảo an toàn dữ liệu tuyệt đối khi chuyển đổi thiết bị, mất kết nối mạng hoặc chuyển đổi giữa nhiều tài khoản trên cùng một máy.
- **Thay đổi dự kiến**:
  - Triển khai hàm `mergeGameProgress(localState, cloudState)` theo quy tắc Union + Max không cộng trùng.
  - Bổ sung hàng đợi đồng bộ lại khi có mạng (`online` event listener).
  - Xử lý khi người chơi nhấn **Đăng xuất**: tách biệt bản lưu theo `lastSyncedUserId` để nếu một học sinh khác đăng nhập trên cùng máy tính phòng tin học, dữ liệu của hai học sinh không bị trộn lẫn vào nhau.
- **Rủi ro & Phòng tránh**:
  - *Rủi ro*: Học sinh A đăng xuất, học sinh B đăng nhập trên cùng trình duyệt làm tiến trình của A gộp sang B.
  - *Phòng tránh*: Lưu kèm `ownerUserId` trong `localStorage`; chỉ tự động gộp bản lưu cục bộ nếu `ownerUserId === null` (dữ liệu khách chưa có chủ) hoặc `ownerUserId === currentUser.id`. Nếu khác `ownerUserId`, tải sạch dữ liệu đám mây của học sinh B.
- **Tiêu chí kiểm thử hoàn thành**:
  - Kiểm thử tắt mạng (Offline mode trong DevTools), hoàn thành 1 trạm, bật lại mạng ➔ dữ liệu tự động đồng bộ lên Supabase. Kiểm thử đăng xuất tài khoản A và đăng nhập tài khoản B.

### Giai đoạn 5: Kiểm thử toàn diện & Chuẩn bị Production
- **Mục tiêu**: Xác minh toàn bộ chính sách bảo mật RLS, hiệu năng màn chơi 2D và độ ổn định khi build production.
- **Thay đổi dự kiến**:
  - Rà soát tất cả các luồng lỗi Auth/Network, kiểm tra không rò rỉ thông tin nhạy cảm và xác nhận 60fps của màn 2D Dạ Dày không bị ảnh hưởng bởi các tác vụ mạng chạy ngầm.
- **Tiêu chí kiểm thử hoàn thành**:
  - Vượt qua toàn bộ danh sách kiểm thử bảo mật RLS (người chơi A không thể đọc/sửa `player_progress` của người chơi B), kiểm tra build production (`npm run build`) không có lỗi.

### Giai đoạn 6: Chuẩn bị nền tảng cho Bảng Xếp Hạng (Leaderboard) & Tính năng Trực tuyến
- **Mục tiêu**: Kết nối modal **Bảng xếp hạng** (hiện đang có sẵn giao diện trên `JourneyMapScreen`) với dữ liệu thực tế từ Supabase.
- **Thay đổi dự kiến**:
  - Tạo View hoặc hàm RPC an toàn trên Supabase trả về Top Nhà Thám Hiểm có `exp` và số tiêu bản cao nhất (chỉ lấy `display_name`, `avatar_variant`, `explorer_level`, `exp`).
- **Tiêu chí kiểm thử hoàn thành**:
  - Mở Bảng xếp hạng trên Bản Đồ Hành Trình hiển thị danh sách thứ hạng thực tế của người chơi.

---

## 6. Hướng Dẫn Các Bước Bạn Cần Thực Hiện Thủ Công Trên Supabase Dashboard

Vì bạn chưa tạo hoặc kết nối project Supabase vào môi trường hiện tại, dưới đây là các bước cụ thể bạn cần chuẩn bị trên **Supabase Dashboard** khi chúng ta bắt đầu triển khai:

1. **Bước 1 – Tạo Project trên Supabase**:
   - Truy cập [https://supabase.com/dashboard](https://supabase.com/dashboard) và nhấn **New Project**.
   - Đặt tên dự án (ví dụ: `potabi-biology-2d`), đặt mật khẩu Database (lưu giữ mật khẩu này an toàn, **không** đưa vào code) và chọn khu vực gần nhất (ví dụ: *Southeast Asia - Singapore*).
2. **Bước 2 – Lấy URL và Publishable / Anon Key**:
   - Trong Supabase Dashboard, vào **Project Settings (biểu tượng bánh răng)** ➔ **API** (hoặc **Data API / API Keys**).
   - Sao chép 2 giá trị công khai:
     - **Project URL** (dạng `https://<project-ref>.supabase.co`) ➔ dùng cho biến môi trường `VITE_SUPABASE_URL`.
     - **Anon / Publishable Key** (`anon` `public` hoặc `sb_publishable_...`) ➔ dùng cho biến môi trường `VITE_SUPABASE_ANON_KEY`.
   - *(Lưu ý quan trọng: Tuyệt đối **không** sao chép khóa `service_role` / `secret` vào biến môi trường frontend).*
3. **Bước 3 – Cấu hình Authentication (Email & Google)**:
   - Vào mục **Authentication** ➔ **Providers**:
     - **Email**: Mặc định đã bật. Nếu bạn muốn học sinh đăng ký xong vào chơi được ngay không cần mở hộp thư xác nhận email trong giai đoạn thử nghiệm, bạn có thể tắt tùy chọn *"Confirm email"*.
     - **Google** *(tùy chọn khi bạn sẵn sàng cấu hình Google Cloud Client ID)*: Bật Google Provider và dán Client ID / Secret từ Google Cloud Console.
   - Vào mục **Authentication** ➔ **URL Configuration**:
     - Thêm địa chỉ URL của ứng dụng (`APP_URL` / Development URL của bạn) vào danh sách **Redirect URLs** để cho phép đăng nhập quay về đúng ứng dụng.
4. **Bước 4 – Chạy kịch bản SQL khởi tạo Bảng & RLS (trong Giai đoạn 1–2)**:
   - Khi bạn duyệt kế hoạch này và chuyển sang bước triển khai, tôi sẽ cung cấp đoạn mã SQL hoàn chỉnh (tạo bảng `public.profiles`, `public.player_progress`, bật `ROW LEVEL SECURITY`, tạo `POLICIES` và `TRIGGER`) để bạn dán vào mục **SQL Editor** trên Supabase Dashboard và nhấn **Run**.
