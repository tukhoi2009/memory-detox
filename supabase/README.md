# Supabase — MEMORY DETOX

Backend: auth, hồ sơ, bài học/quiz, XP, leaderboard, thống kê, thông báo.

## File SQL

| File | Khi nào chạy |
|------|----------------|
| `schema.sql` | **Luôn chạy đầu tiên** (project mới hoặc reset DB) |
| `seed.sql` | Sau `schema.sql` — dữ liệu mẫu |

## Project Supabase mới (khuyên dùng)

Làm theo checklist đầy đủ: **[SETUP_NEW_PROJECT.md](./SETUP_NEW_PROJECT.md)**

Tóm tắt:

1. Tạo project trên [Supabase Dashboard](https://app.supabase.com)
2. Điền `EXPO_PUBLIC_SUPABASE_URL` và `EXPO_PUBLIC_SUPABASE_ANON_KEY` vào `.env`
3. SQL Editor → `schema.sql` → `seed.sql`
4. Bật Auth (Email + Google nếu cần)

## Schema

```
auth.users → profiles (total_points = XP)
              ├── user_progress, quiz_attempts
              ├── user_daily_stats
              ├── notifications, notification_settings
              └── user_achievements
categories → lessons → quizzes
achievements, app_content (faq, terms, …)
view: leaderboard
storage: avatars
```

## Lưu ý

- **Project mới**: phần `DROP TABLE` trong `schema.sql` không ảnh hưởng (chưa có bảng).
- **DB cũ có dữ liệu fitness/health**: `schema.sql` sẽ **xóa** các bảng legacy — chỉ dùng khi chấp nhận mất dữ liệu cũ.
- `total_points` = XP trên UI.
- `exercise_enabled` / `exercise_time` trong `notification_settings` = nhắc luyện tập hàng ngày.

## App

Client đọc Supabase từ `src/lib/supabase.ts` (biến `EXPO_PUBLIC_*` trong `.env`).
