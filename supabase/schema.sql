-- =============================================================================
-- MEMORY DETOX — Supabase schema (public + storage)
--
-- PROJECT MỚI (khuyên dùng):
--   1. Tạo project trống trên app.supabase.com
--   2. SQL Editor → dán & Run TOÀN BỘ file này
--   3. Chạy tiếp seed.sql
--   4. Điền URL + anon key vào .env của app (SETUP_NEW_PROJECT.md)
--
-- Phần DROP bên dưới an toàn trên DB trống; chỉ nguy hiểm nếu DB cũ còn dữ liệu.
-- Auth: auth.users (email, Google OAuth, OTP, reset password).
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.home_tab as enum ('home', 'stats', 'leaderboard', 'profile');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Drop legacy tables (fitness, health tracking, biodegradation, …)
-- ---------------------------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;

-- DROP TRIGGER ... ON table yêu cầu bảng đã tồn tại (lỗi trên project mới nếu gọi trực tiếp)
do $drop_profile_triggers$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  ) then
    execute 'drop trigger if exists trg_profiles_notification_settings on public.profiles';
  end if;
end $drop_profile_triggers$;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.ensure_notification_settings_for_profile() cascade;

drop table if exists public.favorite_workout_templates cascade;
drop table if exists public.user_achievements cascade;
drop table if exists public.workout_sessions cascade;
drop table if exists public.scheduled_workouts cascade;
drop table if exists public.goals cascade;
drop table if exists public.training_plans cascade;
drop table if exists public.workout_template_tasks cascade;
drop table if exists public.workout_templates cascade;
drop table if exists public.activity_types cascade;
drop table if exists public.saved_articles cascade;
drop table if exists public.articles cascade;
drop table if exists public.meal_logs cascade;
drop table if exists public.meals cascade;
drop table if exists public.meal_plans cascade;
drop table if exists public.exercise_logs cascade;
drop table if exists public.sleep_logs cascade;
drop table if exists public.water_logs cascade;
drop table if exists public.weight_logs cascade;
drop table if exists public.case_studies cascade;
drop table if exists public.enzyme_pollutant_relationships cascade;
drop table if exists public.microorganism_enzyme_relationships cascade;
drop table if exists public.enzymes cascade;
drop table if exists public.microorganisms cascade;
drop table if exists public.pollutants cascade;
drop table if exists public.quiz_attempts cascade;
drop table if exists public.user_progress cascade;
drop table if exists public.quizzes cascade;
drop table if exists public.lessons cascade;
drop table if exists public.categories cascade;
drop table if exists public.user_daily_stats cascade;
drop table if exists public.notification_settings cascade;
drop table if exists public.notifications cascade;
drop table if exists public.achievements cascade;
drop table if exists public.app_content cascade;
drop table if exists public.profiles cascade;

drop type if exists public.plan_status cascade;
drop type if exists public.scheduled_workout_status cascade;
drop type if exists public.workout_session_status cascade;
drop type if exists public.goal_metric cascade;
drop type if exists public.goal_timeframe cascade;
drop type if exists public.recurrence_kind cascade;
drop type if exists public.notification_category cascade;
drop type if exists public.notification_type cascade;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  full_name text,
  avatar_url text,
  avatar_preset_id text,
  total_points int not null default 0 check (total_points >= 0),
  notifications_enabled boolean not null default true,
  preferred_language text not null default 'vi' check (preferred_language in ('vi', 'en')),
  default_home_tab public.home_tab not null default 'home',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_username on public.profiles (username) where username is not null;
create index idx_profiles_leaderboard on public.profiles (total_points desc);

-- ---------------------------------------------------------------------------
-- Nội dung học: danh mục → bài học → câu hỏi quiz
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  color_code text,
  icon_name text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_categories_sort on public.categories (sort_order, name);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  title text not null,
  summary text,
  content text not null default '',
  hint text,
  image_url text,
  sort_order int not null default 0,
  is_locked boolean not null default false,
  unlock_min_points int not null default 0 check (unlock_min_points >= 0),
  points_reward int not null default 10 check (points_reward >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_lessons_category_sort on public.lessons (category_id, sort_order);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_index int not null check (correct_index >= 0),
  question_index int not null default 0,
  hint text,
  created_at timestamptz not null default now()
);

create index idx_quizzes_lesson on public.quizzes (lesson_id, question_index);

