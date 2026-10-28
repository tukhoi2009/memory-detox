# Memory Detox

Ứng dụng di động (React Native / Expo) giúp rèn luyện trí nhớ qua bài đọc ngắn, mini-game và quiz theo từng chủ đề. Người dùng tích lũy XP, theo dõi tiến độ và cạnh tranh trên bảng xếp hạng. Backend **Supabase** (Auth, PostgreSQL, Storage).

---

## Tính năng chính

### Xác thực & onboarding
- Onboarding giới thiệu app
- Đăng ký, đăng nhập, xác minh email
- Quên mật khẩu (OTP + đặt lại mật khẩu)
- Thiết lập hồ sơ (tên, avatar) sau khi đăng ký

### Tab chính

| Tab | Mô tả |
|-----|--------|
| **Trang chủ** (`home`) | 5 danh mục luyện tập dạng masonry, XP & level hiện tại, lối tắt vào bài học |
| **Thống kê** (`stats`) | Biểu đồ tiến độ 7/30 ngày; chỉ số độ chính xác, ghi nhớ, hiểu sâu, tập trung |
| **Xếp hạng** (`leaderboard`) | Top người chơi theo tổng XP, podium top 3 |
| **Cá nhân** (`user`) | Hồ sơ, cài đặt tài khoản, thông báo, điều khoản & hỗ trợ |

### 5 danh mục luyện tập

Mỗi danh mục có nhiều cấp độ (bài học), luồng chơi riêng và cơ chế chấm điểm XP:

| Danh mục | Slug | Mô tả |
|----------|------|--------|
| Phá vỡ thói quen lướt | `scroll-habit` | Đọc có thời gian, sau đó tái hiện ý chính bằng từ khóa |
| Nội dung biến mất nhanh | `fleeting-content` | Quan sát biểu đồ / nội dung ngắn rồi ghi nhớ chi tiết |
| Bẫy suy luận đánh lừa | `reasoning-traps` | Đọc đoạn văn và trả lời câu hỏi trắc nghiệm logic |
| Giữ tập trung khi nhiễu | `focus-noise` | Đọc trong môi trường có nhiễu âm thanh, kể lại theo thứ tự logic |
| Ghi nhớ bền vững | `sustainable-memory` | Luyện đọc chậm và ghi nhớ lâu dài qua nhiều cấp độ |

Luồng chung của mỗi cấp: **sẵn sàng → đọc (countdown) → trả lời / locked → kết quả (+ cooldown)**. Cấp mới có thể bị khóa theo XP hoặc thời gian chờ.

### Bài học & quiz
- Danh sách bài theo danh mục (`category-lessons`)
- Chi tiết bài học (`lesson-detail`)
- Quiz trắc nghiệm (`quiz-game`, `quiz-result`, `quiz-review`, `quiz-history`)
- Lưu tiến độ hoàn thành và lịch sử làm bài trên Supabase

### Gamification
- **XP** (`total_points`) cộng dồn khi hoàn thành cấp / quiz
- **Level** tính từ XP (mỗi 150 XP ≈ 1 level)
- **Thành tích** (bài đầu tiên, mốc XP, streak, …)
- **Bảng xếp hạng** toàn app theo tổng điểm

### Khác
- Thông báo in-app (chào mừng, nhắc luyện tập, thành tích, …)
- Nội dung FAQ, điều khoản, bảo mật, hỗ trợ (từ bảng `app_content`)

---

## Công nghệ

| Công nghệ | Ghi chú |
|-----------|---------|
| **Expo SDK 53** | Toolchain & native modules |
| **React Native 0.79** | UI đa nền tảng |
| **TypeScript** | Toàn bộ `src/` |
| **Expo Router v5** | File-based routing (`src/app/`) |
| **NativeWind v4** | Tailwind cho RN |
| **Supabase** | Auth, Postgres, RLS |
| **TanStack Query v5** | Server state / cache |
| **Zustand / React Hook Form / Zod** | State & form validation |
| **react-native-gifted-charts** | Biểu đồ màn Thống kê |

---

## Yêu cầu

- **Node.js** 20 LTS+
- **Yarn** hoặc **npm**
- Tài khoản **Supabase** (project + anon key)
- **iOS Simulator / Android Emulator / thiết bị thật**

---

## Cài đặt

### 1. Clone & cài dependency

```bash
git clone <repository-url> memory-detox
cd memory-detox
yarn install
```

### 2. Biến môi trường

Sao chép `.env.example` thành `.env` và điền giá trị:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-or-publishable-key>

