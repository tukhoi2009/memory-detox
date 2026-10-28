# Supabase — MEMORY DETOX

> **Bạn tạo project Supabase mới?** Dùng **[supabase/SETUP_NEW_PROJECT.md](supabase/SETUP_NEW_PROJECT.md)** — không cần migrate từ DB cũ.

## Setup project mới (tóm tắt)

1. Tạo project trên Supabase Dashboard
2. Copy **Project URL** + **anon key** → `.env` (xem `.env.example`)
3. SQL Editor: chạy `supabase/schema.sql` rồi `supabase/seed.sql`
4. Authentication: bật Email (+ Confirm email nếu OTP); Google nếu cần
5. `yarn start -c` và test đăng ký / quiz

## Kiểm tra DB

```sql
select table_name from information_schema.tables
where table_schema = 'public' order by table_name;
```

Bảng kỳ vọng: `profiles`, `categories`, `lessons`, `quizzes`, `user_progress`, `quiz_attempts`, `user_daily_stats`, `achievements`, `user_achievements`, `notifications`, `notification_settings`, `app_content`.

## App đã nối schema này

- `cyberSafetyGame.service.ts` — bài học, quiz, XP
- `memoryStats.service.ts` — thống kê 7/30 ngày
- Tab: home, stats, leaderboard, user

Chi tiết SQL: [supabase/README.md](supabase/README.md).
