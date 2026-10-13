import React, { useState } from 'react';
import { IMAGES, NOTEBOOK_ENTRIES, OUTFITS } from '../data/biologyData';
import { calculateExplorerLevel } from '../data/gameProgress';

interface WardrobeScreenProps {
  diamonds: number;
  equippedOutfitId: string;
  ownedOutfitIds: string[];
  onEquipOutfit: (id: string) => void;
  onBuyOutfit: (id: string, price: number) => void;
}

export const WardrobeScreen: React.FC<WardrobeScreenProps> = ({
  diamonds,
  equippedOutfitId,
  ownedOutfitIds,
  onEquipOutfit,
  onBuyOutfit,
}) => {
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const selectedOutfit = OUTFITS.find((o) => o.id === equippedOutfitId) || OUTFITS[0];

  const handleAction = (outfit: (typeof OUTFITS)[0]) => {
    setPurchaseError(null);
    const isOwned = ownedOutfitIds.includes(outfit.id);
    if (isOwned) {
      onEquipOutfit(outfit.id);
    } else if (diamonds >= outfit.priceDiamonds) {
      onBuyOutfit(outfit.id, outfit.priceDiamonds);
      onEquipOutfit(outfit.id);
    } else {
      setPurchaseError(
        `Bạn cần thêm ${outfit.priceDiamonds - diamonds} Kim cương để đổi "${outfit.name}". Hãy hoàn thành Nhiệm vụ tuần hoặc Trạm Dạ dày nhé!`
      );
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
      <div className="bg-surface-container-low p-space-lg rounded-[2rem] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-[0_4px_0_#4a2433]">
            <span className="material-symbols-outlined text-3xl">apparel</span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm uppercase text-primary font-bold">
              Tủ Đồ Sinh Học • Trang Bị Thám Hiểm (Lưu tự động)
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Trang Phục &amp; Bảo Hộ Của Potabi
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-full shadow-sm">
          <span className="material-symbols-outlined text-tertiary">diamond</span>
          <span className="font-label-lg text-label-lg text-tertiary font-bold">
            {diamonds} Kim cương hiện có
          </span>
        </div>
      </div>

      {purchaseError && (
        <div className="bg-error-container text-on-error-container px-space-lg py-space-sm rounded-full font-label-md text-label-md flex items-center justify-between">
          <span>{purchaseError}</span>
          <button onClick={() => setPurchaseError(null)} className="cursor-pointer font-bold">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left: Potabi Character Showcase */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-[2.5rem] p-space-lg shadow-md flex flex-col items-center text-center gap-space-md border-2 border-surface-container-highest">
          <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
            Đang Trang Bị: {selectedOutfit.name}
          </span>
          <div className="relative w-52 h-52 rounded-full bg-gradient-to-b from-surface-container-high to-secondary-fixed flex items-center justify-center p-6 shadow-inner">
            <img
              alt="Potabi Character Preview"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              src={IMAGES.potabiBlueAvatar}
            />
            <div
              className="absolute -bottom-2 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: selectedOutfit.accentColor }}
            >
              <span className="material-symbols-outlined text-2xl">
                {selectedOutfit.badgeIcon}
              </span>
            </div>
          </div>
          <div className="bg-surface-container-low p-space-md rounded-2xl w-full flex flex-col gap-1">
            <span className="font-label-md text-label-md text-primary">
              Hiệu ứng trong Màn 2D: {selectedOutfit.roleBonus}
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {selectedOutfit.description}
            </p>
          </div>
        </div>

        {/* Right: Outfit Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          {OUTFITS.map((outfit) => {
            const isOwned = ownedOutfitIds.includes(outfit.id);
            const isEquipped = equippedOutfitId === outfit.id;
            return (
              <div
                key={outfit.id}
                className={`rounded-[2rem] p-space-lg flex flex-col justify-between gap-space-md transition-all border-2 ${
                  isEquipped
                    ? 'bg-surface-container-lowest border-primary shadow-md'
                    : 'bg-surface-container-low border-transparent hover:border-outline-variant'
                }`}
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: outfit.accentColor }}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {outfit.badgeIcon}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                      {outfit.rarity}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    {outfit.name}
                  </h3>
                  <p className="font-label-sm text-label-sm text-primary font-bold">
                    {outfit.roleBonus}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {outfit.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAction(outfit)}
                  className={`w-full py-2.5 px-space-md rounded-full font-label-md text-label-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isEquipped
                      ? 'bg-secondary-container text-on-secondary-container'
                      : isOwned
                      ? 'bg-primary text-on-primary shadow-[0_4px_0_#4a2433]'
                      : 'bg-tertiary-fixed text-on-tertiary-fixed shadow-[0_4px_0_#9a6c00]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {isEquipped ? 'check_circle' : isOwned ? 'checkroom' : 'diamond'}
                  </span>
                  <span>
                    {isEquipped
                      ? 'Đang mặc'
                      : isOwned
                      ? 'Mặc trang phục'
                      : `Đổi ${outfit.priceDiamonds} Kim cương`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ProfileScreenProps {
  exp: number;
  diamonds: number;
  unlockedSpecimens: string[];
  completedStageIds: string[];
  onOpenNotebook: () => void;
  onResetProgress: () => void;
  userEmail?: string | null;
  playerProfile?: {
    display_name: string;
    avatar_variant?: string;
    grade_class: string;
  } | null;
  cloudSyncStatus?: 'idle' | 'syncing' | 'synced' | 'offline' | 'unconfigured';
  cloudSyncError?: string | null;
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
  onManualSyncCloud?: () => void;
  onUpdateProfileInfo?: (updates: {
    display_name: string;
    avatar_variant?: 'blue';
    grade_class: string;
  }) => Promise<void>;
  leaderboardEntries?: {
    user_id: string;
    display_name: string;
    avatar_variant?: string;
    grade_class: string;
    exp: number;
    explorer_level: number;
    specimens_count: number;
  }[];
  onRefreshLeaderboard?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  exp,
  diamonds,
  unlockedSpecimens,
  completedStageIds,
  onOpenNotebook,
  onResetProgress,
  userEmail = null,
  playerProfile = null,
  cloudSyncStatus = 'unconfigured',
  cloudSyncError = null,
  onOpenAuthModal,
  onSignOut,
  onManualSyncCloud,
  onUpdateProfileInfo,
  leaderboardEntries = [],
  onRefreshLeaderboard,
}) => {
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(
    playerProfile?.display_name || 'Nhà Thám Hiểm Vi Mô'
  );
  const [editGrade, setEditGrade] = useState<string>(playerProfile?.grade_class || 'Sinh học 8');
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  const { level } = calculateExplorerLevel(exp);
  const activeDisplayName = playerProfile?.display_name || 'Nhà Thám Hiểm Vi Mô';
  const activeGradeClass = playerProfile?.grade_class || 'Sinh học 8 • Cơ thể người';

  const handleSaveProfileForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateProfileInfo) return;
    setSavingProfile(true);
    await onUpdateProfileInfo({
      display_name: editName.trim() || 'Nhà Thám Hiểm Vi Mô',
      avatar_variant: 'blue',
      grade_class: editGrade.trim() || 'Sinh học 8',
    });
    setSavingProfile(false);
    setIsEditingProfile(false);
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
      {/* Main Explorer Identity Card */}
      <div className="bg-surface-container-low p-space-lg rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg">
        <div className="flex flex-col sm:flex-row items-center gap-space-md text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-primary-fixed p-1.5 border-4 border-primary shadow-md shrink-0">
            <img
              alt="Student Avatar"
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
              src={IMAGES.potabiBlueAvatar}
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">
                Cấp độ {level}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                {activeGradeClass}
              </span>
              {userEmail ? (
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">cloud_done</span>
                  <span>Đã kết nối Đám mây</span>
                </span>
              ) : (
                <span className="px-3 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">devices</span>
                  <span>Lưu cục bộ trên trình duyệt</span>
                </span>
              )}
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">
              {activeDisplayName}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Đã hoàn thành {completedStageIds.length}/5 Chặng •{' '}
              {userEmail
                ? `Tài khoản: ${userEmail}`
                : 'Đăng nhập Supabase để tự động đồng bộ tiến trình trên mọi thiết bị'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-space-sm w-full md:w-auto">
          <div className="bg-surface-container-lowest p-space-md rounded-2xl text-center shadow-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Tổng EXP</span>
            <p className="font-headline-md text-headline-md text-primary">{exp}</p>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-2xl text-center shadow-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Kim Cương</span>
            <p className="font-headline-md text-headline-md text-tertiary">{diamonds}</p>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-2xl text-center shadow-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Tiêu Bản</span>
            <p className="font-headline-md text-headline-md text-on-surface">
              {unlockedSpecimens.length}/{NOTEBOOK_ENTRIES.length}
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Sync & Explorer Profile Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm border-2 border-surface-container-high flex flex-col justify-between gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  {userEmail ? 'cloud_sync' : 'account_circle'}
                </span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Tài Khoản &amp; Đồng Bộ Đám Mây Supabase
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {userEmail
                    ? 'Tiến trình của bạn được hợp nhất thông minh (Smart Merge) giữa máy và đám mây.'
                    : 'Kết nối tài khoản để khôi phục EXP, Kim cương, Trang phục khi đổi máy tính hoặc điện thoại.'}
                </p>
              </div>
            </div>

            {userEmail ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditName(playerProfile?.display_name || 'Nhà Thám Hiểm Vi Mô');
                    setEditGrade(playerProfile?.grade_class || 'Sinh học 8');
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  className="px-space-md py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>{isEditingProfile ? 'Đóng sửa' : 'Sửa hồ sơ'}</span>
                </button>
                <button
                  type="button"
                  onClick={onManualSyncCloud}
                  className="px-space-md py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">sync</span>
                  <span>
                    {cloudSyncStatus === 'syncing' ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="px-space-md py-2 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-space-lg py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-md cursor-pointer flex items-center gap-2 shrink-0"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Đăng nhập / Tạo tài khoản</span>
              </button>
            )}
          </div>

          {cloudSyncError && (
            <div className="bg-tertiary-fixed/40 border border-tertiary-fixed-dim text-on-tertiary-fixed px-space-md py-2 rounded-2xl font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">info</span>
              <span>{cloudSyncError}</span>
            </div>
          )}

          {isEditingProfile && userEmail && (
            <form
              onSubmit={handleSaveProfileForm}
              className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/40 flex flex-col gap-space-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 font-body-sm text-body-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface">Lớp học</label>
                  <input
                    type="text"
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 font-body-sm text-body-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-space-lg py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
                >
                  {savingProfile ? 'Đang lưu...' : 'Lưu thông tin Hồ sơ'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Cloud Leaderboard Preview Card */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm border-2 border-surface-container-high flex flex-col justify-between gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">leaderboard</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Bảng Phong Thần Học Viện
              </h3>
            </div>
            {onRefreshLeaderboard && (
              <button
                type="button"
                onClick={onRefreshLeaderboard}
                className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-primary cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">refresh</span>
                <span>Làm mới</span>
              </button>
            )}
          </div>

          {leaderboardEntries.length > 0 ? (
            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
              {leaderboardEntries.slice(0, 5).map((item, idx) => (
                <div
                  key={item.user_id}
                  className="flex items-center justify-between px-3 py-2 rounded-2xl bg-surface-container-low"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <img
                      src={IMAGES.potabiBlueAvatar}
                      alt=""
                      className="w-6 h-6 object-contain"
                    />
                    <div>
                      <span className="font-label-md text-label-md text-on-surface block leading-none">
                        {item.display_name}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Cấp {item.explorer_level} • {item.specimens_count} tiêu bản
                      </span>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-bold">
                    {item.exp} EXP
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-2xl">
              {cloudSyncStatus === 'unconfigured'
                ? 'Khi cấu hình Supabase và chạy file supabase_setup.sql, bảng xếp hạng các Nhà Thám Hiểm có EXP cao nhất sẽ hiển thị tại đây.'
                : 'Hãy là Nhà Thám Hiểm đầu tiên đồng bộ điểm EXP lên Bảng Phong Thần!'}
            </p>
          )}
        </div>
      </div>

      {/* Unlocked Biology Notebook Entries */}
      <div className="flex flex-col gap-space-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Sổ Tay Tiêu Bản Sinh Học 8 ({unlockedSpecimens.length}/{NOTEBOOK_ENTRIES.length} Đã mở
            khóa)
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNotebook}
              className="px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
            >
              Mở Kính Hiển Vi Quang Học
            </button>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-space-md py-2 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm cursor-pointer hover:bg-error-container hover:text-on-error-container"
              >
                Đặt lại tiến trình gốc
              </button>
            ) : (
              <button
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-space-md py-2 rounded-full bg-error text-on-error font-label-sm text-label-sm cursor-pointer"
              >
                Xác nhận đặt lại
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {NOTEBOOK_ENTRIES.map((entry) => {
            const isUnlocked = unlockedSpecimens.includes(entry.id);
            return (
              <div
                key={entry.id}
                className={`rounded-[2rem] p-space-lg shadow-sm border-2 flex flex-col justify-between gap-space-sm ${
                  isUnlocked
                    ? 'bg-surface-container-lowest border-surface-container-high'
                    : 'bg-surface-container-low/60 border-dashed border-outline-variant opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                      {entry.category}
                    </span>
                    <span className="material-symbols-outlined text-base text-primary">
                      {isUnlocked ? 'verified' : 'lock'}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary mt-2">
                    {entry.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface mt-1">
                    {entry.summary}
                  </p>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-2xl">
                  {isUnlocked
                    ? entry.detail
                    : 'Thu thập tiêu bản này bằng cách hoàn thành Trạm tương ứng trong Màn 2D Dạ Dày!'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface LabModalsProps {
  activeTool: 'microscope' | 'stain' | 'notebook' | null;
  unlockedSpecimens: string[];
  onClose: () => void;
}

export const LabToolModal: React.FC<LabModalsProps> = ({
  activeTool,
  unlockedSpecimens,
  onClose,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(40);
  const [stainType, setStainType] = useState<'none' | 'iodine' | 'methylene'>('iodine');

  if (!activeTool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/75 backdrop-blur-md p-space-md">
      <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-space-lg shadow-2xl border-4 border-primary flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined">
                {activeTool === 'microscope'
                  ? 'zoom_in'
                  : activeTool === 'stain'
                  ? 'colorize'
                  : 'menu_book'}
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              {activeTool === 'microscope' && 'Kính Hiển Vi Quang Học: Soi Màng Tế Bào & Mao Mạch'}
              {activeTool === 'stain' && 'Phòng Thí Nghiệm Nhuộm Mẫu Tiêu Bản'}
              {activeTool === 'notebook' &&
                `Sổ Tay Sinh Học 8 (${unlockedSpecimens.length}/${NOTEBOOK_ENTRIES.length} Tiêu bản)`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {(activeTool === 'microscope' || activeTool === 'stain') && (
          <div className="flex flex-col gap-space-md">
            <div
              className="relative w-full h-64 rounded-2xl overflow-hidden border-4 border-inverse-surface flex items-center justify-center shadow-inner transition-all"
              style={{
                backgroundImage: `url('${IMAGES.heartThumbnail}')`,
                backgroundSize: `${zoomLevel + 60}%`,
                backgroundPosition: 'center',
                filter:
                  stainType === 'iodine'
                    ? 'sepia(0.55) saturate(1.6) hue-rotate(-10deg)'
                    : stainType === 'methylene'
                    ? 'hue-rotate(190deg) saturate(1.4)'
                    : 'none',
              }}
            >
              <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/70 pointer-events-none"></div>
              <div className="absolute top-3 left-3 bg-inverse-surface/85 text-inverse-on-surface px-3 py-1 rounded-full font-label-sm text-label-sm">
                Độ phóng đại: {zoomLevel}x • Thuốc nhuộm:{' '}
                {stainType === 'iodine'
                  ? 'Dung dịch Iốt (Lugol)'
                  : stainType === 'methylene'
                  ? 'Xanh Methylene'
                  : 'Chưa nhuộm'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-2">
                <span className="font-label-md text-label-md text-on-surface">
                  Chọn vật kính phóng đại:
                </span>
                <div className="flex gap-2">
                  {[10, 40, 100].map((z) => (
                    <button
                      key={z}
                      onClick={() => setZoomLevel(z)}
                      className={`flex-1 py-1.5 rounded-full font-label-md text-label-md cursor-pointer ${
                        zoomLevel === z
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-2">
                <span className="font-label-md text-label-md text-on-surface">
                  Nhỏ thuốc nhuộm tiêu bản:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStainType('iodine')}
                    className={`flex-1 py-1.5 rounded-full font-label-sm text-label-sm cursor-pointer ${
                      stainType === 'iodine'
                        ? 'bg-tertiary text-on-tertiary'
                        : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    Iốt (Lugol)
                  </button>
                  <button
                    onClick={() => setStainType('methylene')}
                    className={`flex-1 py-1.5 rounded-full font-label-sm text-label-sm cursor-pointer ${
                      stainType === 'methylene'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    Xanh Methylen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'notebook' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm max-h-96 overflow-y-auto">
            {NOTEBOOK_ENTRIES.map((entry) => {
              const isUnlocked = unlockedSpecimens.includes(entry.id);
              return (
                <div
                  key={entry.id}
                  className={`p-space-md rounded-2xl flex flex-col gap-1 border ${
                    isUnlocked
                      ? 'bg-surface-container-low border-outline-variant/40'
                      : 'bg-surface-container/40 border-dashed border-outline-variant opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-primary font-bold">
                      {entry.category}
                    </span>
                    <span className="material-symbols-outlined text-sm text-primary">
                      {isUnlocked ? 'check_circle' : 'lock'}
                    </span>
                  </div>
                  <h4 className="font-label-lg text-label-lg text-on-surface">{entry.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {isUnlocked ? entry.detail : 'Chưa mở khóa – Hãy khám phá các Trạm trong màn 2D!'}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-space-lg py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
          >
            Hoàn tất quan sát
          </button>
        </div>
      </div>
    </div>
  );
};