-- ---------------------------------------------------------------------------
-- Tiến độ & lịch sử chơi quiz
-- ---------------------------------------------------------------------------
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz,
  points_earned int not null default 0 check (points_earned >= 0),
  correct_answers int not null default 0 check (correct_answers >= 0),
  total_questions int not null default 0 check (total_questions >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index idx_user_progress_user on public.user_progress (user_id, completed_at desc);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  points_earned int not null default 0 check (points_earned >= 0),
  correct_answers int not null default 0 check (correct_answers >= 0),
  total_questions int not null default 0 check (total_questions > 0),
  accuracy_pct numeric(5, 2) generated always as (
    case
      when total_questions > 0
      then round((correct_answers::numeric / total_questions::numeric) * 100, 2)
      else 0
    end
  ) stored,
  focus_seconds int check (focus_seconds is null or focus_seconds >= 0),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index idx_quiz_attempts_user_lesson on public.quiz_attempts (user_id, lesson_id, completed_at desc);
create index idx_quiz_attempts_user_date on public.quiz_attempts (user_id, completed_at desc);

-- ---------------------------------------------------------------------------
-- Thống kê theo ngày (màn Thống kê — biểu đồ 7 ngày & chỉ số trung bình)
-- ---------------------------------------------------------------------------
create table public.user_daily_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stat_date date not null,
  level_pct numeric(5, 2) not null default 0 check (level_pct >= 0 and level_pct <= 100),
  accuracy_pct numeric(5, 2) not null default 0 check (accuracy_pct >= 0 and accuracy_pct <= 100),
  learned_pct numeric(5, 2) not null default 0 check (learned_pct >= 0 and learned_pct <= 100),
  completed_pct numeric(5, 2) not null default 0 check (completed_pct >= 0 and completed_pct <= 100),
  focus_pct numeric(5, 2) not null default 0 check (focus_pct >= 0 and focus_pct <= 100),
  lessons_completed int not null default 0 check (lessons_completed >= 0),
  quizzes_played int not null default 0 check (quizzes_played >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, stat_date)
);

create index idx_user_daily_stats_user_date on public.user_daily_stats (user_id, stat_date desc);