# Tuỳ chọn
EXPO_PUBLIC_GEMINI_API_KEY=
EXPO_PUBLIC_URL=
```

> **Lưu ý:** Client Supabase đọc từ biến môi trường (`src/lib/supabase.ts`). Không commit file `.env` hoặc khóa thật lên git.

### 3. Supabase — project mới

1. Tạo **project Supabase mới** trên Dashboard
2. Điền URL + anon key vào `.env` (bước 2)
3. SQL Editor: chạy `supabase/schema.sql` → `supabase/seed.sql`
4. Bật Auth (Email; Google tuỳ chọn)

**Checklist đầy đủ:** [supabase/SETUP_NEW_PROJECT.md](supabase/SETUP_NEW_PROJECT.md)

Tóm tắt: [supabase/README.md](supabase/README.md) · [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

---

## Chạy ứng dụng

```bash
# Dev server
yarn start

# iOS (native)
yarn ios

# Android
yarn android

# Lint
yarn lint
```

Mở app bằng Expo Go hoặc dev build native (`yarn ios` / `yarn android`).

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (auth)/          # Onboarding, đăng nhập, đăng ký, quên mật khẩu
│   ├── (tabs)/          # home, stats, leaderboard, user
│   └── (screens)/       # Bài học, quiz, 5 luồng danh mục, tài khoản, thông báo
├── features/
│   ├── category-flow/   # UI & logic dùng chung (đọc, countdown, kết quả)
│   ├── scroll-habit/    # Phá vỡ thói quen lướt
│   ├── fleeting-content/# Nội dung biến mất nhanh
│   ├── reasoning-traps/ # Bẫy suy luận
│   ├── focus-noise/     # Giữ tập trung khi nhiễu
│   └── sustainable-memory/ # Ghi nhớ bền vững
├── components/
│   ├── common/          # Button, header, toast, …
│   ├── cyber/           # Leaderboard, podium
│   └── quiz/            # Màn hình kết quả quiz
├── services/            # Supabase: auth, profile, game, stats, notifications
├── modules/
│   ├── auth/            # Form đăng nhập/đăng ký, store
│   └── user-profile/    # Cài đặt tài khoản
├── hooks/               # useProfile, useNotificationCount, …
├── context/             # Auth, Query, Notifications
├── constants/           # Routes, categories, avatars
└── utils/               # Avatar, điều hướng danh mục

supabase/                # schema.sql, seed.sql
assets/                  # Ảnh, icon, onboarding
```

### Luồng màn hình tiêu biểu

| Route | Màn hình |
|-------|-----------|
| `/category-lessons?categoryId=` | Danh sách cấp độ theo danh mục |
| `/scroll-habit/levels` | Chọn cấp — Phá vỡ thói quen lướt |
| `/fleeting-content/levels` | Chọn cấp — Nội dung biến mất nhanh |
| `/reasoning-traps/levels` | Chọn cấp — Bẫy suy luận |
| `/focus-noise/levels` | Chọn cấp — Giữ tập trung khi nhiễu |
| `/sustainable-memory/levels` | Chọn cấp — Ghi nhớ bền vững |
| `*/reading` | Màn đọc có countdown |
| `*/answer` hoặc `*/play` | Trả lời / làm quiz |
| `*/result` | Kết quả & XP nhận được |
| `/quiz-history` | Lịch sử làm quiz |
| `/notifications` | Thông báo in-app |

Định nghĩa route tập trung tại `src/constants/route-table.ts`.

---

## Bảng dữ liệu chính (Supabase)

| Bảng | Vai trò |
|------|---------|
| `profiles` | Hồ sơ, `total_points` (XP), avatar, cài đặt |
| `categories` | 5 danh mục luyện tập |
| `lessons` | Bài học / cấp độ theo danh mục |
| `quizzes` | Câu hỏi trắc nghiệm gắn bài học |
| `user_progress` | Tiến độ hoàn thành từng bài |
| `quiz_attempts` | Lịch sử làm quiz (điểm, độ chính xác) |
| `user_daily_stats` | Thống kê theo ngày cho biểu đồ |
| `achievements` / `user_achievements` | Thành tích |
| `notifications` | Thông báo in-app |
| `app_content` | FAQ, điều khoản, bảo mật, hỗ trợ |

---

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `yarn start` | Khởi động Metro / Expo |
| `yarn ios` | Chạy trên iOS |
| `yarn android` | Chạy trên Android |
| `yarn lint` | ESLint (expo config) |
| `yarn prebuild` | Prebuild native (clean) |

---

## Ghi chú phát triển

- **Cache React Query:** các query dùng key rõ ràng theo domain (`category`, `category-lessons`, `leaderboard`, …) — tránh trộn shape dữ liệu giữa các màn.
- **Session cục bộ:** mỗi luồng danh mục lưu trạng thái đọc / cooldown qua `sessionStorage` trong `src/features/*/sessionStorage.ts`.
- **Seed data:** `supabase/seed.sql` chứa 5 danh mục và nội dung mẫu cho từng cấp; có thể chỉnh sửa trực tiếp trên Supabase Dashboard.
- Repo có thể mang tên thư mục cũ (`biodegradation-explore`); tên sản phẩm hiện tại là **Memory Detox**.

---

## License

MIT — Developer: TNtuandev
