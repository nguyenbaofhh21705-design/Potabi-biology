-- =============================================================================
-- POTABI SINH HỌC - HỌC VIỆN KHÁM PHÁ 2D
-- Kịch bản khởi tạo Database Supabase (PostgreSQL + Row Level Security)
-- Cách dùng: Sao chép toàn bộ nội dung file này vào Supabase Dashboard -> SQL Editor -> Run
-- =============================================================================

-- 1. Bảng hồ sơ người chơi (public.profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Nhà Thám Hiểm Vi Mô',
  avatar_variant TEXT NOT NULL DEFAULT 'yellow' CHECK (avatar_variant IN ('yellow', 'blue')),
  grade_class TEXT DEFAULT 'Sinh học 8',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Bảng lưu tiến trình người chơi (public.player_progress)
CREATE TABLE IF NOT EXISTS public.player_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  exp INTEGER NOT NULL DEFAULT 2370 CHECK (exp >= 0 AND exp <= 100000),
  diamonds INTEGER NOT NULL DEFAULT 420 CHECK (diamonds >= 0 AND diamonds <= 50000),
  explorer_level INTEGER NOT NULL DEFAULT 12 CHECK (explorer_level >= 1 AND explorer_level <= 500),
  equipped_outfit_id TEXT NOT NULL DEFAULT 'blouse-bac-si',
  cutscene_seen BOOLEAN NOT NULL DEFAULT false,
  progress_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  schema_version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Hàm tự động cập nhật dấu thời gian updated_at phía máy chủ
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_player_progress_updated_at ON public.player_progress;
CREATE TRIGGER set_player_progress_updated_at
  BEFORE UPDATE ON public.player_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Bật Row Level Security (RLS) bắt buộc
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;

-- 5. Chính sách RLS cho bảng public.profiles
DROP POLICY IF EXISTS "Cho phep doc ho so cong khai cho bang xep hang" ON public.profiles;
CREATE POLICY "Cho phep doc ho so cong khai cho bang xep hang"
  ON public.profiles
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Nguoi choi tu tao ho so cua minh" ON public.profiles;
CREATE POLICY "Nguoi choi tu tao ho so cua minh"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Nguoi choi tu cap nhat ho so cua minh" ON public.profiles;
CREATE POLICY "Nguoi choi tu cap nhat ho so cua minh"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 6. Chính sách RLS cho bảng public.player_progress (Bảo mật riêng tư tuyệt đối)
DROP POLICY IF EXISTS "Nguoi choi chi doc tien trinh cua chinh minh" ON public.player_progress;
CREATE POLICY "Nguoi choi chi doc tien trinh cua chinh minh"
  ON public.player_progress
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Nguoi choi chi tao tien trinh cua chinh minh" ON public.player_progress;
CREATE POLICY "Nguoi choi chi tao tien trinh cua chinh minh"
  ON public.player_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Nguoi choi chi cap nhat tien trinh cua chinh minh" ON public.player_progress;
CREATE POLICY "Nguoi choi chi cap nhat tien trinh cua chinh minh"
  ON public.player_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. View Bảng Xếp Hạng an toàn (chỉ lộ thông tin hiển thị và điểm EXP, không lộ JSON chi tiết)
CREATE OR REPLACE VIEW public.leaderboard_view
WITH (security_invoker = false)
AS
SELECT
  p.id AS user_id,
  p.display_name,
  p.avatar_variant,
  p.grade_class,
  pr.exp,
  pr.explorer_level,
  COALESCE(jsonb_array_length(pr.progress_data->'unlockedSpecimens'), 0) AS specimens_count,
  pr.updated_at
FROM public.profiles p
INNER JOIN public.player_progress pr ON p.id = pr.user_id
ORDER BY pr.exp DESC, pr.updated_at ASC
LIMIT 50;

GRANT SELECT ON public.leaderboard_view TO anon, authenticated;
