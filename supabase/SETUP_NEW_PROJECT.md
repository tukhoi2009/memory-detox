# Setup Supabase mới — MEMORY DETOX

Checklist khi bạn **tạo project Supabase trống** (không migrate từ DB cũ).

## 1. Tạo project trên Supabase

1. [app.supabase.com](https://app.supabase.com) → **New project**
2. Chọn region gần user (ví dụ Singapore)
3. Lưu **database password** (chỉ cần nếu kết nối trực tiếp Postgres)

## 2. Lấy API keys cho app

**Project Settings → API**

| Biến `.env` | Lấy từ |
|-------------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | **Project URL** |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | **anon** `public` key (hoặc publishable key mới) |

Trong repo:

```bash
cp .env.example .env
# Điền 2 dòng Supabase ở trên
```

Khởi động lại Expo sau khi sửa `.env`: `yarn start -c`

## 3. Chạy SQL (project trống)

**SQL Editor** → New query → dán **toàn bộ** `schema.sql` → **Run một lần** (đừng chạy từng đoạn).

Nếu lỗi `relation "public.profiles" does not exist` ở đầu file: đã sửa trong repo — pull lại `schema.sql` rồi chạy lại từ đầu.

Chạy **theo thứ tự**:

| # | File | Ghi chú |
|---|------|---------|
| 1 | `supabase/schema.sql` | Schema + RLS + bucket `avatars` + trigger thống kê |
| 2 | `supabase/seed.sql` | Danh mục, thành tích, FAQ mẫu (nên chạy) |

Phần `DROP TABLE` trong `schema.sql` an toàn trên DB mới (không có bảng cũ).

### Kiểm tra nhanh

```sql
select table_name from information_schema.tables
where table_schema = 'public' order by 1;

select slug, name from public.categories;
select * from public.leaderboard limit 3;
```

## 4. Authentication

**Authentication → Providers**

- **Email**: bật; bật **Confirm email** nếu app dùng OTP sau đăng ký
- **Google** (tuỳ chọn): bật + cấu hình OAuth Client ID/Secret

**Authentication → URL Configuration** (nếu có deep link / reset password):

- Site URL: URL app hoặc `exp://` trong dev
- Redirect URLs: thêm scheme Expo của bạn nếu dùng magic link

## 5. Storage

`schema.sql` đã tạo bucket **`avatars`** (public, RLS theo `{user_id}/`).

Kiểm tra: **Storage → Buckets** → có `avatars`.

## 6. Realtime (tuỳ chọn)

Nếu dùng thông báo realtime trong app:

**Database → Replication** → bật `INSERT` cho bảng `notifications`.

## 7. Google Sign-In (mobile)

Ngoài Supabase, cấu hình Google OAuth trong Google Cloud Console và Expo (`app.json` / plugin) theo tài liệu Expo Auth Session — khóa **không** commit lên git.

## 8. Types TypeScript (tuỳ chọn)

Sau khi schema chạy xong, có thể generate types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.types.ts
```

Repo đã có `database.types.ts` khớp schema hiện tại; chỉ generate lại khi bạn đổi SQL.

## Thứ tự làm việc đề xuất

```
Tạo project Supabase
    → copy URL + anon key vào .env
    → chạy schema.sql
    → chạy seed.sql
    → bật Auth (Email / Google)
    → yarn start -c
    → đăng ký user test trên app
```

Không cần file migration cũ (`fitness_app_schema.sql`, …) — đã gỡ khỏi repo.