-- ---------------------------------------------------------------------------
-- Thành tích
-- ---------------------------------------------------------------------------
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  icon_url text,
  requirement_type text not null default 'points'
    check (requirement_type in ('points', 'lessons_completed', 'streak_days', 'accuracy')),
  requirement_value int not null default 1 check (requirement_value > 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index idx_user_achievements_user on public.user_achievements (user_id, earned_at desc);

-- ---------------------------------------------------------------------------
-- Thông báo in-app
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null default 'system'
    check (type in (
      'welcome', 'system', 'achievement', 'lesson_unlock', 'practice_reminder', 'streak',
      'meal_reminder', 'water_reminder', 'exercise_reminder', 'sleep_reminder',
      'goal_completed', 'weight_update', 'new_article', 'tip'
    )),
  title text not null,
  message text not null,
  icon text not null default '🔔',
  icon_bg text not null default '#E0F2FE',
  is_read boolean not null default false,
  related_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index idx_notifications_user_created on public.notifications (user_id, created_at desc);
create index idx_notifications_user_unread on public.notifications (user_id, created_at desc)
  where is_read = false;

-- Cài đặt nhắc luyện tập (tương thích client hiện tại — map exercise_* → nhắc luyện tập)
create table public.notification_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  breakfast_enabled boolean not null default false,
  breakfast_time time not null default '07:00',
  lunch_enabled boolean not null default false,
  lunch_time time not null default '12:00',
  dinner_enabled boolean not null default false,
  dinner_time time not null default '18:00',
  water_enabled boolean not null default false,
  water_interval_hours int not null default 2 check (water_interval_hours >= 1),
  exercise_enabled boolean not null default true,
  exercise_time time not null default '08:00',
  sleep_enabled boolean not null default false,
  sleep_time time not null default '22:00',
  goal_notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Nội dung tĩnh (FAQ, Điều khoản, Bảo mật, Liên hệ)
-- ---------------------------------------------------------------------------
create table public.app_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $t$
declare r record;
begin
  for r in
    select unnest(array[
      'profiles',
      'lessons',
      'user_progress',
      'user_daily_stats',
      'notification_settings'
    ]) as tbl
  loop
    execute format('
      drop trigger if exists trg_%I_updated_at on public.%I;
      create trigger trg_%I_updated_at
      before update on public.%I
      for each row execute procedure public.set_updated_at();
    ', r.tbl, r.tbl, r.tbl, r.tbl);
  end loop;
end $t$;

-- ---------------------------------------------------------------------------
-- Auth: tạo profile + notification_settings khi đăng ký
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full text;
  v_user text;
begin
  v_full := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    null
  );
  v_user := coalesce(
    new.raw_user_meta_data->>'username',
    case when new.email is not null then split_part(new.email, '@', 1) else null end,
    'player'
  );

  insert into public.profiles (id, username, full_name, avatar_url, avatar_preset_id)
  values (
    new.id,
    v_user,
    v_full,
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    coalesce(new.raw_user_meta_data->>'avatar_preset_id', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.ensure_notification_settings_for_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notification_settings (
    user_id,
    breakfast_enabled,
    lunch_enabled,
    dinner_enabled,
    water_enabled,
    exercise_enabled,
    exercise_time,
    sleep_enabled,
    goal_notifications_enabled
  )
  values (
    new.id,
    false,
    false,
    false,
    false,
    true,
    '08:00',
    false,
    true
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger trg_profiles_notification_settings
  after insert on public.profiles
  for each row
  execute procedure public.ensure_notification_settings_for_profile();

-- ---------------------------------------------------------------------------
-- View: bảng xếp hạng (XP = total_points)
-- ---------------------------------------------------------------------------
create or replace view public.leaderboard as
select
  id,
  username,
  full_name,
  avatar_url,
  total_points,
  rank() over (order by total_points desc, created_at asc) as rank
from public.profiles
where username is not null;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.lessons enable row level security;
alter table public.quizzes enable row level security;
alter table public.user_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.user_daily_stats enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_settings enable row level security;
alter table public.app_content enable row level security;

-- Profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_select_leaderboard"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Catalog (đọc khi đã đăng nhập)
create policy "categories_select_authenticated"
  on public.categories for select
  to authenticated
  using (true);

create policy "lessons_select_authenticated"
  on public.lessons for select
  to authenticated
  using (true);

create policy "quizzes_select_authenticated"
  on public.quizzes for select
  to authenticated
  using (true);

create policy "achievements_select_authenticated"
  on public.achievements for select
  to authenticated
  using (true);

create policy "app_content_select_authenticated"
  on public.app_content for select
  to authenticated
  using (true);

-- User-owned
create policy "user_progress_all_own"
  on public.user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "quiz_attempts_all_own"
  on public.quiz_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_daily_stats_all_own"
  on public.user_daily_stats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_achievements_select_own"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "user_achievements_insert_own"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "notifications_insert_own"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "notification_settings_all_own"
  on public.notification_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage: avatars
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatars public read" on storage.objects;
drop policy if exists "Avatars upload own folder" on storage.objects;
drop policy if exists "Avatars update own folder" on storage.objects;
drop policy if exists "Avatars delete own folder" on storage.objects;

create policy "Avatars public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Avatars upload own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Avatars update own folder"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Avatars delete own folder"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- Cập nhật user_daily_stats sau mỗi quiz_attempt (server-side)
-- ---------------------------------------------------------------------------
create or replace function public.sync_user_daily_stats_on_quiz_attempt()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_acc numeric(5, 2);
  v_total_lessons int;
  v_completed int;
  v_completed_pct numeric(5, 2);
  v_stat_date date := (new.completed_at at time zone 'utc')::date;
begin
  if new.total_questions > 0 then
    v_acc := round((new.correct_answers::numeric / new.total_questions::numeric) * 100, 2);
  else
    v_acc := 0;
  end if;

  select count(*)::int into v_total_lessons from public.lessons;
  select count(*)::int into v_completed
  from public.user_progress
  where user_id = new.user_id and completed_at is not null;

  v_total_lessons := greatest(1, v_total_lessons);
  v_completed_pct := least(100, round((v_completed::numeric / v_total_lessons::numeric) * 100, 2));

  insert into public.user_daily_stats (
    user_id,
    stat_date,
    accuracy_pct,
    learned_pct,
    completed_pct,
    focus_pct,
    level_pct,
    lessons_completed,
    quizzes_played
  )
  values (
    new.user_id,
    v_stat_date,
    v_acc,
    v_completed_pct,
    v_completed_pct,
    least(100::numeric, round(v_acc * 0.92, 2)),
    round((v_acc + v_completed_pct * 2 + least(100::numeric, round(v_acc * 0.92, 2))) / 4, 2),
    v_completed,
    1
  )
  on conflict (user_id, stat_date) do update set
    quizzes_played = user_daily_stats.quizzes_played + 1,
    accuracy_pct = round(
      (user_daily_stats.accuracy_pct * user_daily_stats.quizzes_played + v_acc)
      / (user_daily_stats.quizzes_played + 1),
      2
    ),
    learned_pct = v_completed_pct,
    completed_pct = v_completed_pct,
    focus_pct = least(
      100,
      round(
        (user_daily_stats.focus_pct * user_daily_stats.quizzes_played
          + least(100::numeric, round(v_acc * 0.92, 2)))
        / (user_daily_stats.quizzes_played + 1),
        2
      )
    ),
    lessons_completed = v_completed,
    level_pct = round(
      (
        round(
          (user_daily_stats.accuracy_pct * user_daily_stats.quizzes_played + v_acc)
          / (user_daily_stats.quizzes_played + 1),
          2
        )
        + v_completed_pct * 2
        + least(100::numeric, round(v_acc * 0.92, 2))
      ) / 4,
      2
    ),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists trg_quiz_attempts_daily_stats on public.quiz_attempts;
create trigger trg_quiz_attempts_daily_stats
  after insert on public.quiz_attempts
  for each row
  execute procedure public.sync_user_daily_stats_on_quiz_attempt();
