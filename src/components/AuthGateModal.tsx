import React, { useState } from 'react';
import { IMAGES } from '../data/biologyData';
import { getSupabaseClient, isSupabaseConfigured, sanitizeSupabaseError } from '../lib/supabase';

interface AuthGateModalProps {
  isOpen: boolean;
  isGateFor2D: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
  onContinueOfflineGuest: () => void;
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({
  isOpen,
  isGateFor2D,
  onClose,
  onAuthSuccess,
  onContinueOfflineGuest,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const configured = isSupabaseConfigured();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMsg(
        'Dự án chưa cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY. Bạn có thể tiếp tục chế độ ngoại tuyến ngay bên dưới!'
      );
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const chosenName = displayName.trim() || trimmedEmail.split('@')[0] || 'Nhà Thám Hiểm Nhí';
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              display_name: chosenName,
              avatar_variant: 'blue',
            },
          },
        });

        if (error) {
          setErrorMsg(sanitizeSupabaseError(error));
          setLoading(false);
          return;
        }

        if (data.session) {
          setLoading(false);
          onAuthSuccess();
        } else {
          setInfoMsg(
            'Đăng ký thành công! Nếu Supabase bật xác thực email, bạn hãy kiểm tra hộp thư hoặc đăng nhập ngay.'
          );
          setMode('login');
          setLoading(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setErrorMsg(sanitizeSupabaseError(error));
          setLoading(false);
          return;
        }

        if (data.session) {
          setLoading(false);
          onAuthSuccess();
        }
      }
    } catch (err) {
      setErrorMsg(sanitizeSupabaseError(err));
      setLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    setErrorMsg(null);
    setInfoMsg(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMsg('Chưa cấu hình kết nối Supabase cho đăng nhập Google.');
      return;
    }

    setLoading(true);
    try {
      const redirectTo = window.location.origin;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        setErrorMsg(sanitizeSupabaseError(error));
        setLoading(false);
        return;
      }

      if (data?.url) {
        // Open OAuth provider URL in a popup window so iframe restrictions do not block Google login
        const popup = window.open(data.url, 'potabi_google_oauth', 'width=560,height=680');
        if (!popup) {
          setInfoMsg(
            'Trình duyệt đang chặn cửa sổ bật lên (Popup). Hãy cho phép Popup hoặc đăng nhập bằng Email & Mật khẩu bên dưới nhé!'
          );
        } else {
          setInfoMsg('Đang chờ xác thực Google trong cửa sổ bật lên...');
        }
      }
      setLoading(false);
    } catch (err) {
      setErrorMsg(sanitizeSupabaseError(err));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex items-center justify-center p-space-md overflow-y-auto select-none">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-[2.25rem] shadow-2xl border-4 border-primary overflow-hidden flex flex-col">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-primary via-primary-container to-tertiary p-space-lg text-on-primary relative overflow-hidden">
          <div className="flex items-center justify-between gap-space-sm relative z-10">
            <div className="flex items-center gap-space-sm">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest p-1.5 shadow-md shrink-0">
                <img
                  alt="Potabi Mascot"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  src={IMAGES.potabiBlueAvatar}
                />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase">
                  {isGateFor2D ? 'Cổng Thám Hiểm 2D • Lưu Đám Mây' : 'Tài Khoản Học Viện Potabi'}
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-primary mt-1">
                  {mode === 'login'
                    ? 'Đăng Nhập Đồng Bộ Hành Trình'
                    : 'Đăng Ký Thẻ Nhà Thám Hiểm'}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-inverse-surface/30 hover:bg-inverse-surface/50 text-on-primary flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <p className="font-body-sm text-body-sm text-secondary-fixed mt-space-xs relative z-10">
            {isGateFor2D
              ? 'Đăng nhập trước khi bước vào Màn 2D Dạ Dày để tự động đồng bộ EXP, Kim cương, Trang phục và Sổ tay Sinh học 8 trên mọi thiết bị!'
              : 'Hợp nhất tiến trình hiện có trên máy với đám mây Supabase hoàn toàn tự động và an toàn.'}
          </p>
        </div>

        <div className="p-space-lg flex flex-col gap-space-md">
          {!configured && (
            <div className="bg-tertiary-fixed/40 border border-tertiary-fixed-dim rounded-2xl p-space-sm flex items-start gap-2 text-on-tertiary-fixed">
              <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">cloud_off</span>
              <div className="font-body-sm text-body-sm">
                <strong>Chế độ Lưu Cục Bộ:</strong> Biến môi trường{' '}
                <code className="px-1 py-0.5 bg-surface rounded text-xs">VITE_SUPABASE_URL</code>{' '}
                và{' '}
                <code className="px-1 py-0.5 bg-surface rounded text-xs">
                  VITE_SUPABASE_ANON_KEY
                </code>{' '}
                chưa được thiết lập. Bạn có thể bấm{' '}
                <strong>“Vào Màn 2D (Lưu trên máy)”</strong> bên dưới để chơi ngay!
              </div>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 bg-surface-container p-1 rounded-full">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setInfoMsg(null);
              }}
              className={`py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setInfoMsg(null);
              }}
              className={`py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Tạo tài khoản mới
            </button>
          </div>

          {errorMsg && (
            <div className="bg-error-container text-on-error-container px-space-md py-2.5 rounded-2xl font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="bg-emerald-100 text-emerald-950 border border-emerald-500 px-space-md py-2.5 rounded-2xl font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">check_circle</span>
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-space-sm">
            {mode === 'register' && (
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface">
                  Tên hiển thị Nhà Thám Hiểm
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="VD: Minh Anh - Lớp 8A1"
                  className="px-space-md py-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/50 focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface">
                Địa chỉ Email học sinh / phụ huynh
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hocsinh@potabi.edu.vn"
                className="px-space-md py-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/50 focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface">
                Mật khẩu (tối thiểu 6 ký tự)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-space-md py-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/50 focus:border-primary outline-none font-body-sm text-body-sm text-on-surface"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !configured}
              className={`mt-1 w-full py-2.5 px-space-lg rounded-full font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 transition-all ${
                loading || !configured
                  ? 'bg-surface-container-highest text-outline cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-container text-on-primary cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {mode === 'login' ? 'login' : 'person_add'}
              </span>
              <span>
                {loading
                  ? 'Đang xử lý đồng bộ...'
                  : mode === 'login'
                  ? 'ĐĂNG NHẬP & ĐỒNG BỘ MÂY'
                  : 'ĐĂNG KÝ & LƯU TIẾN TRÌNH'}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-space-sm">
            <div className="h-px bg-outline-variant/40 flex-1"></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Hoặc kết nối nhanh
            </span>
            <div className="h-px bg-outline-variant/40 flex-1"></div>
          </div>

          {/* Google OAuth & Offline Guest Fallback */}
          <div className="flex flex-col sm:flex-row items-center gap-space-sm">
            <button
              type="button"
              disabled={loading || !configured}
              onClick={handleGoogleOAuth}
              className={`w-full py-2.5 px-space-md rounded-full font-label-md text-label-md border-2 flex items-center justify-center gap-2 transition-colors ${
                loading || !configured
                  ? 'border-outline-variant/30 text-outline cursor-not-allowed'
                  : 'border-primary/40 hover:bg-surface-container-low text-on-surface cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-base text-primary">
                account_circle
              </span>
              <span>Đăng nhập với Google</span>
            </button>

            <button
              type="button"
              onClick={onContinueOfflineGuest}
              className="w-full py-2.5 px-space-md rounded-full bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-label-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">sports_esports</span>
              <span>
                {isGateFor2D ? 'Vào Màn 2D (Lưu trên máy)' : 'Tiếp tục chế độ Khách'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
