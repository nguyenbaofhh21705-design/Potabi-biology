import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export function isSupabaseConfigured(): boolean {
  if (!rawUrl || !rawAnonKey) return false;
  const trimmedUrl = rawUrl.trim();
  const trimmedKey = rawAnonKey.trim();
  if (
    !trimmedUrl ||
    !trimmedKey ||
    trimmedUrl === 'https://your-project-ref.supabase.co' ||
    trimmedKey === 'your-publishable-or-anon-key'
  ) {
    return false;
  }
  return trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://');
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(rawUrl!.trim(), rawAnonKey!.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'potabi_supabase_auth_v1',
      },
    });
  }
  return supabaseInstance;
}

export function sanitizeSupabaseError(error: unknown): string {
  if (!error) return 'Đã xảy ra lỗi kết nối không xác định.';
  const msg =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error);

  const lower = msg.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Email hoặc mật khẩu chưa chính xác. Bạn hãy kiểm tra lại nhé!';
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'Email này đã được đăng ký tài khoản Học viện Potabi. Bạn hãy chuyển sang tab Đăng nhập nhé!';
  }
  if (lower.includes('password should be at least')) {
    return 'Mật khẩu cần có ít nhất 6 ký tự để bảo vệ tài khoản của bạn.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Tài khoản cần xác nhận email. Hãy kiểm tra hộp thư hoặc tắt "Confirm email" trong Supabase Auth.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'Không thể kết nối máy chủ đám mây. Tiến trình của bạn vẫn được lưu an toàn trên thiết bị này.';
  }
  if (lower.includes('relation') && lower.includes('does not exist')) {
    return 'Dự án Supabase chưa chạy kịch bản tạo bảng SQL (supabase_setup.sql). Tiến trình đang lưu cục bộ.';
  }
  return 'Tác vụ đám mây tạm thời gián đoạn. Dữ liệu trên thiết bị của bạn vẫn được bảo toàn.';
}
